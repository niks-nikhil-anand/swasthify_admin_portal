"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Share2, Copy } from "lucide-react";
import { toast } from "sonner";
import { LabCampaign } from "../../types";

interface CampaignHeaderProps {
    campaign: LabCampaign;
}

export const CampaignHeader: React.FC<CampaignHeaderProps> = ({ campaign }) => {
    return (
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={
                            campaign.type === "FREE_CHECKUP" ? "secondary" :
                                campaign.type === "OPD" ? "default" : "outline"
                        } className="px-3 py-1 text-sm font-medium rounded-full uppercase tracking-wide">
                            {campaign.type.replace("_", " ")}
                        </Badge>

                        {campaign.status === "ACTIVE" ? (
                            <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 gap-1.5 px-3 py-1 rounded-full">
                                <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                                Active Now
                            </Badge>
                        ) : (
                            <Badge variant="secondary">{campaign.status}</Badge>
                        )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                        {campaign.name}
                    </h1>
                </div>
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 rounded-full gap-2 px-4 shadow-sm hover:bg-muted bg-background">
                                <Share2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Share</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                toast.success("Link copied to clipboard");
                            }}>
                                <Copy className="w-4 h-4 mr-2" /> Copy Link
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed border-t pt-4">
                {campaign.description || "Join us for this comprehensive health campaign. Reliable testing and accurate results guaranteed."}
            </p>
        </div>
    );
};
