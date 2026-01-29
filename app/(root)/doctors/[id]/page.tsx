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
    startDate: string;
    endDate: string;
    location: any;
    schedule: any;
    dailyLimit: number;
    bookingRules: any;
    eligibility: any;
    doctor: {
        id: string;
        profilePhoto: string | null;
        experienceYears: number | null;
        qualification: string | null;
        bio: string | null;
        hospitalName: string | null;
        clinicName: string | null;
        user: {
            name: string;
            email: string;
        };
        specializations: { name: string }[];
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
        <div className="min-h-screen bg-gray-50/50">


            <div className="container mx-auto py-8 px-4 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Title Section */}
                        <div className="space-y-4">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant={
                                            campaign.type === "FREE_CHECKUP" ? "secondary" :
                                                campaign.type === "OPD" ? "default" : "outline"
                                        } className="uppercase tracking-wider">
                                            {campaign.type.replace("_", " ")}
                                        </Badge>
                                        {campaign.isVerified && (
                                            <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 gap-1">
                                                <CheckCircle className="w-3 h-3" /> Verified
                                            </Badge>
                                        )}
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                                        {campaign.name}
                                    </h1>
                                </div>
                                <Button variant="outline" size="sm" className="hidden sm:flex" onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    toast.success("Link copied to clipboard");
                                }}>
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Share
                                </Button>
                                <Button variant="outline" size="icon" className="sm:hidden" onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    toast.success("Link copied to clipboard");
                                }}>
                                    <Share2 className="w-4 h-4" />
                                </Button>
                            </div>

                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {campaign.description || "Join us for a specialized healthcare session designed to provide expert consultation and care."}
                            </p>
                        </div>

                        {/* Key Info Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Card className="bg-blue-50/50 border-blue-100">
                                <CardContent className="p-4 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                        <CalendarDays className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Date & Duration</p>
                                        <p className="text-sm text-gray-600 mt-0.5">
                                            {new Date(campaign.startDate).toLocaleDateString("en-IN", {
                                                day: "numeric", month: "long"
                                            })} - {new Date(campaign.endDate).toLocaleDateString("en-IN", {
                                                day: "numeric", month: "long", year: "numeric"
                                            })}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-green-50/50 border-green-100">
                                <CardContent className="p-4 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                        <IndianRupee className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Consultation Fee</p>
                                        <p className="text-sm text-gray-600 mt-0.5">
                                            {campaign.price === 0 ? (
                                                <span className="font-bold text-green-700">Free of Cost</span>
                                            ) : (
                                                <span className="font-bold">₹{campaign.price}</span>
                                            )} per visit
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Overview & Schedule Tabs/Sections */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <Clock className="w-5 h-5 text-primary" />
                                        Schedule & Timings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {campaign.schedule && Array.isArray(campaign.schedule) && campaign.schedule.map((dayLine: any, idx: number) => (
                                            <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                                                <span className="font-medium capitalize">{dayLine.day || dayLine.day_of_week}</span>
                                                <div className="text-sm text-muted-foreground">
                                                    {dayLine.slots ? dayLine.slots.map((s: any) => `${s.start} - ${s.end}`).join(", ") : "Available"}
                                                </div>
                                            </div>
                                        ))}
                                        {!campaign.schedule && (
                                            <p className="text-muted-foreground">Schedule details available upon booking.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <MapPin className="w-5 h-5 text-primary" />
                                        Location
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-gray-900">
                                            {campaign.location?.city}, {campaign.location?.state}
                                        </h4>
                                        <p className="text-muted-foreground">
                                            {campaign.doctor.clinicName || campaign.doctor.hospitalName || "Doctor's Clinic"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {campaign.location?.address || "Full address will be shared after booking."}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Sidebar - Doctor Profile */}
                    <div className="space-y-6">
                        <Card className="border-t-4 border-t-primary shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="pt-6 space-y-6">
                                <div className="text-center space-y-2">
                                    <div className="relative inline-block">
                                        <Avatar className="w-24 h-24 mx-auto border-4 border-white shadow-lg">
                                            <AvatarImage src={campaign.doctor.profilePhoto || ""} />
                                            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                                                {campaign.doctor.user.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        {campaign.isVerified && (
                                            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm">
                                                <CheckCircle className="w-5 h-5 text-blue-500 fill-blue-500 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl text-gray-900">{campaign.doctor.user.name}</h3>
                                        <p className="text-sm text-primary font-medium">
                                            {campaign.doctor.specializations.map(s => s.name).join(", ") || "General Physician"}
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4 text-sm">
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <div className="font-bold text-gray-900">{campaign.doctor.experienceYears || "5+"} Years</div>
                                            <div className="text-xs text-muted-foreground">Experience</div>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <div className="font-bold text-gray-900">4.8/5</div>
                                            <div className="text-xs text-muted-foreground">Rating</div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <Stethoscope className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div>
                                                <span className="block font-medium text-gray-700">Qualification</span>
                                                <span className="text-gray-500">{campaign.doctor.qualification || "MBBS, MD"}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Info className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div>
                                                <span className="block font-medium text-gray-700">About</span>
                                                <span className="text-gray-500 line-clamp-3">
                                                    {campaign.doctor.bio || `Dr. ${campaign.doctor.user.name} is a highly engaged specialist dedicated to patient care.`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button className="w-full h-11 text-base shadow-primary/25 shadow-lg">
                                    Book Appointment Now
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}