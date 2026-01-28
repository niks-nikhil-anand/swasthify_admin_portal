"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
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
    X,
    MapPin,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    Info,
    Building,
    FileText,
    Globe
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

    // Location
    location: any;

    // Schedule
    schedule: any;

    // Config
    dailyLimit: number;
    hourlyLimit: number;
    totalCapacity: number | null;
    requiredDetails: string[];

    stats?: any;
    doctor?: any;
}

interface CampaignDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    campaign: CampaignData | null;
}

export function CampaignDetailsModal({
    isOpen,
    onClose,
    campaign,
}: CampaignDetailsModalProps) {
    if (!isOpen || !campaign) return null;

    const data = campaign;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent showCloseButton={false} className="sm:max-w-[60vw] w-full h-[70vh] flex flex-col p-0 overflow-hidden shadow-2xl md:rounded-2xl border-none ring-1 ring-black/5 bg-background">
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
                    <ScrollArea className="h-full">
                        <div className="p-8 pb-20">
                            {/* Overview Section */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-foreground">{data.name}</h2>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant="outline" className="text-sm py-1">{data.type}</Badge>
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
                                            {data.status.replace("_", " ")}
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
                                    <TabsTrigger value="details">Details & Schedule</TabsTrigger>
                                    <TabsTrigger value="location">Location</TabsTrigger>
                                    <TabsTrigger value="config">Configuration</TabsTrigger>
                                </TabsList>

                                {/* DETAILS TAB */}
                                <TabsContent value="details" className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2 space-y-6">
                                            <div className="bg-muted/10 p-5 rounded-xl border">
                                                <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
                                                    <Info className="w-4 h-4 text-primary" /> Description
                                                </h3>
                                                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                                    {data.description || "No description provided."}
                                                </p>
                                            </div>

                                            <div className="bg-muted/10 p-5 rounded-xl border">
                                                <h3 className="font-semibold mb-4 flex items-center gap-2 text-foreground">
                                                    <Clock className="w-4 h-4 text-primary" /> Schedule
                                                </h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="col-span-2">
                                                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Active Days</span>
                                                        <div className="flex flex-wrap gap-2">
                                                            {data.schedule?.days && data.schedule.days.length > 0 ? (
                                                                data.schedule.days.map((day: string) => (
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
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="p-4 border rounded-xl bg-background shadow-sm">
                                                <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Duration</div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Calendar className="w-4 h-4 text-primary" />
                                                    <span className="text-sm font-medium">Start Date</span>
                                                </div>
                                                <div className="text-lg font-bold">{new Date(data.startDate).toLocaleDateString()}</div>
                                            </div>

                                            <div className="p-4 border rounded-xl bg-background shadow-sm">
                                                <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Duration</div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Calendar className="w-4 h-4 text-primary" />
                                                    <span className="text-sm font-medium">End Date</span>
                                                </div>
                                                <div className="text-lg font-bold">{new Date(data.endDate).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* LOCATION TAB */}
                                <TabsContent value="location" className="space-y-6">
                                    <div className="bg-muted/10 p-6 rounded-xl border">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-primary/10 rounded-full">
                                                <MapPin className="w-6 h-6 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg mb-4 text-foreground">Venue Details</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                                                    <div>
                                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Address</p>
                                                        <p className="text-base font-medium mt-1">{data.location?.address || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">City</p>
                                                        <p className="text-base font-medium mt-1">{data.location?.city || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">District</p>
                                                        <p className="text-base font-medium mt-1">{data.location?.district || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">State</p>
                                                        <p className="text-base font-medium mt-1">{data.location?.state || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Pincode</p>
                                                        <p className="text-base font-medium mt-1">{data.location?.pincode || "N/A"}</p>
                                                    </div>
                                                </div>

                                                {(data.location?.latitude && data.location?.longitude) && (
                                                    <div className="mt-6 pt-4 border-t">
                                                        <div className="flex items-center gap-4">
                                                            <div>
                                                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Coordinates</p>
                                                                <p className="text-sm font-mono mt-1 text-foreground">
                                                                    {data.location.latitude.toFixed(6)}, {data.location.longitude.toFixed(6)}
                                                                </p>
                                                            </div>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="ml-auto gap-2"
                                                                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${data.location.latitude},${data.location.longitude}`, '_blank')}
                                                            >
                                                                <Globe className="w-4 h-4" /> Open Maps
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* CONFIG TAB */}
                                <TabsContent value="config" className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>
            </DialogContent>
        </Dialog>
    );
}
