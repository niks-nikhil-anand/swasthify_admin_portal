"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LabCampaign } from "../../types";

interface LabHeaderMobileProps {
    campaign: LabCampaign;
}

export const LabHeaderMobile: React.FC<LabHeaderMobileProps> = ({ campaign }) => {
    return (
        <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col items-center text-center space-y-4 lg:hidden">
            <Avatar className="w-24 h-24 border-4 border-background shadow-md">
                <AvatarImage src={campaign.lab.profilePhoto || ""} className="object-cover" />
                <AvatarFallback className="text-2xl font-bold bg-primary/5 text-primary">
                    {campaign.lab.user.name.charAt(0)}
                </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
                <h3 className="font-bold text-xl text-foreground">{campaign.lab.user.name}</h3>
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {campaign.lab.testTypes?.slice(0, 3).map((type: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">{type}</Badge>
                    ))}
                    {(campaign.lab.testTypes?.length || 0) > 3 && (
                        <span className="text-xs text-muted-foreground">+{campaign.lab.testTypes!.length - 3} more</span>
                    )}
                </div>
            </div>
        </div>
    );
};
