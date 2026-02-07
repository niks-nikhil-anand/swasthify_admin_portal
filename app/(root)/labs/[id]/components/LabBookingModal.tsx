"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LabCampaign } from "../../types";
import { format, addDays, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

interface LabBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    campaign: LabCampaign;
}

const timeCategories = [
    { id: "morning", label: "Morning", range: "10AM - 12PM", icon: "🌅" },
    { id: "afternoon", label: "Afternoon", range: "12PM - 4PM", icon: "☀️" },
    { id: "evening", label: "Evening", range: "4PM - 9PM", icon: "🌆" },
];

const timeSlotsData: Record<string, string[]> = {
    morning: ["10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM"],
    afternoon: ["12:00 PM - 1:00 PM", "1:00 PM - 2:00 PM", "2:00 PM - 3:00 PM", "3:00 PM - 4:00 PM"],
    evening: ["4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM", "6:00 PM - 7:00 PM", "7:00 PM - 8:00 PM", "8:00 PM - 9:00 PM"],
};

export const LabBookingModal: React.FC<LabBookingModalProps> = ({ isOpen, onClose, campaign }) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // Generate next 7 days
    const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

    const handleConfirm = () => {
        if (!selectedTime) return;
        console.log("Lab Booking confirmed for:", selectedDate, selectedTime);
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
                                <h2 className="text-xl font-bold text-foreground">Book Lab Test</h2>
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
                                        {campaign.lab.user.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {campaign.name}
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
                                onClick={handleConfirm}
                                disabled={!selectedTime}
                                className="px-8 h-12 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Book
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
