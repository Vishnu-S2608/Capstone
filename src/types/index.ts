export type Role = 'STUDENT' | 'STAFF' | 'MANAGEMENT';

export type EventStatus = 'Draft' | 'Pending' | 'Approved' | 'Rejected' | 'Changes Requested';

export type EventType = 'PRBM Statement' | 'Attendance' | 'Marks' | 'Timings' | 'Hackathon' | 'Workshop' | 'Seminar';

export type BookingStatus = 'Pending Approval' | 'Confirmed' | 'Cancelled';

export interface User {
  id: string;
  name: string;
  identifier: string; // Register No or Staff ID (e.g. 9923008152)
  email: string;
  role: Role;
  department: string;
  avatarUrl?: string;
}

export interface StudentProfile {
  registerNumber: string;
  aadharNumber: string;
  name: string;
  degree: string;
  batch: string;
  section: string;
  abcId: string;
  facultyAdvisor: string;
  dob: string;
  gender: string;
  nationalityReligion: string;
  address: string;
}

export interface EventItem {
  id: string;
  title: string;
  type: EventType;
  description: string;
  date: string;
  time: string;
  venue: string;
  deadline: string;
  capacity: number;
  registeredCount: number;
  fee: number; // 0 if free
  creditRequirement: number; // Credits needed to join
  creditsAwarded: number; // Credits earned on completion
  supportingDocsUrl?: string;
  status: EventStatus;
  managementComments?: string;
  isCompleted: boolean;
  completionDate?: string;
  requiresStudentApproval: boolean;
  staffId: string;
  staffName: string;
  department: string;
  published: boolean;
}

export interface Registration {
  id: string;
  eventId: string;
  eventTitle: string;
  studentId: string;
  studentName: string;
  registerNumber: string;
  department: string;
  bookingStatus: BookingStatus;
  paymentStatus: 'Paid' | 'Credits Deducted' | 'Free';
  amountOrCreditsPaid: string;
  passCode: string;
  registeredAt: string;
  attended: boolean;
  managementApprovalRemarks?: string;
}

export interface CreditTransaction {
  id: string;
  date: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  description: string;
  eventId?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'URGENT' | 'EVENT' | 'GENERAL';
  date: string;
  author: string;
}

export interface CertificateItem {
  id: string;
  verificationId: string;
  eventId: string;
  eventTitle: string;
  studentId: string;
  studentName: string;
  registerNumber: string;
  issueDate: string;
  department: string;
  gradeOrRemarks: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  actorName: string;
  actorRole: Role;
  details: string;
  timestamp: string;
}
