"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin, Stethoscope, User, CalendarDays, IndianRupee, Info, CheckCircle, Share2, Phone, Linkedin, Mail, MessageCircle, Copy, Star } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

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
    const [user, setUser] = useState<any>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const router = useRouter();

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
        // router.push(`/doctors/book/${campaign?.id}`);
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
        return (
            <div className="min-h-screen bg-gray-50/30 font-sans">
                <div className="container mx-auto py-8 px-4 max-w-6xl">
                    <div className="mb-6">
                        <Skeleton className="h-10 w-32" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content Skeleton */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Title Section Skeleton */}
                            <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-3 w-full">
                                        <div className="flex gap-2">
                                            <Skeleton className="h-6 w-20 rounded-full" />
                                            <Skeleton className="h-6 w-24 rounded-full" />
                                        </div>
                                        <Skeleton className="h-10 w-3/4" />
                                    </div>
                                    <Skeleton className="h-9 w-24 rounded-full" />
                                </div>
                                <Skeleton className="h-20 w-full" />
                            </div>

                            {/* Pricing Skeleton */}
                            <Skeleton className="h-32 w-full rounded-xl" />

                            {/* Detailed Info Tabs Skeleton */}
                            <div className="space-y-6">
                                <Skeleton className="h-64 w-full rounded-xl" />
                                <Skeleton className="h-64 w-full rounded-xl" />
                            </div>
                        </div>

                        {/* Sidebar Skeleton */}
                        <div className="space-y-6">
                            <div className="sticky top-24 space-y-6">
                                <Card className="border-0 shadow-lg ring-1 ring-black/5 overflow-hidden">
                                    <Skeleton className="h-24 w-full" />
                                    <CardContent className="relative pt-0 px-6 pb-6 text-center -mt-12">
                                        <Skeleton className="w-24 h-24 mx-auto rounded-full border-4 border-white mb-4" />
                                        <div className="space-y-2 mb-6 flex flex-col items-center">
                                            <Skeleton className="h-6 w-48" />
                                            <Skeleton className="h-4 w-64" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 mb-6">
                                            <Skeleton className="h-16 w-full rounded-xl" />
                                            <Skeleton className="h-16 w-full rounded-xl" />
                                        </div>
                                        <Skeleton className="h-24 w-full rounded-xl mb-6" />
                                        <Skeleton className="h-12 w-full rounded-xl" />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
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
                        {/* Mobile/Tablet Doctor Profile Header - HIDDEN ON DESKTOP */}
                        <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col items-center text-center space-y-4 lg:hidden">
                            <Avatar className="w-24 h-24 border-4 border-background shadow-md">
                                <AvatarImage src={campaign.doctor.profilePhoto || ""} className="object-cover" />
                                <AvatarFallback className="text-2xl font-bold bg-primary/5 text-primary">
                                    {campaign.doctor.user.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>

                            <div className="space-y-1">
                                <h3 className="font-bold text-xl text-foreground">{campaign.doctor.user.name}</h3>
                                <p className="text-primary font-medium flex items-center justify-center gap-1.5 flex-wrap">
                                    {campaign.doctor.specializations.map(s => s.name).join(", ")}
                                </p>
                                <div className="text-sm text-muted-foreground flex items-center justify-center gap-2 mt-1">
                                    <span>{campaign.doctor.qualification || "MBBS"}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <span>{campaign.doctor.experienceYears} Yrs Exp.</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg border border-yellow-100 dark:border-yellow-900/40">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="font-bold text-foreground">{campaign.doctor.averageRating || "New"}</span>
                                </div>
                                <div className="text-muted-foreground">
                                    {campaign.doctor.totalReviews || 0} Reviews
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

                                        {campaign.isVerified && (
                                            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 gap-1.5 px-3 py-1 rounded-full">
                                                <CheckCircle className="w-3.5 h-3.5 fill-blue-100" />
                                                Verified Campaign
                                            </Badge>
                                        )}
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                                        {campaign.name}
                                    </h1>
                                </div>
                                <div className="flex gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm" className="h-9 rounded-full gap-2 px-4 shadow-sm hover:bg-muted bg-background" suppressHydrationWarning>
                                                <Share2 className="w-4 h-4" />
                                                <span className="hidden sm:inline">Share</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-auto min-w-0 rounded-2xl shadow-xl border-gray-100 p-3 flex flex-row items-center gap-3 animate-in zoom-in-95 duration-200">
                                            <DropdownMenuItem className="p-0 rounded-full focus:bg-transparent cursor-pointer transition-transform hover:-translate-y-1 hover:scale-110 duration-200" onClick={() => {
                                                const url = window.location.href;
                                                const text = `Check out this healthcare campaign by ${campaign.doctor.user.name}`;
                                                window.open(`https://wa.me/?text=${encodeURIComponent(text)}%20${encodeURIComponent(url)}`, '_blank');
                                            }}>
                                                <div className="w-10 h-10 rounded-full relative shadow-sm overflow-hidden bg-white">
                                                    <Image
                                                        src="/icons/whatsapp.png"
                                                        alt="WhatsApp"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </DropdownMenuItem>

                                            <DropdownMenuItem className="p-0 rounded-full focus:bg-transparent cursor-pointer transition-transform hover:-translate-y-1 hover:scale-110 duration-200" onClick={() => {
                                                const url = window.location.href;
                                                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
                                            }}>
                                                <div className="w-10 h-10 rounded-full relative shadow-sm overflow-hidden bg-white">
                                                    <Image
                                                        src="/icons/linkedIn.png"
                                                        alt="LinkedIn"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </DropdownMenuItem>

                                            <DropdownMenuItem className="p-0 rounded-full focus:bg-transparent cursor-pointer transition-transform hover:-translate-y-1 hover:scale-110 duration-200" onClick={() => {
                                                const url = window.location.href;
                                                const subject = `Check out this campaign: ${campaign.name}`;
                                                const body = `I found this interesting healthcare campaign: ${campaign.name}\n\nCheck it out here: ${url}`;
                                                window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                                            }}>
                                                <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                                                    <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg"><path fill="#EA4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" /><path fill="#34A853" d="M24 19.366V5.457c0-2.023-2.309-3.178-3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" opacity=".05" /></svg>
                                                </div>
                                            </DropdownMenuItem>

                                            <DropdownMenuItem className="p-0 rounded-full focus:bg-transparent cursor-pointer transition-transform hover:-translate-y-1 hover:scale-110 duration-200" onClick={() => {
                                                navigator.clipboard.writeText(window.location.href);
                                                toast.success("Link copied to clipboard");
                                            }}>
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 shadow-sm border border-gray-200">
                                                    <Copy className="w-5 h-5" />
                                                </div>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            <p className="text-lg text-muted-foreground leading-relaxed border-t pt-4">
                                {campaign.description || "Join us for a specialized healthcare session designed to provide expert consultation and care."}
                            </p>
                        </div>

                        {/* Key Metrics Grid */}
                        <div className="grid grid-cols-1 gap-4">
                            <Card className="bg-linear-to-br from-green-50 to-green-100/50 dark:from-green-950/40 dark:to-green-900/20 border-green-100 dark:border-green-900/40 shadow-sm overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full -mr-12 -mt-12 opacity-50 blur-xl" />
                                <CardContent className="p-5 flex items-start gap-4 relative">
                                    <div className="w-12 h-12 rounded-xl bg-background shadow-sm flex items-center justify-center text-green-600 dark:text-green-500 shrink-0">
                                        <IndianRupee className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground mb-1">Consultation Fee</p>
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
                                                            <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 text-[10px] px-1.5 h-5">
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
                                                <div className="p-3 bg-muted/50 rounded-lg border flex items-center gap-3 w-fit">
                                                    <span className="text-base font-semibold text-foreground">
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


                        </div>
                    </div>

                    {/* Sidebar - Doctor Profile */}
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
                                        onClick={handleBookAppointment}
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
                </div>
            </div>
        </div>
    );
}