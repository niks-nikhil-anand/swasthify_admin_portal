# Booking Hardening Execution Plan

## Scope

This plan completes the remaining work in four areas:

- 💳 Payment handling
- ♿ UX and accessibility
- 🧹 Code quality
- 🔒 Reservation safety

## Constraints

- 🚫 Do not run `prisma db push`.
- 🚫 Do not run `prisma migrate deploy`.
- 🚫 Do not modify the production database.
- ✅ Use existing Prisma client models and fields only.
- 🇮🇳 Support India-only booking times using IST (`Asia/Kolkata`).
- 🚫 Do not add international timezone support in this phase.

## Current baseline

Already completed:

- Database-backed availability endpoint.
- Persisted doctor schedule and leave checks.
- Disabled booked/unavailable slots.
- Server-side slot revalidation.
- PostgreSQL advisory lock for concurrent appointment requests.

## Target booking lifecycle

```text
Select slot
  → Create PENDING appointment as temporary reservation
  → Create payment order
  → Open Razorpay
  → Verify callback
  → CONFIRMED appointment
  → Release/cancel PENDING appointment on failure or expiry
```

## Step 1 — Create one shared reservation policy

- [ ] Add a shared constant for the pending reservation timeout, proposed value: 15 minutes.
- [ ] Add a shared list of blocking statuses: `PENDING`, `CONFIRMED`, and `RESCHEDULED`.
- [ ] Add a helper to calculate the expiry threshold from the current time.
- [ ] Add a helper to determine whether a pending appointment is stale.
- [ ] Add a helper to release a pending appointment using the existing Prisma client.
- [ ] Make release idempotent: already-cancelled or already-confirmed appointments must not fail unexpectedly.
- [ ] Keep all date-only booking calculations aligned to IST.
- [ ] Reuse these helpers in availability, appointment creation, payment, and cleanup code.

### Completion criteria

- No route contains its own timeout or blocking-status rules.
- No route duplicates stale pending appointment logic.

## Step 2 — Complete reservation safety without schema changes

- [ ] Continue using `PENDING` appointments as temporary reservations.
- [ ] Keep the PostgreSQL advisory lock for `doctorId + slotStart`.
- [ ] Inside the locked transaction, ignore or cancel stale pending appointments for the requested slot.
- [ ] Recheck active blocking appointments after acquiring the lock.
- [ ] Create only one pending appointment when the slot is free.
- [ ] Return `409 Conflict` when another booking owns the slot.
- [ ] Verify the patient owns the appointment before allowing payment or release.
- [ ] Prevent a cancelled appointment from blocking the slot.
- [ ] Ensure a confirmed appointment can never be released by a later failure callback.
- [ ] Keep queue-number generation inside the same protected transaction.

### Completion criteria

- Two simultaneous requests for one doctor and IST slot result in one success and one `409` response.
- A cancelled or expired pending appointment allows the slot to be booked again.

## Step 3 — Implement reservation expiry and cleanup

- [ ] Update `app/api/worker/cleanup-appointments/route.ts` to use the shared timeout.
- [ ] Keep `CRON_SECRET` authorization.
- [ ] Find stale `PENDING` appointments with Prisma.
- [ ] Mark stale appointments `CANCELLED` with an existing cancellation reason when audit history is preferred.
- [ ] Delete stale appointments only if that remains the existing business rule.
- [ ] Do not modify `CONFIRMED`, `COMPLETED`, or recently created pending appointments.
- [ ] Log cleanup count and failure information without patient personal data.
- [ ] Make cleanup safe to run repeatedly.
- [ ] Ensure the public availability API no longer marks expired pending appointments as unavailable.

### Completion criteria

- A pending appointment older than 15 minutes no longer blocks its slot.
- The cleanup endpoint can run repeatedly without duplicate effects.

## Step 4 — Harden payment order creation

Update `app/api/payments/create-order/route.ts`.

- [ ] Verify the authenticated patient owns the appointment.
- [ ] Reject cancelled, confirmed, or expired appointments from creating a new order.
- [ ] Recheck that the appointment’s slot is still valid before creating an order.
- [ ] Reuse an existing pending Razorpay order when safe instead of creating duplicates.
- [ ] Store the Razorpay order ID through the existing Prisma `Payment` model.
- [ ] If order creation fails, release the pending appointment immediately.
- [ ] Do not return payment credentials or internal database details in errors.
- [ ] Return the canonical appointment date/time and fee used for payment.

### Completion criteria

- A user cannot create payment for an expired or cancelled booking.
- Gateway failure releases the temporary reservation.

## Step 5 — Harden payment verification and duplicate callbacks

Update `app/api/payments/verify/route.ts`.

- [ ] Validate all Razorpay fields.
- [ ] Verify the Razorpay signature before modifying the database.
- [ ] Load the appointment and payment record.
- [ ] Verify that the callback order ID matches the stored payment order ID.
- [ ] Verify that the appointment is owned by the authenticated patient when possible.
- [ ] If payment is already `SUCCESS` and appointment is `CONFIRMED`, return idempotent success.
- [ ] If the appointment is already confirmed, never downgrade it.
- [ ] Update payment and appointment inside one Prisma transaction.
- [ ] Send confirmation email only on the first successful state transition.
- [ ] Release/cancel the pending appointment on invalid or failed verification when it is still pending.
- [ ] Return safe errors for duplicate, late, invalid, or mismatched callbacks.

### Completion criteria

- Replaying the same successful callback does not duplicate confirmation or email.
- A late failure cannot change a confirmed appointment.

## Step 6 — Add immediate payment cancellation release

Update `BookingModal.tsx` and the cancellation API.

- [ ] When Razorpay `ondismiss` fires, call the server release endpoint.
- [ ] Release only the current user’s pending appointment.
- [ ] Treat an already released appointment as a safe result.
- [ ] Keep the selected doctor, date, and slot in the modal for retry when appropriate.
- [ ] Show a clear message: payment was cancelled and the slot was released.
- [ ] If the release request fails, tell the user the reservation will expire automatically.
- [ ] Release pending appointments when payment order creation fails.
- [ ] Release pending appointments when payment verification fails.

## Step 7 — Improve booking UX and accessibility

Update the booking modal and related schedule components.

- [ ] Add `role="dialog"` and `aria-modal="true"`.
- [ ] Add an accessible dialog title and description.
- [ ] Trap focus while the modal is open.
- [ ] Return focus to the `Book Now` trigger after closing.
- [ ] Support Escape to close when Razorpay is not active.
- [ ] Add a visible booking progress indicator.
- [ ] Show doctor, appointment date, selected slot, and IST context during review.
- [ ] Show loading states for availability, reservation, payment, cancellation, and retry.
- [ ] Announce no availability and slot-conflict errors to assistive technology.
- [ ] Use accessible labels for every date and slot button.
- [ ] Use disabled styling and text labels for booked/reserved slots.
- [ ] Do not rely on color alone to communicate slot status.
- [ ] Keep all interactive controls at least 44×44px.
- [ ] Preserve patient details when a selected slot becomes unavailable.
- [ ] Refresh slots after a `409` conflict without closing the modal.
- [ ] Keep the interface usable on mobile without horizontal scrolling.
- [ ] Respect reduced-motion preferences.

## Step 8 — Standardize India-only time behavior

- [ ] Define IST as the only supported booking timezone.
- [ ] Use `Asia/Kolkata` for calendar-day interpretation.
- [ ] Ensure the date selected in the browser matches the date validated by the server.
- [ ] Convert schedule times consistently before querying appointments.
- [ ] Display appointment labels in IST.
- [ ] Use the same IST values in payment details and confirmation emails.
- [ ] Test booking around 12:00 AM and 11:59 PM IST.
- [ ] Reject or clearly handle invalid dates and past slots.
- [ ] Do not add user-selectable timezone behavior in this phase.

## Step 9 — Clean up changed code

- [ ] Remove unused imports from booking, availability, appointment, payment, and cleanup files.
- [ ] Replace new `any` types with explicit interfaces or safe `unknown` narrowing.
- [ ] Remove duplicate time parsing and slot-status logic.
- [ ] Centralize reservation timeout and blocking statuses.
- [ ] Use consistent API error response shapes.
- [ ] Use `const` where values are not reassigned.
- [ ] Keep concurrency-lock comments concise and accurate.
- [ ] Avoid logging OTPs, tokens, signatures, payment secrets, or patient details.
- [ ] Confirm no lab or administrative booking behavior changes unintentionally.

## Step 10 — Test reservation safety

- [ ] Test fresh pending appointment blocks a slot.
- [ ] Test cancelled appointment releases a slot.
- [ ] Test stale pending appointment does not block a slot.
- [ ] Test cleanup marks or removes only stale pending appointments.
- [ ] Test confirmed appointment always blocks a slot.
- [ ] Test two concurrent booking requests for the same slot.
- [ ] Test one concurrent request succeeds and the other returns `409`.
- [ ] Test repeated release requests.
- [ ] Test booking again after release.

## Step 11 — Test payment handling

- [ ] Test payment order creation for a valid pending appointment.
- [ ] Test payment order creation for an expired appointment.
- [ ] Test Razorpay order creation failure releases the appointment.
- [ ] Test checkout dismissal releases the appointment.
- [ ] Test invalid signature does not confirm the appointment.
- [ ] Test mismatched order ID does not confirm the appointment.
- [ ] Test successful payment confirms payment and appointment together.
- [ ] Test duplicate successful callback is idempotent.
- [ ] Test late failure does not downgrade a confirmed appointment.
- [ ] Test confirmation email sends only once.

## Step 12 — Run quality and release checks

- [ ] Run `npx tsc --noEmit`.
- [ ] Run scoped ESLint on changed files.
- [ ] Run `npm run lint` and separate pre-existing failures from new failures.
- [ ] Run `npx next build --webpack`.
- [ ] Do not run `prisma db push`.
- [ ] Do not run `prisma migrate deploy`.
- [ ] Review `git diff` for accidental schema or migration changes.
- [ ] Confirm no production database was modified.
- [ ] Complete manual guest and authenticated booking checks on desktop and mobile.

## Definition of done

The booking system is complete for this phase when existing Prisma fields support expiring pending reservations, payment failures release slots immediately, duplicate callbacks are safe, concurrent requests cannot double-book a slot, all booking times are consistently handled in IST, accessibility and code-quality checks pass, and no database push or migration deployment has occurred.
