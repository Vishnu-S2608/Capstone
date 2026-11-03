'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Role } from '@/types';
import {
  Menu,
  X,
  User as UserIcon,
  Bell,
  Calendar,
  Award,
  CreditCard,
  CheckCircle,
  FileText,
  ShieldCheck,
  Layers,
  ChevronRight,
  Sparkles,
  Search,
  BookOpen,
  Send,
  SlidersHorizontal,
  LogOut,
} from 'lucide-react';

interface AppShellProps {
  children: (activeTab: string) => React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { currentRole, setCurrentRole, currentUser } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Role Switcher Handler
  const handleRoleChange = (role: Role) => {
    setCurrentRole(role);
    setActiveTab('dashboard');
  };

  // Sidebar navigation configuration per role
  const navigationItems = {
    STUDENT: [
      { id: 'dashboard', label: 'Dashboard', icon: Layers, badge: '' },
      { id: 'announcements', label: 'Announcements', icon: Bell, badge: '3' },
      { id: 'browse_events', label: 'Browse Events', icon: Calendar, badge: 'NEW' },
      { id: 'my_bookings', label: 'My Bookings', icon: BookOpen, badge: '' },
      { id: 'credit_balance', label: 'Credit Balance', icon: CreditCard, badge: '' },
      { id: 'digital_passes', label: 'Digital Passes', icon: ShieldCheck, badge: 'Active' },
      { id: 'certificates', label: 'My E-Certificates', icon: Award, badge: '' },
    ],
    STAFF: [
      { id: 'dashboard', label: 'Dashboard', icon: Layers, badge: '' },
      { id: 'workspace', label: 'Workspace', icon: SlidersHorizontal, badge: '' },
      { id: 'raise_approval', label: 'Raise Approval', icon: Send, badge: 'Form' },
      { id: 'my_events', label: 'My Events', icon: Calendar, badge: '' },
      { id: 'event_completion', label: 'Event Completion', icon: CheckCircle, badge: '' },
      { id: 'certificate_mgmt', label: 'E-Certificate Mgmt', icon: Award, badge: '' },
    ],
    MANAGEMENT: [
      { id: 'dashboard', label: 'Dashboard', icon: Layers, badge: '' },
      { id: 'staff_approvals', label: 'Staff Approval Requests', icon: FileText, badge: 'Pending' },
      { id: 'student_approvals', label: 'Student Booking Approvals', icon: ShieldCheck, badge: '' },
      { id: 'event_mgmt', label: 'Event Management', icon: Calendar, badge: '' },
      { id: 'credit_records', label: 'Credit & Payment Records', icon: CreditCard, badge: '' },
      { id: 'cert_oversight', label: 'Certificate Oversight', icon: Award, badge: '' },
      { id: 'audit_logs', label: 'System Audit Logs', icon: SlidersHorizontal, badge: '' },
    ],
  };

  const currentNav = navigationItems[currentRole];

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col font-sans">
      {/* Top Navigation Bar - Matches SIS-KARE cyan theme */}
      <header className="bg-[#17a2b8] text-white shadow-md sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-3.5">
          {/* Left: Brand Logo & Hamburger */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-sky-700/40 text-white transition-colors focus:outline-none"
              title="Toggle Sidebar"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-inner">
                {/* College Emblem Icon */}
                <div className="w-8 h-8 rounded-full border-2 border-amber-600 bg-amber-100 flex items-center justify-center text-xs font-black text-amber-800">
                  KLU
                </div>
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="font-extrabold text-xl tracking-wide text-white drop-shadow-sm">SIS-</span>
                <span className="font-black text-xl tracking-wider text-rose-300 drop-shadow-sm">KARE</span>
                <span className="hidden sm:inline-block text-xs bg-white/20 text-white px-2.5 py-1 rounded-full ml-2 font-semibold">
                  Event Portal
                </span>
              </div>
            </div>
          </div>

          {/* Center: Live Role Switcher */}
          <div className="hidden md:flex items-center bg-black/25 p-1.5 rounded-xl border border-white/20 shadow-inner">
            <span className="text-xs text-sky-100 font-bold px-3 uppercase tracking-wider">Role Switcher:</span>
            {(['STUDENT', 'STAFF', 'MANAGEMENT'] as Role[]).map((role) => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className={`px-4 py-1.5 text-xs md:text-sm font-bold rounded-lg transition-all ${
                  currentRole === role
                    ? 'bg-white text-sky-900 shadow-md scale-105'
                    : 'text-white/85 hover:text-white hover:bg-white/10'
                }`}
              >
                {role === 'STUDENT' ? 'Student' : role === 'STAFF' ? 'Staff' : 'Management'}
              </button>
            ))}
          </div>

          {/* Right: User Profile & Identity Pill */}
          <div className="flex items-center space-x-4">
            {/* Mobile Role Selector */}
            <div className="md:hidden">
              <select
                value={currentRole}
                onChange={(e) => handleRoleChange(e.target.value as Role)}
                aria-label="Select User Role"
                className="bg-sky-800 text-white text-sm px-3 py-1.5 rounded-lg border border-white/30"
              >
                <option value="STUDENT">Student</option>
                <option value="STAFF">Staff</option>
                <option value="MANAGEMENT">Management</option>
              </select>
            </div>

            {/* Profile Avatar Pill */}
            <div className="flex items-center space-x-3 bg-sky-800/50 hover:bg-sky-800/70 transition-colors px-3.5 py-1.5 rounded-full border border-white/25 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-white font-bold text-sm">
                <UserIcon className="w-5 h-5" />
              </div>
              <div className="text-right">
                <div className="text-sm font-extrabold leading-tight tracking-wide text-white">
                  {currentUser.identifier}
                </div>
                <div className="text-xs text-sky-100 font-medium leading-tight hidden sm:block">
                  {currentRole === 'STUDENT' ? 'Student' : currentRole === 'STAFF' ? 'Faculty' : 'Admin'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body Container with Sidebar and Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Dark Slate Sidebar - Generous modern sizing */}
        <aside
          className={`${
            sidebarOpen ? 'w-72' : 'w-0 -translate-x-full'
          } lg:translate-x-0 transition-all duration-200 ease-in-out bg-[#1e2631] text-slate-300 flex flex-col shrink-0 z-40 border-r border-slate-700/50 overflow-y-auto`}
        >
          {/* Role Indicator Banner inside Sidebar */}
          <div className="p-4 bg-[#171f28] border-b border-slate-700/60 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block">Active Portal</span>
              <span className="text-sm font-bold text-sky-400 flex items-center gap-1.5 mt-0.5">
                <Sparkles className="w-4 h-4" />
                {currentRole === 'STUDENT'
                  ? 'Student Portal'
                  : currentRole === 'STAFF'
                  ? 'Faculty Portal'
                  : 'Management Admin'}
              </span>
            </div>
            <span
              className={`text-xs font-black px-2 py-1 rounded-md ${
                currentRole === 'STUDENT'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : currentRole === 'STAFF'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {currentRole}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 py-4 px-3 space-y-1.5">
            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#17a2b8] text-white shadow-md'
                      : 'text-slate-300 hover:bg-slate-700/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                        item.badge === 'NEW'
                          ? 'bg-rose-500 text-white animate-pulse'
                          : item.badge === 'Pending'
                          ? 'bg-amber-500 text-black'
                          : isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-sky-900/60 text-sky-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User footer badge */}
          <div className="p-4 bg-[#171f28] border-t border-slate-700/60 text-xs text-slate-400">
            <div className="font-bold text-slate-200 truncate text-sm">{currentUser.name}</div>
            <div className="text-xs text-slate-400 truncate mt-0.5">{currentUser.department}</div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f1f5f9]">
          <div className="max-w-7xl mx-auto space-y-6">
            {children(activeTab)}
          </div>
        </main>
      </div>
    </div>
  );
}
