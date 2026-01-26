"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Loader2,
    Pencil,
    Save,
    X,
    CheckCircle,
    Stethoscope,
    Mail,
    Phone,
    User,
    FileText,
    Shield,
    Eye
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DoctorDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    doctorId: string | null;
}

interface DoctorData {
    id: string;
    userId: string;
    licenseNumber: string | null;
    bio: string | null;
    experienceYears: number | null;
    consultationFee: number | null;
    qualification: string | null;
    clinicPhone: string | null;
    clinicName: string | null;
    hospitalName: string | null;
    timeZone: string;
    profilePhoto: string | null;
    idProof: string | null;
    associationProof: string | null;
    isProfileComplete: boolean;
    profileCompletionPercentage: number | null;
    specializations: { id: string; name: string }[];
    // User relations
    user: {
        name: string;
        email: string;
        phone: string | null;
        isVerified: boolean;
        status: string;
        createdAt: Date;
    };
}

export function DoctorDetailsModal({
    isOpen,
    onClose,
    doctorId,
}: DoctorDetailsModalProps) {
    const [data, setData] = useState<DoctorData | null>(null);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [viewingDoc, setViewingDoc] = useState<{ url: string; type: string } | null>(null);

    // Form state
    const [formData, setFormData] = useState<Partial<DoctorData> & { name?: string; phone?: string; isVerified?: boolean; status?: string }>({});

    useEffect(() => {
        if (isOpen && doctorId) {
            fetchDoctorDetails();
            setIsEditing(false);
        }
    }, [isOpen, doctorId]);

    const fetchDoctorDetails = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/user/doctor/${doctorId}`);
            if (!res.ok) throw new Error("Failed to fetch doctor");
            const doctor = await res.json();
            setData(doctor);
            setFormData({
                ...doctor,
                name: doctor.user.name,
                phone: doctor.user.phone || "",
                isVerified: doctor.user.isVerified,
                status: doctor.user.status,
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to load doctor details");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await fetch(`/api/user/doctor/${doctorId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to update doctor");

            toast.success("Doctor updated successfully");
            setIsEditing(false);
            fetchDoctorDetails(); // Refresh data
        } catch (error) {
            console.error(error);
            toast.error("Failed to update doctor");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[85vw] w-[85vw] h-[85vh] sm:max-w-[85vw] flex flex-col p-0 overflow-hidden shadow-2xl md:rounded-2xl border-none ring-1 ring-black/5 bg-background">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b bg-muted/30">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                            <X className="w-5 h-5 text-muted-foreground" />
                        </Button>
                        <div>
                            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                                {isEditing ? "Edit Doctor Profile" : "Doctor Profile"}
                            </DialogTitle>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                Manage doctor details, documents and account status
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {!isEditing && !loading && (
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(true)}
                                className="shadow-sm hover:shadow-md transition-all gap-2"
                            >
                                <Pencil className="w-4 h-4" />
                                Edit Doctor
                            </Button>
                        )}
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
                                    <p className="text-sm text-primary font-medium mt-1 flex items-center gap-1.5">
                                        <Stethoscope className="w-3.5 h-3.5" />
                                        {data.specializations?.map(s => s.name).join(", ") || "No Specialization"}
                                    </p>
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
                                            <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Exp</div>
                                            <div className="text-lg font-bold text-foreground">{data.experienceYears || 0}<span className="text-xs font-normal text-muted-foreground ml-0.5">yrs</span></div>
                                        </div>
                                        <div className="p-3 bg-background rounded-lg border text-center">
                                            <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Fee</div>
                                            <div className="text-lg font-bold text-foreground">₹{data.consultationFee || 0}</div>
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
                                            {/* @ts-ignore - Assuming createdAt exists on user */}
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
                                                <TabsTrigger value="clinic" className="rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Clinic & Hospital</TabsTrigger>
                                                <TabsTrigger value="documents" className="rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Documents</TabsTrigger>
                                            </TabsList>

                                            {/* OVERVIEW TAB */}
                                            <TabsContent value="overview" className="space-y-8 mt-0">
                                                {/* Bio Section */}
                                                <div>
                                                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                                                        About Doctor
                                                    </h3>
                                                    {isEditing ? (
                                                        <Textarea
                                                            value={formData.bio || ""}
                                                            onChange={(e) => handleChange("bio", e.target.value)}
                                                            rows={5}
                                                            className="resize-none"
                                                            placeholder="Enter doctor's biography..."
                                                        />
                                                    ) : (
                                                        <div className="text-sm p-6 bg-muted/30 rounded-xl border leading-relaxed text-muted-foreground">
                                                            {data.bio || "No biography available."}
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
                                                        <Label>Qualification</Label>
                                                        {isEditing ? (
                                                            <Input value={formData.qualification || ""} onChange={(e) => handleChange("qualification", e.target.value)} />
                                                        ) : (
                                                            <div className="p-3 border rounded-md bg-muted/20 text-sm">{data.qualification || "N/A"}</div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label>Experience (Years)</Label>
                                                        {isEditing ? (
                                                            <Input type="number" value={formData.experienceYears || ""} onChange={(e) => handleChange("experienceYears", e.target.value)} />
                                                        ) : (
                                                            <div className="p-3 border rounded-md bg-muted/20 text-sm">{data.experienceYears || 0} Years</div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label>Consultation Fee (₹)</Label>
                                                        {isEditing ? (
                                                            <Input type="number" value={formData.consultationFee || ""} onChange={(e) => handleChange("consultationFee", e.target.value)} />
                                                        ) : (
                                                            <div className="p-3 border rounded-md bg-muted/20 text-sm">₹{data.consultationFee || 0}</div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label>License Number</Label>
                                                        {isEditing ? (
                                                            <Input value={formData.licenseNumber || ""} onChange={(e) => handleChange("licenseNumber", e.target.value)} />
                                                        ) : (
                                                            <div className="p-3 border rounded-md bg-muted/20 text-sm font-mono">{data.licenseNumber || "N/A"}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </TabsContent>

                                            {/* CLINIC TAB */}
                                            <TabsContent value="clinic" className="space-y-6 mt-0">
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-3">
                                                        <Label>Clinic Name</Label>
                                                        {isEditing ? (
                                                            <Input value={formData.clinicName || ""} onChange={(e) => handleChange("clinicName", e.target.value)} />
                                                        ) : (
                                                            <div className="p-3 border rounded-md bg-muted/20 text-sm">{data.clinicName || "N/A"}</div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label>Clinic Phone</Label>
                                                        {isEditing ? (
                                                            <Input value={formData.clinicPhone || ""} onChange={(e) => handleChange("clinicPhone", e.target.value)} />
                                                        ) : (
                                                            <div className="p-3 border rounded-md bg-muted/20 text-sm">{data.clinicPhone || "N/A"}</div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label>Hospital Association</Label>
                                                        {isEditing ? (
                                                            <Input value={formData.hospitalName || ""} onChange={(e) => handleChange("hospitalName", e.target.value)} />
                                                        ) : (
                                                            <div className="p-3 border rounded-md bg-muted/20 text-sm">{data.hospitalName || "N/A"}</div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label>Time Zone</Label>
                                                        <div className="p-3 border rounded-md bg-muted/20 text-sm text-muted-foreground">{data.timeZone}</div>
                                                    </div>
                                                </div>
                                            </TabsContent>

                                            {/* DOCUMENTS TAB */}
                                            <TabsContent value="documents" className="space-y-6 mt-0">
                                                <div className="grid grid-cols-1 gap-4">
                                                    {/* ID PROOF */}
                                                    <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/10 hover:bg-muted/30 transition-colors">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                                                                <FileText className="w-6 h-6 text-blue-600" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-foreground">Identity Proof</p>
                                                                <p className="text-xs text-muted-foreground">Govt. issued ID (Aadhar/PAN/Passport)</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {data.idProof ? (
                                                                <Button variant="outline" size="sm" onClick={() => setViewingDoc({ url: data.idProof!, type: "Identity Proof" })}>
                                                                    <Eye className="w-4 h-4 mr-2" />
                                                                    View Document
                                                                </Button>
                                                            ) : (
                                                                <Badge variant="outline" className="text-muted-foreground">Not Uploaded</Badge>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* ASSOCIATION/REGISTRATION PROOF */}
                                                    <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/10 hover:bg-muted/30 transition-colors">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                                                                <Shield className="w-6 h-6 text-purple-600" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-foreground">Medical Registration</p>
                                                                <p className="text-xs text-muted-foreground">Medical Council Registration Certificate</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {data.associationProof ? (
                                                                <Button variant="outline" size="sm" onClick={() => setViewingDoc({ url: data.associationProof!, type: "Registration Proof" })}>
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

                {/* Footer only needs to exist maybe? Or handled in header as done previously */}
                {/* We moved actions to header for cleaner UI, but can add a status bar footer if needed */}

            </DialogContent>

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
            </Dialog>
        </Dialog>
    );
}
