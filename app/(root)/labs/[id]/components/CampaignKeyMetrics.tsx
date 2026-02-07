"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { IndianRupee } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LabCampaign } from "../../types";

interface CampaignKeyMetricsProps {
    campaign: LabCampaign;
}

export const CampaignKeyMetrics: React.FC<CampaignKeyMetricsProps> = ({ campaign }) => {
    return (
        <div className="grid grid-cols-1 gap-4">
            <Card className="bg-linear-to-br from-blue-50 to-blue-100/50 border-blue-100 shadow-sm overflow-hidden relative">
                <CardContent className="p-5 flex items-start gap-4 relative">
                    <div className="w-12 h-12 rounded-xl bg-background shadow-sm flex items-center justify-center text-blue-600 shrink-0">
                        <IndianRupee className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-semibold text-foreground mb-1">Campaign Fee</p>
                        <div className="flex flex-col">
                            {campaign.price === 0 ? (
                                <span className="font-bold text-blue-700 text-lg">Free</span>
                            ) : (
                                <div className="flex items-baseline gap-2">
                                    <span className="font-bold text-lg">
                                        ₹{Math.round(campaign.price * (1 - (campaign.discountPercentage || 0) / 100))}
                                    </span>
                                    {(campaign.discountPercentage || 0) > 0 && (
                                        <>
                                            <span className="text-sm text-muted-foreground line-through">
                                                ₹{campaign.price}
                                            </span>
                                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-[10px] px-1.5 h-5">
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
