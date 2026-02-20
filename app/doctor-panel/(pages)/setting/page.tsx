"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { GeneralSettings } from "./components/GeneralSettings";
import { ProfessionalSettings } from "./components/ProfessionalSettings";
import { PaymentSettings } from "./components/PaymentSettings";
import { NotificationSettings } from "./components/NotificationSettings";
import { SecuritySettings } from "./components/SecuritySettings";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [clinicImages, setClinicImages] = useState<string[]>([]);
    const [bankDetails, setBankDetails] = useState({
        bankName: "",
        accountHolderName: "",
        accountNumber: "",
        ifscCode: ""
    });

    useEffect(() => {
        fetchDoctorProfile();
    }, []);

    const fetchDoctorProfile = async () => {
        try {
            const res = await fetch("/api/doctor/profile");
            const data = await res.json();
            if (data.success) {
                setClinicImages(data.doctor.clinicImages || []);
                setBankDetails({
                    bankName: data.doctor.bankName || "",
                    accountHolderName: data.doctor.accountHolderName || "",
                    accountNumber: data.doctor.accountNumber || "",
                    ifscCode: data.doctor.ifscCode || ""
                });
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
            toast.error("Failed to load settings data");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (clinicImages.length >= 5) {
            toast.error("Maximum 5 clinic images allowed");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "clinic");

        try {
            setSaving(true);
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });
            const data = await res.json();

            if (data.url) {
                const updatedImages = [...clinicImages, data.url];
                await updateClinicImages(updatedImages);
            } else {
                toast.error(data.error || "Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image");
        } finally {
            setSaving(false);
        }
    };

    const updateClinicImages = async (images: string[]) => {
        try {
            const res = await fetch("/api/doctor/profile/document", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ clinicImages: images })
            });
            const data = await res.json();
            if (data.success) {
                setClinicImages(images);
                toast.success("Clinic gallery updated");
            } else {
                toast.error(data.error || "Failed to update gallery");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Connection error");
        }
    };

    const removeImage = async (index: number) => {
        const updatedImages = clinicImages.filter((_, i) => i !== index);
        await updateClinicImages(updatedImages);
    };

    const handleBankDetailsUpdate = async () => {
        // Validation Regex
        const accountNumberRegex = /^\d{9,18}$/;
        const ifscCodeRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

        if (bankDetails.accountNumber && !accountNumberRegex.test(bankDetails.accountNumber)) {
            toast.error("Invalid account number. Must be 9-18 digits.");
            return;
        }

        if (bankDetails.ifscCode && !ifscCodeRegex.test(bankDetails.ifscCode)) {
            toast.error("Invalid IFSC code format (e.g., HDFC0001234).");
            return;
        }

        try {
            setSaving(true);
            const res = await fetch("/api/doctor/profile/payment", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bankDetails)
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Payment details saved");
            } else {
                toast.error(data.error || "Failed to save details");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Failed to connect to server");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8  mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">
                    Settings
                </h1>
                <p className="text-muted-foreground text-lg">Manage your professional account, preferences, and payment details.</p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="bg-muted/50 p-1">
                    <TabsTrigger value="general" className="px-6">General</TabsTrigger>
                    <TabsTrigger value="professional" className="px-6">Professional</TabsTrigger>
                    <TabsTrigger value="payments" className="px-6">Payments</TabsTrigger>
                    <TabsTrigger value="notifications" className="px-6">Notifications</TabsTrigger>
                    <TabsTrigger value="security" className="px-6">Security</TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-4">
                    <GeneralSettings />
                </TabsContent>

                {/* Professional Settings */}
                <TabsContent value="professional" className="space-y-4">
                    <ProfessionalSettings
                        clinicImages={clinicImages}
                        handleImageUpload={handleImageUpload}
                        removeImage={removeImage}
                        saving={saving}
                    />
                </TabsContent>

                {/* Payments Settings */}
                <TabsContent value="payments" className="space-y-4">
                    <PaymentSettings
                        bankDetails={bankDetails}
                        setBankDetails={setBankDetails}
                        handleBankDetailsUpdate={handleBankDetailsUpdate}
                        saving={saving}
                    />
                </TabsContent>

                {/* Notifications Settings */}
                <TabsContent value="notifications" className="space-y-4">
                    <NotificationSettings />
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security" className="space-y-4">
                    <SecuritySettings />
                </TabsContent>
            </Tabs>
        </div>
    );
}