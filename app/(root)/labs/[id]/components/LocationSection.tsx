"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LabCampaign } from "../../types";

interface LocationSectionProps {
    campaign: LabCampaign;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ campaign }) => {
    return (
        <Card className="shadow-sm border-muted">
            <CardHeader className="border-b bg-muted/20 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                    Location
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <h4 className="font-semibold text-lg text-foreground mb-2">
                            {campaign.lab.user.name}
                        </h4>
                        <p className="text-muted-foreground">
                            {campaign.location?.address}
                        </p>
                        <p className="text-gray-600 mt-1">
                            {campaign.location?.city}, {campaign.location?.state} - {campaign.location?.pincode}
                        </p>

                        <Button variant="outline" className="mt-4 gap-2" onClick={() => {
                            const query = `${campaign.location?.address}, ${campaign.location?.city}`;
                            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
                        }}>
                            <MapPin className="w-4 h-4" /> Get Directions
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
