"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar, MapPin, Search, Stethoscope, User, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Campaign {
    id: string;
    name: string;
    type: string;
    status: string;
    price: number;
    discountPercentage: number;
    startDate: string;
    endDate: string;
    location: any;
    doctor: {
        id: string;
        profilePhoto: string | null;
        user: {
            name: string;
        };
        specializations: { name: string }[];
        hospitalName: string | null;
        clinicName: string | null;
    };
    isVerified: boolean;
}

export default function DoctorCampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState<string>("ALL");

    const fetchCampaigns = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append("query", searchQuery);
            if (selectedType && selectedType !== "ALL") params.append("type", selectedType);

            const response = await fetch(`/api/public/campaigns?${params.toString()}`);
            if (!response.ok) throw new Error("Failed to fetch campaigns");
            const data = await response.json();
            setCampaigns(data);
        } catch (error) {
            console.error("Error fetching campaigns:", error);
            toast.error("Failed to load campaigns");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Debounce search
        const timer = setTimeout(() => {
            fetchCampaigns();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, selectedType]);

    return (
        <div className="container mx-auto py-12 px-4 space-y-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    Find Healthcare Campaigns
                </h1>
                <p className="text-lg text-muted-foreground">
                    Discover active health camps, free checkups, and specialized OPD sessions from verified doctors near you.
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by campaign or doctor..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-auto flex gap-3">
                    <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Campaign Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Types</SelectItem>
                            <SelectItem value="OPD">OPD</SelectItem>
                            <SelectItem value="HEALTH_CAMP">Health Camp</SelectItem>
                            <SelectItem value="FREE_CHECKUP">Free Checkup</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex flex-col space-y-3">
                            <Skeleton className="h-[200px] w-full rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : campaigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map((campaign) => (
                        <Card key={campaign.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-muted flex flex-col h-full group">
                            <div className="h-2 bg-gradient-to-r from-primary to-blue-600" />
                            <CardHeader className="p-5 pb-0 space-y-4">
                                <div className="flex justify-between items-start">
                                    <Badge variant={
                                        campaign.type === "FREE_CHECKUP" ? "secondary" :
                                            campaign.type === "OPD" ? "default" : "outline"
                                    } className="uppercase text-[10px] tracking-wider font-semibold">
                                        {campaign.type.replace("_", " ")}
                                    </Badge>
                                    <div className="flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded-full text-xs font-medium text-green-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        Active
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl line-clamp-2 group-hover:text-primary transition-colors">
                                        {campaign.name}
                                    </h3>
                                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                                        <MapPin className="w-4 h-4 mr-1 shrink-0" />
                                        <span className="line-clamp-1">
                                            {campaign.location?.city || "Location details inside"}
                                            {campaign.location?.address && `, ${campaign.location.address}`}
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-5 flex-1">
                                <div className="space-y-4">
                                    {/* Date */}
                                    {/* Description */}
                                    <div className="text-sm text-gray-600 line-clamp-3">
                                        {/* @ts-ignore */}
                                        {campaign.description || "Join us for this special healthcare campaign."}
                                    </div>

                                    {/* Doctor Mini Profile */}
                                    <div className="flex items-center gap-3 pt-2 border-t">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border">
                                                {campaign.doctor.profilePhoto ? (
                                                    <img
                                                        src={campaign.doctor.profilePhoto}
                                                        alt={campaign.doctor.user.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <User className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                            {campaign.isVerified && (
                                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                                                    <CheckCircle className="w-3 h-3 text-blue-500 fill-blue-500 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 leading-tight">
                                                {campaign.doctor.user.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground line-clamp-1">
                                                {campaign.doctor.specializations.map(s => s.name).join(", ") || "General Physician"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="p-5 pt-0 mt-auto">
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Price</span>
                                        <span className="text-lg font-bold text-primary">
                                            {campaign.price === 0 ? (
                                                "Free"
                                            ) : (
                                                <div className="flex flex-col">
                                                    {campaign.discountPercentage > 0 && (
                                                        <span className="text-xs text-muted-foreground line-through font-normal">
                                                            ₹{campaign.price}
                                                        </span>
                                                    )}
                                                    <span>
                                                        ₹
                                                        {campaign.discountPercentage > 0
                                                            ? Math.round(campaign.price - (campaign.price * campaign.discountPercentage) / 100)
                                                            : campaign.price}
                                                    </span>
                                                </div>
                                            )}
                                        </span>
                                    </div>
                                    <Button size="sm" className="gap-2" onClick={() => window.location.href = `/doctor/${campaign.id}`}>
                                        View Details
                                        <Stethoscope className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed">
                    <Search className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No active campaigns found</h3>
                    <p className="text-muted-foreground mt-1">
                        Try adjusting your search or filters to find what you're looking for.
                    </p>
                </div>
            )}
        </div>
    );
}