"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Calendar, Clock, CreditCard, Share2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface PaymentSuccessUIProps {
    doctorName: string;
    appointmentDate: Date;
    appointmentTime: string;
    onClose: () => void;
}

export const PaymentSuccessUI: React.FC<PaymentSuccessUIProps> = ({
    doctorName,
    appointmentDate,
    appointmentTime,
    onClose,
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in fade-in zoom-in duration-500">
            {/* Animated Success Icon */}
            <div className="relative">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200 }}
                    className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-200"
                >
                    <Check className="w-12 h-12 text-white" />
                </motion.div>
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute inset-0 bg-green-500 rounded-full"
                />
            </div>

            <div className="space-y-2">
                <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Appointment Complete!</h2>
                <p className="text-muted-foreground font-medium">Your payment was successful and your slot is confirmed.</p>
            </div>

            {/* Summary Card */}
            <div className="w-full bg-muted/30 rounded-3xl p-6 border border-border/50 space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Check className="w-24 h-24" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-left relative z-10">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                            <CreditCard className="w-3 h-3" /> Paid Successfully
                        </p>
                        <p className="text-sm font-bold text-foreground truncate">Consultation Fee</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" /> Date & Time
                        </p>
                        <p className="text-sm font-bold text-foreground">
                            {format(appointmentDate, "MMM d, yyyy")} • {appointmentTime.split(" - ")[0]}
                        </p>
                    </div>
                </div>

                <div className="pt-4 border-t border-border/50 text-left">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Provider</p>
                    <p className="text-lg font-bold text-primary">Dr. {doctorName}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 w-full gap-3 pt-4">
                <Button
                    onClick={onClose}
                    className="h-14 rounded-2xl font-bold bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                >
                    Done
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                    variant="ghost"
                    className="h-12 rounded-2xl font-semibold text-muted-foreground hover:bg-muted/50"
                >
                    <Share2 className="mr-2 w-4 h-4" /> Share Receipt
                </Button>
            </div>

            <p className="text-xs text-muted-foreground">
                A confirmation email has been sent to your registered address.
            </p>
        </div>
    );
};
