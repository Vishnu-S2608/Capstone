# SIS-KARE: College Event Management & Approval Portal

A modern, responsive college event management system built with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS**. It replicates the official Kalasalingam University SIS portal aesthetics with a dark slate sidebar, cyan header banners, and structured key-value data cards.

---

## 🚀 Live Demo & Role Switching

The application is running locally at **[http://localhost:3000](http://localhost:3000)**.

Use the **Role Switcher** in the top navigation bar to toggle between the 3 portals:
1. **Student** (`IKLASH AHAMED N` - Reg No: `9923008152`)
2. **Staff / Faculty** (`Dr. S. Hemaswathi` - ID: `7373000708`)
3. **Management / Dean** (`Dr. R. Venkataraman` - ID: `ADM-8801`)

---

## 🌟 Key Features Implemented

### 1. Student Portal
* **Dashboard:** Pixel-accurate replication of the student information view (Personal Details 2-column cards, ABC ID, Advisor, and Campus Notifications).
* **Browse Events:** Interactive catalog with real-time seat availability meters, fee/credit badges, and category filters.
* **Instant Booking Modal:** Allows booking via **Academic Credit Wallet** or demo online payment. Validates capacity and prevents duplicate reservations.
* **Digital Passes:** Generates tamper-proof gate passes with dynamic QR codes.
* **Credit Ledger:** Real-time balance and audit history of earned and redeemed academic credits.
* **E-Certificates:** Certificate preview modal and PDF download simulator for completed programs.

### 2. Staff / Faculty Portal
* **Faculty Dashboard:** Live status metrics (Proposals under review, approved events, revisions requested, completed events).
* **Raise Approval Form:** Comprehensive proposal submission covering problem statements, category, time slots, venue, capacity, fee/credit rules, and management approval toggles.
* **Workspace & Revisions:** Displays Dean/Management review remarks with one-click **Revise & Resubmit**.
* **Event Completion & Attendance:** Attendance checklist for registered students with server-side date validation (prevents completion before scheduled dates).
* **E-Certificate Issuance:** Issues cryptographically verified certificates to attendees marked as present.

### 3. Management / Admin Portal
* **Executive Console:** High-level analytics on pending sanctions, active events, bookings, and certificates.
* **Staff Sanction Queue:** Review proposals with **Approve**, **Reject**, or **Request Changes** (with mandatory feedback remarks).
* **Student Booking Authorizations:** Authorize or decline student registrations for restricted events.
* **Catalog Publishing:** Publish or unpublish approved events to/from the student feed.
* **Audit Trail:** Comprehensive chronological record of all system events and permissions.

---

## 🗄️ Database Integration (Aiven PostgreSQL Connected)

The project is connected to your **Aiven PostgreSQL Cloud Database**:
- **Host:** `pg-2e8cc02-klu-1f71.h.aivencloud.com:23766`
- **Database:** `defaultdb` (SSL enabled)
- **ORM:** Prisma v6 (`@prisma/client`)
- **Schema & Migrations:** 13 database tables fully synced via `npx prisma db push`
- **Seed Data:** Populated with student, faculty, events, registrations, certificates, and audit trail via `npx prisma db seed`

### Relational Models Implemented
1. `User` & `Role` (STUDENT, STAFF, MANAGEMENT)
2. `StudentProfile` & `StaffProfile`
3. `Event` (Proposals, scheduling, capacity, fee/credits, status)
4. `EventApproval` (Reviewer remarks, sanction status)
5. `EventRegistration` (Bookings, digital pass codes)
6. `BookingApproval` (Restricted event sign-offs)
7. `CreditAccount` & `CreditTransaction` (Atomic student wallet ledger)
8. `Payment` (Payment records)
9. `Attendance` (Verified attendance checklist)
10. `Announcement` (Official bulletins & campus notifications)
11. `Certificate` (Verified credentials with unique verification IDs)
12. `AuditLog` (Chronological compliance audit history)

---

## 🛠️ Tech Stack
* **Framework:** Next.js 16.4.3 (Turbopack, App Router)
* **Language:** TypeScript 5 (Strict Mode)
* **Styling:** Tailwind CSS v4
* **Icons:** Lucide React
