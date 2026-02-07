"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, Clock, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Campaign } from "../../types";
import { format, addDays, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    campaign: Campaign;
}

const timeSlots = [
    { id: "morning", label: "Morning", period: "9:00 AM - 12:00 PM", icon: "🌅" },
    { id: "afternoon", label: "Afternoon", period: "12:00 PM - 4:00 PM", icon: "☀️" },
    { id: "evening", label: "Evening", period: "4:00 PM - 8:00 PM", icon: "🌆" },
];

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, campaign }) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    // Generate next 7 days
    const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

    const handleConfirm = () => {
        if (!selectedSlot) return;
        // Logic will be added here later
        console.log("Booking confirmed for:", selectedDate, selectedSlot);
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
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-background rounded-3xl shadow-2xl border border-border overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b bg-muted/30">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-foreground">Book Appointment</h2>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClose}
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

                        <div className="p-6 space-y-8">
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

                            {/* Time Slot Selection */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Arrival Time Frame</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {timeSlots.map((slot) => {
                                        const isSelected = selectedSlot === slot.id;
                                        return (
                                            <button
                                                key={slot.id}
                                                onClick={() => setSelectedSlot(slot.id)}
                                                className={cn(
                                                    "flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border-2 group",
                                                    isSelected
                                                        ? "bg-primary/5 border-primary shadow-sm"
                                                        : "bg-muted/30 border-transparent hover:bg-muted/50 hover:border-border"
                                                )}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <span className="text-2xl">{slot.icon}</span>
                                                    <div className="text-left">
                                                        <p className={cn(
                                                            "font-bold text-sm",
                                                            isSelected ? "text-primary" : "text-foreground"
                                                        )}>
                                                            {slot.label}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {slot.period}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className={cn(
                                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                                                    isSelected
                                                        ? "bg-primary border-primary text-primary-foreground"
                                                        : "bg-background border-border group-hover:border-primary/50"
                                                )}>
                                                    {isSelected && <Check className="w-4 h-4" />}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-muted/30 border-t flex items-center gap-4">
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Booking for</p>
                                <p className="text-sm font-bold text-foreground">
                                    {format(selectedDate, "EEE, MMM d")}
                                    {selectedSlot && <span className="text-primary ml-1">• {timeSlots.find(s => s.id === selectedSlot)?.label}</span>}
                                </p>
                            </div>
                            <Button
                                onClick={handleConfirm}
                                disabled={!selectedSlot}
                                className="px-8 h-12 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Book Now
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
