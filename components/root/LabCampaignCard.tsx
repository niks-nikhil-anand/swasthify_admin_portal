"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MapPin, CheckCircle, FlaskConical, Clock, Beaker, Zap } from "lucide-react";
import { LabBookingModal } from "@/app/(root)/labs/[id]/components/LabBookingModal";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { LabCampaign } from "@/app/(root)/labs/types";

interface LabCampaignCardProps {
    campaign: LabCampaign;
}

export const LabCampaignCard: React.FC<LabCampaignCardProps> = ({ campaign }) => {
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const discountedPrice = campaign.discountPercentage > 0
        ? Math.round(campaign.price - (campaign.price * campaign.discountPercentage) / 100)
        : campaign.price;

    const getInitials = (name?: string) => {
        if (!name) return "LAB";
        const cleanName = name.replace(/^(Lab\.|Lab\s)/i, '').trim();
        if (!cleanName) return "LAB";
        return cleanName
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    const handleCardClick = () => {
        // 1. Analytics
        fetch("/api/analytics/collect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "event",
                data: {
                    eventType: "campaign_click",
                    eventValue: "lab",
                    path: "/",
                    campaignId: campaign.id,
                    metadata: { name: campaign.name, labId: campaign.lab.id }
                }
            })
        }).catch(console.error);

        // 2. Auth Check & Modal
        const checkAuth = async () => {
            const res = await fetch("/api/auth/me");
            if (res.ok) {
                setIsBookingModalOpen(true);
            } else {
                toast.error("Please login to book a test");
                window.location.href = "/login";
            }
        };
        checkAuth();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="h-full block pt-[60px] md:pt-[75px]"
        >
            <div onClick={handleCardClick} className="relative bg-[#F8F9F9] dark:bg-zinc-950 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-900 shadow-sm hover:shadow-xl transition-all duration-300 w-full h-full flex flex-col group pb-4 md:pb-6 cursor-pointer outline-none">
                
                {/* Top Header Shape Container */}
                <div className="absolute top-0 left-0 w-full h-[180px] pointer-events-none z-0">
                    <svg width="100%" height="180" viewBox="0 0 400 180" preserveAspectRatio="none" className="text-primary dark:text-primary/90 rounded-t-[2.5rem]">
                        <path d="M0,0 L400,0 L400,60 Q200,240 0,60 Z" fill="currentColor" />
                    </svg>
                </div>

                {/* Profile Avatar Sticking Out of Top */}
                <div className="absolute top-[-60px] md:top-[-75px] left-1/2 -translate-x-1/2 z-10 w-[120px] h-[120px] md:w-[150px] md:h-[150px]">
                    <div className="w-full h-full rounded-full border-8 border-[#F8F9F9] dark:border-zinc-950 bg-primary text-white flex items-center justify-center overflow-hidden shadow-sm">
                        {campaign.lab?.profilePhoto ? (
                            <img src={campaign.lab.profilePhoto} alt={campaign.lab.user?.name || "Lab"} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-[44px] md:text-[56px] tracking-tighter font-black">{getInitials(campaign.lab?.user?.name)}</span>
                        )}
                    </div>
                </div>

                {/* Specialization Pill */}
                <div className="absolute top-[138px] left-1/2 -translate-x-1/2 z-20">
                    <div className="bg-primary px-[24px] py-1.5 rounded-full shadow-sm border-4 border-[#F8F9F9] dark:border-zinc-950 whitespace-nowrap">
                        <span className="text-primary-foreground text-[10px] md:text-[11px] font-black uppercase tracking-[0.16em]">
                            {campaign.type.replace("_", " ")}
                        </span>
                    </div>
                </div>

                <div className="relative z-10 pt-[180px] flex flex-col items-center flex-1 w-full">

                    {/* Lab / Campaign Name */}
                    <div className="text-center px-4 lg:px-6">
                        <h3 className="font-extrabold text-[#111111] dark:text-zinc-100 text-[18px] md:text-[20px] leading-[1.3] tracking-tight text-center">
                            {campaign.lab?.user?.name || campaign.name}
                        </h3>
                        {campaign.lab?.testTypes && campaign.lab.testTypes.length > 0 && (
                            <p className="text-primary font-bold text-[13px] md:text-[14px] mt-1 uppercase tracking-wide">
                                {campaign.lab.testTypes.slice(0, 3).join(", ")}
                            </p>
                        )}
                        {campaign.lab?.user?.name && campaign.name !== campaign.lab.user.name && (
                            <p className="text-zinc-500 dark:text-zinc-400 font-semibold text-[13px] md:text-[14px] mt-0.5">
                                {campaign.name}
                            </p>
                        )}
                        <div className="flex items-center justify-center gap-1.5 mt-2 text-[#888888] font-semibold text-[13px] md:text-[14px]">
                            <MapPin className="w-4 h-4 text-[#888888]" />
                            <span className="truncate max-w-[280px]">
                                {campaign.location?.city} • {campaign.location?.address}
                            </span>
                        </div>
                    </div>

                    {/* Divider line mimicking exactly the screenshot's faint line */}
                    <div className="w-full px-4 lg:px-8 mt-7 mb-5">
                        <div className="w-full h-px bg-zinc-200/60 dark:bg-zinc-800" />
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between w-full px-2 lg:px-8 text-center">
                        <div className="flex flex-col flex-1 items-center">
                            <span className="font-black text-[22px] md:text-[26px] text-[#111111] dark:text-zinc-100 leading-none">
                                {campaign.lab?.testTypes?.length || 5}+
                            </span>
                            <span className="text-[11px] font-semibold text-[#A0A0A0] dark:text-zinc-400 uppercase tracking-wide mt-2.5">
                                Tests
                            </span>
                        </div>
                        <div className="w-px h-12 bg-zinc-200/60 dark:bg-zinc-800" />
                        <div className="flex flex-col flex-1 items-center">
                            <span className="font-black text-[22px] md:text-[26px] text-[#111111] dark:text-zinc-100 leading-none">
                                5k+
                            </span>
                            <span className="text-[11px] font-semibold text-[#A0A0A0] dark:text-zinc-400 uppercase tracking-wide mt-2.5">
                                Patients
                            </span>
                        </div>
                        <div className="w-px h-12 bg-zinc-200/60 dark:bg-zinc-800" />
                        <div className="flex flex-col flex-1 items-center">
                            <span className="font-black text-[22px] md:text-[26px] text-[#111111] dark:text-zinc-100 leading-none flex items-center justify-center gap-[0.5px]">
                                <span className="text-[20px] mb-0.5">★</span>
                                {campaign.lab?.averageRating ? campaign.lab.averageRating.toFixed(1) : "4.8"}
                            </span>
                            <span className="text-[11px] font-semibold text-[#A0A0A0] dark:text-zinc-400 uppercase tracking-wide mt-2.5">
                                Rating
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-1.5 lg:gap-3 w-full px-2 lg:px-4 mt-8 md:mt-10">
                        <div className="bg-primary/10 px-3 md:px-4 py-2 rounded-full flex items-center gap-2 shadow-[0_2px_10px_-4px_rgba(13,169,110,0.1)] dark:shadow-none transition-transform hover:scale-105">
                            <span className="text-primary text-xs">★</span>
                            <span className="text-primary text-[10px] md:text-[11px] lg:text-[12px] font-black uppercase tracking-wide">
                                Lab Test
                            </span>
                        </div>
                        <div className="bg-[#F2F2F2] dark:bg-zinc-800/80 px-3 md:px-4 py-2 rounded-full flex items-center gap-2 transition-transform hover:scale-105">
                            <span className="text-amber-500 text-xs">⚡</span>
                            <span className="text-[#333333] dark:text-zinc-300 text-[10px] md:text-[11px] lg:text-[12px] font-black uppercase tracking-wide">
                                Fast Booking
                            </span>
                        </div>
                        {((campaign as any).isVerified !== false) && (
                            <div className="bg-primary/10 px-3 md:px-4 py-2 rounded-full flex items-center gap-2 shadow-[0_2px_10px_-4px_rgba(13,169,110,0.1)] dark:shadow-none transition-transform hover:scale-105">
                                <span className="text-primary text-[11px]">✔</span>
                                <span className="text-primary text-[10px] md:text-[11px] lg:text-[12px] font-black uppercase tracking-wide">
                                    Verified
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Bottom CTA block */}
                    <div className="w-full px-2 lg:px-6 pt-8 mt-auto">
                        <div className="block">
                            <div className="relative overflow-hidden w-full h-[65px] md:h-[75px] rounded-[18px] md:rounded-[20px] border border-zinc-200/60 dark:border-zinc-800/60 bg-[#FFFFFF] dark:bg-zinc-950 flex items-center shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] dark:shadow-none transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-[0_8px_30px_-5px_rgba(13,169,110,0.15)] group/cta">

                                {/* Very faint text Background */}
                                <div className="absolute left-4 lg:left-8 top-[48%] -translate-y-1/2 flex flex-col justify-center pointer-events-none md:gap-0.5 z-0">
                                    <span className="text-[#F6F7F8] dark:text-zinc-800/30 font-black uppercase text-[22px] lg:text-[30px] leading-[0.8] tracking-[0.05em] whitespace-nowrap origin-left transition-transform duration-500 group-hover/cta:translate-x-1">
                                        Book
                                    </span>
                                    <span className="text-[#F6F7F8] dark:text-zinc-800/30 font-black uppercase text-[22px] lg:text-[30px] leading-[0.8] tracking-[0.05em] whitespace-nowrap origin-left transition-transform duration-500 group-hover/cta:translate-x-1">
                                        Test
                                    </span>
                                </div>

                                    {/* Vibrant Price Box */}
                                <div className="ml-auto flex items-center gap-1.5 lg:gap-3 relative z-10 pointer-events-none pr-1.5 lg:pr-3">
                                    {campaign.discountPercentage > 0 && (
                                        <div className="flex flex-col items-end mr-0.5 lg:mr-2">
                                            <span className="text-primary text-[9px] md:text-[10px] font-black uppercase tracking-wider bg-primary/10 px-1.5 py-0.5 rounded-sm mb-0.5 whitespace-nowrap">
                                                {campaign.discountPercentage}% OFF
                                            </span>
                                            <span className="text-zinc-400 dark:text-zinc-500 line-through text-[11px] md:text-xs font-bold whitespace-nowrap">
                                                ₹{campaign.price}
                                            </span>
                                        </div>
                                    )}
                                    <div className="bg-primary text-white font-black text-[16px] xl:text-[24px] px-3 md:px-4 lg:px-7 py-1.5 md:py-2 rounded-[12px] shadow-[0_6px_16px_rgba(13,169,110,0.25)] flex flex-col items-center justify-center leading-none">
                                        {campaign.price === 0 ? "FREE" : `₹${discountedPrice}`}
                                    </div>
                                    <div className="text-zinc-200 dark:text-zinc-700 mr-1 md:mr-2 transition-transform duration-300 group-hover/cta:translate-x-1.5">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lg:w-6 lg:h-6">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <LabBookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                campaign={campaign}
            />
        </motion.div>
    );
};
