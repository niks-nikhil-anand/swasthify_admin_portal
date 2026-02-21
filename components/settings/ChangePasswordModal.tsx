"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function ChangePasswordModal({ isOpen, onClose, onSuccess }: ChangePasswordModalProps) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/me/change-password", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            if (response.ok) {
                toast.success("Password changed successfully");
                onSuccess?.();
                onClose();
                // Clear fields
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                const error = await response.json();
                toast.error(error.error || "Failed to change password");
            }
        } catch (error) {
            console.error("Password change error:", error);
            toast.error("Internal server error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                        Enter your current password and choose a strong new password.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="current-password"
                                    type={showCurrent ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                >
                                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="new-password"
                                    type={showNew ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                >
                                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="confirm-password"
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                >
                                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="text-[11px] text-muted-foreground space-y-1 bg-muted/30 p-3 rounded-lg border border-border/50">
                        <p className="font-semibold mb-1">Password Requirements:</p>
                        <ul className="list-disc pl-4 space-y-0.5">
                            <li>At least 6 characters long (max 16)</li>
                            <li>Include at least one number</li>
                            <li>Include at least one special symbol</li>
                        </ul>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Change Password"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
