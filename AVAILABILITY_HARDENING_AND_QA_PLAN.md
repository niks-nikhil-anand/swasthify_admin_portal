# Doctor Availability Hardening and QA Plan

## Scope

This plan covers the remaining work after persisted doctor availability was connected to the booking modal.

The current implementation already provides:

- Database-backed slot generation.
- Public availability endpoint.
- Doctor schedule and leave checks.
- Disabled booked/unavailable slots in the UI.
- Server-side validation of the selected slot.

The remaining work is to make the system safe under concurrent traffic, consistent across timezones, recoverable when availability changes, and fully tested.

## Goals

- Prevent two users from successfully booking the same slot.
- Expire and release temporary pending reservations.
- Use one consistent timezone model across display, availability, booking, and payment.
- Handle stale availability without losing the user’s booking context.
- Make the behavior observable and testable.
- Complete accessibility, responsive, lint, and production verification.

## Files likely to change

- `prisma/schema.prisma`
- A new Prisma migration under `prisma/migrations/`
- `lib/doctor-availability.ts`
- `app/api/public/campaigns/[id]/availability/route.ts`
- `app/api/appointments/route.ts`
- `app/api/payments/create-order/route.ts`
- `app/api/payments/verify/route.ts`
- `app/api/worker/cleanup-appointments/route.ts`
- `app/(root)/doctors/[id]/components/BookingModal.tsx`
- `app/(root)/doctors/[id]/components/ScheduleSection.tsx`
- Test files for utilities, APIs, and browser flows.

## Step 1 — Finalize booking and reservation rules

- [ ] Confirm the appointment duration; use 30 minutes unless the product requires another value.
- [ ] Confirm the doctor timezone source; use `Doctor.timeZone` with an explicit fallback.
- [ ] Define blocking appointment statuses: `PENDING`, `CONFIRMED`, and `RESCHEDULED`.
- [ ] Define when a pending appointment stops blocking a slot.
- [ ] Set a reservation timeout, for example 10–15 minutes.
- [ ] Define what happens when payment is cancelled or fails.
- [ ] Decide whether a booking attempt may reserve only one slot at a time.
- [ ] Decide whether `DoctorAvailability` overrides or intersects with `Campaign.schedule`.

### Deliverable

Record these rules in code comments or a shared booking policy module so all APIs use the same behavior.

## Step 2 — Add explicit reservation data

Prefer a dedicated reservation model if the payment and OTP steps can take several minutes.

### Proposed model

```text
SlotReservation
- id
- doctorId
- campaignId
- patientId
- slotStart
- slotEnd
- status: ACTIVE | CONVERTED | EXPIRED | RELEASED
- expiresAt
- appointmentId (optional)
- createdAt
- updatedAt
```

- [ ] Add the model and relations to `prisma/schema.prisma`.
- [ ] Add indexes for doctor, slot start, status, and expiry.
- [ ] Add a uniqueness strategy for active reservations on doctor + slot start.
- [ ] Create a migration and inspect the SQL before applying it.
- [ ] Keep appointment payment status separate from reservation status.
- [ ] Preserve historical reservation records for debugging and audit purposes.

### Alternative

If a new model is not approved, extend `Appointment` with `reservationExpiresAt` and treat pending appointments as temporary reservations. Document the tradeoff clearly.

## Step 3 — Build an atomic reservation service

- [ ] Add a server-side function, for example `reserveDoctorSlot()` in `lib/doctor-availability.ts` or a dedicated booking service.
- [ ] Recalculate the valid slot from doctor availability, campaign range, and leave.
- [ ] Start a database transaction.
- [ ] Remove or ignore expired reservations for the requested slot.
- [ ] Check active reservations and blocking appointments.
- [ ] Create the reservation only if the slot is still free.
- [ ] Return a conflict result when another request wins the race.
- [ ] Make reservation creation idempotent for the same booking attempt.
- [ ] Return the canonical slot start/end and reservation expiry to the client.

### Acceptance criteria

- Two simultaneous requests for one doctor and slot produce only one successful reservation.
- A conflict returns HTTP `409` with a safe user-facing message.
- A retry does not create duplicate reservations for the same booking attempt.

## Step 4 — Connect reservation to appointment creation

- [ ] Update `POST /api/appointments` to require a valid active reservation or perform the reservation atomically.
- [ ] Verify that the reservation belongs to the authenticated patient.
- [ ] Verify that the reservation has not expired.
- [ ] Convert the reservation to the pending appointment inside one transaction.
- [ ] Recalculate consultation fees on the server.
- [ ] Ensure queue-number generation remains safe under concurrent bookings.
- [ ] Return the reservation and appointment identifiers needed by payment.
- [ ] Reject forged or stale slot values even if the client previously received them from the availability API.

## Step 5 — Release reservations correctly

- [ ] Release the reservation when the user explicitly cancels booking.
- [ ] Release it when Razorpay checkout is dismissed.
- [ ] Release it when payment order creation fails.
- [ ] Keep it pending for a defined retry window when payment verification is temporarily unavailable.
- [ ] Convert it to `CONVERTED` only after successful payment verification or approved free-booking confirmation.
- [ ] Make release operations idempotent.
- [ ] Ensure a released or expired reservation no longer disables the slot in the public availability response.

## Step 6 — Add expiry cleanup

- [ ] Extend `app/api/worker/cleanup-appointments/route.ts` or add a reservation cleanup endpoint.
- [ ] Authenticate the worker using the existing cron secret mechanism.
- [ ] Mark expired active reservations as `EXPIRED`.
- [ ] Cancel or remove stale pending appointments according to the existing business rule.
- [ ] Ensure cleanup does not affect confirmed, completed, or actively paid appointments.
- [ ] Log cleanup counts and failures.
- [ ] Add a database index that makes expiry queries efficient.

## Step 7 — Standardize timezone handling

- [ ] Choose the canonical storage format: UTC timestamps in the database.
- [ ] Treat the selected date as a calendar date in the doctor’s timezone, not the browser’s timezone.
- [ ] Convert doctor-local schedule times to UTC before querying appointments.
- [ ] Return the doctor timezone from the availability API.
- [ ] Render labels in the doctor timezone and clearly communicate the timezone when relevant.
- [ ] Use the same conversion logic in:
  - [ ] Availability API
  - [ ] Booking modal
  - [ ] Appointment creation
  - [ ] Payment details
  - [ ] Confirmation emails
  - [ ] Patient and doctor appointment views
- [ ] Test dates around midnight and daylight-saving transitions for supported timezones.

## Step 8 — Improve stale availability handling

- [ ] Fetch availability when the booking modal opens.
- [ ] Refresh availability when the selected date changes.
- [ ] Refresh the selected date immediately before reservation/confirmation.
- [ ] Compare the selected slot with the latest server response.
- [ ] On `409`, clear only the unavailable slot and keep the rest of the booking state.
- [ ] Show alternative available slots without closing the modal.
- [ ] Preserve patient details and OTP verification while the user chooses another slot.
- [ ] Prevent payment from opening until a reservation is successfully created.

## Step 9 — Improve availability API behavior

- [ ] Return stable slot identifiers rather than relying only on display labels.
- [ ] Include `start`, `end`, `label`, `status`, and `reason` fields.
- [ ] Distinguish `BOOKED`, `RESERVED`, `PAST`, `ON_LEAVE`, and `UNAVAILABLE` where useful.
- [ ] Do not expose patient identity or internal reservation details.
- [ ] Add response caching only if it cannot display stale slot state during confirmation.
- [ ] Add rate limiting or request protection for public availability queries if needed.
- [ ] Log server errors without logging personal or payment data.

## Step 10 — Add automated tests

### Unit tests

- [ ] Generate slots from a normal schedule.
- [ ] Generate slots when the appointment duration changes.
- [ ] Reject malformed times and invalid schedules.
- [ ] Respect campaign start/end dates.
- [ ] Respect doctor leave periods.
- [ ] Reject past slots.
- [ ] Convert doctor-local times to UTC correctly.
- [ ] Handle multiple availability windows on one weekday.

### API tests

- [ ] Return available slots for a valid public campaign.
- [ ] Return `404` for inactive or unverified campaigns.
- [ ] Return no slots outside the campaign date range.
- [ ] Return no slots during doctor leave.
- [ ] Mark an existing confirmed appointment as booked.
- [ ] Ignore expired reservations.
- [ ] Reject forged slot values at appointment creation.
- [ ] Return `409` for a slot conflict.
- [ ] Verify reservation ownership and expiry.
- [ ] Verify payment cancellation releases the reservation.

### Concurrency tests

- [ ] Send simultaneous reservation requests for the same doctor and slot.
- [ ] Confirm exactly one request succeeds.
- [ ] Confirm the losing request receives `409`.
- [ ] Confirm no duplicate appointment or queue number is created.

## Step 11 — Complete accessibility and responsive QA

- [ ] Add accessible labels to date and slot buttons.
- [ ] Use `aria-disabled` or disabled controls for unavailable slots.
- [ ] Do not communicate availability by color alone.
- [ ] Announce loading, no slots, and conflict messages.
- [ ] Verify focus management when a slot becomes unavailable.
- [ ] Verify keyboard navigation across dates and slots.
- [ ] Verify minimum 44×44px touch targets.
- [ ] Verify no horizontal scrolling on mobile.
- [ ] Verify selected, booked, reserved, and unavailable states in light/dark themes.
- [ ] Respect reduced-motion preferences.

## Step 12 — Run release verification

- [ ] Run `npx tsc --noEmit`.
- [ ] Run scoped ESLint on all changed files.
- [ ] Run `npm run lint` and record unrelated existing failures separately.
- [ ] Run `npx next build --webpack`.
- [ ] Verify the build with database access available so sitemap and data-backed routes are exercised.
- [ ] Test guest booking from doctor details through reservation and payment.
- [ ] Test authenticated booking.
- [ ] Test two users selecting the same slot.
- [ ] Test expired pending reservations.
- [ ] Test payment cancellation and retry.
- [ ] Review migration SQL and deployment order.
- [ ] Update the README and environment documentation if a worker, reservation, or timezone configuration is added.

## Definition of done

This work is complete when slot availability is generated from persisted data, concurrent users cannot double-book a slot, expired reservations are released, all timestamps behave correctly in the doctor’s timezone, stale-slot conflicts are recoverable in the UI, automated tests pass, and the production build and release checks are complete.
