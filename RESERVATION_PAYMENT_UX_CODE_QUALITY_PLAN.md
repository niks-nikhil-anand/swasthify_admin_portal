# Booking Hardening Plan — No Database Push

## Scope

This plan covers the following remaining work:

- 🔒 Reservation expiry and immediate release.
- 💳 Payment cancellation and duplicate callback handling.
- 🔒 Reservation safety using the existing Prisma client/models only.
- ♿ Booking UX and accessibility improvements.
- 🧹 Code quality in the changed booking and availability files.

## Explicit constraints

- 🚫 Do not run `prisma migrate deploy`.
- 🚫 Do not run `prisma db push`.
- 🚫 Do not modify the production database from this task.
- ✅ Use only fields and models already available in the generated Prisma client.
- ✅ Use the existing `Appointment` record as the pending reservation.
- ✅ Use the existing `createdAt` field to determine reservation age.
- 🇮🇳 Scope time handling to India Standard Time (IST, `Asia/Kolkata`) only.
- 🚫 Do not introduce general multi-timezone support yet.

## Design decision under the no-database-change constraint

Because no schema migration or database push is allowed, do not add a new `SlotReservation` model or new reservation fields.

Use this existing lifecycle:

```text
PENDING appointment = temporary reservation
  → payment succeeds = CONFIRMED appointment
  → payment cancelled/failed = CANCELLED or deleted appointment
  → older than timeout = cleanup removes/cancels appointment
```

The implementation may update the Prisma schema locally only if the generated client is required, but no schema change should be applied to the database during this task. Prefer no schema changes at all.

## Existing records and statuses

Use the existing `Appointment` model and statuses:

- `PENDING`: blocks the slot while the booking/payment flow is active.
- `CONFIRMED`: permanently blocks the slot.
- `CANCELLED`: does not block the slot.
- `COMPLETED`: does not apply to future slot availability.
- `RESCHEDULED`: blocks the new appointment slot according to current business rules.

## Step-by-step implementation plan

## Step 1 — Define the IST reservation policy

- [ ] Set the reservation timeout to a single constant, for example `15 minutes`.
- [ ] Define stale pending appointments as `PENDING` records whose `createdAt` is older than the timeout.
- [ ] Define the blocking statuses in one shared constant.
- [ ] Define India-only date handling using `Asia/Kolkata`.
- [ ] Treat all public booking dates as Indian calendar dates.
- [ ] Confirm that the current server/database timestamps are interpreted consistently before implementation.
- [ ] Document that international timezone support is intentionally out of scope.

### Deliverable

Create a shared booking policy/helper module so the availability API, appointment API, cleanup worker, and payment APIs do not implement different timeout rules.

## Step 2 — Create shared Prisma-based reservation helpers

Add reusable server helpers without changing the database schema.

Suggested location:

`lib/booking-reservation.ts`

- [ ] Add `RESERVATION_TIMEOUT_MINUTES`.
- [ ] Add `getReservationThreshold()`.
- [ ] Add `isPendingAppointmentExpired(appointment)`.
- [ ] Add `releasePendingAppointment(appointmentId, reason)` using the existing Prisma client.
- [ ] Add `findBlockingAppointment(doctorId, slotStart)` using existing appointment fields.
- [ ] Add `isAppointmentBlocking(status, createdAt)`.
- [ ] Keep the helper idempotent: releasing an already cancelled appointment should be safe.
- [ ] Never store or expose OTPs, payment secrets, or unnecessary patient details.

## Step 3 — Update availability filtering

Update the public availability endpoint and shared availability logic.

- [ ] Exclude `CANCELLED` and `COMPLETED` appointments.
- [ ] Treat fresh `PENDING` appointments as booked/reserved.
- [ ] Ignore stale `PENDING` appointments after the reservation timeout.
- [ ] Do not delete appointments while serving a public GET request unless that cleanup behavior is explicitly approved.
- [ ] Return `AVAILABLE`, `BOOKED`, or `RESERVED` status as appropriate.
- [ ] Keep the response public but never expose patient identity.
- [ ] Continue using IST calendar dates for the doctor booking flow.

## Step 4 — Add immediate release on booking cancellation

- [ ] Add or update a cancellation endpoint for the current pending appointment.
- [ ] Verify the authenticated patient owns the appointment.
- [ ] Allow cancellation only for the user’s own fresh `PENDING` appointment.
- [ ] Mark it `CANCELLED` rather than deleting it when audit history is useful.
- [ ] Store the existing cancellation reason fields when available.
- [ ] Make repeated cancellation requests return a safe success/already-cancelled response.
- [ ] Return the slot as available on the next availability request.

## Step 5 — Add immediate release on payment failure/cancellation

Update the payment flow to release pending appointments safely.

- [ ] On Razorpay checkout dismissal, call a server cancellation/release endpoint.
- [ ] On payment order creation failure, release the pending appointment.
- [ ] On payment verification failure, release or cancel the pending appointment according to the reservation policy.
- [ ] Do not release an appointment that has already become `CONFIRMED`.
- [ ] Keep the release operation idempotent.
- [ ] Show a clear retry message in the booking modal.
- [ ] Preserve the selected doctor/date/slot in the UI when retry is still allowed.

## Step 6 — Harden duplicate payment callbacks

Update `app/api/payments/verify/route.ts`.

- [ ] Authenticate the payment request against the appointment owner where the current flow supports it.
- [ ] Verify the Razorpay signature before changing any database state.
- [ ] Load the appointment and its payment record.
- [ ] If the payment is already `SUCCESS` and the appointment is already `CONFIRMED`, return an idempotent success response.
- [ ] If the payment record is tied to a different Razorpay order, reject the callback.
- [ ] Update payment and appointment status together in one Prisma transaction.
- [ ] Send confirmation emails only on the first successful transition to `SUCCESS`/`CONFIRMED`.
- [ ] Never downgrade a confirmed appointment because of a repeated or late failure callback.
- [ ] Return safe errors without exposing signature or payment secrets.

## Step 7 — Harden appointment creation without schema changes

Update `app/api/appointments/route.ts` using existing Prisma operations.

- [ ] Keep the existing advisory lock for doctor + IST slot key.
- [ ] Inside the transaction, ignore or cancel stale pending appointments for that exact slot.
- [ ] Recheck for fresh blocking appointments.
- [ ] Create only one new `PENDING` appointment when the slot is free.
- [ ] Keep the existing patient ownership validation.
- [ ] Recalculate the fee on the server.
- [ ] Use the canonical IST slot date/time format from the availability API.
- [ ] Return `409` for active slot conflicts.
- [ ] Ensure retries after a cancelled appointment can book the slot again.

## Step 8 — Improve cleanup without database changes

Update `app/api/worker/cleanup-appointments/route.ts`.

- [ ] Keep the existing `CRON_SECRET` protection.
- [ ] Use the shared reservation timeout constant.
- [ ] Find stale `PENDING` appointments using Prisma.
- [ ] Prefer marking stale appointments `CANCELLED` with a cancellation reason when auditability is required.
- [ ] Delete stale appointments only if that is already the accepted business rule.
- [ ] Confirm cleanup does not affect `CONFIRMED`, `COMPLETED`, or active reservations.
- [ ] Log only counts and IDs needed for operations; avoid personal data.
- [ ] Make cleanup safe to run repeatedly.

## Step 9 — Improve booking UX and accessibility

Update `BookingModal.tsx` and related booking components.

- [ ] Add a visible step/progress indicator.
- [ ] Show the doctor, IST date, and selected slot in every review state.
- [ ] Show a reservation/payment timeout message when relevant.
- [ ] Add an inline conflict message when the server returns `409`.
- [ ] Refresh slots after a conflict without closing the modal.
- [ ] Keep patient details and OTP state when the user selects another available slot.
- [ ] Add `role="dialog"`, `aria-modal="true"`, and an accessible dialog label.
- [ ] Trap focus inside the modal and restore focus to the trigger on close.
- [ ] Support Escape to close when no payment dialog is active.
- [ ] Ensure every date and slot button has an accessible label.
- [ ] Use disabled styling plus text labels for booked/reserved slots; do not rely on color alone.
- [ ] Ensure controls have at least 44×44px touch targets.
- [ ] Add loading states for availability, cancellation, payment, and retry.
- [ ] Respect reduced-motion preferences.
- [ ] Verify the modal on mobile without horizontal scrolling.

## Step 10 — Code quality cleanup

- [ ] Remove unused imports from the changed booking and availability files.
- [ ] Replace new `any` types with explicit interfaces or `unknown` with safe narrowing.
- [ ] Remove duplicate date/time parsing logic by using the shared helper.
- [ ] Remove duplicate blocking-status arrays.
- [ ] Use consistent error response shapes.
- [ ] Use `const` wherever reassignment is not required.
- [ ] Add comments only around non-obvious concurrency and IST behavior.
- [ ] Keep unrelated pre-existing errors out of this change.
- [ ] Do not alter lab, doctor-panel, or admin behavior unintentionally.

## Step 11 — Test the complete lifecycle

### Reservation lifecycle

- [ ] Create a fresh `PENDING` appointment and verify the slot is reserved.
- [ ] Cancel it and verify the slot becomes available immediately.
- [ ] Create a stale `PENDING` appointment and verify it no longer blocks availability.
- [ ] Run cleanup twice and verify the second run is harmless.
- [ ] Confirm a `CONFIRMED` appointment always blocks the slot.

### Payment lifecycle

- [ ] Cancel Razorpay checkout and verify the appointment is released.
- [ ] Fail payment verification and verify the appointment is released or cancelled.
- [ ] Send the same successful callback twice and verify only one confirmation/email occurs.
- [ ] Send a late failure after success and verify the confirmed appointment is unchanged.

### Concurrency

- [ ] Submit two booking requests for the same doctor and IST slot simultaneously.
- [ ] Verify exactly one succeeds.
- [ ] Verify the other returns `409`.
- [ ] Verify no duplicate pending appointments are created.

### IST behavior

- [ ] Test morning, afternoon, and evening slots in India time.
- [ ] Test dates around midnight in the browser.
- [ ] Verify the displayed date matches the server-validated booking date.
- [ ] Confirm no international timezone behavior is introduced.

## Step 12 — Verification and release controls

- [ ] Run `npx tsc --noEmit`.
- [ ] Run scoped ESLint on changed files.
- [ ] Run `npm run lint` and separate existing failures from new failures.
- [ ] Run `npx next build --webpack`.
- [ ] Do not run `prisma migrate deploy`.
- [ ] Do not run `prisma db push`.
- [ ] Do not run destructive database commands.
- [ ] Review `git diff` for schema or migration changes.
- [ ] Confirm no production database was modified.
- [ ] Manually test guest and authenticated booking flows.

## Definition of done

This work is complete when pending appointments act as temporary reservations using existing Prisma fields, cancelled/failed payments release slots immediately, duplicate payment callbacks are idempotent, concurrent booking attempts cannot both win, all booking times are India-only and consistent, accessibility and code-quality checks are complete, and no database migration or database push has been performed.
