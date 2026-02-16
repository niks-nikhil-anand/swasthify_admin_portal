"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MapPin, Stethoscope, User, CheckCircle, Clock, Sparkles, ChevronRight, Share2, Heart, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BookingModal } from "@/app/(root)/doctors/[id]/components/BookingModal";
import { toast } from "sonner";

import { Campaign } from "@/app/(root)/doctors/types";

interface CampaignCardProps {
    campaign: Campaign;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const discountedPrice = campaign.discountPercentage > 0
        ? Math.round(campaign.price - (campaign.price * campaign.discountPercentage) / 100)
        : campaign.price;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -12 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="h-full"
        >
            <Card className="group relative h-full overflow-hidden border border-emerald-500/10 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(5,150,105,0.2)] transition-all duration-700 md:rounded-[3rem] rounded-2xl flex flex-col">
                {/* Visual Flair: Animated Border Gradient */}
                <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 via-transparent to-primary/5 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Floating Badge: Verification */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10 flex gap-2">
                    {campaign.isVerified && (
                        <div className="bg-emerald-500/10 backdrop-blur-md p-1.5 rounded-full border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                            <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-emerald-500 fill-emerald-500/20" />
                        </div>
                    )}
                </div>

                <CardHeader className="p-5 md:p-8 md:pb-4 pb-2 space-y-4 md:space-y-6 relative">
                    <div className="hidden md:flex items-center gap-3">
                        <Badge
                            variant="outline"
                            className="border-primary/20 bg-primary/5 text-primary uppercase text-[10px] tracking-[0.15em] font-black px-4 py-1.5 rounded-full"
                        >
                            <Sparkles className="w-3 h-3 mr-1.5" />
                            {campaign.type.replace("_", " ")}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                            <Clock className="w-3.5 h-3.5 text-emerald-500" />
                            Fast Booking
                        </div>
                    </div>

                    <div className="space-y-2 md:space-y-3">
                        <h3 className="font-black text-xl md:text-2xl lg:text-3xl text-zinc-900 dark:text-white line-clamp-1 md:line-clamp-2 leading-[1.1] tracking-tight group-hover:text-emerald-500 transition-colors duration-300">
                            {campaign.name}
                        </h3>
                        <div className="flex items-center text-xs md:text-sm text-zinc-500 font-bold tracking-tight">
                            <div className="bg-emerald-500/10 p-1 md:p-1.5 rounded-lg mr-2 md:mr-3">
                                <MapPin className="w-3 h-3 md:w-4 md:h-4 text-emerald-600" />
                            </div>
                            <span className="line-clamp-1 opacity-80 uppercase text-[10px] md:text-[11px] tracking-wider font-extrabold">
                                {campaign.location?.city || "Visit Clinic"} • {campaign.location?.address}
                            </span>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-5 md:px-8 md:pb-8 pb-4 flex-1 flex flex-col justify-between md:space-y-8 space-y-4">
                    <div className="relative hidden md:block">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed font-medium italic opacity-70 border-l-2 border-emerald-500/20 pl-4">
                            "{campaign.description || "Experience gold-standard healthcare with our leading specialist. Tailored medical guidance, advanced diagnostics, and compassionate treatment plans."}"
                        </p>
                    </div>

                    {/* Premium Doctor Profile Card */}
                    <div className="relative group/profile overflow-hidden p-3 md:p-5 rounded-2xl md:rounded-[2rem] bg-linear-to-br from-zinc-50/50 to-white dark:from-zinc-900/50 dark:to-zinc-900 border border-zinc-100 dark:border-zinc-800/50 shadow-sm group-hover:shadow-lg transition-all duration-500">
                        <div className="flex items-center md:gap-5 gap-3 relative z-10">
                            <div className="relative shrink-0">
                                <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center overflow-hidden border-2 border-zinc-50 dark:border-zinc-800 shadow-md group-hover/profile:border-emerald-500/30 transition-all transform group-hover/profile:rotate-3 duration-500">
                                    {campaign.doctor.profilePhoto ? (
                                        <img
                                            src={campaign.doctor.profilePhoto}
                                            alt={campaign.doctor.user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-emerald-500/10 flex items-center justify-center">
                                            <User className="md:w-8 md:h-8 w-5 h-5 text-emerald-500" />
                                        </div>
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 md:p-1 rounded-full shadow-lg border-2 border-white dark:border-zinc-900">
                                    <Stethoscope className="md:w-3 md:h-3 w-2.5 h-2.5" />
                                </div>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm md:text-base font-black text-zinc-900 dark:text-white truncate">
                                    Dr. {campaign.doctor.user.name}
                                </p>
                                <p className="text-[9px] md:text-[11px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest opacity-80 mt-0.5 truncate">
                                    {campaign.doctor.specializations.map(s => s.name).join(", ") || "Chief Consultant"}
                                </p>
                            </div>
                        </div>
                        {/* Interactive Sparkle Effect on Hover */}
                        <div className="absolute -inset-2 bg-linear-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 -translate-x-full group-hover/profile:translate-x-full transition-transform duration-1000 ease-in-out" />
                    </div>
                </CardContent>

                <CardFooter className="px-5 md:px-8 md:py-8 py-4 pt-0 mt-auto bg-linear-to-t from-emerald-500/2 to-transparent">
                    <div className="flex items-center justify-between w-full md:p-6 md:py-5 p-4 bg-white dark:bg-zinc-900 rounded-2xl md:rounded-[2.2rem] border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/20 dark:shadow-none group-hover:scale-[1.02] transition-transform duration-500">
                        <div className="flex flex-col">
                            <span className="text-[8px] md:text-[10px] text-zinc-400 uppercase tracking-widest font-black opacity-60">Consultation</span>
                            <div className="flex items-baseline gap-1 md:gap-2 mt-0.5 md:mt-1">
                                <span className="text-lg md:text-2xl font-black text-zinc-900 dark:text-white tabular-nums">
                                    {campaign.price === 0 ? "FREE" : `₹${discountedPrice}`}
                                </span>
                                {campaign.discountPercentage > 0 && (
                                    <span className="text-[9px] md:text-[11px] text-zinc-400 line-through tabular-nums font-bold">
                                        ₹{campaign.price}
                                    </span>
                                )}
                            </div>
                        </div>
                        <Button
                            size="lg"
                            className="bg-zinc-900 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-lg shadow-zinc-200/50 dark:shadow-emerald-500/20 rounded-xl md:rounded-2xl md:gap-3 gap-2 px-4 md:px-6 md:h-12 h-10 font-black text-[10px] md:text-xs uppercase tracking-widest transition-all hover:gap-5"
                            onClick={() => {
                                // 1. Analytics
                                fetch("/api/analytics/collect", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        type: "event",
                                        data: {
                                            eventType: "campaign_click",
                                            eventValue: "doctor",
                                            path: "/",
                                            campaignId: campaign.id,
                                            metadata: { name: campaign.name, doctorId: campaign.doctor.id }
                                        }
                                    })
                                }).catch(console.error);

                                // 2. Auth Check & Modal
                                const checkAuth = async () => {
                                    const res = await fetch("/api/auth/me");
                                    if (res.ok) {
                                        setIsBookingModalOpen(true);
                                    } else {
                                        toast.error("Please login to book an appointment");
                                        window.location.href = "/login";
                                    }
                                };
                                checkAuth();
                            }}
                        >
                            Pay Now
                            <Zap className="w-4 h-4" />
                        </Button>
                    </div>
                </CardFooter>
                <BookingModal
                    isOpen={isBookingModalOpen}
                    onClose={() => setIsBookingModalOpen(false)}
                    campaign={campaign}
                />
            </Card>
        </motion.div>
    );
};
