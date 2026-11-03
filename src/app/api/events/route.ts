import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EventStatus } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, ...payload } = body;

    // Action 1: Create Proposal
    if (action === 'CREATE_PROPOSAL') {
      const {
        title,
        type,
        description,
        date,
        time,
        venue,
        deadline,
        capacity,
        fee,
        creditRequirement,
        creditsAwarded,
        requiresStudentApproval,
        staffId,
      } = payload;

      const newEvent = await prisma.event.create({
        data: {
          title,
          type,
          description,
          date,
          time,
          venue,
          deadline,
          capacity: Number(capacity),
          fee: Number(fee || 0),
          creditRequirement: Number(creditRequirement || 0),
          creditsAwarded: Number(creditsAwarded || 1),
          requiresStudentApproval: Boolean(requiresStudentApproval),
          status: EventStatus.PENDING,
          staffId,
        },
      });

      await prisma.auditLog.create({
        data: {
          action: 'RAISE_EVENT_PROPOSAL',
          actorId: staffId,
          actorName: 'Faculty Member',
          actorRole: 'STAFF',
          details: `Submitted proposal "${title}" for Dean approval.`,
        },
      });

      return NextResponse.json({ success: true, event: newEvent });
    }

    // Action 2: Review Event (Management)
    if (action === 'REVIEW_EVENT') {
      const { eventId, status, remarks, reviewerId, reviewerName } = payload;

      const updated = await prisma.event.update({
        where: { id: eventId },
        data: {
          status: status as EventStatus,
          managementComments: remarks,
          published: status === 'APPROVED',
        },
      });

      await prisma.auditLog.create({
        data: {
          action: `EVENT_${status}`,
          actorId: reviewerId,
          actorName: reviewerName || 'Dean/Admin',
          actorRole: 'MANAGEMENT',
          details: `Event "${updated.title}" marked as ${status}. Remarks: ${remarks || 'None'}`,
        },
      });

      return NextResponse.json({ success: true, event: updated });
    }

    // Action 3: Mark Event Completed (Staff)
    if (action === 'COMPLETE_EVENT') {
      const { eventId, staffId } = payload;
      const evt = await prisma.event.findUnique({ where: { id: eventId } });
      if (!evt) return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });

      const updated = await prisma.event.update({
        where: { id: eventId },
        data: {
          isCompleted: true,
          completionDate: new Date().toISOString().split('T')[0],
        },
      });

      await prisma.auditLog.create({
        data: {
          action: 'EVENT_COMPLETED',
          actorId: staffId,
          actorName: 'Faculty',
          actorRole: 'STAFF',
          details: `Completed event "${evt.title}". Attendance locked.`,
        },
      });

      return NextResponse.json({ success: true, event: updated });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error handling event action:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
