# Persisted Doctor Availability and Slot Availability Plan

## Objective

Replace the hard-coded dates and time slots in `BookingModal.tsx` with real availability calculated from the database.

The booking UI must show only slots that are:

- within the doctor’s persisted schedule;
- inside the campaign’s active date range;
- not blocked by doctor leave;
- not already booked or temporarily reserved; and
- still available when the user confirms the appointment.

## Current state

`BookingModal.tsx` currently:

- generates the next seven dates in the browser;
- uses a hard-coded `timeSlotsData` object;
- does not fetch doctor availability;
- does not disable dates outside the doctor/campaign schedule; and
- does not disable slots already used by existing appointments.

The database already contains:

- `DoctorAvailability` with `dayOfWeek`, `startTime`, and `endTime`;
- `DoctorLeave` with a start and end date; and
- `Appointment` with `doctorId`, `dateTime`, and `status`.

## Proposed data flow

```text
BookingModal selects date
  → GET /api/public/doctors/{doctorId}/availability?campaignId=...&date=YYYY-MM-DD
  → Server validates campaign, schedule, leave, and existing appointments
  → Server returns available slots with status
  → Modal renders enabled/disabled slot buttons
  → User confirms
  → POST /api/appointments revalidates the same slot
  → Appointment is created or a slot-conflict response is returned
```

## Step-by-step implementation plan

## Step 1 — Confirm the availability rules

- [ ] Confirm whether availability comes from `DoctorAvailability`, `Campaign.schedule`, or both.
- [ ] Use `DoctorAvailability` as the source for recurring doctor hours.
- [ ] Use `Campaign.startDate` and `Campaign.endDate` as the bookable campaign window.
- [ ] Decide whether campaign-specific hours override doctor hours or intersect with them.
- [ ] Use `DoctorLeave` to make dates unavailable.
- [ ] Confirm the appointment duration. Proposed default: 30 minutes, matching `Appointment.duration`.
- [ ] Confirm the doctor timezone. Use `Doctor.timeZone`; fall back to `UTC` only when it is not configured.
- [ ] Define which appointment statuses block a slot. Proposed blocking statuses: `PENDING`, `CONFIRMED`, and `RESCHEDULED` when the appointment is not expired or cancelled.

### Output

Document the final rule in a shared helper so the public availability API and appointment-creation API use the same logic.

## Step 2 — Create shared date/time utilities

- [ ] Add a server-safe availability utility, for example `lib/doctor-availability.ts`.
- [ ] Convert database `DayOfWeek` values to the same weekday format used by the date library.
- [ ] Parse `startTime` and `endTime` consistently.
- [ ] Generate slots using the configured appointment duration instead of fixed arrays.
- [ ] Generate a stable slot value, such as an ISO start datetime or `HH:mm` start time.
- [ ] Generate a human-readable label separately, such as `10:00 AM – 10:30 AM`.
- [ ] Handle schedules that cross midnight explicitly or reject them as invalid configuration.
- [ ] Convert date/time values using the doctor timezone before querying appointments.
- [ ] Reject dates in the past and slots whose start time has already passed.

### Output

One reusable function should be able to answer:

```text
getCandidateSlots(doctor, campaign, date) → slot start/end values
```

## Step 3 — Add a public availability API

### Suggested route

`app/api/public/campaigns/[id]/availability/route.ts`

### Request

```text
GET /api/public/campaigns/{campaignId}/availability?date=2026-09-10
```

### Server tasks

- [ ] Validate the campaign ID and date format.
- [ ] Load the active, verified campaign and its doctor.
- [ ] Load doctor availability for the selected weekday.
- [ ] Check that the date falls within the campaign’s active date range.
- [ ] Check doctor leave for the selected date.
- [ ] Generate candidate slots from persisted hours and appointment duration.
- [ ] Query existing appointments for the doctor and selected date.
- [ ] Exclude blocked appointments according to the agreed status rules.
- [ ] Exclude expired pending reservations if reservation expiry is introduced.
- [ ] Return the doctor timezone and a server-generated timestamp.

### Response shape

```json
{
  "date": "2026-09-10",
  "timeZone": "Asia/Kolkata",
  "available": true,
  "reason": null,
  "slots": [
    {
      "start": "2026-09-10T10:00:00+05:30",
      "end": "2026-09-10T10:30:00+05:30",
      "label": "10:00 AM – 10:30 AM",
      "status": "AVAILABLE"
    },
    {
      "start": "2026-09-10T10:30:00+05:30",
      "end": "2026-09-10T11:00:00+05:30",
      "label": "10:30 AM – 11:00 AM",
      "status": "BOOKED"
    }
  ]
}
```

### Rules

- [ ] Do not expose patient information.
- [ ] Return an empty slot list with a user-friendly reason when the date is unavailable.
- [ ] Keep the API public because this is doctor discovery data.
- [ ] Prevent arbitrary campaign IDs from exposing inactive or unverified providers.

## Step 4 — Update the public campaign detail API

- [ ] Include the doctor timezone and normalized availability summary when useful for the detail page.
- [ ] Include campaign start/end dates already required for the date picker.
- [ ] Include leave dates only as availability state, not sensitive internal details.
- [ ] Ensure the response contains the doctor ID needed by the availability endpoint.
- [ ] Keep the public response limited to bookable doctor/campaign data.

## Step 5 — Replace hard-coded dates in `BookingModal.tsx`

- [ ] Remove the browser-only `Array.from({ length: 7 })` date generation as the source of truth.
- [ ] Generate a display window from the campaign’s active date range, with a reasonable maximum such as the next 30 days.
- [ ] Mark dates as enabled, unavailable, leave, past, or outside campaign range.
- [ ] Optionally fetch a summary for the whole date window so dates with no slots can be disabled before selection.
- [ ] Default to the first available date, not automatically to today.
- [ ] Display a clear empty state when no dates are bookable.
- [ ] Reset the selected slot whenever the selected date changes.
- [ ] Show a loading state while the selected date’s slots are being fetched.

## Step 6 — Replace hard-coded time categories and slots

- [ ] Remove `timeCategories` and `timeSlotsData` as fixed booking data.
- [ ] Build time-of-day groupings from the API response only for presentation.
- [ ] Render each returned slot with its server-provided label.
- [ ] Render `AVAILABLE` slots as selectable.
- [ ] Render `BOOKED`, `RESERVED`, and `UNAVAILABLE` slots as disabled with an explanation.
- [ ] Do not let the user select a slot by manually editing a time string.
- [ ] Use the stable server slot start value when submitting the booking.
- [ ] Add accessible labels such as `10:00 AM to 10:30 AM, available`.

## Step 7 — Revalidate availability during appointment creation

Update `app/api/appointments/route.ts` so the server does not trust the slot returned by the browser.

- [ ] Accept a stable slot start/date value from the client.
- [ ] Load the campaign and doctor from the database.
- [ ] Recalculate valid candidate slots using the shared availability helper.
- [ ] Reject a slot outside the doctor schedule or campaign date range.
- [ ] Reject a slot during doctor leave.
- [ ] Query for an existing blocking appointment for the doctor and slot.
- [ ] Return HTTP `409` with a message such as `This slot is no longer available` when a conflict is detected.
- [ ] Recalculate the fee on the server as currently done.
- [ ] Return the canonical appointment date/time and slot label in the response.

## Step 8 — Add double-booking protection

The availability API improves the UI but cannot prevent two users from submitting at the same time.

- [ ] Decide whether to use a dedicated `SlotReservation` model or pending appointments as reservations.
- [ ] Add reservation expiry, for example 10–15 minutes, if payment/OTP can take time.
- [ ] Create the reservation inside a database transaction.
- [ ] Add a database-level uniqueness strategy for doctor and slot start time where feasible.
- [ ] Treat cancelled and expired reservations as non-blocking.
- [ ] Clean up expired pending reservations through the existing worker or a dedicated cleanup path.
- [ ] Make retries idempotent so a user does not create multiple appointments for the same booking attempt.

## Step 9 — Handle stale availability in the UI

- [ ] Refresh the selected date’s availability when the modal opens.
- [ ] Refresh availability immediately before final confirmation if the user has spent significant time in the flow.
- [ ] If the API returns `409`, clear the selected slot and reload that date.
- [ ] Show alternative available slots without closing the booking modal.
- [ ] Preserve patient and OTP state while the user chooses a replacement slot.
- [ ] Do not show a success state until the server confirms the appointment.

## Step 10 — Add accessibility and UX details

- [ ] Provide a visible selected state for dates and slots.
- [ ] Provide a visible disabled state for booked or unavailable slots.
- [ ] Do not rely only on color to communicate slot status.
- [ ] Add `aria-label`, `aria-pressed`, or `aria-disabled` as appropriate.
- [ ] Keep date and slot controls at least 44×44px.
- [ ] Announce loading, no availability, and conflict messages to assistive technology.
- [ ] Ensure date and time labels are understandable in the doctor’s timezone.
- [ ] Keep the layout usable on narrow screens without horizontal scrolling.

## Step 11 — Test the availability system

### Unit tests

- [ ] Weekday mapping.
- [ ] Start/end time parsing.
- [ ] Slot generation for 30-minute appointments.
- [ ] Campaign start/end boundaries.
- [ ] Past-date and past-time rejection.
- [ ] Doctor leave handling.
- [ ] Timezone conversion.
- [ ] Overnight or invalid schedule behavior.

### API tests

- [ ] Public availability for a valid active campaign.
- [ ] Inactive or unverified campaign returns `404`.
- [ ] Date outside campaign range returns no availability.
- [ ] Doctor leave returns no availability.
- [ ] Existing confirmed appointment disables the matching slot.
- [ ] Expired pending reservation does not permanently block a slot.
- [ ] Simultaneous appointment attempts allow only one success.
- [ ] Invalid or forged slot values return `400` or `409`.

### Browser tests

- [ ] Guest opens the doctor details page.
- [ ] Booking modal displays only valid dates.
- [ ] Selecting a date loads real slots.
- [ ] Booked slots are visibly disabled.
- [ ] Selecting a slot and completing OTP preserves the slot.
- [ ] A stale slot conflict refreshes the slot list without losing the booking flow.
- [ ] Authenticated users receive the same real availability.

## Definition of done

This work is complete when `BookingModal.tsx` no longer uses hard-coded booking dates or slots, all displayed availability comes from persisted doctor/campaign data, booked and unavailable slots are disabled, appointment creation revalidates the slot on the server, and unit/API/browser tests cover stale and conflicting availability.
