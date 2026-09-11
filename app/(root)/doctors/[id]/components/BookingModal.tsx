"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Campaign } from "../../types";
import { format, addDays, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

import { toast } from "sonner";
import { loadRazorpay, openRazorpayCheckout, type RazorpayPaymentResponse } from "@/utils/razorpay-client";
import { PaymentSuccessUI } from "@/components/root/PaymentSuccessUI";
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from "firebase/auth";
import { identityAuth } from "@/lib/firebase";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    campaign: Campaign;
    isAuthenticated: boolean;
}

interface AvailabilitySlot {
    startMinutes: number;
    endMinutes: number;
    label: string;
    status: "AVAILABLE" | "BOOKED";
}

interface AvailabilityResponse {
    available: boolean;
    reason: "OUTSIDE_CAMPAIGN" | "OUTSIDE_CAMPAIGN_SCHEDULE" | "DOCTOR_ON_LEAVE" | "NO_DOCTOR_AVAILABILITY" | "NO_CAMPAIGN_SCHEDULE" | "NO_FUTURE_SLOTS" | "NO_SLOTS" | null;
    slots: AvailabilitySlot[];
}

interface AppointmentSummary { id: string; }
interface AppointmentResponse { appointment?: AppointmentSummary; error?: string; }
interface PlatformFee { entityType: string; fee: number; discount: number; discountType: string; }
interface PaymentOrderResponse {
    error?: string;
    key: string;
    amount: number;
    currency: string;
    orderId: string;
    appointmentDetails: { doctorName: string; patientName: string };
}

function formatDoctorName(name?: string | null) {
    const trimmed = (name || "").trim();
    if (!trimmed) return "Doctor";
    return /^dr\.?\s/i.test(trimmed) ? trimmed : `Dr. ${trimmed}`;
}

function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback;
}

function getAvailabilityMessage(reason?: AvailabilityResponse["reason"]) {
    switch (reason) {
        case "NO_DOCTOR_AVAILABILITY":
            return "Doctor is not available on this day.";
        case "NO_CAMPAIGN_SCHEDULE":
            return "Appointments are not configured for this day.";
        case "DOCTOR_ON_LEAVE":
            return "Doctor is on leave on this day.";
        case "OUTSIDE_CAMPAIGN":
        case "OUTSIDE_CAMPAIGN_SCHEDULE":
            return "Appointments are not available on this day.";
        case "NO_FUTURE_SLOTS":
            return "No upcoming slots are left for this day.";
        case "NO_SLOTS":
            return "No appointment slots are available for this date.";
        default:
            return "No appointment slots are available for this date.";
    }
}

function getDateAvailabilityLabel(availability?: AvailabilityResponse) {
    if (!availability) return "";
    if (availability.available) return "Open";
    if (availability.reason === "DOCTOR_ON_LEAVE") return "Leave";
    if (availability.reason === "NO_DOCTOR_AVAILABILITY") return "Off";
    if (availability.reason === "NO_CAMPAIGN_SCHEDULE") return "Off";
    if (availability.reason === "NO_FUTURE_SLOTS") return "Done";
    return "Full";
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, campaign, isAuthenticated }) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isBooking, setIsBooking] = useState(false);
    const [bookingStep, setBookingStep] = useState<"SELECT" | "REVIEW" | "PAYMENT" | "SUCCESS">("SELECT");
    const [bookedAppointment, setBookedAppointment] = useState<AppointmentSummary | null>(null);
    const [platformFees, setPlatformFees] = useState<PlatformFee[]>([]);
    const [guestName, setGuestName] = useState("");
    const [guestMobile, setGuestMobile] = useState("");
    const [guestOtp, setGuestOtp] = useState("");
    const [guestOtpSent, setGuestOtpSent] = useState(false);
    const [guestVerified, setGuestVerified] = useState(false);
    const [guestOtpLoading, setGuestOtpLoading] = useState(false);
    const [availabilityByDate, setAvailabilityByDate] = useState<Record<string, AvailabilityResponse>>({});
    const [availabilityLoading, setAvailabilityLoading] = useState(false);
    const [loadingDateKeys, setLoadingDateKeys] = useState<string[]>([]);
    const [hasAutoSelectedDate, setHasAutoSelectedDate] = useState(false);
    const confirmationResultRef = React.useRef<ConfirmationResult | null>(null);
    const recaptchaVerifierRef = React.useRef<RecaptchaVerifier | null>(null);
    const modalContentRef = React.useRef<HTMLDivElement>(null);
    const previouslyFocusedRef = React.useRef<HTMLElement | null>(null);

    const handleClose = useCallback(() => {
        setBookingStep("SELECT");
        setBookedAppointment(null);
        setSelectedTime(null);
        setGuestName("");
        setGuestMobile("");
        setGuestOtp("");
        setGuestOtpSent(false);
        setGuestVerified(false);
        setHasAutoSelectedDate(false);
        confirmationResultRef.current = null;
        recaptchaVerifierRef.current?.clear();
        recaptchaVerifierRef.current = null;
        onClose();
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return;
        previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
        modalContentRef.current?.focus();
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                handleClose();
                return;
            }
            if (event.key !== "Tab" || !modalContentRef.current) return;
            const focusable = modalContentRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex='-1'])");
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            previouslyFocusedRef.current?.focus();
        };
    }, [handleClose, isOpen]);

    useEffect(() => {
        const fetchPlatformFees = async () => {
            try {
                const res = await fetch("/api/public/platform-fee");
                if (res.ok) {
                    const data = await res.json() as PlatformFee[];
                    setPlatformFees(data);
                }
            } catch (err) {
                console.error("Error fetching platform fees:", err);
            }
        };
        fetchPlatformFees();
    }, []);

    const dates = useMemo(() => {
        const today = new Date();
        const campaignStart = new Date(campaign.startDate);
        const campaignEnd = new Date(campaign.endDate);
        const firstDate = campaignStart > today ? campaignStart : today;
        return Array.from({ length: 14 }, (_, index) => addDays(firstDate, index))
            .filter((date) => date <= campaignEnd);
    }, [campaign.startDate, campaign.endDate]);

    const fetchAvailabilityForDate = useCallback(async (date: Date, signal?: AbortSignal) => {
        const key = format(date, "yyyy-MM-dd");
        setLoadingDateKeys((current) => current.includes(key) ? current : [...current, key]);
        try {
            const response = await fetch(`/api/public/campaigns/${campaign.id}/availability?date=${key}`, { signal });
            if (!response.ok) throw new Error("Unable to load availability");
            const availability = await response.json() as AvailabilityResponse;
            setAvailabilityByDate((current) => ({ ...current, [key]: availability }));
            return [key, availability] as const;
        } finally {
            setLoadingDateKeys((current) => current.filter((dateKey) => dateKey !== key));
        }
    }, [campaign.id]);

    useEffect(() => {
        if (!isOpen || dates.length === 0) return;
        const controller = new AbortController();
        const loadAvailability = async () => {
            setAvailabilityLoading(true);
            setAvailabilityByDate({});
            setHasAutoSelectedDate(false);
            try {
                const results = await Promise.all(dates.map((date) => fetchAvailabilityForDate(date, controller.signal)));
                setAvailabilityByDate(Object.fromEntries(results));
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error("Availability error:", error);
                    toast.error("Unable to load appointment availability");
                }
            } finally {
                if (!controller.signal.aborted) setAvailabilityLoading(false);
            }
        };
        loadAvailability();
        return () => controller.abort();
    }, [dates, fetchAvailabilityForDate, isOpen]);

    useEffect(() => {
        if (isOpen && dates.length > 0 && !dates.some((date) => isSameDay(date, selectedDate))) {
            setSelectedDate(dates[0]);
        }
    }, [dates, isOpen, selectedDate]);

    const selectedDateKey = format(selectedDate, "yyyy-MM-dd");
    const selectedAvailability = availabilityByDate[selectedDateKey];
    const isSelectedDateLoading = loadingDateKeys.includes(selectedDateKey);

    const handleSelectDate = (date: Date) => {
        setSelectedDate(date);
        setSelectedTime(null);
        void fetchAvailabilityForDate(date);
    };

    useEffect(() => {
        if (!isOpen || availabilityLoading || hasAutoSelectedDate || dates.length === 0) return;
        const hasLoadedAllDates = dates.every((date) => availabilityByDate[format(date, "yyyy-MM-dd")]);
        if (!hasLoadedAllDates) return;

        const firstAvailableDate = dates.find((date) => availabilityByDate[format(date, "yyyy-MM-dd")]?.available);
        if (firstAvailableDate && !isSameDay(firstAvailableDate, selectedDate)) {
            setSelectedDate(firstAvailableDate);
            setSelectedTime(null);
        } else if (!firstAvailableDate && dates.length > 0 && !dates.some((date) => isSameDay(date, selectedDate))) {
            setSelectedDate(dates[0]);
            setSelectedTime(null);
        }
        setHasAutoSelectedDate(true);
    }, [availabilityByDate, availabilityLoading, dates, hasAutoSelectedDate, isOpen, selectedDate]);

    const handlePayToBook = async () => {
        if (!selectedTime) return;
        if (!isAuthenticated && !guestVerified) {
            toast.error("Verify your mobile number before confirming the booking");
            return;
        }

        setIsBooking(true);
        let activeAppointmentId: string | null = null;
        try {
            // 1. Create Appointment (Reserved)
            const response = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "DOCTOR",
                    organizerId: campaign.id,
                    date: format(selectedDate, "yyyy-MM-dd"),
                    timeSlot: selectedTime,
                }),
            });

            const data = await response.json() as AppointmentResponse;
            if (!response.ok) {
                throw new Error(data.error || "Failed to book appointment");
            }

            if (!data.appointment) throw new Error("Appointment was not created");
            const appointment = data.appointment;
            activeAppointmentId = appointment.id;
            setBookedAppointment(appointment);

            // 2. Initiate Payment Immediately
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                await releaseAppointment(appointment.id, "Payment gateway unavailable");
                toast.error("Failed to load payment gateway. Please check your internet.");
                setIsBooking(false);
                return;
            }

            const orderRes = await fetch("/api/payments/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ appointmentId: appointment.id }),
            });

            const orderData = await orderRes.json() as PaymentOrderResponse;
            if (!orderRes.ok) throw new Error(orderData.error || "Failed to initiate payment");

            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Swasthify",
                description: `Appointment with Dr. ${orderData.appointmentDetails.doctorName}`,
                order_id: orderData.orderId,
                prefill: {
                    name: orderData.appointmentDetails.patientName,
                },
                theme: { color: "#22c55e" },
                modal: {
                    ondismiss: () => {
                        void releaseAppointment(appointment.id, "Payment cancelled by patient");
                        setIsBooking(false);
                        toast.info("Payment cancelled. Your slot has been released.");
                    }
                },
                handler: async (response: RazorpayPaymentResponse) => {
                    try {
                        const verifyRes = await fetch("/api/payments/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                appointmentId: appointment.id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyRes.ok) {
                            setBookingStep("SUCCESS");
                            toast.success("Appointment Confirmed!");
                        } else {
                            await releaseAppointment(appointment.id, "Payment verification failed");
                            toast.error(verifyData.error || "Payment verification failed");
                        }
                    } catch {
                        toast.error("Something went wrong during verification");
                    } finally {
                        setIsBooking(false);
                    }
                },
            };

            openRazorpayCheckout(options);

        } catch (error: unknown) {
            console.error("Booking/Payment error:", error);
            if (activeAppointmentId) {
                await releaseAppointment(activeAppointmentId, "Booking payment flow failed");
            }
            toast.error(getErrorMessage(error, "Something went wrong. Please try again."));
            setIsBooking(false);
        }
    };

    const releaseAppointment = async (appointmentId: string, reason: string) => {
        try {
            await fetch("/api/appointments/cancel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ appointmentId, reason }),
            });
        } catch (error) {
            console.error("Unable to release appointment reservation:", error);
        }
    };

    const handleSendGuestOtp = async () => {
        if (guestName.trim().length < 2) {
            toast.error("Enter your full name");
            return;
        }
        if (!/^\d{10}$/.test(guestMobile)) {
            toast.error("Enter a valid 10-digit mobile number");
            return;
        }

        setGuestOtpLoading(true);
        try {
            if (!recaptchaVerifierRef.current) {
                recaptchaVerifierRef.current = new RecaptchaVerifier(identityAuth, "booking-recaptcha", { size: "invisible" });
            }
            confirmationResultRef.current = await signInWithPhoneNumber(
                identityAuth,
                `+91${guestMobile}`,
                recaptchaVerifierRef.current
            );
            setGuestOtpSent(true);
            toast.success("OTP sent to your mobile number");
        } catch (error: unknown) {
            recaptchaVerifierRef.current?.clear();
            recaptchaVerifierRef.current = null;
            toast.error(getErrorMessage(error, "Unable to send OTP"));
        } finally {
            setGuestOtpLoading(false);
        }
    };

    const handleVerifyGuestOtp = async () => {
        if (!confirmationResultRef.current || !/^\d{6}$/.test(guestOtp)) {
            toast.error("Enter the 6-digit OTP");
            return;
        }

        setGuestOtpLoading(true);
        try {
            const credential = await confirmationResultRef.current.confirm(guestOtp);
            const response = await fetch("/api/auth/guest-mobile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken: await credential.user.getIdToken(), name: guestName.trim() }),
            });
            const data = await response.json() as { error?: string };
            if (!response.ok) throw new Error(data.error || "Unable to authenticate");
            setGuestVerified(true);
            toast.success("Mobile number verified");
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Invalid OTP"));
        } finally {
            setGuestOtpLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        aria-hidden="true"
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="booking-modal-title"
                        aria-describedby="booking-modal-description"
                        tabIndex={-1}
                        ref={modalContentRef}
                        className={cn(
                            "relative flex w-full flex-col overflow-hidden border border-border bg-background shadow-2xl",
                            "max-h-[92dvh] rounded-t-3xl sm:max-h-[90dvh] sm:rounded-3xl",
                            bookingStep === "REVIEW" ? "sm:max-w-lg lg:max-w-3xl" : "sm:max-w-lg"
                        )}
                    >
                        {bookingStep === "SELECT" && (
                            <>
                                {/* Header */}
                                <div className="shrink-0 border-b bg-muted/30 p-4 sm:p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 id="booking-modal-title" className="text-xl font-bold text-foreground">Book Appointment</h2>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleClose}
                                            className="rounded-full hover:bg-muted"
                                        >
                                            <X className="w-5 h-5" />
                                        </Button>
                                    </div>
                                    <p id="booking-modal-description" className="sr-only">Choose an available date and appointment slot to continue booking.</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <CalendarIcon className="w-6 h-6" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-foreground truncate">
                                                {formatDoctorName(campaign.doctor.user.name)}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {campaign.doctor.specializations.map((s: { name: string }) => s.name).join(", ")}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="min-h-0 flex-1 space-y-6 overflow-y-auto custom-scrollbar p-4 sm:p-6">
                                    {/* Date Selection */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Select Date</h3>
                                            <span className="text-xs font-medium text-primary bg-primary/5 px-2 py-1 rounded-full">
                                                {format(selectedDate, "MMMM yyyy")}
                                            </span>
                                        </div>
                                        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-2 px-2">
                                            {availabilityLoading && dates.length > 0 && Object.keys(availabilityByDate).length === 0 ? (
                                                dates.slice(0, 6).map((date) => (
                                                    <div
                                                        key={date.toISOString()}
                                                        className="min-w-[70px] h-[86px] rounded-2xl border-2 border-transparent bg-muted/40 animate-pulse"
                                                    />
                                                ))
                                            ) : dates.map((date) => {
                                                const isSelected = isSameDay(date, selectedDate);
                                                const dateKey = format(date, "yyyy-MM-dd");
                                                const dateAvailability = availabilityByDate[dateKey];
                                                const isDateAvailable = Boolean(dateAvailability?.available);
                                                const isDateLoading = loadingDateKeys.includes(dateKey);
                                                const availabilityLabel = getDateAvailabilityLabel(dateAvailability);
                                                return (
                                                    <button
                                                        key={date.toISOString()}
                                                        onClick={() => handleSelectDate(date)}
                                                        disabled={isDateLoading}
                                                        aria-label={`${format(date, "EEEE, MMMM d")}${availabilityLabel ? `, ${availabilityLabel}` : ""}`}
                                                        className={cn(
                                                            "flex flex-col items-center justify-center min-w-[70px] h-[86px] rounded-2xl transition-all duration-300 border-2",
                                                            isSelected
                                                                ? "bg-primary/15 border-primary text-primary shadow-lg shadow-primary/10 scale-105"
                                                                : "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted hover:border-border",
                                                            isDateAvailable && isSelected && "bg-primary border-primary text-primary-foreground shadow-primary/25",
                                                            !isDateAvailable && !isSelected && "opacity-65",
                                                            isDateLoading && "cursor-wait opacity-60"
                                                        )}
                                                    >
                                                        <span className="text-xs font-bold uppercase mb-1 opacity-80">
                                                            {format(date, "EEE")}
                                                        </span>
                                                        <span className="text-xl font-extrabold tracking-tight">
                                                            {format(date, "d")}
                                                        </span>
                                                        {availabilityLabel && (
                                                            <span className="mt-1 text-[10px] font-bold uppercase tracking-wide opacity-75">
                                                                {isDateLoading ? "Checking" : availabilityLabel}
                                                            </span>
                                                        )}
                                                        {!availabilityLabel && isDateLoading && (
                                                            <span className="mt-1 text-[10px] font-bold uppercase tracking-wide opacity-75">
                                                                Checking
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Persisted Time Slots */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Select Slot</h3>
                                            {isSelectedDateLoading && <span className="text-xs text-muted-foreground">Checking slots...</span>}
                                        </div>
                                        {isSelectedDateLoading && (
                                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                                {Array.from({ length: 6 }, (_, index) => (
                                                    <div key={index} className="min-h-11 rounded-xl border-2 border-transparent bg-muted/40 animate-pulse" />
                                                ))}
                                            </div>
                                        )}
                                        {!isSelectedDateLoading && (!selectedAvailability || selectedAvailability.slots.length === 0) && (
                                            <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                                                {getAvailabilityMessage(selectedAvailability?.reason)}
                                            </p>
                                        )}
                                        {!isSelectedDateLoading && <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                            {selectedAvailability?.slots?.map((slot) => {
                                                const isSelected = selectedTime === slot.label;
                                                const isAvailable = slot.status === "AVAILABLE";
                                                return (
                                                    <button
                                                        key={slot.label}
                                                        type="button"
                                                        disabled={!isAvailable || availabilityLoading}
                                                        aria-label={`${slot.label}, ${isAvailable ? "available" : "booked"}`}
                                                        onClick={() => isAvailable && setSelectedTime(slot.label)}
                                                        className={cn(
                                                            "flex min-h-11 items-center justify-center rounded-xl border-2 p-3 text-sm font-semibold transition-all duration-200",
                                                            isSelected ? "border-primary bg-primary text-primary-foreground shadow-md" : "border-border/50 bg-muted/20 text-muted-foreground hover:border-primary/30 hover:bg-muted/40",
                                                            !isAvailable && "cursor-not-allowed border-border/30 bg-muted/40 text-muted-foreground/50 line-through"
                                                        )}
                                                    >
                                                        {slot.label}{!isAvailable && " · Booked"}
                                                    </button>
                                                );
                                            })}
                                        </div>}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="shrink-0 border-t bg-muted/30 p-4 sm:p-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Booking for</p>
                                        <p className="text-sm font-bold text-foreground">
                                            {format(selectedDate, "EEE, MMM d")}
                                            {selectedTime && <span className="text-primary ml-1 truncate block sm:inline">• {selectedTime}</span>}
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => setBookingStep("REVIEW")}
                                        disabled={!selectedTime || isBooking || isSelectedDateLoading}
                                        className="h-12 w-full rounded-xl px-8 font-bold shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
                                    >
                                        Proceed to Review
                                    </Button>
                                </div>
                            </>
                        )}


                        {bookingStep === "REVIEW" && (
                            <>
                                {/* Header */}
                                <div className="shrink-0 border-b bg-muted/30 p-4 sm:p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h2 className="text-xl font-bold text-foreground">Review Booking</h2>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleClose}
                                            className="rounded-full hover:bg-muted"
                                        >
                                            <X className="w-5 h-5" />
                                        </Button>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Please review your appointment details and fee breakdown.</p>
                                </div>

                                <div className="min-h-0 flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6">
                                    <div className="grid gap-5 lg:grid-cols-2 lg:items-start lg:gap-6">
                                    <div className="space-y-5">
                                    {/* Appointment Info Summary */}
                                    <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 text-xl">
                                            🩺
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-foreground">{formatDoctorName(campaign.doctor.user.name)}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {format(selectedDate, "EEEE, MMMM do")} • {selectedTime}
                                            </p>
                                        </div>
                                    </div>

                                    {!isAuthenticated && (
                                        <div className="space-y-4 rounded-2xl border border-border/60 bg-muted/20 p-4">
                                            <div>
                                                <h3 className="text-sm font-bold text-foreground">Complete your booking</h3>
                                                <p className="mt-1 text-xs text-muted-foreground">Verify your mobile number to continue. No password is required.</p>
                                            </div>
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
                                                    <span>Full name <span className="text-destructive">*</span></span>
                                                    <input
                                                        value={guestName}
                                                        onChange={(event) => setGuestName(event.target.value)}
                                                        disabled={guestVerified || guestOtpLoading}
                                                        placeholder="Enter your full name"
                                                        className="h-11 rounded-lg border border-input bg-background px-3 font-normal outline-none transition focus-visible:ring-2 focus-visible:ring-primary"
                                                    />
                                                </label>
                                                <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
                                                    <span>Mobile number <span className="text-destructive">*</span></span>
                                                    <div className="flex">
                                                        <span className="flex h-11 items-center rounded-l-lg border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">+91</span>
                                                        <input
                                                            value={guestMobile}
                                                            onChange={(event) => setGuestMobile(event.target.value.replace(/\D/g, "").slice(0, 10))}
                                                            disabled={guestOtpSent || guestVerified || guestOtpLoading}
                                                            inputMode="numeric"
                                                            maxLength={10}
                                                            placeholder="9876543210"
                                                            className="h-11 min-w-0 flex-1 rounded-r-lg border border-input bg-background px-3 font-normal outline-none transition focus-visible:ring-2 focus-visible:ring-primary"
                                                        />
                                                    </div>
                                                </label>
                                            </div>
                                            {!guestOtpSent && !guestVerified && (
                                                <Button type="button" onClick={handleSendGuestOtp} disabled={guestOtpLoading} className="w-full sm:w-auto">
                                                    {guestOtpLoading ? "Sending OTP..." : "Send OTP"}
                                                </Button>
                                            )}
                                            {guestOtpSent && !guestVerified && (
                                                <div className="space-y-3">
                                                    <label className="grid gap-1.5 text-sm font-medium">
                                                        <span>Enter OTP</span>
                                                        <input
                                                            value={guestOtp}
                                                            onChange={(event) => setGuestOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                                                            inputMode="numeric"
                                                            maxLength={6}
                                                            placeholder="6-digit OTP"
                                                            className="h-11 rounded-lg border border-input bg-background px-3 font-normal tracking-[0.35em] outline-none transition focus-visible:ring-2 focus-visible:ring-primary"
                                                        />
                                                    </label>
                                                    <div className="flex flex-wrap gap-3">
                                                        <Button type="button" onClick={handleVerifyGuestOtp} disabled={guestOtpLoading}>
                                                            {guestOtpLoading ? "Verifying..." : "Verify OTP"}
                                                        </Button>
                                                        <Button type="button" variant="outline" onClick={() => { setGuestOtpSent(false); setGuestOtp(""); }} disabled={guestOtpLoading}>
                                                            Change number
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                            {guestVerified && <p className="text-sm font-medium text-green-600 dark:text-green-400">Mobile number verified. You can confirm your booking.</p>}
                                            <div id="booking-recaptcha" />
                                        </div>
                                    )}

                                    </div>

                                    <div className="space-y-5">
                                    {/* Fee Breakdown */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Fee Breakdown</h3>
                                        <div className="space-y-3 bg-muted/30 rounded-2xl p-5 border border-border/50">
                                            {(() => {
                                                const doctorFee = campaign.price;
                                                const campaignDiscount = (doctorFee * (campaign.discountPercentage || 0)) / 100;

                                                // Find relevant platform fee (DOCTOR or ALL)
                                                const platformFeeObj = platformFees.find(f => f.entityType === "DOCTOR") || platformFees.find(f => f.entityType === "ALL");

                                                let platformFeeValue = 0;
                                                let platformDiscountValue = 0;

                                                if (platformFeeObj) {
                                                    // Platform Fee is now always a flat amount as per user request
                                                    platformFeeValue = platformFeeObj.fee;

                                                    // Calculate Platform Discount
                                                    if (platformFeeObj.discountType === "PERCENTAGE") {
                                                        platformDiscountValue = (platformFeeValue * platformFeeObj.discount) / 100;
                                                    } else {
                                                        platformDiscountValue = platformFeeObj.discount;
                                                    }
                                                }

                                                const finalAmount = Math.max(0, doctorFee - campaignDiscount + platformFeeValue - platformDiscountValue);

                                                return (
                                                    <>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-muted-foreground">Doctor Consultation Fee</span>
                                                            <span className="font-medium">₹{doctorFee}</span>
                                                        </div>
                                                        {campaignDiscount > 0 && (
                                                            <div className="flex justify-between text-sm text-green-600">
                                                                <span>Campaign Discount ({campaign.discountPercentage}%)</span>
                                                                <span className="font-medium">-₹{campaignDiscount.toFixed(2)}</span>
                                                            </div>
                                                        )}

                                                        {platformFeeObj && (
                                                            <div className="pt-2 border-t border-border/30 mt-2 space-y-2">
                                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Platform Service Fee</p>
                                                                <div className="flex justify-between text-sm">
                                                                    <span className="text-muted-foreground">Amount</span>
                                                                    <span className="font-medium">₹{platformFeeValue.toFixed(2)}</span>
                                                                </div>
                                                                {platformFeeObj.discount > 0 && (
                                                                    <div className="flex justify-between text-sm text-green-600">
                                                                        <span>Discount ({platformFeeObj.discountType === "PERCENTAGE" ? `${platformFeeObj.discount}%` : "Flat"})</span>
                                                                        <span className="font-medium">-₹{platformDiscountValue.toFixed(2)}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        <div className="border-t border-dashed pt-3 mt-3 flex justify-between items-center bg-primary/5 -mx-5 px-5 py-3 rounded-b-2xl">
                                                            <div>
                                                                <span className="font-bold text-foreground block">Total Amount</span>
                                                                <span className="text-[10px] text-muted-foreground italic">Inc. all fees and discounts</span>
                                                            </div>
                                                            <span className="text-2xl font-black text-primary">₹{Math.round(finalAmount)}</span>
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-3 dark:border-amber-900/40 dark:bg-amber-950/30">
                                        <div className="mt-0.5 text-amber-500">⚠️</div>
                                        <p className="text-xs leading-normal text-amber-700 dark:text-amber-300">
                                            By proceeding, you agree to pay the final amount for the appointment. This amount includes service charges and applicable taxes.
                                        </p>
                                    </div>
                                    </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="shrink-0 border-t bg-muted/30 p-4 sm:p-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:gap-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setBookingStep("SELECT")}
                                        className="h-12 w-full rounded-xl sm:w-auto"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handlePayToBook}
                                        disabled={isBooking}
                                        className="h-12 w-full rounded-xl font-bold shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] sm:flex-1"
                                    >
                                        {isBooking ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                                Processing...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="w-4 h-4" />
                                                Pay & Confirm
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </>
                        )}


                        {bookingStep === "SUCCESS" && bookedAppointment && (
                            <div className="min-h-0 flex-1 overflow-y-auto custom-scrollbar">
                            <PaymentSuccessUI
                                providerName={campaign.doctor.user.name}
                                appointmentDate={selectedDate}
                                appointmentTime={selectedTime!}
                                onClose={handleClose}
                                type="DOCTOR"
                            />
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
