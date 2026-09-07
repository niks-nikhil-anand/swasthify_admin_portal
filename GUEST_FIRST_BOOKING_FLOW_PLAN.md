# Guest-First Booking Flow — Implementation Plan

## Source of truth

This plan translates the product and UX requirements in:

`/Users/nikhil/Downloads/guest-first-booking-flow_2.html`

The HTML file is a specification document. It should not be copied into the application as a static page.

## Objective

Allow visitors to discover doctors and select an appointment slot without logging in. Ask for identity only when the visitor is ready to complete a booking, using mobile OTP as the primary authentication method.

The completed flow should be:

```text
Guest → Browse doctors → Doctor details → Select date and slot
      → Patient details → Mobile OTP → Create/login patient
      → Confirm and pay → Appointment booked
```

Returning authenticated patients should use the shorter flow:

```text
Doctor → Select date and slot → Confirm details → Pay/confirm → Appointment booked
```

## Goals

- Make `/doctors` and `/doctors/[id]` fully usable by guests.
- Show useful doctor information before a user needs to log in.
- Open an in-context booking experience instead of redirecting guests to a generic login page.
- Collect only the patient information required to complete the appointment.
- Make mobile OTP the primary patient login and registration flow.
- Automatically identify existing patients and create new patient accounts after OTP verification.
- Preserve the selected doctor, date, and slot throughout authentication.
- Prevent double bookings with server-side validation and transactional reservation.
- Keep Razorpay payment and appointment confirmation reliable.
- Handle OTP, slot, browser-refresh, and payment failure states clearly.
- Meet accessibility, responsive layout, keyboard, and touch interaction requirements.

## Non-goals

- Redesign the doctor panel, lab panel, or super-admin panel.
- Replace doctor or lab authentication flows unless they share code that must be refactored safely.
- Remove Razorpay without a separate product decision.
- Copy the visual styling of the reference HTML document into the production application.

## Current implementation findings

| Area | Current behavior | Required change |
| --- | --- | --- |
| Guest discovery | `middleware.js` redirects unauthenticated `/doctors` and `/labs` visitors to `/login`. | Make doctor discovery and doctor details public. Keep patient portal and operational portals protected. |
| Doctor listing | `/doctors` currently fetches active verified doctor campaigns. | Confirm card data and expose name, photo, specialization, experience, fee, clinic, rating, and availability. |
| Doctor details | Doctor details are publicly rendered, but booking checks `user` first. | Keep details public and open booking for guests. |
| Booking UI | `BookingModal` supports date, time category, slot, review, and payment. | Add patient details, mobile OTP, account resolution, confirmation, and resumable state. |
| Appointment API | `/api/appointments` requires the `PATIENT` cookie before creating an appointment. | Authenticate/create the patient before appointment creation and reserve the slot transactionally. |
| Mobile OTP | Firebase mobile OTP and backend OTP routes both exist with different session behavior. | Standardize phone normalization, OTP verification, JWT claims, and patient cookie creation. |
| Patient registration | Registration currently requires email and password. | Use mobile OTP as the primary patient registration path; retain email as optional or secondary. |
| Slot safety | Appointment creation does not visibly enforce a unique doctor/date/time reservation. | Add server-side availability checks, reservation expiry, conflict handling, and database protection. |

## Files likely to change

### Frontend

- `middleware.js`
- `app/(root)/doctors/page.tsx`
- `app/(root)/doctors/[id]/page.tsx`
- `app/(root)/doctors/[id]/components/BookingModal.tsx`
- `app/(root)/doctors/[id]/components/ScheduleSection.tsx`
- `app/(root)/(auth)/login/page.tsx`
- `components/auth/AuthWrapper.tsx`
- `components/auth/LoginForm.tsx`
- `components/auth/RegisterForm.tsx`
- New booking components under `app/(root)/doctors/[id]/components/booking/` as needed.

### Backend and data

- `app/api/appointments/route.ts`
- `app/api/auth/otp/route.js`
- `app/api/auth/verify-otp/route.js`
- `app/api/auth/identity-mobile-otp/route.ts`
- `app/api/auth/me/route.ts`
- `app/api/auth/sync-session/route.js`
- `app/api/public/campaigns/route.ts`
- `app/api/public/campaigns/[id]/route.ts`
- `prisma/schema.prisma`
- A new Prisma migration if reservation fields or constraints are required.

### Tests and documentation

- Add unit/API tests for OTP, session, availability, and reservation behavior.
- Add end-to-end tests for guest and authenticated booking journeys.
- Update `README.md` if authentication or booking behavior changes materially.

## Product decisions to confirm before implementation

These decisions affect the API and data model. The proposed default is included so implementation can proceed if no alternative is chosen.

| Decision | Proposed default |
| --- | --- |
| Payment requirement | Keep the current Razorpay payment requirement for paid appointments. |
| Booking identity | Create or identify a `PATIENT` user after successful mobile OTP verification. |
| Patient name | Required for new users and required in the guest booking form. |
| Email | Optional during guest booking; request later if required for receipts. |
| Slot reservation duration | Reserve a selected slot for 10–15 minutes while the user completes OTP and payment. |
| OTP provider | Use the existing Firebase mobile OTP integration, with one standardized backend session endpoint. |
| Password login | Keep temporarily for compatibility, but rank mobile OTP first in the patient UI. |
| Slot source | Derive slots from persisted doctor/campaign availability; never trust client-generated slots. |

## Step-by-step implementation

### Phase 1 — Establish the public discovery boundary

- [ ] Update `middleware.js` so `/doctors` and `/doctors/[id]` are public.
- [ ] Confirm `/api/public/campaigns` and `/api/public/campaigns/[id]` remain accessible without a patient cookie.
- [ ] Keep `/me`, `/doctor-panel`, `/lab-panel`, and `/superAdmin` protected.
- [ ] Preserve redirect behavior for protected routes with a safe `redirect` parameter.
- [ ] Verify a logged-out visitor can search, filter, sort, paginate, open a doctor, view availability, and click `Book Now`.

### Phase 2 — Align doctor listing and details with the reference

- [ ] Review the campaign-versus-doctor data model and decide whether the public card represents a campaign, a doctor, or a doctor’s bookable campaign.
- [ ] Ensure the public API returns stable fields for doctor name, profile image, specialization, experience, fee, clinic/hospital, rating, reviews, and next available slot.
- [ ] Render those fields in the doctor card without requiring click-through for basic information.
- [ ] Add or correct `View Details` and `Book Now` actions.
- [ ] Ensure unavailable doctors and unavailable slots have clear disabled or empty states.
- [ ] Use actual persisted availability rather than hard-coded time slots.

### Phase 3 — Create a resumable booking state model

- [ ] Define a typed booking state containing campaign/doctor ID, selected date, selected slot, patient fields, OTP state, reservation ID, and payment state.
- [ ] Split booking into explicit steps rather than relying on a single `SELECT/REVIEW/PAYMENT/SUCCESS` state.
- [ ] Preserve state when moving backward between steps.
- [ ] Persist only non-sensitive booking context in `sessionStorage` or a short-lived booking token.
- [ ] Never persist the OTP, OTP hash, JWT, or payment credentials in browser storage.
- [ ] Restore the booking context after OTP verification or a safe page refresh.
- [ ] Expire stale booking state when its slot reservation expires.

### Phase 4 — Add guest patient details

- [ ] Add required fields: full name and mobile number.
- [ ] Add optional fields: email, date of birth, gender, and address where supported by the patient profile.
- [ ] Add visible labels, field-level errors, input normalization, and helpful mobile-number guidance.
- [ ] Make optional fields visually and semantically optional.
- [ ] Keep the selected doctor, date, and slot visible in the guest form for confidence.
- [ ] Add back, cancel, and close behavior that does not silently lose entered data.
- [ ] Ensure modal focus trapping, Escape behavior, screen-reader labels, visible focus states, and minimum 44×44px interactive targets.

### Phase 5 — Standardize mobile OTP authentication

- [ ] Define one patient mobile OTP request contract.
- [ ] Normalize Indian phone numbers consistently (`+91XXXXXXXXXX`, `91XXXXXXXXXX`, and `XXXXXXXXXX` must resolve safely).
- [ ] Define one OTP verification contract that returns an authenticated patient session.
- [ ] On successful OTP verification:
  - [ ] Find an existing patient user by normalized phone number.
  - [ ] Reject blocked users.
  - [ ] Create a new patient user when no account exists.
  - [ ] Create or update the patient profile with the submitted name and optional details.
  - [ ] Write an authentication log.
  - [ ] Set the same secure HTTP-only `PATIENT` cookie used by middleware and appointment APIs.
  - [ ] Return only non-sensitive user data and booking continuation information.
- [ ] Standardize JWT claims so every consumer reads the same user ID field.
- [ ] Add resend cooldown, expiry, maximum verification attempts, and server-side rate limiting.
- [ ] Show clear states for incorrect, expired, blocked, and too-many-request OTP attempts.
- [ ] Make mobile OTP primary on the patient login screen.
- [ ] Keep email OTP as a secondary option and password as a compatibility fallback only if still required.

### Phase 6 — Implement the guest booking flow

- [ ] Change doctor detail `Book Now` behavior to open the booking flow for guests and authenticated patients.
- [ ] Authenticated patient path:
  - [ ] Select date and slot.
  - [ ] Review patient details.
  - [ ] Reserve/confirm the slot.
  - [ ] Start payment if required.
  - [ ] Verify payment and show success.
- [ ] Guest path:
  - [ ] Select date and slot.
  - [ ] Enter patient details.
  - [ ] Request mobile OTP.
  - [ ] Verify OTP.
  - [ ] Create or identify the patient account.
  - [ ] Restore the selected doctor/date/slot.
  - [ ] Review and confirm the booking.
  - [ ] Start payment if required.
  - [ ] Verify payment and show success.
- [ ] Prevent the generic `/login` redirect from breaking the booking context.
- [ ] Add loading, retry, disabled, success, and failure feedback for every network step.

### Phase 7 — Make reservations and appointments transactional

- [ ] Add a server endpoint or service for slot validation and temporary reservation.
- [ ] Validate that the requested date and time belong to the selected doctor/campaign schedule.
- [ ] Recheck availability on the server immediately before reservation.
- [ ] Prevent two appointments from claiming the same doctor/date/time.
- [ ] Add reservation expiry metadata if the existing `Appointment` model is used for pending reservations.
- [ ] Use a database transaction for reservation, patient association, queue number, and appointment creation.
- [ ] Release or expire reservations when OTP, payment, or confirmation fails.
- [ ] Ensure the cleanup worker removes or releases stale pending reservations safely.
- [ ] Return a specific conflict response when a slot was taken by another user.
- [ ] Never use client-provided fee, doctor ID, or availability as the source of truth.

### Phase 8 — Integrate payment and confirmation safely

- [ ] Start Razorpay only after patient identity and slot reservation are valid.
- [ ] Calculate the fee on the server using campaign pricing, discounts, and platform fees.
- [ ] Keep the appointment pending until payment signature verification succeeds.
- [ ] On payment cancellation, show a recoverable state and release the reservation according to the reservation policy.
- [ ] On payment verification failure, do not show success and do not mark the appointment confirmed.
- [ ] Make payment verification idempotent so refreshes or duplicate callbacks do not create duplicate confirmations.
- [ ] Show doctor, date, time, patient, fee, payment status, and appointment ID on the success screen.

### Phase 9 — Cover edge cases and accessibility

- [ ] Existing phone number: verify OTP and continue booking without duplicate account creation.
- [ ] New phone number: verify OTP, collect name, create patient, continue booking.
- [ ] Wrong OTP: show remaining attempts where available.
- [ ] Expired OTP: show `Send new OTP`.
- [ ] Too many OTP requests: show cooldown and retry time.
- [ ] Changed phone number: invalidate the previous verification attempt.
- [ ] Slot unavailable: return the user to slot selection with alternatives.
- [ ] Browser closed or refreshed: restore only valid, non-sensitive booking context.
- [ ] Payment cancelled: preserve booking details when possible and provide retry/release behavior.
- [ ] Verify keyboard navigation, focus management, labels, error announcements, contrast, reduced motion, responsive layout, and no horizontal scrolling.

### Phase 10 — Testing and release verification

- [ ] Add unit tests for phone normalization, OTP expiry, OTP attempt limits, and JWT/session creation.
- [ ] Add API tests for new-user creation, existing-user login, blocked users, and duplicate phone handling.
- [ ] Add API/database tests for slot conflicts, reservation expiry, payment failure, and idempotent confirmation.
- [ ] Add end-to-end test: guest discovery → doctor → slot → details → OTP → booking.
- [ ] Add end-to-end test: returning user OTP login → booking.
- [ ] Add end-to-end test: authenticated short booking flow.
- [ ] Add end-to-end tests for expired OTP, invalid OTP, unavailable slot, refresh, and cancelled payment.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Manually verify desktop, tablet, and mobile layouts.
- [ ] Review database migration and rollback considerations before production deployment.
- [ ] Update `README.md` and environment variable documentation if new OTP/reservation configuration is introduced.

## Acceptance criteria

### Guest discovery

- A logged-out visitor can open `/doctors` directly.
- A logged-out visitor can open any public doctor details page directly.
- Search, filters, sorting, pagination, doctor details, availability, and fees work without authentication.

### Guest booking

- Clicking `Book Now` never sends a guest to a generic login page without preserving context.
- A guest can select a slot, enter required patient details, verify mobile OTP, and continue the same booking.
- Existing users are logged in after OTP verification.
- New users receive a patient account and profile without a duplicate account.
- The selected slot remains selected after authentication.

### Slot and payment safety

- Two users cannot successfully book the same doctor/date/time slot.
- Expired or failed reservations are released.
- Appointment confirmation occurs only after successful server-side payment verification.
- Repeated payment callbacks do not create duplicate appointments or payments.

### UX and accessibility

- Every form field has a visible label and useful inline error state.
- Required and optional fields are clearly distinguished.
- The booking modal is usable with keyboard and screen reader.
- Interactive controls meet minimum touch-target sizing.
- The layout works without horizontal scrolling on mobile.

## Definition of done

This work is complete when all acceptance criteria pass, the guest and authenticated flows are tested end to end, lint and production build pass, the migration is reviewed, and the booking flow has been manually checked on mobile and desktop.
