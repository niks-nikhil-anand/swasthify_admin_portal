"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin, Stethoscope, User, CalendarDays, IndianRupee, Info, CheckCircle, Share2, Phone } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

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
    doctor: {
        id: string;
        userId: string;
        profilePhoto: string | null;
        experienceYears: number;
        qualification: string | null;
        bio: string | null;
        hospitalName: string | null;
        clinicName: string | null;
        averageRating: number;
        totalReviews: number;
        user: {
            name: string;
            email: string;
        };
        specializations: {
            id: string;
            name: string;
        }[];
    };
    isVerified: boolean;
}

export default function CampaignDetailsPage() {
    const params = useParams();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);

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
        return (
            <div className="container mx-auto py-12 px-4 max-w-5xl space-y-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-4">
                        <Skeleton className="h-12 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                        <div className="flex gap-4 mt-6">
                            <Skeleton className="h-32 w-full rounded-xl" />
                            <Skeleton className="h-32 w-full rounded-xl" />
                        </div>
                    </div>
                    <div className="w-full md:w-1/3">
                        <Skeleton className="h-[400px] w-full rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="container mx-auto py-20 px-4 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Campaign Not Found</h2>
                <p className="text-muted-foreground mt-2">The campaign you are looking for may have ended or been removed.</p>
                <Button className="mt-6" variant="outline" asChild>
                    <Link href="/doctor">Browse Campaigns</Link>
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
                        <Link href="/doctors">
                            <span className="text-xl">←</span> Back to Campaigns
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
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

                                        {campaign.isVerified && (
                                            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 gap-1.5 px-3 py-1 rounded-full">
                                                <CheckCircle className="w-3.5 h-3.5 fill-blue-100" />
                                                Verified Campaign
                                            </Badge>
                                        )}
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                                        {campaign.name}
                                    </h1>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="hidden sm:flex h-9 rounded-full" onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        toast.success("Link copied to clipboard");
                                    }}>
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share
                                    </Button>
                                    <Button variant="outline" size="icon" className="sm:hidden rounded-full" onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        toast.success("Link copied to clipboard");
                                    }}>
                                        <Share2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <p className="text-lg text-muted-foreground leading-relaxed border-t pt-4">
                                {campaign.description || "Join us for a specialized healthcare session designed to provide expert consultation and care."}
                            </p>
                        </div>

                        {/* Key Metrics Grid */}
                        <div className="grid grid-cols-1 gap-4">
                            <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-100 shadow-sm overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-green-100 rounded-full -mr-12 -mt-12 opacity-50 blur-xl" />
                                <CardContent className="p-5 flex items-start gap-4 relative">
                                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-green-600 shrink-0">
                                        <IndianRupee className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 mb-1">Consultation Fee</p>
                                        <div className="flex flex-col">
                                            {campaign.price === 0 ? (
                                                <span className="font-bold text-green-700 text-lg">Free of Cost</span>
                                            ) : (
                                                <div className="flex items-baseline gap-2">
                                                    <span className="font-bold text-lg">
                                                        ₹{Math.round(campaign.price * (1 - (campaign.discountPercentage || 0) / 100))}
                                                    </span>
                                                    {(campaign.discountPercentage || 0) > 0 && (
                                                        <>
                                                            <span className="text-sm text-muted-foreground line-through decoration-red-500/50">
                                                                ₹{campaign.price}
                                                            </span>
                                                            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 text-[10px] px-1.5 h-5">
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
                            {/* Schedule & Timing */}
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
                                                        <Badge key={day} variant="secondary" className="px-3 py-1.5 text-sm bg-primary/5 hover:bg-primary/10 text-primary border-primary/10 capitalize">
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
                                                <div className="p-3 bg-gray-50 rounded-lg border flex items-center gap-3 w-fit">
                                                    <span className="text-base font-semibold text-gray-900">
                                                        {(() => {
                                                            const formatTime = (t: string) => {
                                                                if (!t) return "";
                                                                const [h, m] = t.split(':');
                                                                const H = parseInt(h);
                                                                if (isNaN(H)) return t;
                                                                return `${H % 12 || 12}:${m} ${H >= 12 ? 'PM' : 'AM'}`;
                                                            };
                                                            return `${formatTime(campaign.schedule?.startTime)} - ${formatTime(campaign.schedule?.endTime)}`;
                                                        })()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground">Detailed schedule details available upon booking.</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Location */}
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
                                                <h4 className="font-semibold text-lg text-gray-900">
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
                                        <div className="w-full md:w-1/3 h-32 bg-slate-100 rounded-lg border flex items-center justify-center text-muted-foreground text-sm">
                                            Map View
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>


                        </div>
                    </div>

                    {/* Sidebar - Doctor Profile */}
                    <div className="space-y-6 h-fit">
                        <div className="sticky top-28 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto hide-scrollbar">
                            <Card className="border-0 shadow-lg ring-1 ring-black/5 overflow-hidden">
                                <div className="h-24 bg-gradient-to-r from-primary/10 to-primary/5"></div>
                                <CardContent className="relative pt-0 px-6 pb-6 text-center -mt-12">
                                    <Avatar className="w-24 h-24 mx-auto border-4 border-white shadow-md mb-4 bg-white">
                                        <AvatarImage src={campaign.doctor.profilePhoto || ""} className="object-cover" />
                                        <AvatarFallback className="text-2xl font-bold bg-primary/5 text-primary">
                                            {campaign.doctor.user.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="space-y-1 mb-6">
                                        <h3 className="font-bold text-xl text-gray-900">{campaign.doctor.user.name}</h3>
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
                                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="font-bold text-gray-900 text-lg">{campaign.doctor.averageRating || "New"}</div>
                                            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Rating</div>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="font-bold text-gray-900 text-lg">{campaign.doctor.totalReviews || 0}</div>
                                            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Reviews</div>
                                        </div>
                                    </div>

                                    <div className="text-left bg-muted/30 p-4 rounded-xl mb-6">
                                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">About Doctor</p>
                                        <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed">
                                            {campaign.doctor.bio || `Dr. ${campaign.doctor.user.name} is a dedicated professional committed to providing excellent healthcare services.`}
                                        </p>
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