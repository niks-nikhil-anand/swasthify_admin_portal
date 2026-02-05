"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Clock, MapPin, IndianRupee, Share2, Copy, Star, FlaskConical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image"; // Used for social icons

interface Campaign {
    id: string;
    name: string;
    description: string | null;
    type: string;
    status: string;
    price: number;
    currency: string;
    discountPercentage: number;
    startDate: string;
    endDate: string;
    location: {
        city: string;
        state: string;
        address: string;
        pincode: string;
        district: string;
        latitude: number;
        longitude: number;
    };
    schedule: {
        days: string[];
        startTime: string;
        endTime: string;
    };
    dailyLimit: number;
    hourlyLimit: number | null;
    totalCapacity: number | null;
    requiredDetails: string[];
    bookingRules: any;
    eligibility: any;
    lab: {
        id: string;
        userId: string;
        profilePhoto: string | null;
        averageRating: number;
        totalReviews: number;
        testTypes: string[];
        user: {
            name: string;
            email: string;
            phone?: string;
        };
    };
    isVerified: boolean;
}

export default function LabCampaignDetailsPage() {
    const params = useParams();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);

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
        return (
            <div className="min-h-screen bg-gray-50/30 font-sans">
                <div className="container mx-auto py-8 px-4 max-w-6xl">
                    <div className="mb-6">
                        <Skeleton className="h-10 w-32" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <Skeleton className="h-64 w-full rounded-2xl" />
                            <Skeleton className="h-32 w-full rounded-xl" />
                            <Skeleton className="h-64 w-full rounded-xl" />
                        </div>
                        <div className="space-y-6">
                            <Skeleton className="h-96 w-full rounded-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!campaign || !campaign.lab) {
        return (
            <div className="container mx-auto py-20 px-4 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Campaign Not Found</h2>
                <p className="text-muted-foreground mt-2">The campaign you are looking for may have ended or been removed.</p>
                <Button className="mt-6" variant="outline" asChild>
                    <Link href="/labs">Browse Lab Campaigns</Link>
                </Button>
            </div>
        );
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
                        {/* Mobile Lab Profile Header - HIDDEN ON DESKTOP */}
                        <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col items-center text-center space-y-4 lg:hidden">
                            <Avatar className="w-24 h-24 border-4 border-background shadow-md">
                                <AvatarImage src={campaign.lab.profilePhoto || ""} className="object-cover" />
                                <AvatarFallback className="text-2xl font-bold bg-primary/5 text-primary">
                                    {campaign.lab.user.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>

                            <div className="space-y-1">
                                <h3 className="font-bold text-xl text-foreground">{campaign.lab.user.name}</h3>
                                <div className="flex flex-wrap items-center justify-center gap-2">
                                    {campaign.lab.testTypes?.slice(0, 3).map((type, i) => (
                                        <Badge key={i} variant="secondary" className="text-xs">{type}</Badge>
                                    ))}
                                    {(campaign.lab.testTypes?.length || 0) > 3 && (
                                        <span className="text-xs text-muted-foreground">+{campaign.lab.testTypes!.length - 3} more</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Title Section */}
                        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant={
                                            campaign.type === "FREE_CHECKUP" ? "secondary" :
                                                campaign.type === "OPD" ? "default" : "outline"
                                        } className="px-3 py-1 text-sm font-medium rounded-full uppercase tracking-wide">
                                            {campaign.type.replace("_", " ")}
                                        </Badge>

                                        {campaign.status === "ACTIVE" ? (
                                            <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 gap-1.5 px-3 py-1 rounded-full">
                                                <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                                                Active Now
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">{campaign.status}</Badge>
                                        )}
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                                        {campaign.name}
                                    </h1>
                                </div>
                                <div className="flex gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm" className="h-9 rounded-full gap-2 px-4 shadow-sm hover:bg-muted bg-background">
                                                <Share2 className="w-4 h-4" />
                                                <span className="hidden sm:inline">Share</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => {
                                                navigator.clipboard.writeText(window.location.href);
                                                toast.success("Link copied to clipboard");
                                            }}>
                                                <Copy className="w-4 h-4 mr-2" /> Copy Link
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            <p className="text-lg text-muted-foreground leading-relaxed border-t pt-4">
                                {campaign.description || "Join us for this comprehensive health campaign. Reliable testing and accurate results guaranteed."}
                            </p>
                        </div>

                        {/* Key Metrics Grid */}
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

                        {/* Detailed Information Tabs */}
                        <div className="space-y-6">
                            {/* Schedule */}
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

                            {/* Location */}
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
                        </div>
                    </div>

                    {/* Sidebar - Lab Profile */}
                    <div className="space-y-6 h-fit hidden lg:block">
                        <div className="sticky top-28 space-y-6">
                            <Card className="border-0 shadow-lg ring-1 ring-black/5 overflow-hidden">
                                <div className="h-24 bg-gradient-to-r from-primary/10 to-primary/5"></div>
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
                                            {campaign.lab.testTypes?.slice(0, 3).map((type, i) => (
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

                                    <Button className="w-full h-12 text-base font-semibold shadow-xl shadow-primary/20 rounded-xl">
                                        Book Appointment
                                    </Button>

                                    <p className="text-xs text-muted-foreground mt-4 text-center">
                                        Instant confirmation • secure booking
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
