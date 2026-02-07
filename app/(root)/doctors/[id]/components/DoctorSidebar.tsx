"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Campaign } from "../../types";

interface DoctorSidebarProps {
    campaign: Campaign;
    onBookAppointment: () => void;
}

export const DoctorSidebar: React.FC<DoctorSidebarProps> = ({ campaign, onBookAppointment }) => {
    return (
        <div className="space-y-6 h-fit hidden lg:block">
            <div className="sticky top-28 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto hide-scrollbar">
                <Card className="border-0 shadow-lg ring-1 ring-black/5 overflow-hidden">
                    <div className="h-24 bg-linear-to-r from-primary/10 to-primary/5"></div>
                    <CardContent className="relative pt-0 px-6 pb-6 text-center -mt-12">
                        <Avatar className="w-24 h-24 mx-auto border-4 border-background shadow-md mb-4 bg-background">
                            <AvatarImage src={campaign.doctor.profilePhoto || ""} className="object-cover" />
                            <AvatarFallback className="text-2xl font-bold bg-primary/5 text-primary">
                                {campaign.doctor.user.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="space-y-1 mb-6">
                            <h3 className="font-bold text-xl text-foreground">{campaign.doctor.user.name}</h3>
                            <p className="text-primary font-medium flex items-center justify-center gap-1.5 flex-wrap">
                                {campaign.doctor.specializations.slice(0, 2).map(s => s.name).join(", ")}
                                {campaign.doctor.specializations.length > 2 && <span className="text-xs text-muted-foreground">+{campaign.doctor.specializations.length - 2} more</span>}
                            </p>
                            <div className="text-sm text-muted-foreground flex items-center justify-center gap-2 mt-1">
                                <span>{campaign.doctor.qualification || "MBBS"}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span>{campaign.doctor.experienceYears} Yrs Exp.</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="p-3 bg-muted/50 rounded-xl border border-border">
                                <div className="font-bold text-foreground text-lg">{campaign.doctor.averageRating || "New"}</div>
                                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Rating</div>
                            </div>
                            <div className="p-3 bg-muted/50 rounded-xl border border-border">
                                <div className="font-bold text-foreground text-lg">{campaign.doctor.totalReviews || 0}</div>
                                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Reviews</div>
                            </div>
                        </div>

                        <div className="text-left bg-muted/30 p-4 rounded-xl mb-6">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">About Doctor</p>
                            <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
                                {campaign.doctor.bio || `Dr. ${campaign.doctor.user.name} is a dedicated professional committed to providing excellent healthcare services.`}
                            </p>
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
