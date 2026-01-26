Swasthify V1 Application - Launch Scope & Deliverables
Date: January 2, 2026
Version: 1.0

This document outlines the complete scope of features, functionalities, and site map for the Swasthify V1 launch.

================================================================================
1. PUBLIC WEBSITE (Patient & General Access)
================================================================================
The public portal serves as the entry point for patients, doctors, and general users to learn about Swasthify and access services.

Site Map & Pages:
-----------------
1. Home Page [/]
   - Description: Main landing page featuring service overview, value proposition, and call-to-action for patients and doctors.
   
2. About Us [/about-us]
   - Description: Company mission, vision, and team information.

3. Services [/services]
   - Description: Detailed catalog of medical services provided (e.g., Consultations, Lab Tests).

4. Contact Us [/contact]
   - Description: Inquiry form and contact details for support.

5. How It Works [/how-it-works]
   - Description: User guides for patients (booking appointments) and doctors (joining the platform).

6. Pricing [/pricing]
   - Description: Service plans or subscription tiers (if applicable).

7. Doctor Onboarding (Join as a Doctor) [/doctor-profile]
   - Description: Detailed portal for doctors to sign up and submit credentials.


================================================================================
2. DOCTOR ONBOARDING & VERIFICATION WORKFLOW
================================================================================
Objective: Ensure trust and safety by verifying every medical professional before they go live.

Step 1: Registration
- link: /doctor-profile
- Action: Doctor signs up using Email and Phone Number.
- Outcome: Account created in "Pending" state.

Step 2: Credential Submission
Doctors must upload the following clear documents via the secure portal:
A. Personal Identity Verification:
   - Pan Card
   - Aadhaar Card
B. Professional Verification:
   - Medical Registration / License Number
   - Specialization Certificates
C. Practice Details:
   - Clinic/Hospital Name & Address
   - Location Coordinates
   - Clinic Photographs

Step 3: Admin Review Process (Offline/Backend)
- Status: The doctor's profile remains hidden from search results until verified.
- Verification: Admin team reviews uploaded documents against public registries.
- Decision: Admin approves (Go Live) or Rejects (Request Resubmission).


================================================================================
3. SUPER ADMIN PANEL (Management Console)
================================================================================
A centralized dashboard for the Swasthify Operations Team to manage the entire platform.

Dashboard & Overview:
---------------------
1. Main Dashboard [/superAdmin/dashboard]
   - Key metrics: Total Users, Active Doctors, Pending Verifications, Today's Appointments.

User Management Modules:
------------------------
2. Doctor Management [/superAdmin/userManagement/doctors]
   - View all registered doctors.
   - Filter by status (Verified, Pending, Blocked).
   - Action: Verify documents and approve "Live" status.

3. Patient Management [/superAdmin/userManagement/patient]
   - View all registered patient accounts.
   - Manage user details and history.

4. Lab Management [/superAdmin/userManagement/labs]
   - Manage diagnostic lab partners.

5. General Users [/superAdmin/userManagement/users]
   - Internal staff or sub-admin account management.

Operations & Workflows:
-----------------------
6. Appointments [/superAdmin/operations/appointment]
   - Monitor booking status and flow.

7. Complaints [/superAdmin/operations/complaints]
   - Helpdesk ticketing system for user grievances.

8. Support Tickets [/superAdmin/operations/tickets]
   - Technical or account-related support requests.

System & Analytics:
-------------------
9. Analytics [/superAdmin/analytics]
   - Detailed reports on platform usage and performance.

10. Reports [/superAdmin/system/reports]
    - Downloadable data reports (Daily/Weekly/Monthly).

11. Push Notifications [/superAdmin/system/pushNotification]
    - Send alerts and updates to user apps.

12. Platform Settings [/superAdmin/system/settings]
    - Global configuration and variables.


================================================================================
4. LAUNCH READINESS
================================================================================
- All core public pages are responsive and content-ready.
- Secure Doctor Onboarding pipeline is tested and active.
- Admin Panel is equipped with full "verification" and "live" toggle capabilities.

End of Document
