"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
    CheckCircle,
    XCircle,
    Info,
    Building,
    FileText,
    Globe,
    TestTube,
    Syringe,
    FlaskConical
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface LabCampaignDetailsModalProps {
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
    currency?: string;
    discountPercentage: number;
    startDate: string;
    endDate: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;

    location: {
        address?: string;
        city?: string;
        state?: string;
        pincode?: string;
        district?: string;
        latitude?: number;
        longitude?: number;
    };

    schedule: {
        days: string[];
        startTime: string;
        endTime: string;
    };

    dailyLimit: number;
    hourlyLimit: number;
    totalCapacity: number | null;
    requiredDetails: string[];

    // Lab Specifics
    healthConcern?: string[];
    gender?: string;
    isFreeHomeSampleCollection?: boolean;
    reportTime?: string;
    testCategory?: string[];
    testsIncluded?: string[];

    lab?: {
        id: string;
        licenseNumber?: string;
        description?: string;
        website?: string;
        testTypes?: string[];
        ownerIdProof?: string;
        addressProof?: string;
        profilePhoto?: string;
        isProfileComplete?: boolean;
        profileCompletionPercentage?: number;
        user: {
            name: string;
            email: string;
        };
    };

    stats: any;
}

export function LabCampaignDetailsModal({
    isOpen,
    onClose,
    campaignId,
}: LabCampaignDetailsModalProps) {
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
            const res = await fetch(`/api/admin/campaigns/${campaignId}`);
            if (!res.ok) throw new Error("Failed to fetch campaign");
            const campaign = await res.json();
            setData(campaign);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load campaign details");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent showCloseButton={false} className="sm:max-w-[60vw] w-full h-[70vh] flex flex-col p-0 overflow-hidden shadow-2xl md:rounded-2xl border-none ring-1 ring-black/5 bg-background">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b bg-muted/30">
                    <div>
                        <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                            Lab Campaign Details
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            View full details of the lab campaign
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
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold text-foreground">{data.name}</h2>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge variant="outline" className="text-sm py-1">{data.type.replace(/_/g, " ")}</Badge>
                                            <Badge
                                                variant={
                                                    data.status === "ACTIVE"
                                                        ? "success"
                                                        : data.status === "DRAFT"
                                                            ? "secondary"
                                                            : "warning"
                                                }
                                                className="text-sm py-1"
                                            >
                                                {data.status}
                                            </Badge>
                                            <Badge variant={data.isVerified ? "success" : "destructive"} className="gap-1 text-sm py-1">
                                                {data.isVerified ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                                {data.isVerified ? "Verified" : "Unverified"}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-primary">
                                            {new Intl.NumberFormat("en-IN", {
                                                style: "currency",
                                                currency: data.currency || "INR",
                                            }).format(data.price)}
                                        </div>
                                        {data.discountPercentage > 0 && (
                                            <Badge variant="success" className="mt-1">
                                                {data.discountPercentage}% OFF
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                <Tabs defaultValue="details" className="w-full">
                                    <TabsList className="mb-6 w-full justify-start h-auto p-1 bg-muted/50 rounded-xl">
                                        <TabsTrigger value="details">Details & Tests</TabsTrigger>
                                        <TabsTrigger value="schedule">Schedule & Location</TabsTrigger>
                                        <TabsTrigger value="config">Configuration</TabsTrigger>
                                        <TabsTrigger value="lab">Lab Profile</TabsTrigger>
                                    </TabsList>

                                    {/* DETAILS & TESTS TAB */}
                                    <TabsContent value="details" className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="md:col-span-2 space-y-6">
                                                {/* Description */}
                                                <div className="bg-muted/10 p-5 rounded-xl border">
                                                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
                                                        <Info className="w-4 h-4 text-primary" /> Description
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                                        {data.description || "No description provided."}
                                                    </p>
                                                </div>

                                                {/* Tests Included */}
                                                {data.testsIncluded && data.testsIncluded.length > 0 && (
                                                    <div className="bg-muted/10 p-5 rounded-xl border">
                                                        <div className="flex justify-between items-center mb-3">
                                                            <h3 className="font-semibold flex items-center gap-2 text-foreground">
                                                                <TestTube className="w-4 h-4 text-primary" /> Tests Included
                                                            </h3>
                                                            <span className="text-xs text-muted-foreground">{data.testsIncluded.length} Tests</span>
                                                        </div>
                                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            {data.testsIncluded.map((test, index) => (
                                                                <li key={index} className="flex items-start gap-2 text-sm bg-background p-2 rounded border">
                                                                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                                                    <span>{test}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                {/* Key Info Cards */}
                                                <div className="p-4 border rounded-xl bg-background shadow-sm space-y-4">
                                                    <div>
                                                        <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Target Audience</div>
                                                        <div className="text-lg font-bold">{data.gender || "All"}</div>
                                                    </div>
                                                    <Separator />
                                                    <div>
                                                        <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Health Concern</div>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {data.healthConcern?.map(c => (
                                                                <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                                                            )) || "N/A"}
                                                        </div>
                                                    </div>
                                                    <Separator />
                                                    <div>
                                                        <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Test Category</div>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {data.testCategory?.map(c => (
                                                                <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                                                            )) || "N/A"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    {/* SCHEDULE & LOCATION TAB */}
                                    <TabsContent value="schedule" className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Schedule */}
                                            <div className="bg-muted/10 p-5 rounded-xl border">
                                                <h3 className="font-semibold mb-4 flex items-center gap-2 text-foreground">
                                                    <Clock className="w-4 h-4 text-primary" /> Application Schedule
                                                </h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="col-span-2">
                                                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Active Days</span>
                                                        <div className="flex flex-wrap gap-2">
                                                            {data.schedule?.days && data.schedule.days.length > 0 ? (
                                                                data.schedule.days.map((day) => (
                                                                    <Badge key={day} variant="secondary" className="bg-background border shadow-sm">
                                                                        {day}
                                                                    </Badge>
                                                                ))
                                                            ) : (
                                                                <span className="text-sm text-muted-foreground">No specific days selected</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="mt-2">
                                                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Start Time</span>
                                                        <div className="text-lg font-medium mt-1">{data.schedule?.startTime || "N/A"}</div>
                                                    </div>
                                                    <div className="mt-2">
                                                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">End Time</span>
                                                        <div className="text-lg font-medium mt-1">{data.schedule?.endTime || "N/A"}</div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                                                    <div>
                                                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Start Date</span>
                                                        <div className="text-lg font-medium mt-1">{new Date(data.startDate).toLocaleDateString()}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">End Date</span>
                                                        <div className="text-lg font-medium mt-1">{new Date(data.endDate).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Location */}
                                            <div className="bg-muted/10 p-5 rounded-xl border">
                                                <h3 className="font-semibold mb-4 flex items-center gap-2 text-foreground">
                                                    <MapPin className="w-4 h-4 text-primary" /> Venue Location
                                                </h3>
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Address</p>
                                                        <p className="text-sm font-medium mt-1">{data.location?.address || "N/A"}</p>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">City</p>
                                                            <p className="text-sm font-medium mt-1">{data.location?.city || "N/A"}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Pincode</p>
                                                            <p className="text-sm font-medium mt-1">{data.location?.pincode || "N/A"}</p>
                                                        </div>
                                                    </div>
                                                    {(data.location?.latitude && data.location?.longitude) && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full gap-2 mt-2"
                                                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${data.location.latitude},${data.location.longitude}`, '_blank')}
                                                        >
                                                            <Globe className="w-4 h-4" /> Open on Maps
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    {/* CONFIG TAB */}
                                    <TabsContent value="config" className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-6">
                                                <div className="bg-muted/10 p-5 rounded-xl border space-y-4">
                                                    <h3 className="font-semibold flex items-center gap-2">
                                                        <Building className="w-4 h-4 text-primary" /> Booking Limits
                                                    </h3>
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center p-3 bg-background border rounded-lg">
                                                            <span className="text-sm text-muted-foreground">Daily Limit</span>
                                                            <span className="font-bold text-lg">{data.dailyLimit || 0}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center p-3 bg-background border rounded-lg">
                                                            <span className="text-sm text-muted-foreground">Hourly Limit</span>
                                                            <span className="font-bold text-lg">{data.hourlyLimit || 0}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center p-3 bg-background border rounded-lg">
                                                            <span className="text-sm text-muted-foreground">Total Capacity</span>
                                                            <span className="font-bold text-lg">{data.totalCapacity || "Unlimited"}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="bg-muted/10 p-5 rounded-xl border space-y-4">
                                                    <h3 className="font-semibold flex items-center gap-2">
                                                        <FlaskConical className="w-4 h-4 text-primary" /> Lab Settings
                                                    </h3>
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center p-3 bg-background border rounded-lg">
                                                            <span className="text-sm text-muted-foreground">Report Time</span>
                                                            <span className="font-bold">{data.reportTime || "N/A"}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center p-3 bg-background border rounded-lg">
                                                            <span className="text-sm text-muted-foreground">Home Sample Collection</span>
                                                            <Badge variant={data.isFreeHomeSampleCollection ? "success" : "outline"}>
                                                                {data.isFreeHomeSampleCollection ? "Free Available" : "Not Available"}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-muted/10 p-5 rounded-xl border space-y-4">
                                                    <h3 className="font-semibold flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-primary" /> Required Patient Details
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {data.requiredDetails && data.requiredDetails.length > 0 ? (
                                                            data.requiredDetails.map((detail) => (
                                                                <Badge key={detail} variant="outline" className="bg-background py-1.5 px-3">
                                                                    {detail}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <p className="text-sm text-muted-foreground italic">No specific details required</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    {/* LAB PROFILE TAB */}
                                    <TabsContent value="lab" className="space-y-6">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            {/* Profile Card */}
                                            <div className="w-full md:w-1/3 bg-muted/10 p-6 rounded-xl border flex flex-col items-center text-center">
                                                <Avatar className="w-32 h-32 border-4 border-background shadow-lg mb-4">
                                                    <AvatarImage src={data.lab?.profilePhoto || ""} />
                                                    <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                                                        {data.lab?.user?.name?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <h3 className="text-xl font-bold text-foreground">{data.lab?.user?.name}</h3>
                                                <p className="text-sm text-muted-foreground mt-1 mb-4">{data.lab?.user?.email}</p>

                                                <div className="w-full p-3 bg-background rounded border mt-2">
                                                    <div className="text-xs text-muted-foreground font-semibold mb-1">Profile Completion</div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                                            <div className="h-full bg-primary" style={{ width: `${data.lab?.profileCompletionPercentage || 0}%` }}></div>
                                                        </div>
                                                        <span className="text-xs font-bold">{data.lab?.profileCompletionPercentage || 0}%</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Lab Details */}
                                            <div className="flex-1 space-y-6">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">About Lab</h4>
                                                    <div className="p-4 bg-muted/10 rounded-xl border text-sm leading-relaxed text-muted-foreground">
                                                        {data.lab?.description || "No description available."}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="p-3 bg-muted/10 rounded-lg border">
                                                        <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">License</div>
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="w-4 h-4 text-primary" />
                                                            <span className="font-mono">{data.lab?.licenseNumber || "N/A"}</span>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-muted/10 rounded-lg border">
                                                        <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Website</div>
                                                        <div className="flex items-center gap-2">
                                                            <Globe className="w-4 h-4 text-primary" />
                                                            <a href={data.lab?.website || "#"} target="_blank" className="hover:underline truncate max-w-[150px]">
                                                                {data.lab?.website || "N/A"}
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>

                                                {(data.lab?.ownerIdProof || data.lab?.addressProof) && (
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Documents</h4>
                                                        <div className="flex flex-wrap gap-3">
                                                            {data.lab?.ownerIdProof && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="gap-2 h-9"
                                                                    onClick={() => window.open(data.lab!.ownerIdProof, '_blank')}
                                                                >
                                                                    <FileText className="w-4 h-4 text-primary" /> Owner ID Proof
                                                                </Button>
                                                            )}
                                                            {data.lab?.addressProof && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="gap-2 h-9"
                                                                    onClick={() => window.open(data.lab!.addressProof, '_blank')}
                                                                >
                                                                    <Building className="w-4 h-4 text-primary" /> Address Proof
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                <div className="mt-8 pt-6 border-t flex justify-between items-center text-xs text-muted-foreground">
                                    <div>
                                        Campaign ID: <span className="font-mono select-all">{data.id}</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <span>Created: {new Date(data.createdAt).toLocaleString()}</span>
                                        <span>Updated: {new Date(data.updatedAt).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-muted-foreground flex-col gap-2">
                            <Info className="w-8 h-8 opacity-20" />
                            <p>No campaign details available</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
