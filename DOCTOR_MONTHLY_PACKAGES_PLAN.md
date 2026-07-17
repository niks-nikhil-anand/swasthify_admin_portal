# Doctor Monthly Packages — Implementation Plan

## Objective

Add a doctor-focused monthly package system that lets super administrators define and assign monthly packages, including free packages and limited free-month entitlements. Doctors can view their current package, monthly price, benefits, renewal status, and any free period in the doctor panel.

The system must support these administration options:

- Assign every doctor a default monthly package.
- Set or edit the monthly package amount for an individual doctor when needed.
- Offer a free package.
- Grant a defined number of free months before paid billing begins.
- Change, pause, cancel, or reactivate a doctor's package.
- Preserve a complete history of package assignments, pricing changes, and payment status.

## Product Rules and Decisions

These rules should be confirmed before implementation begins:

| Topic | Proposed rule |
| --- | --- |
| Default package | Every approved/active doctor receives the configured default monthly package. |
| Custom pricing | Admins can override a package's standard monthly amount for one doctor without changing the package for all doctors. |
| Free package | A package may have a price of `0`; it remains an active package with the same lifecycle and history. |
| Free months | Admins can grant a number of free months. The doctor is entitled to the package during that period without payment. |
| Billing start | Paid billing begins after the free period ends, unless the package is free or an admin changes the subscription. |
| Package changes | Changes apply prospectively by default and retain the prior assignment in history. |
| Access control | A doctor without an active package can be restricted from package-gated actions, such as publishing campaigns, if that policy is enabled. |
| Payments | Monthly package payments should use the existing payment provider flow; payment confirmation activates or renews the subscription. |

## Phase 1 — Requirements and UX Definition

### Steps

1. Define package benefits and limits, such as campaign limits, appointment visibility, analytics access, priority support, or featured placement.
2. Confirm whether package billing is manual per month, one-time monthly payments, or recurring subscriptions through Razorpay.
3. Define the grace period and behavior for failed, overdue, paused, and cancelled subscriptions.
4. Confirm whether doctors may request a package change or whether all changes are admin-managed.
5. Define which doctor-panel features require an active subscription.
6. Define notification timing for upcoming renewal, payment success, payment failure, free-period expiry, and package changes.

### Deliverables

- Approved package catalogue and benefit matrix.
- Approved subscription lifecycle and access policy.
- Wireframes or acceptance criteria for the doctor and admin screens.

## Phase 2 — Prisma Schema and Data Migration

### Schema Changes

Add models or equivalent relations for the following concepts:

| Entity | Purpose | Key fields |
| --- | --- | --- |
| `DoctorPackage` | Reusable package definitions managed by admins. | `id`, `name`, `description`, `monthlyPrice`, `currency`, `isFree`, `isDefault`, `isActive`, benefits/limits, timestamps. |
| `DoctorSubscription` | A doctor's current or historical package assignment. | `id`, `doctorId`, `packageId`, `status`, `monthlyPrice`, `currency`, `startedAt`, `currentPeriodStart`, `currentPeriodEnd`, `freeMonthsGranted`, `freePeriodEndsAt`, `cancelledAt`, timestamps. |
| `DoctorPackagePayment` | Payment and invoice history for subscription periods. | `id`, `subscriptionId`, `amount`, `currency`, `status`, `dueAt`, `paidAt`, Razorpay order/payment IDs, timestamps. |
| `DoctorSubscriptionEvent` | Auditable timeline of package changes. | `id`, `subscriptionId`, `actorId`, `eventType`, `previousValue`, `newValue`, `notes`, timestamp. |

### Required Relations and Constraints

1. Relate `DoctorSubscription` to the existing doctor profile and to `DoctorPackage`.
2. Permit multiple historical subscriptions per doctor, but enforce only one current active subscription per doctor at application level (and through a partial unique index if supported by the migration strategy).
3. Store the price on the subscription as a snapshot so future edits to a package price do not alter past billing history.
4. Store `freeMonthsGranted` and `freePeriodEndsAt` on the subscription so free eligibility is explicit and auditable.
5. Use enums for subscription and payment states, for example:
   - Subscription: `ACTIVE`, `TRIAL`, `PAST_DUE`, `PAUSED`, `CANCELLED`, `EXPIRED`.
   - Payment: `PENDING`, `PAID`, `FAILED`, `WAIVED`, `REFUNDED`.
6. Add indexes for doctor, package, status, period end, and payment reconciliation queries.

### Migration and Backfill Steps

1. Create the models, enums, relations, indexes, and migration.
2. Create one default package in the seed or controlled admin setup.
3. Backfill all eligible existing doctors with the default package.
4. Create subscription events for the backfill so it is traceable.
5. Validate that existing doctor access remains uninterrupted after the migration.

## Phase 3 — Backend APIs and Business Logic

### Admin APIs

| Capability | Suggested endpoint / action |
| --- | --- |
| List packages | `GET /api/superAdmin/doctor-packages` |
| Create package | `POST /api/superAdmin/doctor-packages` |
| Update package | `PATCH /api/superAdmin/doctor-packages/:packageId` |
| Set default package | `POST /api/superAdmin/doctor-packages/:packageId/default` |
| View doctor package history | `GET /api/superAdmin/doctors/:doctorId/subscriptions` |
| Assign/change package | `POST /api/superAdmin/doctors/:doctorId/subscriptions` |
| Update custom price/free months/status | `PATCH /api/superAdmin/subscriptions/:subscriptionId` |
| Pause/cancel/reactivate | Dedicated protected subscription actions or an explicit state transition endpoint |

### Doctor APIs

| Capability | Suggested endpoint / action |
| --- | --- |
| Current package and entitlement | `GET /api/doctor-panel/package` |
| Package payment history | `GET /api/doctor-panel/package/payments` |
| Start renewal payment | `POST /api/doctor-panel/package/payment-order` |
| Verify renewal payment | `POST /api/doctor-panel/package/payment-verify` |
| Available packages (if doctor self-service is allowed) | `GET /api/doctor-panel/packages` |

### Business Logic Steps

1. Build a service layer that calculates the effective monthly price: custom doctor price first, then package price; free package and active free period result in `0` due.
2. Automatically assign the default package when an admin approves a doctor or when a doctor becomes eligible for the platform.
3. Generate monthly payment obligations only for active paid subscriptions outside their free period.
4. Create Razorpay orders for due package payments and verify HMAC signatures before marking payments paid.
5. Advance `currentPeriodStart` and `currentPeriodEnd` only after a valid paid payment or a waived/free period renewal.
6. Add an idempotent scheduled job to identify expiring subscriptions, create due payments, update overdue status, and send reminders.
7. Add authorization checks so doctors can read only their own package data and only super admins can manage package configuration.
8. Log every admin assignment, price override, free-month grant, status transition, payment result, and automated renewal event.

## Phase 4 — Super Admin Package UI

### Package Management Screen

Create a dedicated area under the super-admin portal, for example `/superAdmin/doctor-packages`.

1. Display a package table with name, monthly price, type (paid/free), default status, assigned doctors, active status, and last updated date.
2. Add filters for active/inactive, free/paid, and default package.
3. Add a **Create Package** dialog with name, description, monthly amount, currency, free flag, benefits, limits, and active status.
4. Add an **Edit Package** dialog that clearly warns when a standard price change affects only future assignments or renewals.
5. Provide a one-click **Set as Default** action with confirmation; prevent multiple default packages.
6. Allow inactive packages to remain visible in historical records while preventing new assignments.

### Doctor Package Assignment UI

Add a **Package & Billing** section to the admin doctor-detail page.

1. Show the current package, effective monthly amount, source of price (standard or custom), current period, free-period end date, status, and next payment due date.
2. Add an **Assign / Change Package** action with selectable package, start date, and whether the change is immediate or next-cycle.
3. Add controls to override the doctor's monthly amount, mark the package free, and grant a selectable number of free months.
4. Require a reason/note for manual price overrides, waived fees, cancellation, and reactivation.
5. Show subscription and payment history in tabs or a timeline, including the admin actor and reason for each change.
6. Add guarded actions for pause, cancel, reactivate, waive a payment, and resend payment reminders.

### Admin UI States

1. Empty state when no packages exist, directing the admin to create the first/default package.
2. Validation errors for negative prices, duplicate defaults, free months without a selected package, and inactive-package assignment.
3. Clear badges for `Free`, `Trial`, `Active`, `Past Due`, `Paused`, and `Cancelled`.
4. Confirmation dialogs for operations that affect access or billing.

## Phase 5 — Doctor Panel Package UI

### Doctor Package Page

Create a package page such as `/doctor-panel/package` and add it to the doctor navigation.

1. Show the current package name, status, benefits, effective monthly price, and current billing period.
2. Display a clear free-period message, for example: “You have 2 free months remaining; paid billing starts on 16 September 2026.”
3. Display the next renewal amount and due date for paid packages.
4. Provide a **Pay / Renew Now** action when payment is due, leading to the Razorpay checkout flow.
5. Show recent payment history, receipts/status, and package-change history.
6. If self-service changes are enabled, show available packages and route requests through an approval flow; otherwise display an admin-support contact action.

### Dashboard Integration

1. Add a compact package-status card to the doctor dashboard.
2. Show non-blocking renewal reminders before the due date and high-priority alerts for expired or past-due packages.
3. If access restrictions are enabled, show an explanatory gate on protected actions with a direct path to the package page or support.

## Phase 6 — Payments, Notifications, and Scheduled Work

### Payment Integration

1. Reuse the existing Razorpay order and signature-verification patterns, while keeping package payments distinct from appointment payments.
2. Attach internal subscription and payment IDs to Razorpay notes/metadata for reconciliation.
3. Make verification idempotent to avoid duplicate renewal periods from repeated callbacks or requests.
4. Record failed, cancelled, refunded, and manually waived outcomes.

### Notifications

Send email and in-app notifications for:

- Default package assignment.
- Package change or price override.
- Start and expiry of a free period.
- Upcoming renewal reminders.
- Successful payment and receipt availability.
- Failed payment, overdue state, pause, cancellation, and reactivation.

### Scheduled Jobs

1. Daily: identify subscriptions approaching the free-period end or renewal date and queue reminders.
2. Daily: create or update due payments for paid subscriptions.
3. Daily: mark subscriptions past due or expired after the configured grace period.
4. Daily: apply scheduled package changes due at the next billing cycle.
5. Ensure every job is idempotent and emits audit events.

## Phase 7 — Authorization, Validation, and Security

1. Restrict package configuration and doctor subscription actions to super-admin roles.
2. Validate all money values server-side using the smallest currency unit or a safe decimal strategy; do not trust client-provided totals.
3. Verify doctor ownership on all doctor-panel package and payment requests.
4. Verify Razorpay signatures server-side and safely handle webhook/retry duplicates.
5. Maintain audit logs for all administrative pricing and entitlement changes.
6. Avoid deleting packages or subscriptions that have payment history; deactivate or cancel them instead.

## Phase 8 — Testing and Quality Assurance

### Test Scenarios

1. A newly approved doctor automatically receives the default package.
2. An admin changes the default package and future eligible doctors receive the new one.
3. A doctor receives a custom monthly price without changing the package's standard price.
4. A doctor receives a free package.
5. A paid package with 1, 3, and 12 free months correctly begins billing after each free period.
6. A successful Razorpay payment renews exactly one billing period.
7. A failed or repeated payment verification does not create duplicate payments or subscription periods.
8. Pause, cancel, reactivate, and scheduled package-change behaviors preserve history.
9. Doctors cannot access another doctor's package, billing, or receipt data.
10. Inactive packages cannot be assigned, while prior subscriptions still render correctly.
11. Doctor-facing and admin-facing UI work across desktop and mobile layouts.

### Acceptance Criteria

- Every eligible doctor has one visible current package or a clearly documented exception state.
- Admins can set a default package, assign a package, override monthly pricing, offer it free, and grant free months.
- Doctors can understand their package, free-period status, upcoming payment, and payment history without contacting support.
- All package/payment changes are secured, auditable, and resilient to repeated requests.

## Phase 9 — Rollout and Operations

1. Deploy schema changes and package configuration behind a feature flag if available.
2. Create and review the default package before enabling automatic assignment.
3. Backfill existing doctors in a staged batch, then reconcile assignment counts with active doctors.
4. Enable the admin UI first and verify manual assignment flows.
5. Enable the doctor package page and payment flow for a pilot group.
6. Monitor payment failures, overdue subscriptions, support tickets, and audit logs.
7. Enable access restrictions only after package data and renewal handling are stable.

## Recommended Implementation Order

1. Confirm business rules and package benefits.
2. Implement Prisma models, migration, seed/default package, and existing-doctor backfill.
3. Implement protected admin APIs and core subscription service logic.
4. Build super-admin package and doctor-assignment UI.
5. Build doctor package visibility UI.
6. Add Razorpay package-payment flow, notifications, and scheduled renewal jobs.
7. Add access gating, complete test coverage, and roll out in stages.
