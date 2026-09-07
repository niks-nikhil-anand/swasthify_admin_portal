"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import { Campaign } from "@/app/(root)/doctors/types";
export type { Campaign };

interface CampaignCardProps {
    campaign: Campaign;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
    const discountedPrice = campaign.discountPercentage > 0
        ? Math.round(campaign.price - (campaign.price * campaign.discountPercentage) / 100)
        : campaign.price;

    const getInitials = (name?: string) => {
        if (!name) return "MK";
        const cleanName = name.replace(/^(Dr\.|Dr\s)/i, '').trim();
        if (!cleanName) return "MK";
        return cleanName
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="block h-full pt-[42px] sm:pt-[52px] md:pt-[62px] lg:pt-[75px]"
        >
            <Link href={`/doctors/${campaign.id}`} aria-label={`View details and book an appointment with ${campaign.doctorName || campaign.doctor?.user?.name || campaign.name}`} className="group relative flex h-full w-full cursor-pointer flex-col rounded-[1.75rem] border border-zinc-100 bg-[#F8F9F9] pb-4 text-left shadow-sm transition-all duration-300 hover:shadow-xl dark:border-zinc-900 dark:bg-zinc-950 sm:rounded-[2rem] md:rounded-[2.25rem] md:pb-5 lg:rounded-[2.5rem] lg:pb-6">
                
                {/* Top Header Shape Container */}
                <div className="pointer-events-none absolute left-0 top-0 z-0 h-[150px] w-full sm:h-[165px] md:h-[175px] lg:h-[180px]">
                    <svg width="100%" height="100%" viewBox="0 0 400 180" preserveAspectRatio="none" className="rounded-t-[1.75rem] text-primary dark:text-primary/90 sm:rounded-t-[2rem] md:rounded-t-[2.25rem] lg:rounded-t-[2.5rem]">
                        <path d="M0,0 L400,0 L400,60 Q200,240 0,60 Z" fill="currentColor" />
                    </svg>
                </div>

                {/* Profile Avatar Sticking Out of Top */}
                <div className="absolute left-1/2 top-[-46px] z-10 h-[92px] w-[92px] -translate-x-1/2 sm:top-[-54px] sm:h-[108px] sm:w-[108px] md:top-[-62px] md:h-[124px] md:w-[124px] lg:top-[-75px] lg:h-[150px] lg:w-[150px]">
                    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-[5px] border-[#F8F9F9] bg-primary text-white shadow-sm dark:border-zinc-950 sm:border-[6px] lg:border-8">
                        {campaign.doctorImage || campaign.doctor?.profilePhoto ? (
                            <img src={campaign.doctorImage || campaign.doctor?.profilePhoto || ""} alt={campaign.doctorName || campaign.doctor?.user?.name || "Doctor"} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-[34px] font-black tracking-tighter sm:text-[40px] md:text-[46px] lg:text-[56px]">{getInitials(campaign.doctorName || campaign.doctor?.user?.name)}</span>
                        )}
                    </div>
                </div>

                {/* Specialization Pill - Kept above the content with responsive clearance */}
                <div className="absolute left-1/2 top-[112px] z-20 -translate-x-1/2 sm:top-[125px] md:top-[138px]">
                    <div className="whitespace-nowrap rounded-full border-[3px] border-[#F8F9F9] bg-primary px-4 py-1.5 shadow-sm dark:border-zinc-950 sm:border-4 sm:px-5">
                        <span className="text-[9px] font-black uppercase tracking-[0.14em] text-primary-foreground sm:text-[10px] md:text-[11px] md:tracking-[0.16em]">
                            {campaign.specialisation || campaign.doctor?.specializations?.[0]?.name || campaign.type.replace("_", " ")}
                        </span>
                    </div>
                </div>

                <div className="relative z-10 flex w-full flex-1 flex-col items-center pt-[166px] sm:pt-[176px] md:pt-[188px] lg:pt-[180px]">

                    {/* Doctor / Hospital Name */}
                    <div className="w-full px-3 text-center sm:px-4 lg:px-6">
                        {(() => {
                            const rawDocName = campaign.doctorName || campaign.doctor?.user?.name;
                            const specialties = campaign.specialisation || campaign.doctor?.specializations?.map(s => s.name).join(", ");
                            const orgName = campaign.doctor?.hospitalName || campaign.doctor?.clinicName || campaign.name;

                            if (rawDocName) {
                                const formattedDocName = rawDocName.startsWith("Dr.") ? rawDocName : `Dr. ${rawDocName}`;
                                return (
                                    <>
                                        <h3 className="line-clamp-2 text-[16px] font-extrabold leading-[1.25] tracking-tight text-[#111111] dark:text-zinc-100 sm:text-[18px] md:text-[20px] md:leading-[1.3]">
                                            {formattedDocName}
                                        </h3>
                                        {specialties && (
                                            <p className="mt-1 line-clamp-1 text-[11px] font-bold uppercase tracking-wide text-primary sm:text-[13px] md:text-[14px]">
                                                {specialties}
                                            </p>
                                        )}
                                        {orgName && (
                                            <p className="mt-0.5 line-clamp-1 text-[12px] font-semibold text-zinc-500 dark:text-zinc-400 sm:text-[13px] md:text-[14px]">
                                                {orgName}
                                            </p>
                                        )}
                                    </>
                                );
                            } else {
                                return (
                                    <>
                                        <h3 className="line-clamp-2 text-[16px] font-extrabold leading-[1.25] tracking-tight text-[#111111] dark:text-zinc-100 sm:text-[18px] md:text-[20px] md:leading-[1.3]">
                                            {orgName}
                                        </h3>
                                        {specialties && (
                                            <p className="mt-1 line-clamp-1 text-[11px] font-bold uppercase tracking-wide text-primary sm:text-[13px] md:text-[14px]">
                                                {specialties}
                                            </p>
                                        )}
                                    </>
                                );
                            }
                        })()}
                        <div className="mt-2 flex items-center justify-center gap-1.5 text-[12px] font-semibold text-[#888888] sm:text-[13px] md:text-[14px]">
                            <MapPin className="w-4 h-4 text-[#888888]" />
                            <span title={`${campaign.location?.city || ""} • ${campaign.location?.address || ""}`} className="max-w-[75vw] truncate sm:max-w-[280px]">
                                {campaign.location?.city} • {campaign.location?.address}
                            </span>
                        </div>
                    </div>

                    {/* Divider line mimicking exactly the screenshot's faint line */}
                    <div className="mb-4 mt-5 w-full px-3 sm:mt-6 sm:px-5 md:mb-5 md:mt-7 lg:px-8">
                        <div className="w-full h-[1px] bg-zinc-200/60 dark:bg-zinc-800" />
                    </div>

                    {/* Stats Row */}
                    <div className="flex w-full items-center justify-between px-2 text-center sm:px-4 lg:px-8">
                        <div className="flex flex-col flex-1 items-center">
                            <span className="text-[20px] font-black leading-none text-[#111111] dark:text-zinc-100 sm:text-[22px] md:text-[26px]">
                                {campaign.doctorExperience !== undefined && campaign.doctorExperience !== null ? campaign.doctorExperience : (campaign.doctor?.experienceYears || 0)}+
                            </span>
                            <span className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-[#A0A0A0] dark:text-zinc-400 sm:text-[11px] md:mt-2.5">
                                Yrs Exp.
                            </span>
                        </div>
                        <div className="h-10 w-px bg-zinc-200/60 dark:bg-zinc-800 sm:h-12" />
                        <div className="flex flex-col flex-1 items-center">
                            <span className="text-[20px] font-black leading-none text-[#111111] dark:text-zinc-100 sm:text-[22px] md:text-[26px]">
                                5k+
                            </span>
                            <span className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-[#A0A0A0] dark:text-zinc-400 sm:text-[11px] md:mt-2.5">
                                Patients
                            </span>
                        </div>
                        <div className="h-10 w-px bg-zinc-200/60 dark:bg-zinc-800 sm:h-12" />
                        <div className="flex flex-col flex-1 items-center">
                            <span className="flex items-center justify-center gap-[0.5px] text-[20px] font-black leading-none text-[#111111] dark:text-zinc-100 sm:text-[22px] md:text-[26px]">
                                <span className="mb-0.5 text-[18px] sm:text-[20px]">★</span>
                                {campaign.doctor?.averageRating ? campaign.doctor.averageRating.toFixed(1) : "4.8"}
                            </span>
                            <span className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-[#A0A0A0] dark:text-zinc-400 sm:text-[11px] md:mt-2.5">
                                Rating
                            </span>
                        </div>
                    </div>

                    {/* Feature Pills */}
                    <div className="mt-6 flex w-full flex-wrap items-center justify-center gap-1.5 px-2 sm:mt-8 sm:gap-2 lg:mt-10 lg:gap-3 lg:px-4">
                        <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-2 shadow-[0_2px_10px_-4px_rgba(13,169,110,0.1)] transition-transform hover:scale-105 dark:shadow-none sm:gap-2 sm:px-3 md:px-4">
                            <span className="text-primary text-xs">★</span>
                            <span className="text-[9px] font-black uppercase tracking-wide text-primary sm:text-[10px] md:text-[11px] lg:text-[12px]">
                                OPD
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-full bg-[#F2F2F2] px-2.5 py-2 transition-transform hover:scale-105 dark:bg-zinc-800/80 sm:gap-2 sm:px-3 md:px-4">
                            <span className="text-amber-500 text-xs">⚡</span>
                            <span className="text-[9px] font-black uppercase tracking-wide text-[#333333] dark:text-zinc-300 sm:text-[10px] md:text-[11px] lg:text-[12px]">
                                Fast Booking
                            </span>
                        </div>
                        {campaign.isVerified !== false && (
                            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-2 shadow-[0_2px_10px_-4px_rgba(13,169,110,0.1)] transition-transform hover:scale-105 dark:shadow-none sm:gap-2 sm:px-3 md:px-4">
                                <span className="text-primary text-[11px]">✔</span>
                                <span className="text-[9px] font-black uppercase tracking-wide text-primary sm:text-[10px] md:text-[11px] lg:text-[12px]">
                                    Verified
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Bottom CTA block */}
                    <div className="mt-auto w-full px-2 pt-6 sm:pt-7 lg:px-6 lg:pt-8">
                        <div className="block">
                            <div className="group/cta relative flex h-[58px] w-full items-center overflow-hidden rounded-[16px] border border-zinc-200/60 bg-[#FFFFFF] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-[0_8px_30px_-5px_rgba(13,169,110,0.15)] dark:border-zinc-800/60 dark:bg-zinc-950 dark:shadow-none sm:h-[65px] md:h-[75px] md:rounded-[20px]">

                                {/* Very faint text Background */}
                                <div className="pointer-events-none absolute left-3 top-[48%] z-0 flex -translate-y-1/2 flex-col justify-center sm:left-4 lg:left-8">
                                    <span className="whitespace-nowrap text-[19px] font-black uppercase leading-[0.8] tracking-[0.05em] text-zinc-200 transition-transform duration-500 group-hover/cta:translate-x-1 dark:text-zinc-800/50 sm:text-[22px] lg:text-[30px]">
                                        View Details
                                    </span>
                                    <span className="whitespace-nowrap text-[19px] font-black uppercase leading-[0.8] tracking-[0.05em] text-zinc-200 transition-transform duration-500 group-hover/cta:translate-x-1 dark:text-zinc-800/50 sm:text-[22px] lg:text-[30px]">
                                        · Book Now
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
                                    <div className="flex flex-col items-center justify-center rounded-[11px] bg-primary px-3 py-2 text-[16px] font-black leading-none text-white shadow-[0_6px_16px_rgba(13,169,110,0.25)] sm:px-4 md:rounded-[12px] md:py-2 lg:px-7 lg:text-[24px]">
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
            </Link>
        </motion.div>
    );
};
