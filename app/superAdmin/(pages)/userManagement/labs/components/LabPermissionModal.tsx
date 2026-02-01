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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Shield } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface LabPermissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    labId: string | null;
}

const AVAILABLE_PERMISSIONS = [
    { id: "dashboard", label: "Dashboard" },
    { id: "tests", label: "My Tests" },
    { id: "appointment", label: "Appointments" },
    { id: "reports", label: "Reports" },
    { id: "profile", label: "My Profile" },
    { id: "setting", label: "Settings" },
];

export function LabPermissionModal({
    isOpen,
    onClose,
    labId,
}: LabPermissionModalProps) {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    const [profileCompletionPercentage, setProfileCompletionPercentage] = useState(0);

    useEffect(() => {
        if (isOpen && labId) {
            fetchPermissions();
        }
    }, [isOpen, labId]);

    const fetchPermissions = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/user/lab/${labId}`);
            if (!res.ok) throw new Error("Failed to fetch lab");
            const data = await res.json();

            setPermissions(data.permissions || []);
            setIsProfileComplete(data.isProfileComplete || false);
            setProfileCompletionPercentage(data.profileCompletionPercentage || 0);

        } catch (error) {
            console.error(error);
            toast.error("Failed to load permissions");
        } finally {
            setLoading(false);
        }
    };

    const handlePermissionToggle = (permissionId: string) => {
        setPermissions((prev) =>
            prev.includes(permissionId)
                ? prev.filter((id) => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            // Use the main update endpoint with PATCH
            const res = await fetch(`/api/user/lab/${labId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    permissions: Array.from(new Set([...permissions, "profile"])), // Ensure profile is always there
                    isProfileComplete,
                    profileCompletionPercentage
                }),
            });

            if (!res.ok) throw new Error("Failed to update permissions");

            toast.success("Permissions updated successfully");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update permissions");
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Manage Access & Permissions
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="space-y-6 py-4">

                        {/* Profile Completion Status */}
                        <div className="space-y-4 rounded-lg border p-4 bg-muted/20">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="profile-complete" className="font-semibold">
                                    Profile Complete
                                </Label>
                                <Switch
                                    id="profile-complete"
                                    checked={isProfileComplete}
                                    onCheckedChange={setIsProfileComplete}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="completion-percentage">Completion Percentage (%)</Label>
                                <Input
                                    id="completion-percentage"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={profileCompletionPercentage}
                                    onChange={(e) => setProfileCompletionPercentage(Number(e.target.value))}
                                />
                            </div>
                        </div>

                        {/* Page Permissions */}
                        <div className="space-y-3">
                            <Label className="font-semibold">Page Access</Label>
                            <div className="grid grid-cols-2 gap-4">
                                {AVAILABLE_PERMISSIONS.map((perm) => {
                                    const isProfile = perm.id === "profile";
                                    return (
                                        <div
                                            key={perm.id}
                                            className={`flex items-center space-x-2 ${!isProfile && !isProfileComplete ? "opacity-50 cursor-not-allowed" : ""
                                                }`}
                                        >
                                            <Checkbox
                                                id={perm.id}
                                                checked={isProfile ? true : permissions.includes(perm.id)}
                                                onCheckedChange={() => !isProfile && handlePermissionToggle(perm.id)}
                                                disabled={isProfile || !isProfileComplete}
                                            />
                                            <Label
                                                htmlFor={perm.id}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {perm.label}
                                            </Label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="text-xs text-muted-foreground bg-yellow-50 p-2 rounded border border-yellow-100 dark:bg-yellow-900/10 dark:border-yellow-900/30">
                            Note: If "Profile Complete" is OFF, the lab will only have access to the Profile page, regardless of other selections.
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={saving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
