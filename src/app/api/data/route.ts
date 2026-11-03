import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [
      users,
      events,
      registrations,
      creditAccounts,
      announcements,
      certificates,
      auditLogs,
    ] = await Promise.all([
      prisma.user.findMany({
        include: {
          studentProfile: true,
          staffProfile: true,
        },
      }),
      prisma.event.findMany({
        include: {
          staff: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.eventRegistration.findMany({
        include: {
          event: true,
          student: {
            include: {
              studentProfile: true,
            },
          },
          attendance: true,
        },
        orderBy: { registeredAt: 'desc' },
      }),
      prisma.creditAccount.findMany({
        include: {
          transactions: {
            orderBy: { timestamp: 'desc' },
          },
        },
      }),
      prisma.announcement.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      prisma.certificate.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.findMany({
        orderBy: { timestamp: 'desc' },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        users,
        events,
        registrations,
        creditAccounts,
        announcements,
        certificates,
        auditLogs,
      },
    });
  } catch (error: any) {
    console.error('Error fetching data from Aiven PostgreSQL:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Database connection error' },
      { status: 500 }
    );
  }
}
