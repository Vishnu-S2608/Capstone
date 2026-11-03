import { PrismaClient, Role, EventStatus, BookingStatus, CreditTxType, AnnouncementCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing records (if any)...');
  await prisma.auditLog.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.attendance.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.bookingApproval.deleteMany({});
  await prisma.eventRegistration.deleteMany({});
  await prisma.eventApproval.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.creditTransaction.deleteMany({});
  await prisma.creditAccount.deleteMany({});
  await prisma.announcement.deleteMany({});
  await prisma.studentProfile.deleteMany({});
  await prisma.staffProfile.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding Users & Profiles...');

  // 1. Staff Faculty
  const staff = await prisma.user.create({
    data: {
      id: 'usr_staff_1',
      name: 'Dr. S. Hemaswathi',
      identifier: '7373000708',
      email: 'hemaswathi@klu.ac.in',
      role: Role.STAFF,
      department: 'Information Technology',
      staffProfile: {
        create: {
          staffId: '7373000708',
          designation: 'Associate Professor & Faculty Advisor',
          phone: '+91 7373000708',
        },
      },
    },
  });

  // 2. Management Dean
  const management = await prisma.user.create({
    data: {
      id: 'usr_mgmt_1',
      name: 'Dr. R. Venkataraman (Dean/Admin)',
      identifier: 'ADM-8801',
      email: 'dean.academics@klu.ac.in',
      role: Role.MANAGEMENT,
      department: 'Academic & Event Affairs',
    },
  });

  // 3. Student (Matching SIS Reference Screenshot)
  const student = await prisma.user.create({
    data: {
      id: 'usr_student_1',
      name: 'IKLASH AHAMED N',
      identifier: '9923008152',
      email: 'iklash.it23@klu.ac.in',
      role: Role.STUDENT,
      department: 'B.Tech. / Information Technology',
      studentProfile: {
        create: {
          registerNumber: '9923008152',
          aadharNumber: '645858492682',
          degree: 'B.Tech. / Information Technology',
          batch: '2023',
          section: 'C',
          abcId: '773082314321',
          facultyAdvisor: 'Dr. S. Hemaswathi (7373000708)',
          dob: '15/05/2006',
          gender: 'Male',
          nationalityReligion: 'Indian / Islam / BC-Muslim',
          address: '27, ramasamy street, muthoorani, karaikudi, Sivagangai, Tamilnadu, India - 630001',
        },
      },
      creditAccount: {
        create: {
          currentBalance: 46,
          transactions: {
            create: [
              {
                amount: 50,
                type: CreditTxType.CREDIT,
                description: 'Semester Academic Activity Credit Allocation',
              },
              {
                amount: 5,
                type: CreditTxType.DEBIT,
                description: 'Registration fee for Cloud Native Development Workshop',
              },
              {
                amount: 1,
                type: CreditTxType.CREDIT,
                description: 'Completion reward for Cloud Native Workshop',
              },
            ],
          },
        },
      },
    },
  });

  console.log('Seeding Events...');

  // Event 1: AI Hackathon
  const evt1 = await prisma.event.create({
    data: {
      id: 'evt_1',
      title: 'National Level AI & Deep Learning Hackathon 2026',
      type: 'Hackathon',
      description: '36-hour continuous hackathon on building generative AI solutions for smart governance and healthcare problems.',
      date: '2026-11-15',
      time: '09:00 AM - 09:00 PM',
      venue: 'Computing Hub Lab 3 & Auditorium',
      deadline: '2026-11-10',
      capacity: 120,
      registeredCount: 88,
      fee: 150.0,
      creditRequirement: 0,
      creditsAwarded: 2,
      status: EventStatus.APPROVED,
      published: true,
      isCompleted: false,
      requiresStudentApproval: false,
      staffId: staff.id,
    },
  });

  // Event 2: Cloud Native (Completed)
  const evt2 = await prisma.event.create({
    data: {
      id: 'evt_2',
      title: 'Full Stack Cloud Native Development with Next.js & Kubernetes',
      type: 'Workshop',
      description: 'Hands-on training session covering containerization, edge functions, and continuous integration workflows.',
      date: '2026-10-20',
      time: '10:00 AM - 04:00 PM',
      venue: 'Seminar Hall 2, IT Block',
      deadline: '2026-10-18',
      capacity: 60,
      registeredCount: 52,
      fee: 0.0,
      creditRequirement: 5,
      creditsAwarded: 1,
      status: EventStatus.APPROVED,
      published: true,
      isCompleted: true,
      completionDate: '2026-10-20',
      requiresStudentApproval: false,
      staffId: staff.id,
    },
  });

  // Event 3: PRBM Statement Symposium
  await prisma.event.create({
    data: {
      id: 'evt_3',
      title: 'Cybersecurity PRBM Statement & Threat Modeling Symposium',
      type: 'PRBM Statement',
      description: 'Faculty-guided presentation on zero-day vulnerability discovery, network penetration testing, and ethical guidelines.',
      date: '2026-11-28',
      time: '02:00 PM - 05:00 PM',
      venue: 'Digital Conference Room A',
      deadline: '2026-11-25',
      capacity: 80,
      registeredCount: 14,
      fee: 100.0,
      creditRequirement: 0,
      creditsAwarded: 1,
      status: EventStatus.PENDING,
      published: false,
      isCompleted: false,
      requiresStudentApproval: true,
      managementComments: 'Under initial review by Academic Dean.',
      staffId: staff.id,
    },
  });

  // Event 4: Changes Requested Event
  await prisma.event.create({
    data: {
      id: 'evt_4',
      title: 'Internet of Things (IoT) Sensor Interfacing Lab Masterclass',
      type: 'Workshop',
      description: 'Microcontroller firmware development, sensor telemetry over MQTT, and AWS IoT core pipeline.',
      date: '2026-12-05',
      time: '09:30 AM - 03:30 PM',
      venue: 'Embedded Systems Lab 4',
      deadline: '2026-11-30',
      capacity: 45,
      registeredCount: 0,
      fee: 0.0,
      creditRequirement: 10,
      creditsAwarded: 2,
      status: EventStatus.CHANGES_REQUESTED,
      published: false,
      isCompleted: false,
      requiresStudentApproval: false,
      managementComments: 'Please clarify component kit procurement budget and verify lab availability with ECE department head.',
      staffId: staff.id,
    },
  });

  console.log('Seeding Registrations & Passes...');

  // Registration 1 (Completed workshop)
  await prisma.eventRegistration.create({
    data: {
      id: 'reg_1',
      eventId: evt2.id,
      studentId: student.id,
      bookingStatus: BookingStatus.CONFIRMED,
      paymentStatus: 'Credits Deducted',
      amountPaid: '5 Credits',
      passCode: 'PASS-IT-9923-EVT2',
      attendance: {
        create: {
          attended: true,
          markedBy: staff.id,
          markedAt: new Date('2026-10-20T10:30:00Z'),
        },
      },
    },
  });

  // Registration 2 (AI Hackathon)
  await prisma.eventRegistration.create({
    data: {
      id: 'reg_2',
      eventId: evt1.id,
      studentId: student.id,
      bookingStatus: BookingStatus.CONFIRMED,
      paymentStatus: 'Paid',
      amountPaid: '₹150.00',
      passCode: 'PASS-IT-9923-EVT1',
      attendance: {
        create: {
          attended: false,
        },
      },
    },
  });

  console.log('Seeding Certificates...');
  await prisma.certificate.create({
    data: {
      id: 'cert_1',
      verificationId: 'CERT-KLU-2026-88412',
      eventId: evt2.id,
      studentId: student.id,
      studentName: student.name,
      registerNumber: '9923008152',
      issueDate: '2026-10-22',
      department: 'B.Tech. / Information Technology',
      gradeOrRemarks: 'Distinction / Completed with 100% Attendance',
    },
  });

  console.log('Seeding Announcements...');
  await prisma.announcement.createMany({
    data: [
      {
        title: 'Students can access SIS outside the campus using address: http://sis.kalasalingam.ac.in/',
        content: 'Ensure you connect via college VPN or registered IP for secure semester hall ticket downloads and portal services.',
        category: AnnouncementCategory.GENERAL,
        author: 'Office of COE',
      },
      {
        title: 'Registrations Open: National Level AI & Deep Learning Hackathon 2026',
        content: 'Limited 120 seats available. Cash prizes up to ₹50,000 for top 3 teams. Students earn 2 extra academic activity credits.',
        category: AnnouncementCategory.EVENT,
        author: 'Department of IT',
      },
      {
        title: 'Notice regarding suggestions related to Academic Activities',
        content: 'Students can send emails regarding any suggestions related to Academic Activities to coe@klu.ac.in.',
        category: AnnouncementCategory.URGENT,
        author: 'Academic Dean',
      },
    ],
  });

  console.log('Seeding Audit Logs...');
  await prisma.auditLog.createMany({
    data: [
      {
        action: 'EVENT_APPROVED',
        actorId: management.id,
        actorName: management.name,
        actorRole: Role.MANAGEMENT,
        details: 'Approved event "National Level AI & Deep Learning Hackathon 2026" with 120 capacity.',
      },
      {
        action: 'CERTIFICATE_GENERATED',
        actorId: staff.id,
        actorName: staff.name,
        actorRole: Role.STAFF,
        details: 'Generated 52 certificates for "Full Stack Cloud Native Development" workshop.',
      },
    ],
  });

  console.log('Aiven PostgreSQL Database seeded successfully! 🎉');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
