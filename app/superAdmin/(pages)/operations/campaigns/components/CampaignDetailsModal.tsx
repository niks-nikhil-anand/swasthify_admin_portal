"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Loader2,
    X,
    MapPin,
    Calendar,
    Clock,
    CreditCard,
    CheckCircle,
    XCircle,
    Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CampaignDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    campaignId: string | null;
}

interface CampaignData {
    id: string;
    name: string;
    description: string | null;
    type: string;
    status: string;
    price: number;
    discountPercentage: number;
    startDate: string;
    endDate: string;
    isVerified: boolean;
    doctor: {
        user: {
            name: string;
            email: string;
        }
    };
    location: {
        address?: string;
        city?: string;
        state?: string;
        pincode?: string;
    };
    schedule: any;
    appointmentConfig: {
        dailyLimit: number;
        hourlyLimit: number;
        totalCapacity: number | null;
    };
    stats: {
        views?: number;
        bookings?: number;
    } | null;
    createdAt: string;
}

export function CampaignDetailsModal({
    isOpen,
    onClose,
    campaignId,
}: CampaignDetailsModalProps) {
    const [data, setData] = useState<CampaignData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && campaignId) {
            fetchCampaignDetails();
        }
    }, [isOpen, campaignId]);

    const fetchCampaignDetails = async () => {
        try {
            setLoading(true);
            // Assuming we will create this API route
            const res = await fetch(`/api/admin/campaigns/${campaignId}`);
            if (!res.ok) throw new Error("Failed to fetch campaign");
            const campaign = await res.json();
            setData(campaign);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load campaign details");
            // Mock data for now if API fails (for development) or handle error gracefully
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent showCloseButton={false} className="max-w-[800px] w-full h-[85vh] flex flex-col p-0 overflow-hidden shadow-2xl md:rounded-2xl border-none ring-1 ring-black/5 bg-background">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b bg-muted/30">
                    <div>
                        <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                            Campaign Details
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            View full details of the campaign
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="w-5 h-5 text-muted-foreground" />
                    </Button>
                </div>

                <div className="flex-1 overflow-hidden bg-background">
                    {loading ? (
                        <div className="flex items-center justify-center w-full h-full">
                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        </div>
                    ) : data ? (
                        <ScrollArea className="h-full">
                            <div className="p-8 pb-20">
                                {/* Overview Section */}
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground">{data.name}</h2>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline">{data.type}</Badge>
                                            <Badge
                                                variant={
                                                    data.status === "ACTIVE"
                                                        ? "success"
                                                        : data.status === "DRAFT"
                                                            ? "secondary" // Changed from warning to secondary for DRAFT
                                                            : "warning" // Using warning for other states by default logic from previous files
                                                }
                                            >
                                                {data.status}
                                            </Badge>
                                            <Badge variant={data.isVerified ? "success" : "destructive"} className="gap-1">
                                                {/* Using standard Lucide icons if checked/x-circle not available directly or just lucide-react import */}
                                                {data.isVerified ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                {data.isVerified ? "Verified" : "Unverified"}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold">
                                            {new Intl.NumberFormat("en-IN", {
                                                style: "currency",
                                                currency: "INR",
                                            }).format(data.price)}
                                        </div>
                                        {data.discountPercentage > 0 && (
                                            <p className="text-sm text-green-600 font-medium">
                                                {data.discountPercentage}% Discount
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                <Tabs defaultValue="details" className="w-full">
                                    <TabsList className="mb-6 w-full justify-start h-auto p-1 bg-muted/50 rounded-xl">
                                        <TabsTrigger value="details">Details</TabsTrigger>
                                        <TabsTrigger value="location">Location</TabsTrigger>
                                        <TabsTrigger value="schedule">Schedule & Config</TabsTrigger>
                                        <TabsTrigger value="doctor">Doctor Info</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="details" className="space-y-6">
                                        <div className="bg-muted/10 p-4 rounded-lg border">
                                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                                <Info className="w-4 h-4" /> Description
                                            </h3>
                                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                                {data.description || "No description provided."}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 border rounded-lg">
                                                <div className="text-sm text-muted-foreground">Start Date</div>
                                                <div className="font-medium flex items-center gap-2 mt-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(data.startDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="p-4 border rounded-lg">
                                                <div className="text-sm text-muted-foreground">End Date</div>
                                                <div className="font-medium flex items-center gap-2 mt-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(data.endDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="location" className="space-y-6">
                                        <div className="bg-muted/10 p-6 rounded-lg border flex items-start gap-4">
                                            <MapPin className="w-6 h-6 text-primary mt-1" />
                                            <div>
                                                <h3 className="font-semibold text-lg mb-2">Location Details</h3>
                                                <div className="space-y-1 text-sm">
                                                    <p><span className="font-medium">Address:</span> {data.location?.address || "N/A"}</p>
                                                    <p><span className="font-medium">City:</span> {data.location?.city || "N/A"}</p>
                                                    <p><span className="font-medium">State:</span> {data.location?.state || "N/A"}</p>
                                                    <p><span className="font-medium">Pincode:</span> {data.location?.pincode || "N/A"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="schedule" className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <h3 className="font-semibold">Limits</h3>
                                                <div className="grid grid-cols-1 gap-3">
                                                    <div className="flex justify-between p-3 border rounded">
                                                        <span className="text-sm text-muted-foreground">Daily Limit</span>
                                                        <span className="font-medium">{data.appointmentConfig?.dailyLimit || 0}</span>
                                                    </div>
                                                    <div className="flex justify-between p-3 border rounded">
                                                        <span className="text-sm text-muted-foreground">Hourly Limit</span>
                                                        <span className="font-medium">{data.appointmentConfig?.hourlyLimit || 0}</span>
                                                    </div>
                                                    <div className="flex justify-between p-3 border rounded">
                                                        <span className="text-sm text-muted-foreground">Total Capacity</span>
                                                        <span className="font-medium">{data.appointmentConfig?.totalCapacity || "Unlimited"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Could add a JSON viewer or formatted schedule viewer here if schedule supports complex structure */}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="doctor" className="space-y-6">
                                        <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/10">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                                {data.doctor?.user?.name?.[0]}
                                            </div>
                                            <div>
                                                <h3 className="font-bold">{data.doctor?.user?.name}</h3>
                                                <p className="text-sm text-muted-foreground">{data.doctor?.user?.email}</p>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                <div className="mt-8 text-xs text-muted-foreground text-center">
                                    Campaign ID: {data.id} • Created on {new Date(data.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                            No data available
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
