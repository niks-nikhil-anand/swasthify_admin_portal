# Public Doctor Discovery and Guest Booking Plan

## Scope

This plan covers only the following three goals:

1. Make `/doctors` and `/doctors/[id]` usable by guests.
2. Show useful doctor information before authentication is required.
3. Open booking in context instead of redirecting guests to a generic login page.

The detailed product requirements are defined in:

`/Users/nikhil/Downloads/guest-first-booking-flow_2.html`

This document is an implementation plan. It does not require copying the reference HTML into the application.

## Expected user journey

```text
Guest opens /doctors
  → Searches, filters, or sorts doctors
  → Opens /doctors/[id]
  → Reviews doctor profile and available slots
  → Clicks Book Now
  → Booking flow opens on the same page
  → Selected doctor and slot remain visible
  → Guest continues to patient details and authentication
```

## Current problems to resolve

- `middleware.js` currently redirects unauthenticated `/doctors` and `/labs` visitors to `/login`.
- The doctor detail page checks for a logged-in user before opening `BookingModal`.
- Guests therefore cannot start a booking from the doctor page.
- The public listing is campaign-based, so the displayed doctor information must be checked for completeness and consistency.
- The current booking modal uses client-generated date/time choices and must be aligned with server-provided availability.

## Files in scope

### Routing and pages

- `middleware.js`
- `app/(root)/doctors/page.tsx`
- `app/(root)/doctors/[id]/page.tsx`
- `app/(root)/doctors/[id]/components/ScheduleSection.tsx`

### Doctor discovery components

- `app/(root)/doctors/components/DoctorFilters.tsx`
- `app/(root)/doctors/components/Search.tsx`
- `app/(root)/doctors/components/DoctorPagination.tsx`
- `components/root/CampaignCard.tsx`

### Booking components and APIs

- `app/(root)/doctors/[id]/components/BookingModal.tsx`
- `app/api/public/campaigns/route.ts`
- `app/api/public/campaigns/[id]/route.ts`
- `app/api/appointments/route.ts`
- Existing patient authentication and OTP routes as needed after the guest flow reaches authentication.

## Step-by-step plan

## Step 1 — Define the public access boundary

### Tasks

- [ ] Treat `/doctors` as a public route.
- [ ] Treat `/doctors/[id]` as a public route.
- [ ] Keep `/me`, `/doctor-panel`, `/lab-panel`, and `/superAdmin` protected.
- [ ] Keep doctor and lab management APIs protected unless they are explicitly public read APIs.
- [ ] Confirm that public campaign APIs do not require a patient cookie.
- [ ] Preserve safe redirect behavior for protected pages only.

### Acceptance criteria

- A logged-out user can open `/doctors` directly without seeing `/login`.
- A logged-out user can open a doctor details URL directly without seeing `/login`.
- Existing protected routes still redirect unauthenticated users correctly.
- A logged-in patient can still access the same public pages normally.

## Step 2 — Verify the public doctor data contract

### Tasks

- [ ] Inspect the response from `/api/public/campaigns` and `/api/public/campaigns/[id]`.
- [ ] Confirm whether each result represents a doctor, campaign, or doctor/campaign combination.
- [ ] Define a stable frontend view model for the public doctor card and detail page.
- [ ] Ensure the API returns, where available:
  - [ ] Doctor name
  - [ ] Profile photo
  - [ ] Specialization
  - [ ] Years of experience
  - [ ] Consultation fee
  - [ ] Clinic or hospital name
  - [ ] Rating and review count
  - [ ] Available days and time slots
  - [ ] Campaign/booking identifier
- [ ] Return explicit `null` or an empty state for missing optional data instead of making the frontend guess.
- [ ] Ensure only active and verified bookable doctors are returned.

### Acceptance criteria

- The frontend does not need authentication to fetch public doctor data.
- Every doctor card has enough information for a visitor to decide whether to open details.
- Missing photo, rating, clinic, or availability data has a clean fallback display.
- The booking action uses a stable identifier that the server can validate.

## Step 3 — Update the doctor listing page

### Tasks

- [ ] Confirm the page heading and copy describe finding doctors, not only campaigns.
- [ ] Keep search, specialization filters, type filters, sorting, and pagination available to guests.
- [ ] Update the card layout to show the key doctor information directly.
- [ ] Add clear `View Details` and `Book Now` actions to every eligible card.
- [ ] Make the entire card keyboard accessible without creating nested-link/button conflicts.
- [ ] Show loading, empty, error, and no-availability states.
- [ ] Preserve filters in the URL so a guest can navigate back from doctor details.
- [ ] Ensure the card remains readable on mobile without horizontal scrolling.

### Acceptance criteria

- A guest can search and filter doctors without authentication.
- A guest can see the doctor’s name, specialization, experience, fee, clinic/hospital, rating, and next availability when provided.
- `View Details` opens the correct `/doctors/[id]` page.
- `Book Now` opens the in-context booking flow or the doctor details page with the booking state preserved.

## Step 4 — Update the doctor details page

### Tasks

- [ ] Remove the requirement that a user must be logged in to view doctor details.
- [ ] Display the doctor profile information clearly above the booking action.
- [ ] Display consultation fee, experience, specialization, clinic/hospital, rating, and doctor bio.
- [ ] Display persisted availability and available dates/times.
- [ ] Mark unavailable dates and slots clearly.
- [ ] Keep the selected date and slot in component state.
- [ ] Add a clear `Book Now` action near the availability section and in the desktop sidebar/mobile action area.
- [ ] Make the back link return to the previous doctor listing/filter state when possible.
- [ ] Add loading and not-found states that do not expose internal errors.

### Acceptance criteria

- A guest can fully inspect a doctor before entering any identity information.
- A guest can select a valid date and slot from the doctor details page.
- The selected doctor, date, and slot are visible when booking begins.
- The page never displays a misleading booking action for an unavailable doctor or slot.

## Step 5 — Replace the guest redirect with in-context booking

### Tasks

- [ ] Change `handleBookAppointment` in `app/(root)/doctors/[id]/page.tsx` so guests do not get redirected to `/login`.
- [ ] Open `BookingModal` for both guests and authenticated patients.
- [ ] Pass the selected date and slot into `BookingModal` when the user clicks `Book Now` from the schedule.
- [ ] Add a booking header showing the doctor, specialization, selected date, and selected slot.
- [ ] Add an explicit progress indicator for the booking steps.
- [ ] Use the following initial step structure:
  1. Select date and slot
  2. Patient details
  3. Mobile number
  4. OTP verification
  5. Review booking
  6. Payment or confirmation
  7. Appointment booked
- [ ] For authenticated patients, skip the identity steps and begin at review/confirmation.
- [ ] For guests, keep the selected doctor/date/slot while identity is collected.
- [ ] Add back navigation between steps without losing form data.
- [ ] Add a cancel/close confirmation if closing would discard meaningful booking progress.

### Acceptance criteria

- Clicking `Book Now` as a guest opens the booking experience on the current doctor context.
- No guest is sent to a generic login page before the booking context is saved.
- The user can return to the previous step without losing their selected slot or entered details.
- Authenticated patients receive the shorter booking path.
- Guest users are asked to authenticate only when needed to complete the booking.

## Step 6 — Connect booking to real availability

### Tasks

- [ ] Remove or isolate hard-coded time slot data from `BookingModal.tsx`.
- [ ] Add a public availability response for the selected doctor/campaign and date.
- [ ] Fetch available slots when the date changes.
- [ ] Disable slots already booked, expired, unavailable, or outside the doctor schedule.
- [ ] Show a loading state while availability is being fetched.
- [ ] Show a useful empty state when no slots are available for a date.
- [ ] Revalidate the selected slot on the server before creating or reserving an appointment.
- [ ] Return a specific conflict response when another user takes the slot first.

### Acceptance criteria

- The guest sees only server-supported dates and slots.
- A slot that becomes unavailable cannot be confirmed successfully.
- The user receives a clear message and can select another slot after a conflict.
- Date and time values are sent in a consistent timezone-safe format.

## Step 7 — Add the minimum guest identity handoff

### Tasks

- [ ] Add full name and mobile number as required guest fields.
- [ ] Keep email and other patient profile fields optional unless product requirements make them mandatory.
- [ ] Request mobile OTP from the booking context.
- [ ] Verify OTP without losing the selected doctor/date/slot.
- [ ] Identify an existing patient or create a new patient account after verification.
- [ ] Set the same secure patient session cookie used by the existing appointment API.
- [ ] Return the user to the review step after successful verification.
- [ ] Do not store OTP values or authentication tokens in browser storage.

### Acceptance criteria

- A new guest can complete the identity step without manually restarting the booking.
- An existing patient can verify and continue without creating a duplicate account.
- The selected doctor/date/slot is still present after OTP verification.
- OTP errors are shown inside the booking flow with retry and resend behavior.

## Step 8 — Protect the booking boundary on the server

### Tasks

- [ ] Do not trust client-provided fee, doctor data, availability, or campaign status.
- [ ] Validate the campaign/doctor and selected slot on the server.
- [ ] Require a valid authenticated patient session before final appointment creation.
- [ ] Reserve or create the appointment transactionally to prevent double booking.
- [ ] Calculate the final fee on the server.
- [ ] Return structured errors for unauthenticated, invalid slot, unavailable slot, and server failure cases.
- [ ] Keep payment initiation after server validation and patient identity resolution.

### Acceptance criteria

- A guest cannot create an appointment by calling the API without completing authentication.
- A client cannot book a slot outside the doctor’s real availability.
- Two users cannot successfully claim the same slot.
- Server-side fee calculation matches the review and payment amount.

## Step 9 — Accessibility and responsive QA

### Tasks

- [ ] Add visible labels and accessible descriptions to all booking fields.
- [ ] Ensure modal focus is trapped while open and returns to the triggering button when closed.
- [ ] Support Escape to close where safe and provide an explicit close button.
- [ ] Use visible focus states for cards, links, buttons, date controls, and slot controls.
- [ ] Ensure touch targets are at least 44×44px.
- [ ] Announce validation and availability errors accessibly.
- [ ] Support reduced-motion preferences for modal and step transitions.
- [ ] Verify mobile layout has no horizontal scrolling.
- [ ] Verify color contrast for selected, unavailable, error, and success states.

## Step 10 — Verification checklist

### Guest discovery

- [ ] Open `/doctors` in a logged-out browser.
- [ ] Search for a doctor.
- [ ] Filter by specialization.
- [ ] Change sorting and pagination.
- [ ] Open a doctor detail page directly.
- [ ] Use the browser Back button and confirm the listing state is retained.

### Guest booking

- [ ] Select a valid date and slot.
- [ ] Click `Book Now` while logged out.
- [ ] Confirm the booking flow opens without a generic login redirect.
- [ ] Enter patient details.
- [ ] Complete mobile OTP.
- [ ] Confirm the selected doctor/date/slot remains selected.
- [ ] Complete review and payment/confirmation.

### Authenticated booking

- [ ] Repeat the flow as an authenticated patient.
- [ ] Confirm identity steps are skipped.
- [ ] Confirm the patient can review and complete the booking directly.

### Failure cases

- [ ] Invalid doctor or campaign.
- [ ] No availability.
- [ ] Slot taken by another user.
- [ ] OTP expired or incorrect.
- [ ] User closes and reopens the booking modal.
- [ ] Payment cancelled or verification fails.

### Quality gates

- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Test desktop, tablet, and mobile widths.
- [ ] Test keyboard-only navigation.
- [ ] Review the final diff for unrelated changes.

## Definition of done

This scoped work is complete when guests can discover and inspect doctors without authentication, can start booking from the doctor context without losing their slot, and can complete the guest-to-authenticated handoff successfully. Protected areas must remain protected, real availability must be validated server-side, and all verification checks must pass.
