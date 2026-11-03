'use client';

import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import AppShell from '@/components/layout/AppShell';
import StudentPortalView from '@/components/student/StudentPortalView';
import StaffPortalView from '@/components/staff/StaffPortalView';
import ManagementPortalView from '@/components/management/ManagementPortalView';

function PortalDispatcher() {
  const { currentRole } = useApp();

  return (
    <AppShell>
      {(activeTab) => {
        if (currentRole === 'STUDENT') {
          return <StudentPortalView activeTab={activeTab} />;
        }
        if (currentRole === 'STAFF') {
          return <StaffPortalView activeTab={activeTab} />;
        }
        return <ManagementPortalView activeTab={activeTab} />;
      }}
    </AppShell>
  );
}

export default function HomePage() {
  return (
    <AppProvider>
      <PortalDispatcher />
    </AppProvider>
  );
}
