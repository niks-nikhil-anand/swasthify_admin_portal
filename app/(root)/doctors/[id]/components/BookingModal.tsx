"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, Clock, ChevronRight, Check, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Campaign } from "../../types";
import { format, addDays, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

import { toast } from "sonner";
import { loadRazorpay, openRazorpayCheckout } from "@/utils/razorpay-client";
import { PaymentSuccessUI } from "@/components/root/PaymentSuccessUI";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    campaign: Campaign;
}

const timeCategories = [
    { id: "morning", label: "Morning", range: "10AM - 12PM", icon: "🌅" },
    { id: "afternoon", label: "Afternoon", range: "12PM - 4PM", icon: "☀️" },
    { id: "evening", label: "Evening", range: "4PM - 9PM", icon: "🌆" },
];

const timeSlotsData: Record<string, string[]> = {
    morning: ["10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM"],
    afternoon: ["12:00 PM - 1:00 PM", "1:00 PM - 2:00 PM", "3:00 PM - 4:00 PM"],
    evening: ["4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM", "6:00 PM - 7:00 PM", "7:00 PM - 8:00 PM", "8:00 PM - 9:00 PM"],
};

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, campaign }) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isBooking, setIsBooking] = useState(false);
    const [bookingStep, setBookingStep] = useState<"SELECT" | "REVIEW" | "PAYMENT" | "SUCCESS">("SELECT");
    const [bookedAppointment, setBookedAppointment] = useState<any>(null);
    const [platformFees, setPlatformFees] = useState<any[]>([]);

    useEffect(() => {
        const fetchPlatformFees = async () => {
            try {
                const res = await fetch("/api/public/platform-fee");
                if (res.ok) {
                    const data = await res.json();
                    setPlatformFees(data);
                }
            } catch (err) {
                console.error("Error fetching platform fees:", err);
            }
        };
        fetchPlatformFees();
    }, []);

    // Generate next 7 days
    const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

    const handlePayToBook = async () => {
        if (!selectedTime) return;

        setIsBooking(true);
        try {
            // 1. Create Appointment (Reserved)
            const response = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "DOCTOR",
                    organizerId: campaign.id,
                    date: selectedDate,
                    timeSlot: selectedTime,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to book appointment");
            }

            const appointment = data.appointment;
            setBookedAppointment(appointment);

            // 2. Initiate Payment Immediately
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                toast.error("Failed to load payment gateway. Please check your internet.");
                return;
            }

            const orderRes = await fetch("/api/payments/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ appointmentId: appointment.id }),
            });

            const orderData = await orderRes.json();
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
                        setIsBooking(false);
                        toast.info("Payment cancelled. Your appointment is not yet confirmed.");
                    }
                },
                handler: async (response: any) => {
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
                            toast.error(verifyData.error || "Payment verification failed");
                        }
                    } catch (err) {
                        toast.error("Something went wrong during verification");
                    } finally {
                        setIsBooking(false);
                    }
                },
            };

            openRazorpayCheckout(options);

        } catch (error: any) {
            console.error("Booking/Payment error:", error);
            toast.error(error.message || "Something went wrong. Please try again.");
            setIsBooking(false);
        }
    };

    const handleClose = () => {
        setBookingStep("SELECT");
        setBookedAppointment(null);
        setSelectedTime(null);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-background rounded-3xl shadow-2xl border border-border overflow-hidden"
                    >
                        {bookingStep === "SELECT" && (
                            <>
                                {/* Header */}
                                <div className="p-6 border-b bg-muted/30">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-bold text-foreground">Book Appointment</h2>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleClose}
                                            className="rounded-full hover:bg-muted"
                                        >
                                            <X className="w-5 h-5" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <CalendarIcon className="w-6 h-6" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-foreground truncate">
                                                Dr. {campaign.doctor.user.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {campaign.doctor.specializations.map((s: { name: string }) => s.name).join(", ")}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                    {/* Date Selection */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Select Date</h3>
                                            <span className="text-xs font-medium text-primary bg-primary/5 px-2 py-1 rounded-full">
                                                {format(selectedDate, "MMMM yyyy")}
                                            </span>
                                        </div>
                                        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-2 px-2">
                                            {dates.map((date) => {
                                                const isSelected = isSameDay(date, selectedDate);
                                                return (
                                                    <button
                                                        key={date.toISOString()}
                                                        onClick={() => setSelectedDate(date)}
                                                        className={cn(
                                                            "flex flex-col items-center justify-center min-w-[70px] h-[86px] rounded-2xl transition-all duration-300 border-2",
                                                            isSelected
                                                                ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                                                                : "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted hover:border-border"
                                                        )}
                                                    >
                                                        <span className="text-xs font-bold uppercase mb-1 opacity-80">
                                                            {format(date, "EEE")}
                                                        </span>
                                                        <span className="text-xl font-extrabold tracking-tight">
                                                            {format(date, "d")}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Time Category Selection */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Arrival Time Frame</h3>
                                        <div className="grid grid-cols-3 gap-3">
                                            {timeCategories.map((cat) => {
                                                const isSelected = selectedCategory === cat.id;
                                                return (
                                                    <button
                                                        key={cat.id}
                                                        onClick={() => {
                                                            setSelectedCategory(cat.id);
                                                            setSelectedTime(null);
                                                        }}
                                                        className={cn(
                                                            "flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 border-2",
                                                            isSelected
                                                                ? "bg-primary/5 border-primary shadow-sm"
                                                                : "bg-muted/30 border-transparent hover:bg-muted/50 hover:border-border"
                                                        )}
                                                    >
                                                        <span className="text-xl mb-1">{cat.icon}</span>
                                                        <span className={cn(
                                                            "text-xs font-bold",
                                                            isSelected ? "text-primary" : "text-foreground"
                                                        )}>{cat.label}</span>
                                                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">{cat.range}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Detailed Time Slots */}
                                    <AnimatePresence mode="wait">
                                        {selectedCategory && (
                                            <motion.div
                                                key={selectedCategory}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="space-y-4"
                                            >
                                                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Select Slot</h3>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {timeSlotsData[selectedCategory].map((time) => {
                                                        const isSelected = selectedTime === time;
                                                        return (
                                                            <button
                                                                key={time}
                                                                onClick={() => setSelectedTime(time)}
                                                                className={cn(
                                                                    "flex items-center justify-center p-3 rounded-xl transition-all duration-200 border-2 text-sm font-semibold",
                                                                    isSelected
                                                                        ? "bg-primary border-primary text-primary-foreground shadow-md"
                                                                        : "bg-muted/20 border-border/50 text-muted-foreground hover:border-primary/30 hover:bg-muted/40"
                                                                )}
                                                            >
                                                                {time}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Footer */}
                                <div className="p-6 bg-muted/30 border-t flex items-center gap-4">
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Booking for</p>
                                        <p className="text-sm font-bold text-foreground">
                                            {format(selectedDate, "EEE, MMM d")}
                                            {selectedTime && <span className="text-primary ml-1 truncate block sm:inline">• {selectedTime}</span>}
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => setBookingStep("REVIEW")}
                                        disabled={!selectedTime || isBooking}
                                        className="px-8 h-12 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        Proceed to Review
                                    </Button>
                                </div>
                            </>
                        )}


                        {bookingStep === "REVIEW" && (
                            <>
                                {/* Header */}
                                <div className="p-6 border-b bg-muted/30">
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

                                <div className="p-6 space-y-6">
                                    {/* Appointment Info Summary */}
                                    <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 text-xl">
                                            🩺
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">Dr. {campaign.doctor.user.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {format(selectedDate, "EEEE, MMMM do")} • {selectedTime}
                                            </p>
                                        </div>
                                    </div>

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

                                    <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                                        <div className="text-amber-500 mt-0.5">⚠️</div>
                                        <p className="text-xs text-amber-700 leading-normal">
                                            By proceeding, you agree to pay the final amount for the appointment. This amount includes service charges and applicable taxes.
                                        </p>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="p-6 bg-muted/30 border-t flex items-center gap-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setBookingStep("SELECT")}
                                        className="rounded-xl h-12"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handlePayToBook}
                                        disabled={isBooking}
                                        className="flex-1 h-12 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
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
                            <PaymentSuccessUI
                                providerName={campaign.doctor.user.name}
                                appointmentDate={selectedDate}
                                appointmentTime={selectedTime!}
                                onClose={handleClose}
                                type="DOCTOR"
                            />
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
