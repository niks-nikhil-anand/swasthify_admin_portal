"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MapPin, Stethoscope, User, CheckCircle, FlaskConical } from "lucide-react";

export interface LabCampaign {
    id: string;
    name: string;
    type: string;
    status: string;
    price: number;
    discountPercentage: number;
    startDate: string;
    endDate: string;
    location: any;
    lab: {
        id: string;
        profilePhoto: string | null;
        user: {
            name: string;
        };
        testTypes: string[];
    };
    isVerified: boolean;
    description?: string | null;
}

interface LabCampaignCardProps {
    campaign: LabCampaign;
}

export const LabCampaignCard: React.FC<LabCampaignCardProps> = ({ campaign }) => {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-muted flex flex-col h-full group">
            <div className="h-2 bg-gradient-to-r from-primary to-blue-600" />
            <CardHeader className="p-5 pb-0 space-y-4">
                <div className="flex justify-between items-start">
                    <Badge variant={
                        campaign.type === "FREE_CHECKUP" ? "secondary" :
                            campaign.type === "OPD" ? "default" : "outline"
                    } className="uppercase text-[10px] tracking-wider font-semibold">
                        {campaign.type.replace("_", " ")}
                    </Badge>
                    <div className="flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded-full text-xs font-medium text-green-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Active
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-xl line-clamp-2 group-hover:text-primary transition-colors">
                        {campaign.name}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                        <MapPin className="w-4 h-4 mr-1 shrink-0" />
                        <span className="line-clamp-1">
                            {campaign.location?.city || "Location details inside"}
                            {campaign.location?.address && `, ${campaign.location.address}`}
                        </span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-5 flex-1">
                <div className="space-y-4">
                    {/* Description */}
                    <div className="text-sm text-gray-600 line-clamp-3">
                        {/* @ts-ignore */}
                        {campaign.description || "Join us for this special healthcare campaign."}
                    </div>

                    {/* Report Time & Tests - Optional info we can add later */}

                    {/* Lab Mini Profile */}
                    <div className="flex items-center gap-3 pt-2 border-t">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border">
                                {campaign.lab.profilePhoto ? (
                                    <img
                                        src={campaign.lab.profilePhoto}
                                        alt={campaign.lab.user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FlaskConical className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                            {campaign.isVerified && (
                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                                    <CheckCircle className="w-3 h-3 text-blue-500 fill-blue-500 text-white" />
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900 leading-tight">
                                {campaign.lab.user.name}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                                {campaign.lab.testTypes?.slice(0, 2).join(", ") || "Diagnostic Lab"}
                                {campaign.lab.testTypes?.length > 2 && "..."}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-5 pt-0 mt-auto">
                <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Price</span>
                        <span className="text-lg font-bold text-primary">
                            {campaign.price === 0 ? (
                                "Free"
                            ) : (
                                <div className="flex items-center gap-2">
                                    {campaign.discountPercentage > 0 && (
                                        <span className="text-xs text-muted-foreground line-through font-normal">
                                            ₹{campaign.price}
                                        </span>
                                    )}
                                    <span>
                                        ₹
                                        {campaign.discountPercentage > 0
                                            ? Math.round(campaign.price - (campaign.price * campaign.discountPercentage) / 100)
                                            : campaign.price}
                                    </span>
                                </div>
                            )}
                        </span>
                    </div>
                    <Button size="sm" className="gap-2 cursor-pointer" onClick={() => window.location.href = `/labs/${campaign.id}`}>
                        View Details
                        <Stethoscope className="w-4 h-4" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};
