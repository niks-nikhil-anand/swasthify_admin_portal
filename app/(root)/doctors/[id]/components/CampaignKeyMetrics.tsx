"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee } from "lucide-react";
import { Campaign } from "../../types";

interface CampaignKeyMetricsProps {
    campaign: Campaign;
}

export const CampaignKeyMetrics: React.FC<CampaignKeyMetricsProps> = ({ campaign }) => {
    return (
        <div className="grid grid-cols-1 gap-4">
            <Card className="bg-linear-to-br from-green-50 to-green-100/50 dark:from-green-950/40 dark:to-green-900/20 border-green-100 dark:border-green-900/40 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full -mr-12 -mt-12 opacity-50 blur-xl" />
                <CardContent className="p-5 flex items-start gap-4 relative">
                    <div className="w-12 h-12 rounded-xl bg-background shadow-sm flex items-center justify-center text-green-600 dark:text-green-500 shrink-0">
                        <IndianRupee className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-semibold text-foreground mb-1">Consultation Fee</p>
                        <div className="flex flex-col">
                            {campaign.price === 0 ? (
                                <span className="font-bold text-green-700 text-lg">Free of Cost</span>
                            ) : (
                                <div className="flex items-baseline gap-2">
                                    <span className="font-bold text-lg">
                                        ₹{Math.round(campaign.price * (1 - (campaign.discountPercentage || 0) / 100))}
                                    </span>
                                    {(campaign.discountPercentage || 0) > 0 && (
                                        <>
                                            <span className="text-sm text-muted-foreground line-through decoration-red-500/50">
                                                ₹{campaign.price}
                                            </span>
                                            <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 text-[10px] px-1.5 h-5">
                                                {campaign.discountPercentage}% OFF
                                            </Badge>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
