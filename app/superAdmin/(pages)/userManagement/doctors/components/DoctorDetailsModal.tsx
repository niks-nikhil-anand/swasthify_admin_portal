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
import { Separator } from "@/components/ui/separator";
import { Loader2, Pencil, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

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
    // User relations
    user: {
        name: string;
        email: string;
        phone: string | null;
        isVerified: boolean;
        status: string;
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
            <DialogContent className="max-w-[70vw] w-[70vw] h-[70vh] sm:max-w-[70vw] flex flex-col p-0 overflow-hidden shadow-2xl md:rounded-2xl border-none ring-1 ring-black/5">
                <DialogHeader className="px-8 py-6 border-b bg-gray-50/50">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900 mr-5">
                            {isEditing ? "Edit Doctor Details" : "Doctor Details"}
                        </DialogTitle>
                        {!isEditing && !loading && data && (
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => setIsEditing(true)}
                                className="shadow-sm hover:shadow-md transition-all"
                            >
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit Doctor
                            </Button>
                        )}
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto bg-gray-50/30">
                    {loading ? (
                        <div className="flex items-center justify-center h-full py-10">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : data ? (
                        <div className="space-y-8 px-8 py-8">
                            {/* Personal Information */}
                            <section className="bg-white p-6 rounded-xl border shadow-sm">
                                <h3 className="text-lg font-semibold mb-6 flex items-center text-gray-800">
                                    <div className="w-1 h-6 bg-primary rounded-full mr-3"></div>
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2.5">
                                        <Label className="text-muted-foreground font-medium">Full Name</Label>
                                        {isEditing ? (
                                            <Input
                                                value={formData.name || ""}
                                                onChange={(e) => handleChange("name", e.target.value)}
                                                className="h-10"
                                            />
                                        ) : (
                                            <div className="text-sm font-medium p-3 bg-gray-50 rounded-lg border border-gray-100/50">
                                                {data.user.name || "N/A"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2.5">
                                        <Label className="text-muted-foreground font-medium">Email</Label>
                                        <div className="text-sm font-medium p-3 bg-gray-50 rounded-lg border border-gray-100/50 text-gray-700">
                                            {data.user.email || "N/A"}
                                        </div>
                                    </div>
                                    <div className="space-y-2.5">
                                        <Label className="text-muted-foreground font-medium">Phone</Label>
                                        {isEditing ? (
                                            <Input
                                                value={formData.phone || ""}
                                                onChange={(e) => handleChange("phone", e.target.value)}
                                                className="h-10"
                                            />
                                        ) : (
                                            <div className="text-sm font-medium p-3 bg-gray-50 rounded-lg border border-gray-100/50">
                                                {data.user.phone || "N/A"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2.5">
                                        <Label className="text-muted-foreground font-medium">Time Zone</Label>
                                        <div className="text-sm font-medium p-3 bg-gray-50 rounded-lg border border-gray-100/50 text-gray-700">
                                            {data.timeZone || "N/A"}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Status & Verification */}
                            <section className="bg-white p-6 rounded-xl border shadow-sm">
                                <h3 className="text-lg font-semibold mb-6 flex items-center text-gray-800">
                                    <div className="w-1 h-6 bg-primary rounded-full mr-3"></div>
                                    Account Status
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2.5">
                                        <Label className="text-muted-foreground font-medium">Status</Label>
                                        {isEditing ? (
                                            <Select
                                                value={formData.status}
                                                onValueChange={(val) => handleChange("status", val)}
                                            >
                                                <SelectTrigger className="h-10">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                                    <SelectItem value="PENDING">Pending</SelectItem>
                                                    <SelectItem value="BLOCKED">Blocked</SelectItem>
                                                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <div className="flex items-center h-10 px-1">
                                                <Badge
                                                    className="px-3 py-1 text-sm font-medium"
                                                    variant={
                                                        data.user.status === "ACTIVE"
                                                            ? "success"
                                                            : data.user.status === "BLOCKED"
                                                                ? "destructive"
                                                                : "secondary"
                                                    }
                                                >
                                                    {data.user.status}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2.5">
                                        <Label className="text-muted-foreground font-medium">Verification</Label>
                                        {isEditing ? (
                                            <Select
                                                value={formData.isVerified ? "true" : "false"}
                                                onValueChange={(val) => handleChange("isVerified", val === "true")}
                                            >
                                                <SelectTrigger className="h-10">
                                                    <SelectValue placeholder="Verification status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="true">Verified</SelectItem>
                                                    <SelectItem value="false">Not Verified</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <div className="flex items-center h-10 px-1">
                                                <Badge
                                                    className="px-3 py-1 text-sm font-medium"
                                                    variant={data.user.isVerified ? "success" : "secondary"}
                                                >
                                                    {data.user.isVerified ? "Verified" : "Not Verified"}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Professional Details */}
                            <section className="bg-white p-6 rounded-xl border shadow-sm">
                                <h3 className="text-lg font-semibold mb-6 flex items-center text-gray-800">
                                    <div className="w-1 h-6 bg-primary rounded-full mr-3"></div>
                                    Professional Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2.5">
                                        <Label className="text-muted-foreground font-medium">Qualification</Label>
                                        {isEditing ? (
                                            <Input
                                                value={formData.qualification || ""}
                                                onChange={(e) => handleChange("qualification", e.target.value)}
                                                className="h-10"
                                            />
                                        ) : (
                                            <div className="text-sm font-medium p-3 bg-gray-50 rounded-lg border border-gray-100/50">
                                                {data.qualification || "N/A"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2.5">
                                        <Label className="text-muted-foreground font-medium">Experience</Label>
                                        {isEditing ? (
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    value={formData.experienceYears || ""}
                                                    onChange={(e) => handleChange("experienceYears", e.target.value)}
                                                    className="h-10 pr-12"
                                                />
                                                <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">Years</span>
                                            </div>
                                        ) : (
                                            <div className="text-sm font-medium p-3 bg-gray-50 rounded-lg border border-gray-100/50">
                                                {data.experienceYears !== null ? `${data.experienceYears} Years` : "N/A"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2.5">
                                        <Label className="text-muted-foreground font-medium">License Number</Label>
                                        {isEditing ? (
                                            <Input
                                                value={formData.licenseNumber || ""}
                                                onChange={(e) => handleChange("licenseNumber", e.target.value)}
                                                className="h-10"
                                            />
                                        ) : (
                                            <div className="text-sm font-medium p-3 bg-gray-50 rounded-lg border border-gray-100/50 font-mono">
                                                {data.licenseNumber || "N/A"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2.5">
                                        <Label className="text-muted-foreground font-medium">Consultation Fee</Label>
                                        {isEditing ? (
                                            <div className="relative">
                                                <span className="absolute left-3 top-2.5 text-sm text-muted-foreground">₹</span>
                                                <Input
                                                    type="number"
                                                    value={formData.consultationFee || ""}
                                                    onChange={(e) => handleChange("consultationFee", e.target.value)}
                                                    className="h-10 pl-7"
                                                />
                                            </div>
                                        ) : (
                                            <div className="text-sm font-medium p-3 bg-gray-50 rounded-lg border border-gray-100/50">
                                                {data.consultationFee !== null ? `₹${data.consultationFee}` : "N/A"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-6 space-y-2.5">
                                    <Label className="text-muted-foreground font-medium">Bio</Label>
                                    {isEditing ? (
                                        <Textarea
                                            value={formData.bio || ""}
                                            onChange={(e) => handleChange("bio", e.target.value)}
                                            rows={4}
                                            className="resize-none"
                                        />
                                    ) : (
                                        <div className="text-sm p-4 bg-gray-50 rounded-lg border border-gray-100/50 min-h-[100px] whitespace-pre-wrap leading-relaxed text-gray-700">
                                            {data.bio || "No biography available."}
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Clinic Information */}
                            <section className="bg-white p-6 rounded-xl border shadow-sm">
                                <h3 className="text-lg font-semibold mb-6 flex items-center text-gray-800">
                                    <div className="w-1 h-6 bg-primary rounded-full mr-3"></div>
                                    Clinic Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2.5">
                                        <Label className="text-muted-foreground font-medium">Clinic Name</Label>
                                        {isEditing ? (
                                            <Input
                                                value={formData.clinicName || ""}
                                                onChange={(e) => handleChange("clinicName", e.target.value)}
                                                className="h-10"
                                            />
                                        ) : (
                                            <div className="text-sm font-medium p-3 bg-gray-50 rounded-lg border border-gray-100/50">
                                                {data.clinicName || "N/A"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2.5">
                                        <Label className="text-muted-foreground font-medium">Hospital Name</Label>
                                        {isEditing ? (
                                            <Input
                                                value={formData.hospitalName || ""}
                                                onChange={(e) => handleChange("hospitalName", e.target.value)}
                                                className="h-10"
                                            />
                                        ) : (
                                            <div className="text-sm font-medium p-3 bg-gray-50 rounded-lg border border-gray-100/50">
                                                {data.hospitalName || "N/A"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2.5">
                                        <Label className="text-muted-foreground font-medium">Clinic Phone</Label>
                                        {isEditing ? (
                                            <Input
                                                value={formData.clinicPhone || ""}
                                                onChange={(e) => handleChange("clinicPhone", e.target.value)}
                                                className="h-10"
                                            />
                                        ) : (
                                            <div className="text-sm font-medium p-3 bg-gray-50 rounded-lg border border-gray-100/50">
                                                {data.clinicPhone || "N/A"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            No data available
                        </div>
                    )}
                </div>

                {isEditing && (
                    <DialogFooter className="px-6 py-4 border-t">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsEditing(false);
                                setFormData({
                                    ...data!,
                                    name: data?.user.name,
                                    phone: data?.user.phone || "",
                                    isVerified: data?.user.isVerified,
                                    status: data?.user.status,
                                });
                            }}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                )}

                {!isEditing && (
                    <DialogFooter className="px-6 py-4 border-t">
                        <Button variant="secondary" onClick={onClose}>Close</Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
