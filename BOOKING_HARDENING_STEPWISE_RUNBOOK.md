# Booking Hardening — Stepwise Execution Runbook

## Purpose

This runbook converts [BOOKING_HARDENING_EXECUTION_PLAN.md](./BOOKING_HARDENING_EXECUTION_PLAN.md) into an ordered implementation sequence.

It covers:

- 🔒 Reservation safety and expiry
- 💳 Payment cancellation and duplicate callback protection
- ♿ UX and accessibility
- 🧹 Code quality

## Non-negotiable constraints

- 🚫 Do not run `prisma db push`.
- 🚫 Do not run `prisma migrate deploy`.
- 🚫 Do not add or apply a database migration in this phase.
- ✅ Use existing Prisma models and fields only.
- ✅ Treat existing `PENDING` appointments as temporary reservations.
- 🇮🇳 Support India-only booking time using IST (`Asia/Kolkata`).
- 🚫 Do not add international timezone selection or conversion yet.

## Execution order

```text
1. Establish shared rules
2. Centralize reservation helpers
3. Harden appointment creation
4. Add expiry and cleanup
5. Harden payment order and verification
6. Release on cancellation/failure
7. Improve UX and accessibility
8. Clean code
9. Test each lifecycle
10. Run final verification
```

## Step 1 — Freeze the current baseline

### Inspect

- [ ] Record the current behavior of:
  - [ ] `app/api/appointments/route.ts`
  - [ ] `app/api/payments/create-order/route.ts`
  - [ ] `app/api/payments/verify/route.ts`
  - [ ] `app/api/worker/cleanup-appointments/route.ts`
  - [ ] `app/(root)/doctors/[id]/components/BookingModal.tsx`
- [ ] Confirm the existing Prisma client is generated and usable.
- [ ] Confirm no migration or schema change is needed for this implementation.
- [ ] Check `git status` and preserve unrelated worktree changes.

### Checkpoint

- [ ] No database command has been run.
- [ ] Existing guest availability still loads before changes begin.

## Step 2 — Establish shared booking rules

### Create or update

`lib/booking-reservation.ts`

- [ ] Add `RESERVATION_TIMEOUT_MINUTES = 15`.
- [ ] Add `BLOCKING_APPOINTMENT_STATUSES`.
- [ ] Add `getReservationThreshold(now = new Date())`.
- [ ] Add `isExpiredPendingAppointment(createdAt, now = new Date())`.
- [ ] Add `isBlockingAppointment(status, createdAt)`.
- [ ] Add `releasePendingAppointment(appointmentId, reason)` using Prisma.
- [ ] Make release safe if the appointment is already cancelled or confirmed.
- [ ] Keep all booking date interpretation in IST.

### Checkpoint

- [ ] Availability, appointment, cleanup, and payment code can import the same policy.
- [ ] No duplicated timeout values remain.

## Step 3 — Harden appointment creation

### Update

`app/api/appointments/route.ts`

- [ ] Authenticate the patient using the existing `PATIENT` cookie.
- [ ] Validate the campaign and doctor.
- [ ] Validate the requested date as an IST calendar date.
- [ ] Validate the requested slot against persisted schedule, campaign dates, and leave.
- [ ] Acquire the existing PostgreSQL advisory lock for doctor + slot.
- [ ] Inside the lock, ignore or release stale pending appointments for that slot.
- [ ] Recheck fresh `PENDING`, `CONFIRMED`, and `RESCHEDULED` appointments.
- [ ] Return `409` when the slot is already claimed.
- [ ] Calculate fees only on the server.
- [ ] Create the new `PENDING` appointment inside the protected transaction.
- [ ] Keep queue-number calculation inside the same transaction.

### Checkpoint

- [ ] One request for an available slot succeeds.
- [ ] A second request for the same slot returns `409`.
- [ ] A cancelled appointment does not block a new booking.

## Step 4 — Implement pending reservation expiry

### Update

`app/api/worker/cleanup-appointments/route.ts`

- [ ] Use `getReservationThreshold()`.
- [ ] Find only stale `PENDING` appointments with Prisma.
- [ ] Mark them `CANCELLED` with an existing cancellation reason, or delete them only if that is the established business rule.
- [ ] Keep `CONFIRMED`, `COMPLETED`, and recent `PENDING` appointments unchanged.
- [ ] Make the operation safe to repeat.
- [ ] Log counts without logging patient details.

### Update availability filtering

`app/api/public/campaigns/[id]/availability/route.ts`

- [ ] Treat fresh pending appointments as `RESERVED` or unavailable.
- [ ] Ignore stale pending appointments.
- [ ] Keep cancelled appointments available again.

### Checkpoint

- [ ] A fresh pending appointment blocks its slot.
- [ ] A stale pending appointment does not block its slot.
- [ ] Cleanup releases stale slots without database schema changes.

## Step 5 — Harden payment order creation

### Update

`app/api/payments/create-order/route.ts`

- [ ] Verify the patient owns the appointment.
- [ ] Reject cancelled, confirmed, or expired appointments.
- [ ] Recheck appointment age using the shared reservation policy.
- [ ] Recheck the appointment slot before creating a payment order.
- [ ] Reuse a valid existing pending Razorpay order where possible.
- [ ] Persist the order ID using the existing `Payment` model.
- [ ] If Razorpay order creation fails, release the pending appointment immediately.
- [ ] Return only safe payment and appointment details.

### Checkpoint

- [ ] Valid pending appointment creates one usable payment order.
- [ ] Expired appointment cannot create an order.
- [ ] Gateway failure releases the appointment.

## Step 6 — Harden payment verification

### Update

`app/api/payments/verify/route.ts`

- [ ] Validate required Razorpay fields.
- [ ] Verify the signature before any state update.
- [ ] Load the appointment and payment record.
- [ ] Confirm the callback order ID matches the stored order ID.
- [ ] Confirm the appointment is still owned by the patient where applicable.
- [ ] If payment is already successful and appointment is confirmed, return idempotent success.
- [ ] Reject callbacks for cancelled or expired appointments.
- [ ] Update payment and appointment together in a Prisma transaction.
- [ ] Send confirmation email only on the first successful transition.
- [ ] Never downgrade a confirmed appointment.

### Checkpoint

- [ ] First valid callback confirms the appointment.
- [ ] Repeated valid callback does not duplicate confirmation or email.
- [ ] Invalid signature does not modify payment or appointment state.
- [ ] Late failure cannot change a confirmed appointment.

## Step 7 — Release on payment cancellation and failure

### Update

`BookingModal.tsx` and the appointment cancellation endpoint.

- [ ] On Razorpay `ondismiss`, call the server release endpoint.
- [ ] Release only the authenticated patient’s pending appointment.
- [ ] On order creation failure, release the appointment.
- [ ] On verification failure, release or cancel the still-pending appointment.
- [ ] Keep release operations idempotent.
- [ ] Preserve doctor, date, slot, and patient form state for a retry.
- [ ] Show a clear message that the slot was released or will expire automatically.

### Checkpoint

- [ ] Payment dismissal makes the slot available again.
- [ ] Retrying after cancellation does not create duplicate pending appointments.

## Step 8 — Standardize India-only time behavior

- [ ] Use `Asia/Kolkata` as the only supported booking timezone.
- [ ] Treat dates from the browser as IST calendar dates.
- [ ] Use one canonical date format for API requests: `YYYY-MM-DD`.
- [ ] Use one canonical slot value from the availability API.
- [ ] Ensure availability and appointment creation calculate the same slot start.
- [ ] Display IST in review and confirmation where helpful.
- [ ] Verify behavior around midnight IST.
- [ ] Do not introduce timezone selection or international conversion.

### Checkpoint

- [ ] A date selected in the booking modal is the same date persisted by the server.
- [ ] The slot shown in the UI matches the slot validated by the API.

## Step 9 — Improve UX and accessibility

### Modal structure

- [ ] Add dialog semantics: `role="dialog"`, `aria-modal="true"`, title, and description.
- [ ] Trap focus while the modal is open.
- [ ] Restore focus to the triggering button after close.
- [ ] Support Escape unless Razorpay is active.

### Availability feedback

- [ ] Show loading state while availability is loading.
- [ ] Show a clear no-slots state.
- [ ] Show booked/reserved/unavailable text, not color alone.
- [ ] Announce slot conflicts and refresh results.
- [ ] Keep the modal open after a `409` response.
- [ ] Preserve patient and OTP state when selecting another slot.

### Controls

- [ ] Add accessible labels to dates and slots.
- [ ] Use `disabled`/`aria-disabled` correctly.
- [ ] Ensure focus states are visible.
- [ ] Keep controls at least 44×44px.
- [ ] Verify mobile layout has no horizontal scrolling.
- [ ] Respect reduced-motion preferences.

## Step 10 — Clean up code quality

- [ ] Remove unused imports in changed files.
- [ ] Replace new `any` types with explicit types or narrowed `unknown`.
- [ ] Remove duplicate date/time parsing.
- [ ] Remove duplicate status and timeout definitions.
- [ ] Standardize API error response shapes.
- [ ] Avoid logging tokens, OTPs, signatures, payment secrets, or patient data.
- [ ] Keep unrelated existing lint errors separate from this work.
- [ ] Confirm no unintended lab, admin, or doctor-panel changes.

## Step 11 — Run tests in execution order

### Reservation tests

- [ ] Fresh pending appointment blocks a slot.
- [ ] Cancelled appointment releases a slot.
- [ ] Stale pending appointment releases after 15 minutes.
- [ ] Cleanup is idempotent.
- [ ] Confirmed appointment remains blocking.
- [ ] Concurrent requests produce one success and one `409`.

### Payment tests

- [ ] Valid order creation.
- [ ] Expired appointment rejection.
- [ ] Gateway failure release.
- [ ] Checkout dismissal release.
- [ ] Invalid signature rejection.
- [ ] Mismatched order rejection.
- [ ] Successful confirmation.
- [ ] Duplicate callback idempotency.
- [ ] Late failure protection.
- [ ] Single confirmation email.

### UX/accessibility tests

- [ ] Keyboard-only modal flow.
- [ ] Focus trap and focus restoration.
- [ ] Screen-reader labels and announcements.
- [ ] Mobile viewport.
- [ ] No horizontal scrolling.
- [ ] Reduced-motion behavior.

## Step 12 — Final verification

- [ ] Run `npx tsc --noEmit`.
- [ ] Run scoped ESLint on changed files.
- [ ] Run `npm run lint` and document unrelated baseline errors separately.
- [ ] Run `npx next build --webpack`.
- [ ] Review `git diff`.
- [ ] Confirm no Prisma migration files were added.
- [ ] Confirm no `prisma db push` or `prisma migrate deploy` was run.
- [ ] Confirm no production database was modified.
- [ ] Manually test guest and authenticated booking in IST.

## Definition of done

The hardening work is complete when pending appointments safely expire using existing Prisma fields, payment failures release slots immediately, duplicate callbacks are harmless, concurrent bookings cannot both win, the UX is accessible and recoverable, code quality checks are addressed, IST behavior is consistent, and no database push or migration deployment has occurred.
