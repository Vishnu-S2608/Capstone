'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Calendar,
  MapPin,
  Clock,
  Award,
  CreditCard,
  CheckCircle,
  AlertCircle,
  FileText,
  Download,
  QrCode,
  Tag,
  Search,
  Filter,
  X,
  ExternalLink,
} from 'lucide-react';
import { EventItem } from '@/types';

interface StudentPortalViewProps {
  activeTab: string;
}

export default function StudentPortalView({ activeTab }: StudentPortalViewProps) {
  const {
    studentProfile,
    events,
    registrations,
    creditBalance,
    creditTransactions,
    announcements,
    certificates,
    bookEvent,
    cancelBooking,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [bookingModalEvent, setBookingModalEvent] = useState<EventItem | null>(null);
  const [paymentChoice, setPaymentChoice] = useState<'credits' | 'fee'>('credits');
  const [bookingMessage, setBookingMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [viewingPass, setViewingPass] = useState<any | null>(null);
  const [viewingCert, setViewingCert] = useState<any | null>(null);

  // Filter approved & published events for students
  const publishedEvents = events.filter((e) => e.published && e.status === 'Approved');

  const filteredEvents = publishedEvents.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || evt.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const myRegistrations = registrations.filter((r) => r.studentId === 'usr_student_1');

  const handleConfirmBooking = () => {
    if (!bookingModalEvent) return;
    const res = bookEvent(bookingModalEvent.id, paymentChoice);
    setBookingMessage({ text: res.message, isError: !res.success });
    if (res.success) {
      setTimeout(() => {
        setBookingModalEvent(null);
        setBookingMessage(null);
      }, 1800);
    }
  };

  /* -------------------------------------------------------------
     1. DASHBOARD VIEW (Direct match to user's uploaded SIS reference)
  -------------------------------------------------------------- */
  if (activeTab === 'dashboard') {
    return (
      <div className="space-y-6">
        {/* Top Notifications Banner */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
          <div className="bg-[#17a2b8] text-white px-6 py-3.5 font-bold text-base tracking-wide flex items-center justify-between">
            <span className="text-base md:text-lg">Notifications</span>
            <span className="text-sm font-medium text-sky-100">Live Campus Feed</span>
          </div>
          <div className="p-4 bg-[#0d859a]/10 border-b border-[#0d859a]/20 text-sm md:text-base text-[#095f6e] flex items-center justify-between">
            <span className="font-bold">⚠️ Semester Academic & Activity Registrations are currently active. Ensure your ABC ID is verified.</span>
            <span className="text-xs font-black bg-[#17a2b8] text-white px-2.5 py-1 rounded-md">NEW</span>
          </div>
        </div>

        {/* 2-Column Personal Details Cards (Matches SIS-KARE Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Personal Details Card */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
            <div className="bg-[#17a2b8] text-white px-6 py-3.5 font-bold text-base md:text-lg tracking-wide">
              Personal Details
            </div>
            <div className="divide-y divide-slate-200 text-sm md:text-base">
              <div className="grid grid-cols-12 py-3.5 px-6 hover:bg-slate-50 transition-colors">
                <div className="col-span-5 font-semibold text-slate-600">Register Number</div>
                <div className="col-span-7 font-black text-slate-900 tracking-wide">{studentProfile.registerNumber}</div>
              </div>
              <div className="grid grid-cols-12 py-3.5 px-6 hover:bg-slate-50 transition-colors">
                <div className="col-span-5 font-semibold text-slate-600">Aadhar Number</div>
                <div className="col-span-7 font-medium text-slate-900">{studentProfile.aadharNumber}</div>
              </div>
              <div className="grid grid-cols-12 py-3.5 px-6 hover:bg-slate-50 transition-colors">
                <div className="col-span-5 font-semibold text-slate-600">Name of the Student</div>
                <div className="col-span-7 font-black text-slate-900 uppercase">{studentProfile.name}</div>
              </div>
              <div className="grid grid-cols-12 py-3.5 px-6 hover:bg-slate-50 transition-colors">
                <div className="col-span-5 font-semibold text-slate-600">Degree / Programme</div>
                <div className="col-span-7 font-medium text-slate-900">{studentProfile.degree}</div>
              </div>
              <div className="grid grid-cols-12 py-3.5 px-6 hover:bg-slate-50 transition-colors">
                <div className="col-span-5 font-semibold text-slate-600">Batch</div>
                <div className="col-span-7 font-bold text-slate-900">{studentProfile.batch}</div>
              </div>
              <div className="grid grid-cols-12 py-3.5 px-6 hover:bg-slate-50 transition-colors">
                <div className="col-span-5 font-semibold text-slate-600">Section</div>
                <div className="col-span-7 font-black text-slate-900">{studentProfile.section}</div>
              </div>
              <div className="grid grid-cols-12 py-3.5 px-6 hover:bg-slate-50 transition-colors">
                <div className="col-span-5 font-semibold text-slate-600">ABC ID</div>
                <div className="col-span-7 font-bold text-slate-900">{studentProfile.abcId}</div>
              </div>
              <div className="grid grid-cols-12 py-3.5 px-6 hover:bg-slate-50 transition-colors">
                <div className="col-span-5 font-semibold text-slate-600">Faculty Advisor</div>
                <div className="col-span-7 font-bold text-sky-800">{studentProfile.facultyAdvisor}</div>
              </div>
            </div>
          </div>

          {/* Right Personal Details Card */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
            <div className="bg-[#17a2b8] text-white px-6 py-3.5 font-bold text-base md:text-lg tracking-wide">
              Personal Details
            </div>
            <div className="divide-y divide-slate-200 text-sm md:text-base">
              <div className="grid grid-cols-12 py-3.5 px-6 hover:bg-slate-50 transition-colors">
                <div className="col-span-5 font-semibold text-slate-600">Date of birth</div>
                <div className="col-span-7 font-bold text-slate-900">{studentProfile.dob}</div>
              </div>
              <div className="grid grid-cols-12 py-3.5 px-6 hover:bg-slate-50 transition-colors">
                <div className="col-span-5 font-semibold text-slate-600">Gender</div>
                <div className="col-span-7 font-medium text-slate-900">{studentProfile.gender}</div>
              </div>
              <div className="grid grid-cols-12 py-3.5 px-6 hover:bg-slate-50 transition-colors">
                <div className="col-span-5 font-semibold text-slate-600">Nationality/Religion/Community/Caste</div>
                <div className="col-span-7 font-medium text-slate-900">{studentProfile.nationalityReligion}</div>
              </div>
              <div className="grid grid-cols-12 py-3.5 px-6 hover:bg-slate-50 transition-colors">
                <div className="col-span-5 font-semibold text-slate-600">Address</div>
                <div className="col-span-7 font-medium text-slate-800 leading-relaxed">
                  {studentProfile.address}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Student Notifications Box (Bottom Cyan strip matching reference) */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
          <div className="bg-[#00c0ef] text-white px-6 py-3.5 font-bold text-base md:text-lg tracking-wide">
            Student Notifications
          </div>
          <div className="p-6 space-y-3.5 text-sm md:text-base text-slate-800">
            <div className="flex items-start gap-2.5">
              <span className="text-sky-600 font-bold text-lg">•</span>
              <span>
                Students can access SIS out side the campus using the address{' '}
                <a
                  href="http://sis.kalasalingam.ac.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-700 font-bold underline hover:text-sky-900"
                >
                  http://sis.kalasalingam.ac.in/
                </a>
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-sky-600 font-bold text-lg">•</span>
              <span>
                Students can send E-mail regarding any suggestion related to Academic Activities to{' '}
                <a
                  href="mailto:coe@klu.ac.in"
                  className="text-sky-700 font-bold underline hover:text-sky-900"
                >
                  coe@klu.ac.in
                </a>
                .
              </span>
            </div>
          </div>
        </div>

        {/* Quick Activity Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="bg-white p-5 md:p-6 rounded-lg border-l-4 border-sky-500 shadow-sm">
            <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">Available Credits</div>
            <div className="text-3xl md:text-4xl font-black text-sky-700 mt-2">{creditBalance}</div>
            <div className="text-xs text-slate-400 mt-1">Academic Activity Wallet</div>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-lg border-l-4 border-emerald-500 shadow-sm">
            <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">My Bookings</div>
            <div className="text-3xl md:text-4xl font-black text-emerald-700 mt-2">{myRegistrations.length}</div>
            <div className="text-xs text-slate-400 mt-1">Confirmed & Scheduled</div>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-lg border-l-4 border-amber-500 shadow-sm">
            <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">Open Campus Events</div>
            <div className="text-3xl md:text-4xl font-black text-amber-700 mt-2">{publishedEvents.length}</div>
            <div className="text-xs text-slate-400 mt-1">Accepting Registrations</div>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-lg border-l-4 border-purple-500 shadow-sm">
            <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">E-Certificates</div>
            <div className="text-3xl md:text-4xl font-black text-purple-700 mt-2">{certificates.length}</div>
            <div className="text-xs text-slate-400 mt-1">Verified & Available</div>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     2. ANNOUNCEMENTS VIEW
  -------------------------------------------------------------- */
  if (activeTab === 'announcements') {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-[#17a2b8] text-white px-4 py-2 font-bold text-sm">
            Official College Announcements & Event Bulletins
          </div>
          <div className="divide-y divide-slate-100 p-4 space-y-4">
            {announcements.map((ann) => (
              <div key={ann.id} className="pt-3 first:pt-0">
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      ann.category === 'URGENT'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : ann.category === 'EVENT'
                        ? 'bg-sky-100 text-sky-800 border border-sky-200'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {ann.category}
                  </span>
                  <span className="text-xs text-slate-400">{ann.date} • {ann.author}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{ann.title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     3. BROWSE EVENTS VIEW
  -------------------------------------------------------------- */
  if (activeTab === 'browse_events') {
    return (
      <div className="space-y-4">
        {/* Search & Filter Header */}
        <div className="bg-white p-3 rounded shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search events, workshops, hackathons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
            {['ALL', 'Hackathon', 'Workshop', 'PRBM Statement', 'Seminar'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-semibold rounded whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#17a2b8] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.map((evt) => {
            const seatsLeft = evt.capacity - evt.registeredCount;
            const percentFilled = Math.min(100, Math.round((evt.registeredCount / evt.capacity) * 100));
            const isAlreadyBooked = myRegistrations.some(
              (r) => r.eventId === evt.id && r.bookingStatus !== 'Cancelled'
            );

            return (
              <div
                key={evt.id}
                className="bg-white rounded shadow-sm border border-slate-200 flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="border-t-4 border-[#17a2b8] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                      {evt.type}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{evt.department}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">{evt.description}</p>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span className="truncate">{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                  </div>

                  {/* Seat Capacity Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-500 font-medium">Capacity filled:</span>
                      <span className="font-bold text-slate-700">
                        {evt.registeredCount} / {evt.capacity} seats ({seatsLeft} remaining)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          percentFilled > 80 ? 'bg-rose-500' : 'bg-[#17a2b8]'
                        }`}
                        style={{ width: `${percentFilled}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer with Price/Credits and Booking CTA */}
                <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    {evt.fee > 0 ? (
                      <div className="text-xs font-bold text-slate-900">
                        ₹{evt.fee}{' '}
                        {evt.creditRequirement > 0 && (
                          <span className="text-slate-500 font-normal">or {evt.creditRequirement} credits</span>
                        )}
                      </div>
                    ) : evt.creditRequirement > 0 ? (
                      <div className="text-xs font-bold text-amber-700">
                        {evt.creditRequirement} Credits Required
                      </div>
                    ) : (
                      <div className="text-xs font-bold text-emerald-600">Free to Register</div>
                    )}
                    <div className="text-[10px] text-sky-700 font-medium">
                      +{evt.creditsAwarded} Academic Credit on completion
                    </div>
                  </div>

                  {isAlreadyBooked ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Booked
                    </span>
                  ) : seatsLeft <= 0 ? (
                    <span className="text-xs font-bold text-slate-400 bg-slate-200 px-3 py-1.5 rounded">
                      Full
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setBookingModalEvent(evt);
                        setBookingMessage(null);
                      }}
                      className="text-xs font-bold bg-[#17a2b8] hover:bg-[#138496] text-white px-3.5 py-1.5 rounded shadow-sm transition-colors"
                    >
                      Book Event
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Booking Confirmation Modal */}
        {bookingModalEvent && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in duration-200">
              <div className="bg-[#17a2b8] text-white px-4 py-3 flex items-center justify-between font-bold text-sm">
                <span>Confirm Event Registration</span>
                <button
                  onClick={() => setBookingModalEvent(null)}
                  className="text-white hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{bookingModalEvent.title}</h4>
                  <p className="text-slate-500 mt-1">{bookingModalEvent.venue} • {bookingModalEvent.date}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Student Name:</span>
                    <span className="font-bold text-slate-800">{studentProfile.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Register Number:</span>
                    <span className="font-bold text-slate-800">{studentProfile.registerNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Credit Balance:</span>
                    <span className="font-bold text-sky-700">{creditBalance} Credits</span>
                  </div>
                </div>

                {/* Payment / Credit Selector */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-700 block">Choose Payment / Registration Method:</span>
                  <div className="space-y-1.5">
                    {bookingModalEvent.creditRequirement > 0 && (
                      <label className="flex items-center space-x-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentChoice"
                          checked={paymentChoice === 'credits'}
                          onChange={() => setPaymentChoice('credits')}
                          className="text-sky-600 focus:ring-sky-500"
                        />
                        <span className="font-medium text-slate-800">
                          Use {bookingModalEvent.creditRequirement} Academic Credits (Wallet)
                        </span>
                      </label>
                    )}

                    {bookingModalEvent.fee > 0 && (
                      <label className="flex items-center space-x-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentChoice"
                          checked={paymentChoice === 'fee'}
                          onChange={() => setPaymentChoice('fee')}
                          className="text-sky-600 focus:ring-sky-500"
                        />
                        <span className="font-medium text-slate-800">
                          Pay ₹{bookingModalEvent.fee}.00 (Online Demo Payment)
                        </span>
                      </label>
                    )}

                    {bookingModalEvent.fee === 0 && bookingModalEvent.creditRequirement === 0 && (
                      <div className="p-2 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 font-medium">
                        This event is free of charge. No payment required.
                      </div>
                    )}
                  </div>
                </div>

                {bookingMessage && (
                  <div
                    className={`p-2.5 rounded text-xs font-semibold ${
                      bookingMessage.isError
                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {bookingMessage.text}
                  </div>
                )}

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => setBookingModalEvent(null)}
                    className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    className="px-4 py-1.5 rounded bg-[#17a2b8] hover:bg-[#138496] text-white font-bold shadow-sm"
                  >
                    Confirm & Reserve Seat
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* -------------------------------------------------------------
     4. MY BOOKINGS VIEW
  -------------------------------------------------------------- */
  if (activeTab === 'my_bookings') {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-[#17a2b8] text-white px-4 py-2 font-bold text-sm flex items-center justify-between">
            <span>My Registered Events & Bookings</span>
            <span className="text-xs text-sky-100">{myRegistrations.length} Total Bookings</span>
          </div>

          {myRegistrations.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              You haven't booked any events yet. Check the Browse Events tab!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">Event Title</th>
                    <th className="px-4 py-2.5">Booking Status</th>
                    <th className="px-4 py-2.5">Payment</th>
                    <th className="px-4 py-2.5">Registered Date</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {reg.eventTitle}
                        <div className="text-[11px] text-slate-400 font-normal">
                          Pass Code: <span className="font-mono text-slate-600">{reg.passCode}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                            reg.bookingStatus === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : reg.bookingStatus === 'Pending Approval'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {reg.bookingStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-medium">
                        {reg.amountOrCreditsPaid}
                      </td>
                      <td className="px-4 py-3 text-slate-500">{reg.registeredAt}</td>
                      <td className="px-4 py-3 text-right space-x-2">
                        {reg.bookingStatus === 'Confirmed' && (
                          <button
                            onClick={() => setViewingPass(reg)}
                            className="bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-300 px-2.5 py-1 rounded font-semibold text-[11px]"
                          >
                            Digital Pass
                          </button>
                        )}
                        {reg.bookingStatus !== 'Cancelled' && (
                          <button
                            onClick={() => cancelBooking(reg.id)}
                            className="text-rose-600 hover:text-rose-800 font-medium text-[11px]"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Digital Pass Modal */}
        {viewingPass && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full overflow-hidden border border-slate-300">
              <div className="bg-[#17a2b8] text-white p-3 flex justify-between items-center font-bold text-sm">
                <span>SIS-KARE Official Event Pass</span>
                <button onClick={() => setViewingPass(null)} className="text-white hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 text-center space-y-4">
                <div className="w-36 h-36 mx-auto bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center rounded-lg">
                  <QrCode className="w-24 h-24 text-slate-800" />
                  <span className="text-[10px] font-mono text-slate-500 mt-1">{viewingPass.passCode}</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{viewingPass.eventTitle}</h4>
                  <p className="text-xs text-slate-500 mt-1">Student: {studentProfile.name}</p>
                  <p className="text-xs font-mono font-bold text-sky-800">Reg: {studentProfile.registerNumber}</p>
                </div>
                <div className="p-2 bg-emerald-50 text-emerald-800 rounded text-xs font-semibold">
                  Valid for Single Admission • Gate Verification Active
                </div>
                <button
                  onClick={() => alert(`Pass downloaded for ${viewingPass.passCode}`)}
                  className="w-full py-2 bg-[#17a2b8] text-white rounded font-bold text-xs shadow"
                >
                  Download / Save to Phone
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* -------------------------------------------------------------
     5. CREDIT BALANCE VIEW
  -------------------------------------------------------------- */
  if (activeTab === 'credit_balance') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow-sm border-t-4 border-[#17a2b8]">
            <div className="text-xs font-semibold text-slate-500 uppercase">Available Academic Credits</div>
            <div className="text-3xl font-black text-sky-800 mt-2">{creditBalance}</div>
            <div className="text-xs text-slate-500 mt-1">Can be redeemed for high-value workshops & certifications.</div>
          </div>
          <div className="bg-white p-4 rounded shadow-sm border-t-4 border-emerald-500">
            <div className="text-xs font-semibold text-slate-500 uppercase">Total Credits Earned</div>
            <div className="text-3xl font-black text-emerald-700 mt-2">51</div>
            <div className="text-xs text-slate-500 mt-1">From attending hackathons & verified course modules.</div>
          </div>
          <div className="bg-white p-4 rounded shadow-sm border-t-4 border-amber-500">
            <div className="text-xs font-semibold text-slate-500 uppercase">Credits Redeemed</div>
            <div className="text-3xl font-black text-amber-700 mt-2">5</div>
            <div className="text-xs text-slate-500 mt-1">Used for event admissions this semester.</div>
          </div>
        </div>

        {/* Ledger */}
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-[#17a2b8] text-white px-4 py-2 font-bold text-sm">
            Credit Transaction Ledger & Audit History
          </div>
          <div className="divide-y divide-slate-100">
            {creditTransactions.map((tx) => (
              <div key={tx.id} className="p-3 text-xs flex items-center justify-between hover:bg-slate-50">
                <div>
                  <div className="font-semibold text-slate-900">{tx.description}</div>
                  <div className="text-[10px] text-slate-400">{tx.date} • ID: {tx.id}</div>
                </div>
                <div
                  className={`font-bold text-sm ${
                    tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {tx.type === 'CREDIT' ? `+${tx.amount} Credits` : `-${tx.amount} Credits`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     6. DIGITAL PASSES VIEW
  -------------------------------------------------------------- */
  if (activeTab === 'digital_passes') {
    const activePasses = myRegistrations.filter((r) => r.bookingStatus === 'Confirmed');
    return (
      <div className="space-y-4">
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-[#17a2b8] text-white px-4 py-2 font-bold text-sm">
            Active Digital Gate Passes
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {activePasses.length === 0 ? (
              <div className="col-span-2 text-center text-slate-500 text-xs py-8">
                No active digital passes available. Passes are issued automatically upon confirmed booking.
              </div>
            ) : (
              activePasses.map((pass) => (
                <div
                  key={pass.id}
                  className="bg-white border-2 border-slate-300 rounded-lg p-4 shadow-sm relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-[#17a2b8] text-white text-[10px] font-bold px-3 py-0.5 rounded-bl">
                    VERIFIED PASS
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-slate-100 rounded border border-slate-200">
                      <QrCode className="w-16 h-16 text-slate-900" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{pass.eventTitle}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Attendee: {studentProfile.name}</p>
                      <p className="text-xs font-mono font-bold text-sky-800 mt-0.5">{pass.passCode}</p>
                      <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                        Status: Confirmed & Authorized
                      </div>
                    </div>
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
     7. MY E-CERTIFICATES VIEW
  -------------------------------------------------------------- */
  if (activeTab === 'certificates') {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-[#17a2b8] text-white px-4 py-2 font-bold text-sm flex items-center justify-between">
            <span>Verified E-Certificates of Participation & Excellence</span>
            <span className="text-xs text-sky-100">{certificates.length} Issued</span>
          </div>

          <div className="p-4">
            {certificates.length === 0 ? (
              <div className="text-center text-slate-500 text-xs py-8">
                No certificates earned yet. Attend and complete approved events to earn verified credentials!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-amber-50/50 border border-amber-200 rounded p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <Award className="w-6 h-6 text-amber-600" />
                        <span className="text-[10px] font-mono font-bold text-slate-500">
                          {cert.verificationId}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 mt-2">{cert.eventTitle}</h4>
                      <p className="text-xs text-slate-600 mt-1">{cert.gradeOrRemarks}</p>
                      <div className="text-[11px] text-slate-400 mt-2">
                        Issued on: {cert.issueDate} • {cert.department}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between">
                      <button
                        onClick={() => setViewingCert(cert)}
                        className="text-xs font-bold text-sky-700 hover:underline"
                      >
                        Preview Certificate
                      </button>
                      <button
                        onClick={() => alert(`Certificate ${cert.verificationId} PDF downloaded successfully!`)}
                        className="bg-[#17a2b8] text-white px-3 py-1 rounded text-xs font-bold shadow-sm flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Certificate Preview Modal */}
        {viewingCert && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8 border-8 border-double border-amber-600 text-center space-y-4">
              <div className="text-xs font-extrabold tracking-widest text-slate-500 uppercase">
                Kalasalingam Academy of Research and Education
              </div>
              <h2 className="text-2xl font-serif font-black text-slate-900 uppercase">
                Certificate of Achievement
              </h2>
              <p className="text-xs text-slate-500 italic">This is proudly presented to</p>
              <div className="text-xl font-bold text-sky-900 underline decoration-sky-500">
                {viewingCert.studentName} ({viewingCert.registerNumber})
              </div>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                for active participation and successful completion of the academic program
              </p>
              <div className="font-bold text-sm text-slate-800">{viewingCert.eventTitle}</div>
              <div className="text-xs text-slate-500">{viewingCert.gradeOrRemarks}</div>

              <div className="pt-6 flex items-center justify-between text-xs text-slate-600 border-t border-slate-200 mt-4">
                <div>
                  <div className="font-bold">Dr. S. Hemaswathi</div>
                  <div className="text-[10px] text-slate-400">Faculty Coordinator</div>
                </div>
                <div className="text-center font-mono text-[10px] text-slate-400">
                  <QrCode className="w-10 h-10 mx-auto text-slate-700" />
                  {viewingCert.verificationId}
                </div>
                <div>
                  <div className="font-bold">Dr. R. Venkataraman</div>
                  <div className="text-[10px] text-slate-400">Dean / Academic Affairs</div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setViewingCert(null)}
                  className="px-6 py-1.5 bg-slate-800 text-white rounded text-xs font-bold"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
