"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Campaign } from "../../types";

interface DoctorHeaderMobileProps {
    campaign: Campaign;
}

export const DoctorHeaderMobile: React.FC<DoctorHeaderMobileProps> = ({ campaign }) => {
    return (
        <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col items-center text-center space-y-4 lg:hidden">
            <Avatar className="w-24 h-24 border-4 border-background shadow-md">
                <AvatarImage src={campaign.doctor.profilePhoto || ""} className="object-cover" />
                <AvatarFallback className="text-2xl font-bold bg-primary/5 text-primary">
                    {campaign.doctor.user.name.charAt(0)}
                </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
                <h3 className="font-bold text-xl text-foreground">{campaign.doctor.user.name}</h3>
                <p className="text-primary font-medium flex items-center justify-center gap-1.5 flex-wrap">
                    {campaign.doctor.specializations.map(s => s.name).join(", ")}
                </p>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-2 mt-1">
                    <span>{campaign.doctor.qualification || "MBBS"}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>{campaign.doctor.experienceYears} Yrs Exp.</span>
                </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg border border-yellow-100 dark:border-yellow-900/40">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-foreground">{campaign.doctor.averageRating || "New"}</span>
                </div>
                <div className="text-muted-foreground">
                    {campaign.doctor.totalReviews || 0} Reviews
                </div>
            </div>
        </div>
    );
};
