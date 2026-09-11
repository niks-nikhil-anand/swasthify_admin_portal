"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Share2, Copy, ChevronDown, ChevronUp } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Image from "next/image";
import { Campaign } from "../../types";

interface CampaignHeaderProps {
    campaign: Campaign;
}

const DESCRIPTION_CHUNK_RATIO = 0.4;

export const CampaignHeader: React.FC<CampaignHeaderProps> = ({ campaign }) => {
    const [visibleDescriptionStep, setVisibleDescriptionStep] = useState(1);
    const description = campaign.description || "Join us for a specialized healthcare session designed to provide expert consultation and care.";
    const canToggleDescription = description.length > 520;
    const totalDescriptionSteps = Math.ceil(1 / DESCRIPTION_CHUNK_RATIO);
    const isFullDescriptionVisible = visibleDescriptionStep >= totalDescriptionSteps;
    const visibleDescriptionLength = canToggleDescription && !isFullDescriptionVisible
        ? Math.ceil(description.length * DESCRIPTION_CHUNK_RATIO * visibleDescriptionStep)
        : description.length;
    const visibleDescription = canToggleDescription && !isFullDescriptionVisible
        ? `${description.slice(0, visibleDescriptionLength).trimEnd()}...`
        : description;

    const handleDescriptionToggle = () => {
        if (isFullDescriptionVisible) {
            setVisibleDescriptionStep(1);
            return;
        }

        setVisibleDescriptionStep((current) => Math.min(current + 1, totalDescriptionSteps));
    };

    return (
        <div className="bg-card p-6 rounded-2xl border shadow-sm space-y-4">
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
                            <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-400 gap-1.5 px-3 py-1 rounded-full">
                                <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                                Active Now
                            </Badge>
                        ) : (
                            <Badge variant="secondary">{campaign.status}</Badge>
                        )}

                        {campaign.isVerified && (
                            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-400 gap-1.5 px-3 py-1 rounded-full">
                                <CheckCircle className="w-3.5 h-3.5 fill-blue-100" />
                                Verified Campaign
                            </Badge>
                        )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                        {campaign.name}
                    </h1>
                </div>
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 rounded-full gap-2 px-4 shadow-sm hover:bg-muted bg-background" suppressHydrationWarning>
                                <Share2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Share</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-auto min-w-0 rounded-2xl shadow-xl border-border p-3 flex flex-row items-center gap-3 animate-in zoom-in-95 duration-200">
                            <DropdownMenuItem className="p-0 rounded-full focus:bg-transparent cursor-pointer transition-transform hover:-translate-y-1 hover:scale-110 duration-200" onClick={() => {
                                const url = window.location.href;
                                const text = `Check out this healthcare campaign by ${campaign.doctor.user.name}`;
                                window.open(`https://wa.me/?text=${encodeURIComponent(text)}%20${encodeURIComponent(url)}`, '_blank');
                            }}>
                                <div className="w-10 h-10 rounded-full relative shadow-sm overflow-hidden bg-white">
                                    <Image
                                        src="/icons/whatsapp.png"
                                        alt="WhatsApp"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </DropdownMenuItem>

                            <DropdownMenuItem className="p-0 rounded-full focus:bg-transparent cursor-pointer transition-transform hover:-translate-y-1 hover:scale-110 duration-200" onClick={() => {
                                const url = window.location.href;
                                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
                            }}>
                                <div className="w-10 h-10 rounded-full relative shadow-sm overflow-hidden bg-white">
                                    <Image
                                        src="/icons/linkedIn.png"
                                        alt="LinkedIn"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </DropdownMenuItem>

                            <DropdownMenuItem className="p-0 rounded-full focus:bg-transparent cursor-pointer transition-transform hover:-translate-y-1 hover:scale-110 duration-200" onClick={() => {
                                const url = window.location.href;
                                const subject = `Check out this campaign: ${campaign.name}`;
                                const body = `I found this interesting healthcare campaign: ${campaign.name}\n\nCheck it out here: ${url}`;
                                window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                            }}>
                                <div className="w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center shadow-sm">
                                    <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg"><path fill="#EA4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" /><path fill="#34A853" d="M24 19.366V5.457c0-2.023-2.309-3.178-3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" opacity=".05" /></svg>
                                </div>
                            </DropdownMenuItem>

                            <DropdownMenuItem className="p-0 rounded-full focus:bg-transparent cursor-pointer transition-transform hover:-translate-y-1 hover:scale-110 duration-200" onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                toast.success("Link copied to clipboard");
                            }}>
                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground shadow-sm border border-border">
                                    <Copy className="w-5 h-5" />
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="border-t pt-4">
                <p className="text-lg text-muted-foreground leading-relaxed">
                    {visibleDescription}
                </p>

                {canToggleDescription && (
                    <Button
                        type="button"
                        variant="link"
                        className="mt-2 h-auto p-0 text-base font-semibold text-primary hover:text-primary/80"
                        onClick={handleDescriptionToggle}
                        aria-expanded={isFullDescriptionVisible}
                    >
                        {isFullDescriptionVisible ? "View less" : "View more"}
                        {isFullDescriptionVisible ? (
                            <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                            <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
};
