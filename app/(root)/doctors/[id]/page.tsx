"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { Campaign } from "../types";
import { CampaignLoadingSkeleton } from "./components/CampaignLoadingSkeleton";
import { CampaignNotFound } from "./components/CampaignNotFound";
import { DoctorHeaderMobile } from "./components/DoctorHeaderMobile";
import { CampaignHeader } from "./components/CampaignHeader";
import { CampaignKeyMetrics } from "./components/CampaignKeyMetrics";
import { ScheduleSection } from "./components/ScheduleSection";
import { LocationSection } from "./components/LocationSection";
import { DoctorSidebar } from "./components/DoctorSidebar";
import { useParams as useNextParams } from "next/navigation";
import { BookingModal } from "./components/BookingModal";
import { ClinicImageSlider } from "./components/ClinicImageSlider";
import { DoctorReviews } from "./components/DoctorReviews";

export default function CampaignDetailsPage() {
    const params = useNextParams();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ id: string } | null>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("/api/auth/me");
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };
        fetchUser();
    }, []);

    const handleBookAppointment = () => {
        setIsBookingModalOpen(true);
    };

    useEffect(() => {
        const fetchCampaign = async () => {
            if (!params.id) return;
            try {
                const response = await fetch(`/api/public/campaigns/${params.id}`);
                if (!response.ok) {
                    throw new Error("Campaign not found");
                }
                const data = await response.json();
                setCampaign(data);
            } catch (error) {
                console.error("Error fetching campaign:", error);
                toast.error("Failed to load campaign details");
            } finally {
                setLoading(false);
            }
        };

        fetchCampaign();
    }, [params.id]);

    if (loading) {
        return <CampaignLoadingSkeleton />;
    }

    if (!campaign) {
        return <CampaignNotFound />;
    }

    return (
        <div className="min-h-screen bg-muted/30 font-sans">
            <div className="container mx-auto py-8 px-4 max-w-6xl">
                {/* Back Button */}
                <div className="mb-6">
                    <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-primary transition-colors" asChild>
                        <Link href="/doctors">
                            <span className="text-xl">←</span> Back to Campaigns
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Clinic Image Slider */}
                        {campaign.doctor.clinicImages && campaign.doctor.clinicImages.length > 0 && (
                            <ClinicImageSlider
                                images={campaign.doctor.clinicImages}
                            />
                        )}

                        {/* Mobile/Tablet Doctor Profile Header - HIDDEN ON DESKTOP */}
                        <DoctorHeaderMobile campaign={campaign} />

                        {/* Title Section */}
                        <CampaignHeader campaign={campaign} />

                        {/* Key Metrics Grid */}
                        <CampaignKeyMetrics campaign={campaign} />

                        {/* Mobile Actions - About Doctor & Book Appointment (HIDDEN ON DESKTOP) */}
                        <div className="space-y-4 lg:hidden">
                            <div className="text-left bg-card p-4 rounded-xl border shadow-sm">
                                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">About Doctor</p>
                                <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
                                    {campaign.doctor.bio || `Dr. ${campaign.doctor.user.name} is a dedicated professional committed to providing excellent healthcare services.`}
                                </p>
                            </div>

                            <Button
                                onClick={handleBookAppointment}
                                className="w-full h-12 text-base font-semibold shadow-xl shadow-primary/20 rounded-xl"
                            >
                                Book Appointment
                            </Button>

                            <p className="text-xs text-muted-foreground text-center">
                                Instant confirmation • secure booking
                            </p>
                        </div>

                        {/* Detailed Information Tabs */}
                        <div className="space-y-6">
                            {/* Schedule & Timing */}
                            <ScheduleSection campaign={campaign} />

                            {/* Location */}
                            <LocationSection campaign={campaign} />

                            {/* Verified Reviews */}
                            <DoctorReviews campaign={campaign} />
                        </div>
                    </div>

                    {/* Sidebar - Doctor Profile */}
                    <DoctorSidebar campaign={campaign} onBookAppointment={handleBookAppointment} />
                </div>
            </div>

            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                campaign={campaign}
                isAuthenticated={Boolean(user)}
            />
        </div>
    );
}
