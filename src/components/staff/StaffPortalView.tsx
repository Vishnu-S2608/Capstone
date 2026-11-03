'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  FileText,
  Users,
  Award,
  Send,
  Edit,
  RotateCcw,
  CheckSquare,
  Square,
  Download,
  Plus,
} from 'lucide-react';
import { EventItem, EventType } from '@/types';

interface StaffPortalViewProps {
  activeTab: string;
}

export default function StaffPortalView({ activeTab }: StaffPortalViewProps) {
  const {
    currentUser,
    events,
    registrations,
    raiseEvent,
    updateEvent,
    completeEvent,
    toggleAttendance,
    generateCertificates,
  } = useApp();

  // Form State for "Raise Approval"
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('PRBM Statement');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('2026-11-20');
  const [time, setTime] = useState('10:00 AM - 01:00 PM');
  const [venue, setVenue] = useState('Computing Lab 2');
  const [deadline, setDeadline] = useState('2026-11-17');
  const [capacity, setCapacity] = useState(60);
  const [fee, setFee] = useState(0);
  const [creditRequirement, setCreditRequirement] = useState(0);
  const [creditsAwarded, setCreditsAwarded] = useState(1);
  const [requiresStudentApproval, setRequiresStudentApproval] = useState(false);
  const [supportingDocsUrl, setSupportingDocsUrl] = useState('');
  const [formSuccessMessage, setFormSuccessMessage] = useState('');

  // Editing state for "Changes Requested"
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Selected event for completion / attendance
  const [selectedCompletionEventId, setSelectedCompletionEventId] = useState<string>('evt_2');
  const [completionNotice, setCompletionNotice] = useState<{ text: string; isError: boolean } | null>(null);

  // Selected event for certificate generation
  const [selectedCertEventId, setSelectedCertEventId] = useState<string>('evt_2');
  const [certGenResult, setCertGenResult] = useState<string | null>(null);

  // Staff's own events
  const staffEvents = events.filter((e) => e.staffId === currentUser.id);

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEventId) {
      updateEvent(editingEventId, {
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
        supportingDocsUrl,
        status: 'Pending',
        managementComments: 'Revised and resubmitted by faculty.',
      });
      setFormSuccessMessage(`Proposal "${title}" revised and resubmitted to Management!`);
      setEditingEventId(null);
    } else {
      raiseEvent({
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
        supportingDocsUrl,
        status: 'Pending',
        staffId: currentUser.id,
        staffName: currentUser.name,
        department: currentUser.department,
      });
      setFormSuccessMessage(`Event proposal "${title}" successfully submitted for Dean/Admin approval!`);
    }

    // Reset Form
    setTitle('');
    setDescription('');
    setTimeout(() => setFormSuccessMessage(''), 4000);
  };

  const handleEditProposal = (evt: EventItem) => {
    setEditingEventId(evt.id);
    setTitle(evt.title);
    setType(evt.type);
    setDescription(evt.description);
    setDate(evt.date);
    setTime(evt.time);
    setVenue(evt.venue);
    setDeadline(evt.deadline);
    setCapacity(evt.capacity);
    setFee(evt.fee);
    setCreditRequirement(evt.creditRequirement);
    setCreditsAwarded(evt.creditsAwarded);
    setRequiresStudentApproval(evt.requiresStudentApproval);
    setSupportingDocsUrl(evt.supportingDocsUrl || '');
  };

  const handleMarkCompleted = (eventId: string) => {
    const res = completeEvent(eventId);
    setCompletionNotice({ text: res.message, isError: !res.success });
    setTimeout(() => setCompletionNotice(null), 4000);
  };

  const handleGenerateCertificates = (eventId: string) => {
    const count = generateCertificates(eventId);
    if (count > 0) {
      setCertGenResult(`Successfully generated and dispatched ${count} digital certificates!`);
    } else {
      setCertGenResult('All eligible attendees already have certificates or no attendees marked present.');
    }
    setTimeout(() => setCertGenResult(null), 4000);
  };

  /* -------------------------------------------------------------
     1. STAFF DASHBOARD
  -------------------------------------------------------------- */
  if (activeTab === 'dashboard') {
    const pendingReview = staffEvents.filter((e) => e.status === 'Pending').length;
    const approved = staffEvents.filter((e) => e.status === 'Approved').length;
    const changesNeeded = staffEvents.filter((e) => e.status === 'Changes Requested').length;
    const completed = staffEvents.filter((e) => e.isCompleted).length;

    return (
      <div className="space-y-6">
        {/* Top Banner */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
          <div className="bg-[#17a2b8] text-white px-6 py-3.5 font-bold text-base md:text-lg flex items-center justify-between">
            <span>Faculty Event Management Dashboard</span>
            <span className="text-sm font-medium text-sky-100">{currentUser.department}</span>
          </div>
          <div className="p-5 md:p-6 bg-sky-50/70 border-b border-sky-100 flex items-center justify-between">
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-800">Welcome, {currentUser.name}</h3>
              <p className="text-sm text-slate-500 mt-0.5">Staff ID: {currentUser.identifier} • Academic Year 2026</p>
            </div>
            <div className="text-sm text-slate-700 bg-white px-4 py-2 rounded-lg border border-slate-200 font-semibold shadow-sm">
              3 Pending Action Items
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="bg-white p-5 md:p-6 rounded-lg border-l-4 border-amber-500 shadow-sm">
            <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">Under Review</div>
            <div className="text-3xl md:text-4xl font-black text-amber-700 mt-2">{pendingReview}</div>
            <div className="text-xs text-slate-400 mt-1">Submitted to Management</div>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-lg border-l-4 border-emerald-500 shadow-sm">
            <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">Approved Events</div>
            <div className="text-3xl md:text-4xl font-black text-emerald-700 mt-2">{approved}</div>
            <div className="text-xs text-slate-400 mt-1">Published & Active</div>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-lg border-l-4 border-rose-500 shadow-sm">
            <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">Revision Requests</div>
            <div className="text-3xl md:text-4xl font-black text-rose-700 mt-2">{changesNeeded}</div>
            <div className="text-xs text-slate-400 mt-1">Requires Faculty Edit</div>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-lg border-l-4 border-purple-500 shadow-sm">
            <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">Completed Events</div>
            <div className="text-3xl md:text-4xl font-black text-purple-700 mt-2">{completed}</div>
            <div className="text-xs text-slate-400 mt-1">Ready for Certificates</div>
          </div>
        </div>

        {/* Actionable Notice for Changes Requested */}
        {changesNeeded > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-5 flex items-start space-x-3.5">
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <h4 className="font-bold text-rose-900 text-base">
                Action Required: Management requested changes on {changesNeeded} proposal(s)
              </h4>
              <p className="text-rose-700 mt-1">
                Check the Workspace tab to view Dean remarks, update the event proposal, and resubmit for approval.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* -------------------------------------------------------------
     2. WORKSPACE & MY EVENTS
  -------------------------------------------------------------- */
  if (activeTab === 'workspace' || activeTab === 'my_events') {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-[#17a2b8] text-white px-4 py-2 font-bold text-sm flex items-center justify-between">
            <span>Faculty Event Proposals & Workspace</span>
            <span className="text-xs text-sky-100">{staffEvents.length} Total Submissions</span>
          </div>

          <div className="divide-y divide-slate-100">
            {staffEvents.map((evt) => (
              <div key={evt.id} className="p-4 hover:bg-slate-50/70 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
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
                        Status: {evt.status}
                      </span>
                      {evt.isCompleted && (
                        <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{evt.title}</h4>
                    <p className="text-xs text-slate-600 mt-1">{evt.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">
                      <span>📅 Date: {evt.date}</span>
                      <span>⏰ Slot: {evt.time}</span>
                      <span>📍 Venue: {evt.venue}</span>
                      <span>👥 Bookings: {evt.registeredCount} / {evt.capacity}</span>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-end justify-between gap-2 shrink-0">
                    {evt.status === 'Changes Requested' && (
                      <button
                        onClick={() => handleEditProposal(evt)}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded shadow-sm flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" /> Revise & Resubmit
                      </button>
                    )}
                  </div>
                </div>

                {/* Show Management Feedback Box */}
                {evt.managementComments && (
                  <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded text-xs">
                    <span className="font-bold text-amber-900">Dean / Management Remarks:</span>{' '}
                    <span className="text-amber-800">{evt.managementComments}</span>
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
     3. RAISE APPROVAL VIEW
  -------------------------------------------------------------- */
  if (activeTab === 'raise_approval') {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-[#17a2b8] text-white px-4 py-2 font-bold text-sm flex items-center justify-between">
            <span>
              {editingEventId ? 'Revise Event Proposal' : 'Raise Event Approval Request to Management'}
            </span>
            <span className="text-xs text-sky-100">Official Faculty Form</span>
          </div>

          {formSuccessMessage && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border-b border-emerald-200 text-xs font-bold">
              ✓ {formSuccessMessage}
            </div>
          )}

          <form onSubmit={handleSubmitProposal} className="p-6 md:p-8 space-y-6 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className="block font-bold text-slate-800 text-sm md:text-base mb-1.5">
                  Event Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. National Hackathon on Generative AI"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 text-sm md:text-base border border-slate-300 rounded-lg focus:border-sky-500 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 text-sm md:text-base mb-1.5">
                  Event Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as EventType)}
                  aria-label="Event Type"
                  className="w-full p-3 text-sm md:text-base border border-slate-300 rounded-lg focus:border-sky-500 focus:outline-none shadow-sm"
                >
                  <option value="PRBM Statement">PRBM Statement</option>
                  <option value="Attendance">Attendance Mandated Event</option>
                  <option value="Marks">Marks / Assessment Linked</option>
                  <option value="Timings">Timings / Academic Slot</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 text-sm md:text-base mb-1.5">
                  Venue / Location <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computing Lab 4, IT Block"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full p-3 text-sm md:text-base border border-slate-300 rounded-lg focus:border-sky-500 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 text-sm md:text-base mb-1.5">
                  Event Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 text-sm md:text-base border border-slate-300 rounded-lg focus:border-sky-500 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 text-sm md:text-base mb-1.5">
                  Time Slot <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 09:30 AM - 04:30 PM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-3 text-sm md:text-base border border-slate-300 rounded-lg focus:border-sky-500 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 text-sm md:text-base mb-1.5">
                  Registration Deadline <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full p-3 text-sm md:text-base border border-slate-300 rounded-lg focus:border-sky-500 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 text-sm md:text-base mb-1.5">
                  Capacity (Max Seats) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="5"
                  max="1000"
                  required
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full p-3 text-sm md:text-base border border-slate-300 rounded-lg focus:border-sky-500 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 text-sm md:text-base mb-1.5">
                  Registration Fee (₹) (0 for Free)
                </label>
                <input
                  type="number"
                  min="0"
                  value={fee}
                  onChange={(e) => setFee(Number(e.target.value))}
                  className="w-full p-3 text-sm md:text-base border border-slate-300 rounded-lg focus:border-sky-500 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 text-sm md:text-base mb-1.5">
                  Credits Required to Register (0 for None)
                </label>
                <input
                  type="number"
                  min="0"
                  value={creditRequirement}
                  onChange={(e) => setCreditRequirement(Number(e.target.value))}
                  className="w-full p-3 text-sm md:text-base border border-slate-300 rounded-lg focus:border-sky-500 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Academic Credits Awarded on Completion
                </label>
                <input
                  type="number"
                  min="0"
                  value={creditsAwarded}
                  onChange={(e) => setCreditsAwarded(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Detailed Description & Problem Statement <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Outline program schedule, objectives, deliverables, and student evaluation criteria..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requiresStudentApproval}
                    onChange={(e) => setRequiresStudentApproval(e.target.checked)}
                    className="rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span className="font-semibold text-slate-700">
                    Require Management Sign-off for Each Student Booking
                  </span>
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
              {editingEventId && (
                <button
                  type="button"
                  onClick={() => setEditingEventId(null)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  Cancel Edit
                </button>
              )}
              <button
                type="submit"
                className="px-5 py-2 bg-[#17a2b8] hover:bg-[#138496] text-white rounded font-bold shadow-sm flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                {editingEventId ? 'Submit Revisions' : 'Submit for Management Approval'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     4. EVENT COMPLETION & ATTENDANCE
  -------------------------------------------------------------- */
  if (activeTab === 'event_completion') {
    const selectedEvent = events.find((e) => e.id === selectedCompletionEventId);
    const eventRegistrations = registrations.filter((r) => r.eventId === selectedCompletionEventId);

    return (
      <div className="space-y-4">
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-[#17a2b8] text-white px-4 py-2 font-bold text-sm flex items-center justify-between">
            <span>Event Completion & Attendance Record</span>
            <span className="text-xs text-sky-100">Step 1: Attendance • Step 2: Lock & Complete</span>
          </div>

          <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="w-full md:w-auto flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-700">Select Event:</span>
              <select
                value={selectedCompletionEventId}
                onChange={(e) => setSelectedCompletionEventId(e.target.value)}
                aria-label="Select Event for Completion"
                className="p-1.5 border border-slate-300 rounded text-xs font-medium focus:outline-none"
              >
                {staffEvents.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title} ({e.date}) - {e.status}
                  </option>
                ))}
              </select>
            </div>

            {selectedEvent && (
              <div className="w-full md:w-auto flex items-center space-x-2">
                {selectedEvent.isCompleted ? (
                  <span className="text-xs font-bold bg-purple-100 text-purple-800 px-3 py-1.5 rounded flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Marked Completed
                  </span>
                ) : (
                  <button
                    onClick={() => handleMarkCompleted(selectedEvent.id)}
                    className="w-full md:w-auto text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded shadow-sm flex items-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" /> Finalize Event & Lock Attendance
                  </button>
                )}
              </div>
            )}
          </div>

          {completionNotice && (
            <div
              className={`p-3 text-xs font-bold ${
                completionNotice.isError
                  ? 'bg-rose-50 text-rose-800 border-b border-rose-200'
                  : 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
              }`}
            >
              {completionNotice.text}
            </div>
          )}

          {/* Attendance Checklist */}
          <div className="p-4">
            <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase">
              Registered Attendee Roster ({eventRegistrations.length} Students)
            </h4>

            {eventRegistrations.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                No students registered for this event yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 uppercase font-semibold">
                    <tr>
                      <th className="px-3 py-2">Attendee Name</th>
                      <th className="px-3 py-2">Register Number</th>
                      <th className="px-3 py-2">Department</th>
                      <th className="px-3 py-2 text-center">Attendance Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {eventRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2.5 font-bold text-slate-800">{reg.studentName}</td>
                        <td className="px-3 py-2.5 font-mono text-slate-600">{reg.registerNumber}</td>
                        <td className="px-3 py-2.5 text-slate-600">{reg.department}</td>
                        <td className="px-3 py-2.5 text-center">
                          <button
                            disabled={selectedEvent?.isCompleted}
                            onClick={() => toggleAttendance(reg.id)}
                            className={`px-3 py-1 rounded text-[11px] font-bold transition-colors ${
                              reg.attended
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            {reg.attended ? '✓ Present' : 'Mark Absent'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     5. E-CERTIFICATE MANAGEMENT
  -------------------------------------------------------------- */
  if (activeTab === 'certificate_mgmt') {
    const eligibleEvent = events.find((e) => e.id === selectedCertEventId);
    const attendedCount = registrations.filter(
      (r) => r.eventId === selectedCertEventId && r.attended
    ).length;

    return (
      <div className="space-y-4">
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-[#17a2b8] text-white px-4 py-2 font-bold text-sm flex items-center justify-between">
            <span>E-Certificate Issuance & Verification Center</span>
            <span className="text-xs text-sky-100">Official Certificate Engine</span>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded border border-slate-200">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-700">Select Completed Event:</span>
                <select
                  value={selectedCertEventId}
                  onChange={(e) => setSelectedCertEventId(e.target.value)}
                  aria-label="Select Completed Event for Certificates"
                  className="p-1.5 border border-slate-300 rounded text-xs font-medium focus:outline-none"
                >
                  {staffEvents
                    .filter((e) => e.isCompleted)
                    .map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.title} (Completed on {e.completionDate})
                      </option>
                    ))}
                </select>
              </div>

              {eligibleEvent?.isCompleted && (
                <button
                  onClick={() => handleGenerateCertificates(eligibleEvent.id)}
                  className="text-xs font-bold bg-[#17a2b8] hover:bg-[#138496] text-white px-4 py-2 rounded shadow-sm flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" /> Issue Certificates to {attendedCount} Verified Attendees
                </button>
              )}
            </div>

            {certGenResult && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 text-xs font-bold">
                ✓ {certGenResult}
              </div>
            )}

            <div className="p-4 border border-dashed border-slate-300 rounded text-center text-xs space-y-2">
              <Award className="w-10 h-10 mx-auto text-amber-500" />
              <h4 className="font-bold text-slate-800">Automated University Security Standard</h4>
              <p className="text-slate-500 max-w-md mx-auto">
                Certificates are issued with a cryptographically signed verification identifier (e.g., CERT-KLU-2026-XXXXX) and QR code matching the Kalasalingam University credential registry.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
