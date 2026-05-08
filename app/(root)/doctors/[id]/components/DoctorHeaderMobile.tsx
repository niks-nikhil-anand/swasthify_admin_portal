"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, Briefcase } from "lucide-react";
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
                </div>
            </div>

            <div className="pt-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-2xl group transition-all hover:bg-primary/10 hover:border-primary/20">
                    <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                        <Award className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-foreground">
                        {campaign.doctor.experienceYears}+ Years <span className="text-muted-foreground font-medium">Experience</span>
                    </span>
                </div>
            </div>
        </div>
    );
};
