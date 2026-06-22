"use client";

import { useState, useEffect } from "react";
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
    Loader2,
    X,
    MapPin,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    Info,
    Building,
    Stethoscope,
    FileText,
    Globe
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface DoctorCampaignDetailsModalProps {
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

    doctor: {
        id: string;
        user: {
            name: string;
            email: string;
        };
        licenseNumber?: string;
        bio?: string;
        experienceYears?: number;
        qualification?: string;
        clinicName?: string;
        hospitalName?: string;
        profilePhoto?: string;
        isProfileComplete?: boolean;
        profileCompletionPercentage?: number;
        idProof?: string;
        associationProof?: string;
    };

    stats: any;
    doctorName?: string | null;
    doctorImage?: string | null;
    doctorExperience?: number | null;
    specialisation?: string | null;
}

export function DoctorCampaignDetailsModal({
    isOpen,
    onClose,
    campaignId,
}: DoctorCampaignDetailsModalProps) {
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
                            Doctor Campaign Details
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
                                        <TabsTrigger value="details">Details & Schedule</TabsTrigger>
                                        <TabsTrigger value="location">Location</TabsTrigger>
                                        <TabsTrigger value="config">Configuration</TabsTrigger>
                                        <TabsTrigger value="doctor">Doctor Profile</TabsTrigger>
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

                                    {/* DOCTOR TAB */}
                                    <TabsContent value="doctor" className="space-y-6">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            {/* Profile Card */}
                                            <div className="w-full md:w-1/3 bg-muted/10 p-6 rounded-xl border flex flex-col items-center text-center">
                                                <Avatar className="w-32 h-32 border-4 border-background shadow-lg mb-4">
                                                    <AvatarImage src={data.doctor?.profilePhoto || ""} />
                                                    <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                                                        {data.doctor?.user?.name?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <h3 className="text-xl font-bold text-foreground">{data.doctor?.user?.name}</h3>
                                                <p className="text-sm text-primary font-medium mb-1">{data.doctor?.qualification || "Doctor"}</p>
                                                <p className="text-xs text-muted-foreground mb-4">{data.doctor?.user?.email}</p>

                                                <div className="w-full grid grid-cols-2 gap-2 mt-2">
                                                    <div className="p-2 bg-background rounded border">
                                                        <div className="text-xs text-muted-foreground font-semibold">Experience</div>
                                                        <div className="font-bold">{data.doctor?.experienceYears || 0} Yrs</div>
                                                    </div>
                                                    <div className="p-2 bg-background rounded border">
                                                        <div className="text-xs text-muted-foreground font-semibold">Profile</div>
                                                        <div className="font-bold text-green-600">{data.doctor?.profileCompletionPercentage || 0}%</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Doctor Details */}
                                            <div className="flex-1 space-y-6">
                                                {(data.doctorName || data.doctorExperience || data.specialisation || data.doctorImage) && (
                                                    <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl space-y-3">
                                                        <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">Campaign Overrides</h4>
                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                            {data.doctorName && (
                                                                <div>
                                                                    <span className="text-xs font-semibold text-muted-foreground">Doctor Name</span>
                                                                    <div className="font-medium text-foreground">{data.doctorName}</div>
                                                                </div>
                                                            )}
                                                            {data.doctorExperience !== undefined && data.doctorExperience !== null && (
                                                                <div>
                                                                    <span className="text-xs font-semibold text-muted-foreground">Experience</span>
                                                                    <div className="font-medium text-foreground">{data.doctorExperience} Years</div>
                                                                </div>
                                                            )}
                                                            {data.specialisation && (
                                                                <div className="col-span-2">
                                                                    <span className="text-xs font-semibold text-muted-foreground">Specialisation</span>
                                                                    <div className="font-medium text-foreground">{data.specialisation}</div>
                                                                </div>
                                                            )}
                                                            {data.doctorImage && (
                                                                <div className="col-span-2">
                                                                    <span className="text-xs font-semibold text-muted-foreground block mb-1">Doctor Image</span>
                                                                    <img src={data.doctorImage} alt="Override" className="h-16 w-16 object-cover rounded border" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                <div>
                                                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">About</h4>
                                                    <div className="p-4 bg-muted/10 rounded-xl border text-sm leading-relaxed text-muted-foreground">
                                                        {data.doctor?.bio || "No biography available."}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Clinic</h4>
                                                        <div className="p-3 bg-muted/10 rounded-lg border flex items-center gap-3">
                                                            <Building className="w-4 h-4 text-primary shrink-0" />
                                                            <span className="font-medium truncate">{data.doctor?.clinicName || "N/A"}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Hospital</h4>
                                                        <div className="p-3 bg-muted/10 rounded-lg border flex items-center gap-3">
                                                            <Building className="w-4 h-4 text-primary shrink-0" />
                                                            <span className="font-medium truncate">{data.doctor?.hospitalName || "N/A"}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">License</h4>
                                                    <div className="p-3 bg-muted/10 rounded-lg border flex items-center gap-3">
                                                        <Stethoscope className="w-4 h-4 text-primary" />
                                                        <span className="font-mono font-medium">{data.doctor?.licenseNumber || "Not Provided"}</span>
                                                    </div>
                                                </div>

                                                {(data.doctor?.idProof || data.doctor?.associationProof) && (
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Documents</h4>
                                                        <div className="flex flex-wrap gap-3">
                                                            {data.doctor?.idProof && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="gap-2 h-9"
                                                                    onClick={() => window.open(data.doctor.idProof, '_blank')}
                                                                >
                                                                    <FileText className="w-4 h-4 text-primary" /> View ID Proof
                                                                </Button>
                                                            )}
                                                            {data.doctor?.associationProof && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="gap-2 h-9"
                                                                    onClick={() => window.open(data.doctor.associationProof, '_blank')}
                                                                >
                                                                    <Building className="w-4 h-4 text-primary" /> View Association Proof
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
