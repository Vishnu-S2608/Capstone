'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  User,
  StudentProfile,
  EventItem,
  Registration,
  CreditTransaction,
  Announcement,
  CertificateItem,
  AuditLogItem,
  EventStatus,
} from '@/types';

interface AppContextType {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  currentUser: User;
  studentProfile: StudentProfile;
  events: EventItem[];
  registrations: Registration[];
  creditBalance: number;
  creditTransactions: CreditTransaction[];
  announcements: Announcement[];
  certificates: CertificateItem[];
  auditLogs: AuditLogItem[];
  
  // Actions
  raiseEvent: (event: Omit<EventItem, 'id' | 'registeredCount' | 'isCompleted' | 'published'>) => void;
  updateEvent: (id: string, updates: Partial<EventItem>) => void;
  reviewEvent: (id: string, status: EventStatus, comments?: string) => void;
  completeEvent: (id: string) => { success: boolean; message: string };
  toggleAttendance: (registrationId: string) => void;
  generateCertificates: (eventId: string) => number;
  bookEvent: (eventId: string, paymentMethod: 'credits' | 'fee') => { success: boolean; message: string };
  cancelBooking: (registrationId: string) => { success: boolean; message: string };
  reviewBooking: (registrationId: string, status: 'Confirmed' | 'Cancelled', remarks?: string) => void;
  toggleEventPublish: (eventId: string) => void;
}

const DEFAULT_USERS: Record<Role, User> = {
  STUDENT: {
    id: 'usr_student_1',
    name: 'IKLASH AHAMED N',
    identifier: '9923008152',
    email: 'iklash.it23@klu.ac.in',
    role: 'STUDENT',
    department: 'B.Tech. / Information Technology',
  },
  STAFF: {
    id: 'usr_staff_1',
    name: 'Dr. S. Hemaswathi',
    identifier: '7373000708',
    email: 'hemaswathi@klu.ac.in',
    role: 'STAFF',
    department: 'Information Technology',
  },
  MANAGEMENT: {
    id: 'usr_mgmt_1',
    name: 'Dr. R. Venkataraman (Dean/Admin)',
    identifier: 'ADM-8801',
    email: 'dean.academics@klu.ac.in',
    role: 'MANAGEMENT',
    department: 'Academic & Event Affairs',
  },
};

const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  registerNumber: '9923008152',
  aadharNumber: '645858492682',
  name: 'IKLASH AHAMED N',
  degree: 'B.Tech. / Information Technology',
  batch: '2023',
  section: 'C',
  abcId: '773082314321',
  facultyAdvisor: 'Dr. S. Hemaswathi (7373000708)',
  dob: '15/05/2006',
  gender: 'Male',
  nationalityReligion: 'Indian / Islam / BC-Muslim',
  address: '27, ramasamy street, muthoorani, karaikudi, Sivagangai, Tamilnadu, India - 630001',
};

const INITIAL_EVENTS: EventItem[] = [
  {
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
    fee: 150,
    creditRequirement: 0,
    creditsAwarded: 2,
    status: 'Approved',
    published: true,
    isCompleted: false,
    requiresStudentApproval: false,
    staffId: 'usr_staff_1',
    staffName: 'Dr. S. Hemaswathi',
    department: 'Information Technology',
  },
  {
    id: 'evt_2',
    title: 'Full Stack Cloud Native Development with Next.js & Kubernetes',
    type: 'Workshop',
    description: 'Hands-on training session covering containerization, edge functions, and continuous integration workflows.',
    date: '2026-10-20', // past date to demonstrate completion
    time: '10:00 AM - 04:00 PM',
    venue: 'Seminar Hall 2, IT Block',
    deadline: '2026-10-18',
    capacity: 60,
    registeredCount: 52,
    fee: 0,
    creditRequirement: 5,
    creditsAwarded: 1,
    status: 'Approved',
    published: true,
    isCompleted: true,
    completionDate: '2026-10-20',
    requiresStudentApproval: false,
    staffId: 'usr_staff_1',
    staffName: 'Dr. S. Hemaswathi',
    department: 'Information Technology',
  },
  {
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
    fee: 100,
    creditRequirement: 0,
    creditsAwarded: 1,
    status: 'Pending',
    published: false,
    isCompleted: false,
    requiresStudentApproval: true,
    staffId: 'usr_staff_1',
    staffName: 'Dr. S. Hemaswathi',
    department: 'Information Technology',
    managementComments: 'Under initial review by Academic Dean.',
  },
  {
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
    fee: 0,
    creditRequirement: 10,
    creditsAwarded: 2,
    status: 'Changes Requested',
    published: false,
    isCompleted: false,
    requiresStudentApproval: false,
    staffId: 'usr_staff_1',
    staffName: 'Dr. S. Hemaswathi',
    department: 'Information Technology',
    managementComments: 'Please clarify component kit procurement budget and verify lab availability with ECE department head.',
  },
];

const INITIAL_REGISTRATIONS: Registration[] = [
  {
    id: 'reg_1',
    eventId: 'evt_2',
    eventTitle: 'Full Stack Cloud Native Development with Next.js & Kubernetes',
    studentId: 'usr_student_1',
    studentName: 'IKLASH AHAMED N',
    registerNumber: '9923008152',
    department: 'B.Tech. / Information Technology',
    bookingStatus: 'Confirmed',
    paymentStatus: 'Credits Deducted',
    amountOrCreditsPaid: '5 Credits',
    passCode: 'PASS-IT-9923-EVT2',
    registeredAt: '2026-10-15',
    attended: true,
  },
  {
    id: 'reg_2',
    eventId: 'evt_1',
    eventTitle: 'National Level AI & Deep Learning Hackathon 2026',
    studentId: 'usr_student_1',
    studentName: 'IKLASH AHAMED N',
    registerNumber: '9923008152',
    department: 'B.Tech. / Information Technology',
    bookingStatus: 'Confirmed',
    paymentStatus: 'Paid',
    amountOrCreditsPaid: '₹150.00',
    passCode: 'PASS-IT-9923-EVT1',
    registeredAt: '2026-10-25',
    attended: false,
  },
];

const INITIAL_CERTIFICATES: CertificateItem[] = [
  {
    id: 'cert_1',
    verificationId: 'CERT-KLU-2026-88412',
    eventId: 'evt_2',
    eventTitle: 'Full Stack Cloud Native Development with Next.js & Kubernetes',
    studentId: 'usr_student_1',
    studentName: 'IKLASH AHAMED N',
    registerNumber: '9923008152',
    issueDate: '2026-10-22',
    department: 'B.Tech. / Information Technology',
    gradeOrRemarks: 'Distinction / Completed with 100% Attendance',
  },
];

const INITIAL_CREDIT_TRANSACTIONS: CreditTransaction[] = [
  {
    id: 'tx_1',
    date: '2026-10-01',
    amount: 50,
    type: 'CREDIT',
    description: 'Semester Academic Activity Credit Allocation',
  },
  {
    id: 'tx_2',
    date: '2026-10-15',
    amount: 5,
    type: 'DEBIT',
    description: 'Registration fee for Cloud Native Development Workshop',
    eventId: 'evt_2',
  },
  {
    id: 'tx_3',
    date: '2026-10-22',
    amount: 1,
    type: 'CREDIT',
    description: 'Completion reward for Cloud Native Workshop',
    eventId: 'evt_2',
  },
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_1',
    title: 'Students can access SIS outside the campus using address: http://sis.kalasalingam.ac.in/',
    content: 'Ensure you connect via college VPN or registered IP for secure semester hall ticket downloads and portal services.',
    category: 'GENERAL',
    date: '2026-10-28',
    author: 'Office of COE',
  },
  {
    id: 'ann_2',
    title: 'Registrations Open: National Level AI & Deep Learning Hackathon 2026',
    content: 'Limited 120 seats available. Cash prizes up to ₹50,000 for top 3 teams. Students earn 2 extra academic activity credits.',
    category: 'EVENT',
    date: '2026-10-27',
    author: 'Department of IT',
  },
  {
    id: 'ann_3',
    title: 'Notice regarding suggestions related to Academic Activities',
    content: 'Students can send emails regarding any suggestions related to Academic Activities to coe@klu.ac.in.',
    category: 'URGENT',
    date: '2026-10-25',
    author: 'Academic Dean',
  },
];

const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log_1',
    action: 'EVENT_APPROVED',
    actorName: 'Dr. R. Venkataraman (Dean)',
    actorRole: 'MANAGEMENT',
    details: 'Approved event "National Level AI & Deep Learning Hackathon 2026" with 120 capacity.',
    timestamp: '2026-10-12 11:30 AM',
  },
  {
    id: 'log_2',
    action: 'CERTIFICATE_GENERATED',
    actorName: 'Dr. S. Hemaswathi',
    actorRole: 'STAFF',
    details: 'Generated 52 certificates for "Full Stack Cloud Native Development" workshop.',
    timestamp: '2026-10-22 04:15 PM',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<Role>('STUDENT');
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [registrations, setRegistrations] = useState<Registration[]>(INITIAL_REGISTRATIONS);
  const [creditBalance, setCreditBalance] = useState<number>(46); // 50 - 5 + 1
  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>(INITIAL_CREDIT_TRANSACTIONS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [certificates, setCertificates] = useState<CertificateItem[]>(INITIAL_CERTIFICATES);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);

  const currentUser = DEFAULT_USERS[currentRole];

  // Live Aiven PostgreSQL Synchronization
  useEffect(() => {
    async function loadDbData() {
      try {
        const res = await fetch('/api/data');
        const json = await res.json();
        if (json.success && json.data) {
          const { events: dbEvents, creditAccounts, announcements: dbAnn, certificates: dbCerts } = json.data;
          if (dbEvents && dbEvents.length > 0) {
            setEvents(
              dbEvents.map((e: any) => ({
                id: e.id,
                title: e.title,
                type: e.type,
                description: e.description,
                date: e.date,
                time: e.time,
                venue: e.venue,
                deadline: e.deadline,
                capacity: e.capacity,
                registeredCount: e.registeredCount,
                fee: Number(e.fee),
                creditRequirement: e.creditRequirement,
                creditsAwarded: e.creditsAwarded,
                status:
                  e.status === 'APPROVED'
                    ? 'Approved'
                    : e.status === 'CHANGES_REQUESTED'
                    ? 'Changes Requested'
                    : e.status === 'REJECTED'
                    ? 'Rejected'
                    : 'Pending',
                published: e.published,
                isCompleted: e.isCompleted,
                completionDate: e.completionDate,
                requiresStudentApproval: e.requiresStudentApproval,
                staffId: e.staffId,
                staffName: e.staff?.name || 'Dr. S. Hemaswathi',
                department: e.staff?.department || 'Information Technology',
                managementComments: e.managementComments,
              }))
            );
          }
          if (creditAccounts && creditAccounts.length > 0) {
            const studentAcct = creditAccounts.find((a: any) => a.studentId === 'usr_student_1');
            if (studentAcct) {
              setCreditBalance(studentAcct.currentBalance);
              if (studentAcct.transactions && studentAcct.transactions.length > 0) {
                setCreditTransactions(
                  studentAcct.transactions.map((t: any) => ({
                    id: t.id,
                    date: new Date(t.timestamp).toISOString().split('T')[0],
                    amount: t.amount,
                    type: t.type,
                    description: t.description,
                    eventId: t.eventId,
                  }))
                );
              }
            }
          }
          if (dbAnn && dbAnn.length > 0) {
            setAnnouncements(
              dbAnn.map((a: any) => ({
                id: a.id,
                title: a.title,
                content: a.content,
                category: a.category,
                date: new Date(a.createdAt).toISOString().split('T')[0],
                author: a.author,
              }))
            );
          }
          if (dbCerts && dbCerts.length > 0) {
            setCertificates(
              dbCerts.map((c: any) => ({
                id: c.id,
                verificationId: c.verificationId,
                eventId: c.eventId,
                eventTitle: c.eventTitle || 'Certified University Event',
                studentId: c.studentId,
                studentName: c.studentName,
                registerNumber: c.registerNumber,
                issueDate: c.issueDate,
                department: c.department,
                gradeOrRemarks: c.gradeOrRemarks,
              }))
            );
          }
        }
      } catch (err) {
        console.warn('Fallback to local state:', err);
      }
    }
    loadDbData();
  }, []);

  const logAction = (action: string, details: string) => {
    const newLog: AuditLogItem = {
      id: `log_${Date.now()}`,
      action,
      actorName: currentUser.name,
      actorRole: currentRole,
      details,
      timestamp: new Date().toLocaleString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const raiseEvent: AppContextType['raiseEvent'] = (eventData) => {
    const newEvent: EventItem = {
      ...eventData,
      id: `evt_${Date.now()}`,
      registeredCount: 0,
      isCompleted: false,
      published: false,
      staffId: currentUser.id,
      staffName: currentUser.name,
      department: currentUser.department,
    };
    setEvents((prev) => [newEvent, ...prev]);
    logAction('RAISE_EVENT_PROPOSAL', `Submitted approval request for "${newEvent.title}"`);

    // Synchronize to Aiven PostgreSQL in background
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'CREATE_PROPOSAL',
        ...eventData,
        staffId: currentUser.id,
      }),
    }).catch(console.error);
  };

  const updateEvent: AppContextType['updateEvent'] = (id, updates) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
    logAction('EVENT_UPDATED', `Updated event configuration for ID: ${id}`);
  };

  const reviewEvent: AppContextType['reviewEvent'] = (id, status, comments) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          return {
            ...e,
            status,
            managementComments: comments || e.managementComments,
            published: status === 'Approved',
          };
        }
        return e;
      })
    );
    logAction('EVENT_REVIEWED', `Marked event "${id}" as ${status}. Notes: ${comments || 'None'}`);
  };

  const completeEvent: AppContextType['completeEvent'] = (id) => {
    const evt = events.find((e) => e.id === id);
    if (!evt) return { success: false, message: 'Event not found.' };

    const eventDate = new Date(evt.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Business rule: Event must have finished
    if (eventDate > today) {
      return {
        success: false,
        message: 'Validation failed: Cannot complete an upcoming event before its scheduled date.',
      };
    }

    setEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, isCompleted: true, completionDate: new Date().toISOString().split('T')[0] }
          : e
      )
    );
    logAction('EVENT_COMPLETED', `Marked "${evt.title}" as completed. Attendance locked.`);
    return { success: true, message: 'Event successfully marked as completed!' };
  };

  const toggleAttendance: AppContextType['toggleAttendance'] = (registrationId) => {
    setRegistrations((prev) =>
      prev.map((r) => {
        if (r.id === registrationId) {
          const newStatus = !r.attended;
          return { ...r, attended: newStatus };
        }
        return r;
      })
    );
  };

  const generateCertificates: AppContextType['generateCertificates'] = (eventId) => {
    const evt = events.find((e) => e.id === eventId);
    if (!evt || !evt.isCompleted) return 0;

    const attendedRegistrations = registrations.filter(
      (r) => r.eventId === eventId && r.attended
    );

    let generatedCount = 0;
    const newCertificates: CertificateItem[] = [];

    attendedRegistrations.forEach((reg) => {
      const alreadyHas = certificates.some(
        (c) => c.eventId === eventId && c.studentId === reg.studentId
      );
      if (!alreadyHas) {
        newCertificates.push({
          id: `cert_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          verificationId: `CERT-KLU-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          eventId: evt.id,
          eventTitle: evt.title,
          studentId: reg.studentId,
          studentName: reg.studentName,
          registerNumber: reg.registerNumber,
          issueDate: new Date().toISOString().split('T')[0],
          department: reg.department,
          gradeOrRemarks: 'Participated & Successfully Completed with Verified Attendance',
        });
        generatedCount++;
      }
    });

    if (newCertificates.length > 0) {
      setCertificates((prev) => [...newCertificates, ...prev]);
      logAction('CERTIFICATES_ISSUED', `Generated ${generatedCount} certificates for "${evt.title}"`);
    }

    return generatedCount;
  };

  const bookEvent: AppContextType['bookEvent'] = (eventId, paymentMethod) => {
    const evt = events.find((e) => e.id === eventId);
    if (!evt) return { success: false, message: 'Event not found.' };

    if (!evt.published || evt.status !== 'Approved') {
      return { success: false, message: 'This event is not published or approved for booking.' };
    }

    if (evt.registeredCount >= evt.capacity) {
      return { success: false, message: 'Event capacity is full. Registrations closed.' };
    }

    const alreadyBooked = registrations.some(
      (r) => r.eventId === eventId && r.studentId === currentUser.id && r.bookingStatus !== 'Cancelled'
    );
    if (alreadyBooked) {
      return { success: false, message: 'You have already booked this event.' };
    }

    // Payment or Credit checks
    let paymentDesc = 'Free';
    if (paymentMethod === 'credits' && evt.creditRequirement > 0) {
      if (creditBalance < evt.creditRequirement) {
        return { success: false, message: `Insufficient credits. Required: ${evt.creditRequirement}, Available: ${creditBalance}` };
      }
      setCreditBalance((prev) => prev - evt.creditRequirement);
      paymentDesc = `${evt.creditRequirement} Credits`;
      
      const tx: CreditTransaction = {
        id: `tx_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        amount: evt.creditRequirement,
        type: 'DEBIT',
        description: `Registration deduction for ${evt.title}`,
        eventId: evt.id,
      };
      setCreditTransactions((prev) => [tx, ...prev]);
    } else if (evt.fee > 0) {
      paymentDesc = `₹${evt.fee}.00 (Demo Paid)`;
    }

    const initialBookingStatus = evt.requiresStudentApproval ? 'Pending Approval' : 'Confirmed';
    const passCode = `PASS-${DEFAULT_STUDENT_PROFILE.section}-${currentUser.identifier.slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReg: Registration = {
      id: `reg_${Date.now()}`,
      eventId: evt.id,
      eventTitle: evt.title,
      studentId: currentUser.id,
      studentName: currentUser.name,
      registerNumber: currentUser.identifier,
      department: currentUser.department,
      bookingStatus: initialBookingStatus,
      paymentStatus: paymentMethod === 'credits' ? 'Credits Deducted' : evt.fee > 0 ? 'Paid' : 'Free',
      amountOrCreditsPaid: paymentDesc,
      passCode,
      registeredAt: new Date().toISOString().split('T')[0],
      attended: false,
    };

    setRegistrations((prev) => [newReg, ...prev]);
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e))
    );

    logAction('EVENT_REGISTERED', `Student ${currentUser.name} (${currentUser.identifier}) booked "${evt.title}"`);
    return {
      success: true,
      message: evt.requiresStudentApproval
        ? 'Registration submitted! Waiting for management approval.'
        : 'Registration confirmed! Digital Pass is now available.',
    };
  };

  const cancelBooking: AppContextType['cancelBooking'] = (registrationId) => {
    const reg = registrations.find((r) => r.id === registrationId);
    if (!reg) return { success: false, message: 'Booking not found.' };

    const evt = events.find((e) => e.id === reg.eventId);
    if (evt && evt.isCompleted) {
      return { success: false, message: 'Cannot cancel booking for a completed event.' };
    }

    setRegistrations((prev) =>
      prev.map((r) => (r.id === registrationId ? { ...r, bookingStatus: 'Cancelled' } : r))
    );

    if (evt) {
      setEvents((prev) =>
        prev.map((e) => (e.id === evt.id ? { ...e, registeredCount: Math.max(0, e.registeredCount - 1) } : e))
      );
    }

    logAction('BOOKING_CANCELLED', `Cancelled booking for event ID: ${reg.eventId}`);
    return { success: true, message: 'Booking successfully cancelled.' };
  };

  const reviewBooking: AppContextType['reviewBooking'] = (registrationId, status, remarks) => {
    setRegistrations((prev) =>
      prev.map((r) =>
        r.id === registrationId
          ? { ...r, bookingStatus: status, managementApprovalRemarks: remarks }
          : r
      )
    );
    logAction('STUDENT_BOOKING_REVIEWED', `Marked booking ID ${registrationId} as ${status}. Remarks: ${remarks || 'None'}`);
  };

  const toggleEventPublish: AppContextType['toggleEventPublish'] = (eventId) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          if (e.status !== 'Approved') return e;
          return { ...e, published: !e.published };
        }
        return e;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        studentProfile: DEFAULT_STUDENT_PROFILE,
        events,
        registrations,
        creditBalance,
        creditTransactions,
        announcements,
        certificates,
        auditLogs,
        raiseEvent,
        updateEvent,
        reviewEvent,
        completeEvent,
        toggleAttendance,
        generateCertificates,
        bookEvent,
        cancelBooking,
        reviewBooking,
        toggleEventPublish,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
