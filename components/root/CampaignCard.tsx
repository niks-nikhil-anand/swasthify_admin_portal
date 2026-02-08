"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MapPin, Stethoscope, User, CheckCircle, Clock } from "lucide-react";

export interface Campaign {
    id: string;
    name: string;
    type: string;
    status: string;
    price: number;
    discountPercentage: number;
    startDate: string;
    endDate: string;
    location: any;
    doctor: {
        id: string;
        profilePhoto: string | null;
        user: {
            name: string;
        };
        specializations: { name: string }[];
        hospitalName: string | null;
        clinicName: string | null;
    };
    isVerified: boolean;
    description?: string | null;
}

interface CampaignCardProps {
    campaign: Campaign;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
    const discountedPrice = campaign.discountPercentage > 0
        ? Math.round(campaign.price - (campaign.price * campaign.discountPercentage) / 100)
        : campaign.price;

    return (
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-500 border-l-4 border-l-emerald-600 border-t-0 border-r-0 border-b-0 bg-white dark:bg-zinc-950 flex flex-col h-full group relative">
            {/* Subtle stethoscope background watermark */}
            <div className="absolute top-12  right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                <Stethoscope className="w-32 h-32 -rotate-12" />
            </div>

            <CardHeader className="p-6 pb-2 space-y-4">
                <div className="flex justify-between items-start">
                    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 uppercase text-[10px] tracking-widest font-bold px-2 py-0.5">
                        {campaign.type.replace("_", " ")}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">
                        <Clock className="w-3 h-3" />
                        Available
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="font-extrabold text-xl lg:text-2xl text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-tight group-hover:text-emerald-600 transition-colors">
                        {campaign.name}
                    </h3>
                    <div className="flex items-center text-sm text-zinc-500 font-medium">
                        <MapPin className="w-4 h-4 mr-1.5 text-emerald-500 shrink-0" />
                        <span className="line-clamp-1">
                            {campaign.location?.city || "Visit Clinic"}
                            {campaign.location?.address && `, ${campaign.location.address}`}
                        </span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6 flex-1 space-y-6">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                    {campaign.description || "Expert consultation with top specialists. Book your slot now for personalized healthcare advice and treatment."}
                </p>

                {/* Doctor Mini Profile */}
                <div className="flex items-center gap-4 p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                    <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center overflow-hidden border shadow-sm group-hover:border-emerald-500/50 transition-colors">
                            {campaign.doctor.profilePhoto ? (
                                <img
                                    src={campaign.doctor.profilePhoto}
                                    alt={campaign.doctor.user.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-6 h-6 text-emerald-500" />
                            )}
                        </div>
                        {campaign.isVerified && (
                            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-900 rounded-full p-0.5 shadow-sm">
                                <CheckCircle className="w-4 h-4 text-white fill-emerald-500" />
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            Dr. {campaign.doctor.user.name}
                        </p>
                        <p className="text-xs text-zinc-500 font-medium line-clamp-1">
                            {campaign.doctor.specializations.map(s => s.name).join(", ") || "Specialist"}
                        </p>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-6 pt-0 mt-auto border-t border-zinc-50 dark:border-zinc-900">
                <div className="flex items-center justify-between w-full pt-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-400 uppercase tracking-tighter font-bold">Consultation Fee</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                                {campaign.price === 0 ? "FREE" : `₹${discountedPrice}`}
                            </span>
                            {campaign.discountPercentage > 0 && (
                                <span className="text-sm text-zinc-400 line-through">
                                    ₹{campaign.price}
                                </span>
                            )}
                        </div>
                    </div>
                    <Button
                        size="lg"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 dark:shadow-none rounded-xl gap-2 transition-all hover:scale-105 active:scale-95"
                        onClick={() => {
                            // Track Click event for CTR
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

                            window.location.href = `/doctors/${campaign.id}`;
                        }}
                    >
                        Book Appt
                        <Stethoscope className="w-4 h-4" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};
