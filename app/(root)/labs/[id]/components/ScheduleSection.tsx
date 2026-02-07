"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LabCampaign } from "../../types";

interface ScheduleSectionProps {
    campaign: LabCampaign;
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ campaign }) => {
    return (
        <Card className="shadow-sm border-muted">
            <CardHeader className="border-b bg-muted/20 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="w-5 h-5 text-primary" />
                    Schedule & Timing
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                {campaign.schedule?.days && campaign.schedule.days.length > 0 ? (
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                                <CalendarDays className="w-4 h-4" />
                                Available Days
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {campaign.schedule.days.map((day: string) => (
                                    <Badge key={day} variant="secondary" className="px-3 py-1.5 text-sm bg-primary/5 text-primary border-primary/10 capitalize">
                                        {day.toLowerCase()}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Timing
                            </h4>
                            <div className="p-3 bg-muted/50 rounded-lg border w-fit font-semibold">
                                {campaign.schedule.startTime} - {campaign.schedule.endTime}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-muted-foreground">Schedule details available upon booking.</p>
                )}
            </CardContent>
        </Card>
    );
};
