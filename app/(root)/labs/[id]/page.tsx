"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { LabCampaign } from "../types";
import { CampaignLoadingSkeleton } from "./components/CampaignLoadingSkeleton";
import { CampaignNotFound } from "./components/CampaignNotFound";
import { LabHeaderMobile } from "./components/LabHeaderMobile";
import { CampaignHeader } from "./components/CampaignHeader";
import { CampaignKeyMetrics } from "./components/CampaignKeyMetrics";
import { ScheduleSection } from "./components/ScheduleSection";
import { LocationSection } from "./components/LocationSection";
import { LabSidebar } from "./components/LabSidebar";
import { useParams as useNextParams, useRouter as useNextRouter } from "next/navigation";

export default function LabCampaignDetailsPage() {
    const params = useNextParams();
    const [campaign, setCampaign] = useState<LabCampaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const router = useNextRouter();

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
            } finally {
                setCheckingAuth(false);
            }
        };
        fetchUser();
    }, []);

    const handleBookAppointment = () => {
        if (!user) {
            toast.error("Please login to book an appointment");
            router.push("/login");
            return;
        }

        // Logic for booking appointment when authenticated
        toast.success("Proceeding to booking...");
        // router.push(`/labs/book/${campaign?.id}`);
    };

    useEffect(() => {
        const fetchCampaign = async () => {
            if (!params.id) return;
            try {
                // We use the same public API endpoint, which now includes lab details
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

    if (!campaign || !campaign.lab) {
        return <CampaignNotFound />;
    }

    return (
        <div className="min-h-screen bg-gray-50/30 font-sans">
            <div className="container mx-auto py-8 px-4 max-w-6xl">
                {/* Back Button */}
                <div className="mb-6">
                    <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-primary transition-colors" asChild>
                        <Link href="/labs">
                            <span className="text-xl">←</span> Back to Campaigns
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Mobile Lab Profile Header */}
                        <LabHeaderMobile campaign={campaign} />

                        {/* Title Section */}
                        <CampaignHeader campaign={campaign} />

                        {/* Key Metrics Grid */}
                        <CampaignKeyMetrics campaign={campaign} />

                        {/* Detailed Information */}
                        <div className="space-y-6">
                            <ScheduleSection campaign={campaign} />
                            <LocationSection campaign={campaign} />
                        </div>
                    </div>

                    {/* Sidebar - Lab Profile */}
                    <LabSidebar campaign={campaign} onBookAppointment={handleBookAppointment} />
                </div>
            </div>
        </div>
    );
}
