'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Calendar,
  Users,
  Award,
  CreditCard,
  FileText,
  Shield,
  Eye,
  Search,
  ExternalLink,
} from 'lucide-react';
import { EventItem, EventStatus } from '@/types';

interface ManagementPortalViewProps {
  activeTab: string;
}

export default function ManagementPortalView({ activeTab }: ManagementPortalViewProps) {
  const {
    events,
    registrations,
    certificates,
    auditLogs,
    reviewEvent,
    reviewBooking,
    toggleEventPublish,
  } = useApp();

  const [reviewRemarks, setReviewRemarks] = useState<Record<string, string>>({});
  const [activeReviewEvent, setActiveReviewEvent] = useState<EventItem | null>(null);

  const pendingStaffProposals = events.filter((e) => e.status === 'Pending');
  const pendingStudentBookings = registrations.filter((r) => r.bookingStatus === 'Pending Approval');

  const handleAction = (eventId: string, status: EventStatus) => {
    const comments = reviewRemarks[eventId] || '';
    reviewEvent(eventId, status, comments);
    setActiveReviewEvent(null);
  };

  /* -------------------------------------------------------------
     1. MANAGEMENT DASHBOARD
  -------------------------------------------------------------- */
  if (activeTab === 'dashboard') {
    return (
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
          <div className="bg-[#17a2b8] text-white px-6 py-3.5 font-bold text-base md:text-lg flex items-center justify-between">
            <span>Executive Administration & Academic Affairs Oversight</span>
            <span className="text-sm font-medium text-sky-100">Kalasalingam University Event Governance</span>
          </div>
          <div className="p-5 md:p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-800">
                Dean of Academic Affairs / Office of Registrar
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">
                System Administrator Console • High-Privilege Governance
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold bg-amber-100 text-amber-800 px-4 py-2 rounded-lg border border-amber-300 shadow-sm">
                {pendingStaffProposals.length} Pending Event Proposals
              </span>
            </div>
          </div>
        </div>

        {/* Global Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="bg-white p-5 md:p-6 rounded-lg border-l-4 border-amber-500 shadow-sm">
            <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">Staff Review Queue</div>
            <div className="text-3xl md:text-4xl font-black text-amber-700 mt-2">{pendingStaffProposals.length}</div>
            <div className="text-xs text-slate-400 mt-1">Awaiting Official Sanction</div>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-lg border-l-4 border-sky-500 shadow-sm">
            <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">Active Published Events</div>
            <div className="text-3xl md:text-4xl font-black text-sky-700 mt-2">
              {events.filter((e) => e.published).length}
            </div>
            <div className="text-xs text-slate-400 mt-1">Open on Student Portal</div>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-lg border-l-4 border-purple-500 shadow-sm">
            <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">Student Bookings</div>
            <div className="text-3xl md:text-4xl font-black text-purple-700 mt-2">{registrations.length}</div>
            <div className="text-xs text-slate-400 mt-1">Cumulative Registrations</div>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-lg border-l-4 border-emerald-500 shadow-sm">
            <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">Certificates Issued</div>
            <div className="text-3xl md:text-4xl font-black text-emerald-700 mt-2">{certificates.length}</div>
            <div className="text-xs text-slate-400 mt-1">Verified & Digitally Signed</div>
          </div>
        </div>

        {/* Quick Action Pending Feed */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-[#17a2b8] text-white px-6 py-3.5 font-bold text-base md:text-lg">
            Pending Staff Proposals Needing Immediate Decision
          </div>
          <div className="divide-y divide-slate-100 p-6">
            {pendingStaffProposals.length === 0 ? (
              <div className="text-center text-slate-500 text-xs py-4">
                All staff submissions have been reviewed. Queue is clear!
              </div>
            ) : (
              pendingStaffProposals.map((evt) => (
                <div key={evt.id} className="py-3 first:pt-0 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                      {evt.type}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{evt.title}</h4>
                    <p className="text-xs text-slate-500">
                      Proposed by {evt.staffName} ({evt.department}) • Slot: {evt.date} ({evt.time})
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => reviewEvent(evt.id, 'Approved', 'Approved by Academic Dean.')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        reviewEvent(
                          evt.id,
                          'Changes Requested',
                          'Please adjust lab timing or provide updated syllabus.'
                        )
                      }
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-bold"
                    >
                      Request Changes
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     2. STAFF APPROVAL REQUESTS (Full Form & Decision Engine)
  -------------------------------------------------------------- */
  if (activeTab === 'staff_approvals') {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-[#17a2b8] text-white px-4 py-2 font-bold text-sm flex items-center justify-between">
            <span>Staff Event Sanction & Review Bureau</span>
            <span className="text-xs text-sky-100">{events.length} Total Registered Proposals</span>
          </div>

          <div className="divide-y divide-slate-200">
            {events.map((evt) => (
              <div key={evt.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                        {evt.type}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          evt.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : evt.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : evt.status === 'Changes Requested'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {evt.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mt-1">{evt.title}</h4>
                    <p className="text-xs text-slate-600 mt-1">{evt.description}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded border border-slate-200">
                      <div>
                        <span className="font-semibold text-slate-700">Faculty:</span> {evt.staffName}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Date:</span> {evt.date}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Capacity:</span> {evt.capacity} Seats
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Fee / Credits:</span> ₹{evt.fee} / {evt.creditRequirement} Cr
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="shrink-0 flex md:flex-col gap-2 items-end justify-center">
                    {evt.status === 'Pending' || evt.status === 'Changes Requested' ? (
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => handleAction(evt.id, 'Approved')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold shadow-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            const note = prompt('Enter feedback / revision requirements for faculty:', 'Please provide budget approval and verify venue slot availability.');
                            if (note) reviewEvent(evt.id, 'Changes Requested', note);
                          }}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-bold shadow-sm"
                        >
                          Request Changes
                        </button>
                        <button
                          onClick={() => {
                            const note = prompt('Enter rejection reason:', 'Slot collision with University Annual Examinations.');
                            if (note) reviewEvent(evt.id, 'Rejected', note);
                          }}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold shadow-sm"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-400">
                        Sanctioned Decision Recorded
                      </span>
                    )}
                  </div>
                </div>

                {evt.managementComments && (
                  <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900">
                    <span className="font-bold">Official Remarks:</span> {evt.managementComments}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     3. STUDENT BOOKING APPROVALS
  -------------------------------------------------------------- */
  if (activeTab === 'student_approvals') {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-[#17a2b8] text-white px-4 py-2 font-bold text-sm flex items-center justify-between">
            <span>Special Student Event Booking Approvals</span>
            <span className="text-xs text-sky-100">{pendingStudentBookings.length} In Queue</span>
          </div>

          <div className="divide-y divide-slate-100">
            {pendingStudentBookings.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No student bookings currently require administrative authorization.
              </div>
            ) : (
              pendingStudentBookings.map((reg) => (
                <div key={reg.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{reg.studentName}</h4>
                    <p className="text-xs text-slate-500">
                      Register No: <span className="font-mono font-bold text-slate-700">{reg.registerNumber}</span> • {reg.department}
                    </p>
                    <div className="text-xs font-semibold text-sky-800 mt-1">
                      Event: {reg.eventTitle}
                    </div>
                  </div>

                  <div className="space-x-2">
                    <button
                      onClick={() => reviewBooking(reg.id, 'Confirmed', 'Approved by Dean.')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold"
                    >
                      Authorize Pass
                    </button>
                    <button
                      onClick={() => reviewBooking(reg.id, 'Cancelled', 'Student prerequisites not satisfied.')}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     4. EVENT MANAGEMENT & PUBLISHING CONTROLS
  -------------------------------------------------------------- */
  if (activeTab === 'event_mgmt') {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-[#17a2b8] text-white px-4 py-2 font-bold text-sm flex items-center justify-between">
            <span>University Event Catalog Publishing & Lifecycle Control</span>
            <span className="text-xs text-sky-100">Policy Governance</span>
          </div>

          <div className="divide-y divide-slate-100">
            {events.map((evt) => (
              <div key={evt.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">{evt.title}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        evt.published
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {evt.published ? 'Live / Published' : 'Unpublished'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Bookings: {evt.registeredCount} / {evt.capacity} • Venue: {evt.venue} • Date: {evt.date}
                  </div>
                </div>

                <div>
                  {evt.status === 'Approved' ? (
                    <button
                      onClick={() => toggleEventPublish(evt.id)}
                      className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                        evt.published
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'bg-[#17a2b8] text-white hover:bg-[#138496]'
                      }`}
                    >
                      {evt.published ? 'Unpublish from Feed' : 'Publish to Students'}
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">
                      Must be Approved before publishing
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     5. CERTIFICATE OVERSIGHT & VERIFICATION REGISTRY
  -------------------------------------------------------------- */
  if (activeTab === 'cert_oversight') {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-[#17a2b8] text-white px-4 py-2 font-bold text-sm flex items-center justify-between">
            <span>Institution Certificate Registry & Verifications</span>
            <span className="text-xs text-sky-100">{certificates.length} Total Verified</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-2.5">Verification ID</th>
                  <th className="px-4 py-2.5">Recipient Student</th>
                  <th className="px-4 py-2.5">Register No</th>
                  <th className="px-4 py-2.5">Event Title</th>
                  <th className="px-4 py-2.5">Issue Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {certificates.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 font-medium">
                    <td className="px-4 py-3 font-mono font-bold text-sky-800">{c.verificationId}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{c.studentName}</td>
                    <td className="px-4 py-3 text-slate-600">{c.registerNumber}</td>
                    <td className="px-4 py-3 text-slate-800">{c.eventTitle}</td>
                    <td className="px-4 py-3 text-slate-500">{c.issueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     6. CREDIT & PAYMENT RECORDS
  -------------------------------------------------------------- */
  if (activeTab === 'credit_records') {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-[#17a2b8] text-white px-4 py-2 font-bold text-sm">
            Institutional Credit Accounts & Transaction Audit
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-200 bg-slate-50">
            <div className="bg-white p-3 rounded border border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Total System Credits Issued</div>
              <div className="text-2xl font-black text-sky-800 mt-1">12,450</div>
            </div>
            <div className="bg-white p-3 rounded border border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Total Credits Redeemed</div>
              <div className="text-2xl font-black text-amber-700 mt-1">1,890</div>
            </div>
            <div className="bg-white p-3 rounded border border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Demo Registration Fees Collected</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">₹84,500.00</div>
            </div>
          </div>
          <div className="p-4 text-xs text-slate-600">
            All credit ledger transactions and payment statuses are securely validated. Server-side transactions ensure no duplicate deductions or negative balances occur.
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     7. SYSTEM AUDIT LOGS
  -------------------------------------------------------------- */
  if (activeTab === 'audit_logs') {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-[#17a2b8] text-white px-4 py-2 font-bold text-sm flex items-center justify-between">
            <span>Security & Compliance Audit Trail</span>
            <span className="text-xs text-sky-100">{auditLogs.length} Logged Entries</span>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 hover:bg-slate-50 text-xs flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-sky-900 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200 text-[10px]">
                      {log.action}
                    </span>
                    <span className="font-bold text-slate-800">{log.actorName}</span>
                    <span className="text-slate-400">({log.actorRole})</span>
                  </div>
                  <p className="text-slate-600 mt-1">{log.details}</p>
                </div>
                <div className="text-slate-400 text-[11px] shrink-0 font-mono">
                  {log.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
