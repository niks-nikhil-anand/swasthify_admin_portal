-- CreateEnum
CREATE TYPE "DoctorSubscriptionStatus" AS ENUM ('ACTIVE', 'TRIAL', 'PAST_DUE', 'PAUSED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "DoctorPackagePaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'WAIVED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "DoctorSubscriptionEventType" AS ENUM ('ASSIGNED', 'PACKAGE_CHANGED', 'PRICE_OVERRIDDEN', 'FREE_MONTHS_GRANTED', 'STATUS_CHANGED', 'PAUSED', 'CANCELLED', 'REACTIVATED', 'PERIOD_RENEWED', 'PAYMENT_CREATED', 'PAYMENT_PAID', 'PAYMENT_FAILED', 'PAYMENT_WAIVED', 'PAYMENT_REFUNDED', 'BACKFILLED');

-- CreateTable
CREATE TABLE "doctor_packages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "monthlyPrice" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "currency" CHAR(3) NOT NULL DEFAULT 'INR',
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "benefits" JSONB,
    "limits" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctor_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_subscriptions" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "status" "DoctorSubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "monthlyPrice" DECIMAL(12,2) NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'INR',
    "isPriceOverride" BOOLEAN NOT NULL DEFAULT false,
    "priceOverrideReason" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "freeMonthsGranted" INTEGER NOT NULL DEFAULT 0,
    "freePeriodEndsAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctor_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_package_payments" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'INR',
    "status" "DoctorPackagePaymentStatus" NOT NULL DEFAULT 'PENDING',
    "dueAt" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "failureReason" TEXT,
    "waivedReason" TEXT,
    "refundedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctor_package_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_subscription_events" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "actorId" TEXT,
    "eventType" "DoctorSubscriptionEventType" NOT NULL,
    "previousValue" JSONB,
    "newValue" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "doctor_subscription_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "doctor_packages_name_key" ON "doctor_packages"("name");

-- CreateIndex
CREATE INDEX "doctor_packages_isActive_idx" ON "doctor_packages"("isActive");

-- CreateIndex
CREATE INDEX "doctor_packages_isDefault_idx" ON "doctor_packages"("isDefault");

-- CreateIndex
CREATE INDEX "doctor_subscriptions_doctorId_idx" ON "doctor_subscriptions"("doctorId");

-- CreateIndex
CREATE INDEX "doctor_subscriptions_packageId_idx" ON "doctor_subscriptions"("packageId");

-- CreateIndex
CREATE INDEX "doctor_subscriptions_status_idx" ON "doctor_subscriptions"("status");

-- CreateIndex
CREATE INDEX "doctor_subscriptions_currentPeriodEnd_idx" ON "doctor_subscriptions"("currentPeriodEnd");

-- CreateIndex
CREATE INDEX "doctor_subscriptions_doctorId_status_idx" ON "doctor_subscriptions"("doctorId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_package_payments_razorpayOrderId_key" ON "doctor_package_payments"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_package_payments_razorpayPaymentId_key" ON "doctor_package_payments"("razorpayPaymentId");

-- CreateIndex
CREATE INDEX "doctor_package_payments_subscriptionId_idx" ON "doctor_package_payments"("subscriptionId");

-- CreateIndex
CREATE INDEX "doctor_package_payments_status_dueAt_idx" ON "doctor_package_payments"("status", "dueAt");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_package_payments_subscriptionId_periodStart_periodEn_key" ON "doctor_package_payments"("subscriptionId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "doctor_subscription_events_subscriptionId_createdAt_idx" ON "doctor_subscription_events"("subscriptionId", "createdAt");

-- CreateIndex
CREATE INDEX "doctor_subscription_events_actorId_idx" ON "doctor_subscription_events"("actorId");

-- CreateIndex
CREATE INDEX "doctor_subscription_events_eventType_idx" ON "doctor_subscription_events"("eventType");

-- AddForeignKey
ALTER TABLE "doctor_subscriptions" ADD CONSTRAINT "doctor_subscriptions_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_subscriptions" ADD CONSTRAINT "doctor_subscriptions_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "doctor_packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_package_payments" ADD CONSTRAINT "doctor_package_payments_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "doctor_subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_subscription_events" ADD CONSTRAINT "doctor_subscription_events_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "doctor_subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_subscription_events" ADD CONSTRAINT "doctor_subscription_events_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
