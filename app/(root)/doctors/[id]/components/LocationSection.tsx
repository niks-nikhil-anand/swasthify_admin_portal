"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { Campaign } from "../../types";

interface LocationSectionProps {
    campaign: Campaign;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ campaign }) => {
    return (
        <Card className="shadow-sm border-muted">
            <CardHeader className="border-b bg-muted/20 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                    Venue Location
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                        <div>
                            <h4 className="font-semibold text-lg text-foreground">
                                {campaign.doctor.clinicName || campaign.doctor.hospitalName || "Medical Center"}
                            </h4>
                            <p className="text-muted-foreground mt-1">
                                {campaign.location?.address}
                            </p>
                            <p className="text-gray-600 mt-1">
                                {campaign.location?.city}, {campaign.location?.district}, {campaign.location?.state} - {campaign.location?.pincode}
                            </p>
                        </div>

                        <Button variant="outline" className="gap-2 cursor-pointer" onClick={() => {
                            if (campaign.location?.latitude && campaign.location?.longitude) {
                                window.open(`https://www.google.com/maps/search/?api=1&query=${campaign.location.latitude},${campaign.location.longitude}`, '_blank');
                            } else {
                                const query = `${campaign.location?.address}, ${campaign.location?.city}, ${campaign.location?.state}`;
                                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
                            }
                        }}>
                            <MapPin className="w-4 h-4" />
                            Get Directions
                        </Button>
                    </div>

                    {/* Simple Map Placeholder - In production use a real map component */}
                    <div className="w-full md:w-1/3 h-48 bg-slate-100 rounded-lg border overflow-hidden relative">
                        {campaign.location?.latitude && campaign.location?.longitude ? (
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                title="map"
                                scrolling="no"
                                src={`https://maps.google.com/maps?q=${campaign.location.latitude},${campaign.location.longitude}&z=14&output=embed`}
                                className="w-full h-full"
                            ></iframe>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                                Map not available
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
