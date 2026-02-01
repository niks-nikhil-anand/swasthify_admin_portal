"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Send, Users, Eye, MousePointerClick, MoreHorizontal, Calendar, Copy, TestTube } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CreateCampaign } from "./_components/CreateCampaign";
import { toast } from "sonner";
import { CampaignDetailsModal } from "./_components/CampaignDetailsModal";

// Mock Data for Lab Campaigns
const mockCampaigns = [
    {
        id: "CMP-L-001",
        name: "World Diabetes Day Screening",
        description: "Special discounted screening for diabetes with random blood sugar and HbA1c tests.",
        type: "HEALTH_CHECKUP_CAMP",
        status: "ACTIVE",
        price: 499,
        discountPercentage: 50,
        startDate: "2024-11-14T09:00:00",
        endDate: "2024-11-20T17:00:00",
        createdAt: "2024-11-01T10:00:00",
        updatedAt: "2024-11-01T10:00:00",
        isVerified: true,
        stats: {
            reach: 1250,
            clicks: 340,
        },
        location: {
            address: "Main Lab Center, 3rd Block",
            city: "Mumbai",
            district: "Mumbai Suburban",
            state: "Maharashtra",
            pincode: "400050",
            latitude: 19.0760,
            longitude: 72.8777
        },
        schedule: {
            days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"],
            startTime: "08:00",
            endTime: "20:00"
        },
        dailyLimit: 100,
        hourlyLimit: 15,
        totalCapacity: 500,
        requiredDetails: ["Name", "Age", "Gender", "Phone Number", "History of Diabetes"]
    },
    {
        id: "CMP-L-002",
        name: "Senior Citizen Full Body Checkup",
        description: "Comprehensive health checkup package for citizens above 60 years.",
        type: "DISCOUNTED_TESTS",
        status: "DRAFT",
        price: 1999,
        discountPercentage: 20,
        startDate: "2024-12-01T08:00:00",
        endDate: "2024-12-31T18:00:00",
        createdAt: "2024-11-15T14:30:00",
        updatedAt: "2024-11-15T14:30:00",
        isVerified: false,
        location: {
            address: "All Centers",
            city: "Mumbai",
            district: "Mumbai Suburban",
            state: "Maharashtra",
            pincode: "400001"
        },
        schedule: {
            days: ["MONDAY", "WEDNESDAY", "FRIDAY"],
            startTime: "09:00",
            endTime: "13:00"
        },
        dailyLimit: 20,
        hourlyLimit: 5,
        totalCapacity: null,
        requiredDetails: ["Name", "Phone Number"]
    }
];

export default function LabCampaignPage() {
    const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCopyId = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Campaign ID copied to clipboard");
    };

    const handleViewDetails = (campaign: any) => {
        setSelectedCampaign(campaign);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Lab Campaigns</h1>
                    <p className="text-muted-foreground">Promote your lab packages and organize health camps.</p>
                </div>
                <CreateCampaign />
            </div>

            {/* Campaign Stats Overview */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,250</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Potential patients reached
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bookings</CardTitle>
                        <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">85</div>
                        <p className="text-xs text-muted-foreground mt-1 text-emerald-600">
                            6.8% Conversion Rate
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                        <Megaphone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Running currently
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Your Campaigns</CardTitle>
                    <CardDescription>
                        Manage your marketing initiatives.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {mockCampaigns.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No campaigns found. Create your first campaign!
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {mockCampaigns.map((camp) => (
                                <div key={camp.id} className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                    {/* Icon & Title */}
                                    <div className="md:col-span-4 flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <TestTube className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm">{camp.name}</h3>
                                            <p className="text-xs text-muted-foreground mt-0.5">{camp.type.replace(/_/g, " ")}</p>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="md:col-span-2">
                                        <Badge variant={
                                            camp.status === "ACTIVE" ? "success" :
                                                camp.status === "IN_REVIEW" ? "warning" :
                                                    camp.status === "DRAFT" ? "secondary" : "outline"
                                        } className="font-normal">
                                            {camp.status.replace("_", " ")}
                                        </Badge>
                                    </div>

                                    {/* Stats Info */}
                                    <div className="md:col-span-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1.5" title="Start Date">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span>{new Date(camp.startDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5" title="Reach">
                                            <Eye className="h-3.5 w-3.5" />
                                            <span>{camp.stats?.reach || 0} Reach</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="md:col-span-2 flex justify-end">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleViewDetails(camp)}>
                                                    <Eye className="w-4 h-4 mr-2" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleCopyId(camp.id)}>
                                                    <Copy className="w-4 h-4 mr-2" /> Copy ID
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>View Stats</DropdownMenuItem>
                                                {camp.status === 'DRAFT' && <DropdownMenuItem>Edit</DropdownMenuItem>}
                                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <CampaignDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                campaign={selectedCampaign}
            />
        </div>
    );
}