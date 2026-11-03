import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BookingStatus, CreditTxType } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, eventId, studentId, paymentMethod } = body;

    if (action === 'BOOK_EVENT') {
      // Use an interactive transaction for atomic safety
      const result = await prisma.$transaction(async (tx) => {
        const evt = await tx.event.findUnique({
          where: { id: eventId },
        });

        if (!evt) throw new Error('Event not found');
        if (!evt.published || evt.status !== 'APPROVED') throw new Error('Event is not open for booking');
        if (evt.registeredCount >= evt.capacity) throw new Error('Event capacity is full');

        const existingReg = await tx.eventRegistration.findUnique({
          where: {
            eventId_studentId: {
              eventId,
              studentId,
            },
          },
        });

        if (existingReg && existingReg.bookingStatus !== 'CANCELLED') {
          throw new Error('You have already registered for this event');
        }

        // Credit check
        if (paymentMethod === 'credits' && evt.creditRequirement > 0) {
          const account = await tx.creditAccount.findUnique({
            where: { studentId },
          });

          if (!account || account.currentBalance < evt.creditRequirement) {
            throw new Error(`Insufficient credits. Required: ${evt.creditRequirement}, Available: ${account?.currentBalance || 0}`);
          }

          // Deduct credits
          await tx.creditAccount.update({
            where: { studentId },
            data: { currentBalance: { decrement: evt.creditRequirement } },
          });

          // Record transaction
          await tx.creditTransaction.create({
            data: {
              accountId: account.id,
              amount: evt.creditRequirement,
              type: CreditTxType.DEBIT,
              description: `Registration fee for ${evt.title}`,
              eventId: evt.id,
            },
          });
        }

        const passCode = `PASS-KLU-${Math.floor(1000 + Math.random() * 9000)}-${evt.id.slice(-4)}`;
        const initialStatus = evt.requiresStudentApproval
          ? BookingStatus.PENDING_APPROVAL
          : BookingStatus.CONFIRMED;

        const registration = await tx.eventRegistration.create({
          data: {
            eventId,
            studentId,
            bookingStatus: initialStatus,
            paymentStatus: paymentMethod === 'credits' ? 'Credits Deducted' : Number(evt.fee) > 0 ? 'Paid' : 'Free',
            amountPaid: paymentMethod === 'credits' ? `${evt.creditRequirement} Credits` : Number(evt.fee) > 0 ? `₹${evt.fee}` : 'Free',
            passCode,
            attendance: {
              create: {
                attended: false,
              },
            },
          },
        });

        // Increment registered count
        await tx.event.update({
          where: { id: eventId },
          data: { registeredCount: { increment: 1 } },
        });

        return registration;
      });

      return NextResponse.json({ success: true, registration: result });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error handling booking:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
