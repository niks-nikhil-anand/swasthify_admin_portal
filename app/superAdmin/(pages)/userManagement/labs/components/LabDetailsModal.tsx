"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Loader2,
    Save,
    X,
    CheckCircle,
    Mail,
    Phone,
    User,
    Globe,
    FileText,
    MapPin,
    Shield,
    Eye,
    Lock,
    Megaphone,
    FlaskConical,

} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { LabCampaignDetailsModal } from "../../../operations/campaigns/components/LabCampaignDetailsModal";

interface LabDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    labId: string | null;
    defaultEditing?: boolean;
}

const AVAILABLE_PERMISSIONS = [
    "profile",
    "appointments",
    "patients",
    "test_management", // Specific to labs potentially, or just reuse general ones
    "reports",
    "billing",
    "analytics",
    "support"
];

interface LabData {
    id: string;
    userId: string;
    licenseNumber: string | null;
    description: string | null;
    website: string | null;
    testTypes: string[];
    averageRating: number;
    totalReviews: number;
    profilePhoto: string | null;
    ownerIdProof: string | null;
    addressProof: string | null;
    isProfileComplete: boolean;
    profileCompletionPercentage: number;
    permissions: string[];
    // User relations
    user: {
        name: string;
        email: string;
        phone: string | null;
        isVerified: boolean;
        status: string;
        createdAt: Date;
    };
    addresses: {
        id: string;
        street: string | null;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        label: string | null;
        isDefault: boolean;
    }[];
    campaigns?: Campaign[];
}

interface Campaign {
    id: string;
    name: string;
    type: string;
    status: string;
    startDate: string;
    endDate: string;
    isVerified: boolean;
}

export function LabDetailsModal({
    isOpen,
    onClose,
    labId,
    defaultEditing = false,
}: LabDetailsModalProps) {
    const [data, setData] = useState<LabData | null>(null);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(defaultEditing);
    const [saving, setSaving] = useState(false);
    const [viewingDoc, setViewingDoc] = useState<{ url: string; type: string } | null>(null);

    // Campaign Details State
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
    const [showCampaignDetails, setShowCampaignDetails] = useState(false);

    // Form state
    const [formData, setFormData] = useState<Partial<LabData> & { name?: string; phone?: string; isVerified?: boolean; status?: string }>({});

    useEffect(() => {
        if (isOpen && labId) {
            fetchLabDetails();
            setIsEditing(defaultEditing);
        }
    }, [isOpen, labId, defaultEditing]);

    const fetchLabDetails = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/user/lab/${labId}`);
            if (!res.ok) throw new Error("Failed to fetch lab");
            const lab = await res.json();
            setData(lab);
            setFormData({
                ...lab,
                name: lab.user.name,
                phone: lab.user.phone || "",
                isVerified: lab.user.isVerified,
                status: lab.user.status,
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to load lab details");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await fetch(`/api/user/lab/${labId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to update lab");

            toast.success("Lab updated successfully");
            setIsEditing(false);
            fetchLabDetails(); // Refresh data
        } catch (error) {
            console.error(error);
            toast.error("Failed to update lab");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field: string, value: any) => {
        if (field === "isVerified" && value === true) {
            const completion = data?.profileCompletionPercentage || 0;
            if (completion < 80) {
                toast.error(`Cannot verify lab. Profile completion is only ${completion}%. Minimum 80% required.`);
                return;
            }
        }
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleTestTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const types = e.target.value.split(",").map(item => item.trim());
        setFormData(prev => ({ ...prev, testTypes: types }));
    };

    const handlePermissionToggle = (permission: string) => {
        setFormData(prev => {
            const current = new Set(prev.permissions || data?.permissions || []);
            if (current.has(permission)) {
                current.delete(permission);
            } else {
                current.add(permission);
            }
            return { ...prev, permissions: Array.from(current) };
        });
    };

    if (!isOpen) return null;

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent showCloseButton={false} className="max-w-[60vw] w-[60vw] h-[85vh] sm:max-w-[60vw] flex flex-col p-0 overflow-hidden shadow-2xl md:rounded-2xl border-none ring-1 ring-black/5 bg-background">
                    {/* Header */}
                    <div className="flex items-center justify-between px-8 py-5 border-b bg-muted/30">
                        <div className="flex items-center gap-4">
                            <div>
                                <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                                    {isEditing ? "Edit Lab Profile" : "Lab Profile"}
                                </DialogTitle>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                    Manage lab details, documents and account status
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                                <X className="w-5 h-5 text-muted-foreground" />
                            </Button>

                            {isEditing && (
                                <>
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setIsEditing(false);
                                            // Reset form
                                            if (data) {
                                                setFormData({
                                                    ...data,
                                                    name: data.user.name,
                                                    phone: data.user.phone || "",
                                                    isVerified: data.user.isVerified,
                                                    status: data.user.status,
                                                });
                                            }
                                        }}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSave} disabled={saving} className="gap-2">
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Save Changes
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden flex relative">
                        {loading ? (
                            <div className="flex items-center justify-center w-full h-full">
                                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                            </div>
                        ) : data ? (
                            <div className="flex w-full h-full">
                                {/* Left Sidebar - Profile Summary */}
                                <div className="w-[320px] bg-muted/20 border-r flex flex-col overflow-y-auto shrink-0 p-6 space-y-6">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="relative mb-4">
                                            <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                                                <AvatarImage src={data.profilePhoto || ""} className="object-cover" />
                                                <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                                                    {data.user.name?.[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="absolute bottom-1 right-1">
                                                <Badge variant={data.user.isVerified ? "success" : "secondary"} className="shadow-sm border-white border-2">
                                                    {data.user.isVerified ? <CheckCircle className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                                                    {data.user.isVerified ? "Verified" : "Unverified"}
                                                </Badge>
                                            </div>
                                        </div>
                                        <h2 className="text-xl font-bold text-foreground">{data.user.name}</h2>
                                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                            <Badge variant={data.user.status === "ACTIVE" ? "default" : "secondary"} className={
                                                cn("uppercase text-[10px] tracking-wider",
                                                    data.user.status === "ACTIVE" ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200" :
                                                        data.user.status === "BLOCKED" ? "bg-red-100 text-red-700 hover:bg-red-200 border-red-200" :
                                                            "bg-gray-100 text-gray-700 border-gray-200")
                                            }>
                                                {data.user.status}
                                            </Badge>
                                            <Badge variant="outline" className="text-[10px] text-muted-foreground">
                                                ID: {data.id.substring(0, 8)}...
                                            </Badge>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground font-medium">Profile Completion</span>
                                                <span className="text-primary font-bold">{data.profileCompletionPercentage || 0}%</span>
                                            </div>
                                            <Progress value={data.profileCompletionPercentage || 0} className="h-2" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 pt-2">
                                            <div className="p-3 bg-background rounded-lg border text-center">
                                                <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Rating</div>
                                                <div className="text-lg font-bold text-foreground flex items-center justify-center gap-1">
                                                    {data.averageRating || 0} <span className="text-yellow-500">★</span>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-background rounded-lg border text-center">
                                                <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Reviews</div>
                                                <div className="text-lg font-bold text-foreground">{data.totalReviews || 0}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                                <Mail className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-xs text-muted-foreground font-medium">Email Address</p>
                                                <p className="truncate text-foreground" title={data.user.email}>{data.user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                                <Phone className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-muted-foreground font-medium">Phone Number</p>
                                                <p className="text-foreground">{data.user.phone || "N/A"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                                                <User className="w-4 h-4 text-purple-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-muted-foreground font-medium">Joined On</p>
                                                <p className="text-foreground">{data.user.createdAt ? new Date(data.user.createdAt).toLocaleDateString() : "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Content Areas */}
                                <div className="flex-1 overflow-hidden bg-background">
                                    <ScrollArea className="h-full">
                                        <div className="p-8 pb-20">
                                            <Tabs defaultValue="overview" className="w-full">
                                                <TabsList className="mb-8 w-full justify-start h-auto p-1 bg-muted/50 rounded-xl">
                                                    <TabsTrigger value="overview" className="rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
                                                    <TabsTrigger value="professional" className="rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Professional</TabsTrigger>
                                                    <TabsTrigger value="location" className="rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Contact & Location</TabsTrigger>
                                                    <TabsTrigger value="documents" className="rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Documents</TabsTrigger>
                                                    <TabsTrigger value="permissions" className="rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Permissions</TabsTrigger>
                                                    <TabsTrigger value="campaigns" className="rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Campaigns</TabsTrigger>
                                                </TabsList>

                                                {/* OVERVIEW TAB */}
                                                <TabsContent value="overview" className="space-y-8 mt-0">
                                                    {/* Description Section */}
                                                    <div>
                                                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                                                            About Lab
                                                        </h3>
                                                        {isEditing ? (
                                                            <Textarea
                                                                value={formData.description || ""}
                                                                onChange={(e) => handleChange("description", e.target.value)}
                                                                rows={5}
                                                                className="resize-none"
                                                                placeholder="Enter lab description..."
                                                            />
                                                        ) : (
                                                            <div className="text-sm p-6 bg-muted/30 rounded-xl border leading-relaxed text-muted-foreground">
                                                                {data.description || "No description available."}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Quick Status Management (only when editing) */}
                                                    {isEditing && (
                                                        <div className="grid grid-cols-2 gap-6 p-6 bg-muted/30 rounded-xl border">
                                                            <div className="space-y-3">
                                                                <Label>Account Status</Label>
                                                                <Select
                                                                    value={formData.status}
                                                                    onValueChange={(val) => handleChange("status", val)}
                                                                >
                                                                    <SelectTrigger className="bg-white">
                                                                        <SelectValue placeholder="Select status" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                                                        <SelectItem value="PENDING">Pending</SelectItem>
                                                                        <SelectItem value="BLOCKED">Blocked</SelectItem>
                                                                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="space-y-3">
                                                                <Label>Verification Status</Label>
                                                                <Select
                                                                    value={formData.isVerified ? "true" : "false"}
                                                                    onValueChange={(val) => handleChange("isVerified", val === "true")}
                                                                >
                                                                    <SelectTrigger className="bg-white">
                                                                        <SelectValue placeholder="Verification status" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="true">Verified</SelectItem>
                                                                        <SelectItem value="false">Not Verified</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    )}

                                                </TabsContent>

                                                {/* PROFESSIONAL TAB */}
                                                <TabsContent value="professional" className="space-y-6 mt-0">
                                                    <div className="grid grid-cols-2 gap-6">
                                                        <div className="space-y-3">
                                                            <Label>License Number</Label>
                                                            {isEditing ? (
                                                                <Input value={formData.licenseNumber || ""} onChange={(e) => handleChange("licenseNumber", e.target.value)} />
                                                            ) : (
                                                                <div className="p-3 border rounded-md bg-muted/20 text-sm font-mono">{data.licenseNumber || "N/A"}</div>
                                                            )}
                                                        </div>
                                                        <div className="space-y-3">
                                                            <Label>Website</Label>
                                                            {isEditing ? (
                                                                <Input value={formData.website || ""} onChange={(e) => handleChange("website", e.target.value)} />
                                                            ) : (
                                                                <div className="p-3 border rounded-md bg-muted/20 text-sm flex items-center gap-2">
                                                                    {data.website ? (
                                                                        <>
                                                                            <Globe className="w-3 h-3 text-muted-foreground" />
                                                                            <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{data.website}</a>
                                                                        </>
                                                                    ) : "N/A"}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <Label className="text-sm font-semibold text-gray-700 mb-3 block">Test Types Available</Label>
                                                        {isEditing ? (
                                                            <div className="space-y-2">
                                                                <Input
                                                                    value={formData.testTypes?.join(", ") || ""}
                                                                    onChange={handleTestTypeChange}
                                                                    placeholder="e.g. Blood Test, MRI, CT Scan (comma separated)"
                                                                    className="border-gray-300 focus:border-primary focus:ring-primary/20"
                                                                />
                                                                <p className="text-xs text-muted-foreground">Separate multiple types with commas</p>
                                                            </div>
                                                        ) : (
                                                            <div className="bg-muted/30 rounded-xl p-4 border border-dashed border-gray-200">
                                                                {data.testTypes && data.testTypes.length > 0 ? (
                                                                    <div className="grid grid-cols-2 gap-3">
                                                                        {data.testTypes.map((type, index) => (
                                                                            <div key={index} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow group">
                                                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                                                    <FlaskConical className="w-4 h-4" />
                                                                                </div>
                                                                                <span className="font-medium text-sm text-gray-700">{type}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-center py-6 text-muted-foreground bg-white rounded-lg border border-gray-100">
                                                                        <FlaskConical className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                                                        <p className="text-sm">No test types listed</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TabsContent>

                                                {/* LOCATION TAB */}
                                                <TabsContent value="location" className="space-y-6 mt-0">
                                                    {/* Contact Info */}
                                                    <div className="bg-white p-5 rounded-xl border shadow-sm mb-6">
                                                        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                                                            <div className="w-1 h-6 bg-primary rounded-full mr-3"></div>
                                                            Contact Information
                                                        </h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-gray-100">
                                                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                                                    <Mail className="w-5 h-5" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Email Address</p>
                                                                    <p className="font-medium text-gray-900">{data.user.email}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-gray-100">
                                                                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                                                    <Phone className="w-5 h-5" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Phone Number</p>
                                                                    <p className="font-medium text-gray-900">{data.user.phone || "N/A"}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800 px-1">
                                                        <div className="w-1 h-6 bg-primary rounded-full mr-3"></div>
                                                        Registered Addresses
                                                    </h3>
                                                    {data.addresses && data.addresses.length > 0 ? (
                                                        data.addresses.map((addr, idx) => (
                                                            <div key={addr.id} className="border rounded-xl bg-muted/5 p-4 relative">
                                                                {addr.isDefault && (
                                                                    <div className="absolute top-4 right-4">
                                                                        <Badge>Primary Address</Badge>
                                                                    </div>
                                                                )}
                                                                <div className="flex items-start gap-3">
                                                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-1">
                                                                        <MapPin className="w-5 h-5" />
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <p className="font-semibold text-foreground">{addr.label || `Address #${idx + 1}`}</p>
                                                                        <p className="text-sm text-foreground/80">{addr.street}</p>
                                                                        <p className="text-sm text-foreground/80">
                                                                            {addr.city}, {addr.state} - <span className="font-mono text-muted-foreground">{addr.zipCode}</span>
                                                                        </p>
                                                                        <p className="text-sm text-muted-foreground">{addr.country}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-xl bg-muted/10 text-muted-foreground">
                                                            <MapPin className="w-8 h-8 mb-2 opacity-50" />
                                                            <p>No addresses found</p>
                                                        </div>
                                                    )}

                                                </TabsContent>

                                                {/* DOCUMENTS TAB */}
                                                <TabsContent value="documents" className="space-y-6 mt-0">
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {/* OWNER ID PROOF */}
                                                        <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/10 hover:bg-muted/30 transition-colors">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                                                                    <FileText className="w-6 h-6 text-blue-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-foreground">Owner Identity Proof</p>
                                                                    <p className="text-xs text-muted-foreground">Govt. issued ID of the owner</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                {data.ownerIdProof ? (
                                                                    <Button variant="outline" size="sm" onClick={() => setViewingDoc({ url: data.ownerIdProof!, type: "Owner Identity Proof" })}>
                                                                        <Eye className="w-4 h-4 mr-2" />
                                                                        View Document
                                                                    </Button>
                                                                ) : (
                                                                    <Badge variant="outline" className="text-muted-foreground">Not Uploaded</Badge>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* ADDRESS PROOF */}
                                                        <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/10 hover:bg-muted/30 transition-colors">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                                                                    <Shield className="w-6 h-6 text-purple-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-foreground">Lab Address Proof</p>
                                                                    <p className="text-xs text-muted-foreground">Document verifying lab address</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                {data.addressProof ? (
                                                                    <Button variant="outline" size="sm" onClick={() => setViewingDoc({ url: data.addressProof!, type: "Address Proof" })}>
                                                                        <Eye className="w-4 h-4 mr-2" />
                                                                        View Document
                                                                    </Button>
                                                                ) : (
                                                                    <Badge variant="outline" className="text-muted-foreground">Not Uploaded</Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TabsContent>

                                                {/* PERMISSIONS TAB */}
                                                <TabsContent value="permissions" className="space-y-6 mt-0">
                                                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                                                        <h3 className="text-lg font-semibold mb-6 flex items-center text-gray-800">
                                                            <div className="w-1 h-6 bg-primary rounded-full mr-3"></div>
                                                            Access Permissions
                                                        </h3>

                                                        {isEditing ? (
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                                {AVAILABLE_PERMISSIONS.map((permission) => {
                                                                    const currentPermissions = formData.permissions || data.permissions || [];
                                                                    const isSelected = currentPermissions.includes(permission);

                                                                    return (
                                                                        <div
                                                                            key={permission}
                                                                            className={cn(
                                                                                "flex items-center p-3 border rounded-lg cursor-pointer transition-all",
                                                                                isSelected ? "bg-primary/5 border-primary" : "bg-muted/10 border-transparent hover:bg-muted/20"
                                                                            )}
                                                                            onClick={() => handlePermissionToggle(permission)}
                                                                        >
                                                                            <div className={cn(
                                                                                "w-5 h-5 rounded border mr-3 flex items-center justify-center transition-colors",
                                                                                isSelected ? "bg-primary border-primary" : "border-muted-foreground bg-white"
                                                                            )}>
                                                                                {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                                                            </div>
                                                                            <span className="text-sm font-medium capitalize">
                                                                                {permission.replace(/_/g, " ").toLowerCase()}
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        ) : (
                                                            data.permissions && data.permissions.length > 0 ? (
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                                    {data.permissions.map((permission, index) => (
                                                                        <div key={index} className="flex items-center p-3 bg-muted/20 border rounded-lg">
                                                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 shrink-0">
                                                                                <Lock className="w-4 h-4 text-blue-600" />
                                                                            </div>
                                                                            <span className="text-sm font-medium capitalize">
                                                                                {permission.replace(/_/g, " ").toLowerCase()}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground bg-muted/10 rounded-xl border border-dashed">
                                                                    <Lock className="w-10 h-10 mb-2 opacity-20" />
                                                                    <p>No specific permissions assigned.</p>
                                                                    <p className="text-xs mt-1">This user has default access only.</p>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </TabsContent>

                                                {/* CAMPAIGNS TAB */}
                                                <TabsContent value="campaigns" className="space-y-6 mt-0">
                                                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                                                        <h3 className="text-lg font-semibold mb-6 flex items-center text-gray-800">
                                                            <div className="w-1 h-6 bg-primary rounded-full mr-3"></div>
                                                            Lab Campaigns
                                                        </h3>

                                                        {data.campaigns && data.campaigns.length > 0 ? (
                                                            <div className="space-y-4">
                                                                {data.campaigns.map((campaign) => (
                                                                    <div key={campaign.id} className="flex items-center justify-between p-4 bg-muted/10 rounded-lg border hover:bg-muted/20 transition-all">
                                                                        <div className="flex items-center gap-4">
                                                                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                                                                <Megaphone className="w-5 h-5" />
                                                                            </div>
                                                                            <div>
                                                                                <h4 className="font-semibold text-gray-900">{campaign.name}</h4>
                                                                                <div className="flex items-center gap-2 mt-1">
                                                                                    <Badge variant="outline" className="text-xs font-normal">
                                                                                        {campaign.type.replace("_", " ")}
                                                                                    </Badge>
                                                                                    <span className="text-xs text-muted-foreground">
                                                                                        {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex flex-col items-end gap-2">
                                                                            <Badge variant={
                                                                                campaign.status === "ACTIVE" ? "success" :
                                                                                    campaign.status === "IN_REVIEW" ? "warning" :
                                                                                        campaign.status === "DRAFT" ? "secondary" : "outline"
                                                                            }>
                                                                                {campaign.status}
                                                                            </Badge>
                                                                            {campaign.isVerified && (
                                                                                <div className="flex items-center text-xs text-green-600 font-medium">
                                                                                    <CheckCircle className="w-3 h-3 mr-1" /> Verified
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex gap-2 mt-2">
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="h-7 text-xs gap-1"
                                                                                onClick={() => {
                                                                                    setSelectedCampaignId(campaign.id);
                                                                                    setShowCampaignDetails(true);
                                                                                }}
                                                                            >
                                                                                <Eye className="w-3 h-3" /> View Details
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground bg-muted/10 rounded-xl border border-dashed">
                                                                <Megaphone className="w-12 h-12 mb-3 text-muted-foreground/20" />
                                                                <p className="font-medium">No campaigns found</p>
                                                                <p className="text-sm mt-1">This lab hasn't created any campaigns yet.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TabsContent>
                                            </Tabs>
                                        </div>
                                    </ScrollArea>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center text-muted-foreground w-full h-full">
                                No data available
                            </div>
                        )}
                    </div>

                </DialogContent >
            </Dialog >

            {/* Document Viewer Modal */}
            <Dialog open={!!viewingDoc} onOpenChange={(open) => !open && setViewingDoc(null)}>
                <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden">
                    <div className="px-6 py-4 border-b flex items-center justify-between bg-muted/30">
                        <DialogTitle>{viewingDoc?.type}</DialogTitle>
                        <Button variant="ghost" size="icon" onClick={() => setViewingDoc(null)}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                    <div className="flex-1 bg-muted/20 relative flex items-center justify-center p-4">
                        {viewingDoc?.url && (
                            viewingDoc.url.toLowerCase().endsWith('.pdf') ? (
                                <iframe src={viewingDoc.url} className="w-full h-full rounded-lg shadow-sm border" title="Document Preview" />
                            ) : (
                                <img src={viewingDoc.url} alt="Document" className="max-w-full max-h-full object-contain rounded-lg shadow-sm" />
                            )
                        )}
                    </div>
                </DialogContent>
            </Dialog >

            {/* Campaign Details Modal */}
            <LabCampaignDetailsModal
                isOpen={showCampaignDetails}
                onClose={() => {
                    setShowCampaignDetails(false);
                    setSelectedCampaignId(null);
                }}
                campaignId={selectedCampaignId}
            />
        </>
    );
}
