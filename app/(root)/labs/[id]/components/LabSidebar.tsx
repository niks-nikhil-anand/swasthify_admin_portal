"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { LabCampaign } from "../../types";

interface LabSidebarProps {
    campaign: LabCampaign;
    onBookAppointment: () => void;
}

export const LabSidebar: React.FC<LabSidebarProps> = ({ campaign, onBookAppointment }) => {
    return (
        <div className="space-y-6 h-fit hidden lg:block">
            <div className="sticky top-28 space-y-6">
                <Card className="border-0 shadow-lg ring-1 ring-black/5 overflow-hidden">
                    <div className="h-24 bg-linear-to-r from-primary/10 to-primary/5"></div>
                    <CardContent className="relative pt-0 px-6 pb-6 text-center -mt-12">
                        <Avatar className="w-24 h-24 mx-auto border-4 border-background shadow-md mb-4 bg-background">
                            <AvatarImage src={campaign.lab.profilePhoto || ""} className="object-cover" />
                            <AvatarFallback className="text-2xl font-bold bg-primary/5 text-primary">
                                {campaign.lab.user.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="space-y-1 mb-6">
                            <h3 className="font-bold text-xl text-foreground">{campaign.lab.user.name}</h3>
                            <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                                {campaign.lab.testTypes?.slice(0, 3).map((type: string, i: number) => (
                                    <Badge key={i} variant="outline" className="text-xs font-normal">
                                        {type}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="p-3 bg-muted/50 rounded-xl border border-border">
                                <div className="font-bold text-foreground text-lg flex items-center justify-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    {campaign.lab.averageRating || "New"}
                                </div>
                                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Rating</div>
                            </div>
                            <div className="p-3 bg-muted/50 rounded-xl border border-border">
                                <div className="font-bold text-foreground text-lg">{campaign.lab.totalReviews || 0}</div>
                                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Reviews</div>
                            </div>
                        </div>

                        <Button
                            onClick={onBookAppointment}
                            className="w-full h-12 text-base font-semibold shadow-xl shadow-primary/20 rounded-xl"
                        >
                            Book Appointment
                        </Button>

                        <p className="text-xs text-muted-foreground mt-4 text-center">
                            Instant confirmation • secure booking
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
