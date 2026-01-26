"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Mail, MapPin, Phone, User, Stethoscope, Upload, CheckCircle, AlertCircle, FileText, Loader2, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export default function ProfilePage() {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null); // Track which file is uploading

    // Form State
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        bio: "",
        clinicName: "",
        address: "",
        city: "",
        zip: "",
        profilePhoto: "",
        idProof: "",
        associationProof: ""
    });

    const [completionPercentage, setCompletionPercentage] = useState(0);

    // Calculate completion percentage
    useEffect(() => {
        const fields = [
            formData.firstName, formData.lastName, formData.email, formData.phone,
            formData.bio, formData.clinicName, formData.address,
            formData.city, formData.zip, formData.profilePhoto, formData.idProof, formData.associationProof
        ];
        const filled = fields.filter(f => f && f.trim() !== "").length;
        setCompletionPercentage(Math.round((filled / fields.length) * 100));
    }, [formData]);

    // Fetch Profile Data on Mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/doctor/profile");
                if (!res.ok) throw new Error("Failed to fetch profile");
                const data = await res.json();

                if (data.success && data.doctor) {
                    const d = data.doctor;
                    console.log("Fetched Profile Photo URL:", d.profilePhoto);
                    setFormData(prev => ({
                        ...prev,
                        firstName: d.firstName || "",
                        lastName: d.lastName || "",
                        email: d.email || "",
                        phone: d.phone || "",
                        bio: d.bio || "",
                        clinicName: d.clinicName || "",
                        address: d.address || "",
                        city: d.city || "",
                        zip: d.zip || "",
                        profilePhoto: d.profilePhoto || "",
                        idProof: d.idProof || "",
                        associationProof: d.associationProof || ""
                    }));
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast.error("Failed to load profile data.");
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(type);
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        uploadFormData.append("type", type);

        try {
            // 1. Upload to S3
            const res = await fetch("/api/upload", {
                method: "POST",
                body: uploadFormData,
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Upload failed details:", res.status, errorText);
                throw new Error(`Upload failed: ${res.status} ${errorText}`);
            }

            const data = await res.json();
            const uploadedUrl = data.url;

            // 2. Update Local State
            setFormData(prev => ({ ...prev, [type]: uploadedUrl }));

            // 3. PERSIST IMMEDIATELY TO DB (Only for profile photo)
            if (type === "profilePhoto") {
                const patchRes = await fetch("/api/doctor/profile", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...formData, profilePhoto: uploadedUrl }) // Send updated URL
                });

                if (!patchRes.ok) {
                    throw new Error("Failed to save photo to profile.");
                }
                toast.success("Profile photo updated successfully.");
            } else {
                toast.success(`${type} uploaded successfully.`);
            }

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "There was an error uploading your file.");
        } finally {
            setUploading(null);
        }
    };

    const handleDeletePhoto = async () => {
        if (!confirm("Are you sure you want to remove your profile photo?")) return;

        setLoading(true);
        try {
            const res = await fetch("/api/doctor/profile/photo", {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Delete failed");

            setFormData(prev => ({ ...prev, profilePhoto: "" }));
            toast.success("Profile photo removed.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to remove profile photo.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/doctor/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Update failed details:", res.status, errorText);
                throw new Error(`Update failed: ${res.status} ${errorText}`);
            }

            toast.success("Profile updated successfully.");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Could not save profile changes.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">My Profile</h1>
                    <p className="text-muted-foreground">Manage your personal information and clinic details.</p>
                </div>
                <div className="flex items-center gap-4 bg-card p-4 rounded-lg border shadow-sm w-full md:w-auto min-w-[300px]">
                    <div className="space-y-1 w-full">
                        <div className="flex justify-between text-sm font-medium">
                            <span>Profile Completion</span>
                            <span className={completionPercentage === 100 ? "text-green-600" : "text-primary"}>
                                {completionPercentage}%
                            </span>
                        </div>
                        <Progress value={completionPercentage} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                            {completionPercentage < 100 ? "Complete your profile to get better visibility." : "Your profile is fully complete!"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-12">
                {/* Profile Sidebar */}
                <Card className="md:col-span-4 lg:col-span-3 h-fit">
                    <CardContent className="pt-6 text-center">
                        <div className="relative mx-auto w-32 h-32 mb-4 group">
                            <input
                                type="file"
                                id="profilePhoto"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, "profilePhoto")}
                                disabled={uploading === "profilePhoto"}
                            />
                            <Label htmlFor="profilePhoto" className="cursor-pointer relative block">
                                <Avatar className="w-full h-full border-4 border-background shadow-xl">
                                    <AvatarImage src={formData.profilePhoto || "/avatars/doctor-default.png"} alt="Doctor" className="object-cover" />
                                    <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                                        {formData.firstName?.[0]}{formData.lastName?.[0]}
                                    </AvatarFallback>
                                </Avatar>

                                {/* Loading Spinner Overlay */}
                                {uploading === "profilePhoto" && (
                                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center z-20">
                                        <Loader2 className="h-8 w-8 text-white animate-spin" />
                                    </div>
                                )}

                                {/* Hover Overlay with Camera Icon */}
                                {!uploading && (
                                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <Camera className="h-8 w-8 text-white" />
                                    </div>
                                )}
                            </Label>

                            {/* Remove Button - Outside label to prevent triggering file input */}
                            {formData.profilePhoto && !uploading && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDeletePhoto();
                                    }}
                                    className="absolute -bottom-2 -right-2 p-2 bg-destructive text-destructive-foreground rounded-full shadow-lg hover:bg-destructive/90 transition-colors z-30"
                                    title="Remove Photo"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        <h2 className="text-xl font-bold">Dr. {formData.firstName} {formData.lastName}</h2>
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5 mt-1">
                            <Stethoscope className="h-3.5 w-3.5" />
                            Cardiologist
                        </p>

                        <div className="mt-6 flex flex-col gap-2">
                            <Button className="w-full" onClick={handleSave} disabled={loading}>
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>

                        <div className="mt-6 text-left space-y-4 text-sm">
                            <Separator />
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="truncate">{formData.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{formData.phone}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{formData.city || "Location not set"}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Profile Details Form */}
                <div className="md:col-span-8 lg:col-span-9 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>
                                Update your personal details and contact information.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" value={formData.firstName} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" value={formData.lastName} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" value={formData.email} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                                            +91
                                        </span>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="rounded-l-none"
                                            placeholder="98765 43210"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Professional Bio</Label>
                                <Textarea
                                    id="bio"
                                    className="min-h-[80px]"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    placeholder="Brief introduction..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Clinic Details</CardTitle>
                            <CardDescription>
                                Information about your primary clinic location.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="clinicName">Clinic Name</Label>
                                <Input id="clinicName" value={formData.clinicName} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" value={formData.address} onChange={handleInputChange} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" value={formData.city} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="zip">Pincode</Label>
                                    <Input id="zip" value={formData.zip} onChange={handleInputChange} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Documents & Verification</CardTitle>
                            <CardDescription>
                                Upload necessary documents for verification.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* ID Proof */}
                                <div className="space-y-3">
                                    <Label>ID Proof (Aadhar/PAN/Passport)</Label>
                                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors relative">
                                        {formData.idProof ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <FileText className="h-10 w-10 text-primary" />
                                                <p className="text-sm font-medium text-primary break-all max-w-[200px]">Document Uploaded</p>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <a href={formData.idProof} target="_blank" rel="noopener noreferrer">View</a>
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                                <p className="text-sm font-medium">Click to upload</p>
                                                <p className="text-xs text-muted-foreground">PDF, JPG or PNG (Max 5MB)</p>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept="application/pdf,image/*"
                                            onChange={(e) => handleFileUpload(e, "idProof")}
                                            disabled={uploading === "idProof"}
                                        />
                                        {uploading === "idProof" && (
                                            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Association Proof */}
                                <div className="space-y-3">
                                    <Label>Medical Council Registration</Label>
                                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors relative">
                                        {formData.associationProof ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <FileText className="h-10 w-10 text-primary" />
                                                <p className="text-sm font-medium text-primary break-all max-w-[200px]">Document Uploaded</p>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <a href={formData.associationProof} target="_blank" rel="noopener noreferrer">View</a>
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                                <p className="text-sm font-medium">Click to upload</p>
                                                <p className="text-xs text-muted-foreground">PDF, JPG or PNG (Max 5MB)</p>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept="application/pdf,image/*"
                                            onChange={(e) => handleFileUpload(e, "associationProof")}
                                            disabled={uploading === "associationProof"}
                                        />
                                        {uploading === "associationProof" && (
                                            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline">Cancel</Button>
                        <Button onClick={handleSave} disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}