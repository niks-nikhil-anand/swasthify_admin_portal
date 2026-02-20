"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Shield, Loader2 } from "lucide-react";

export function SecuritySettings() {
    const [passwords, setPasswords] = useState({
        new: "",
        confirm: ""
    });
    const [saving, setSaving] = useState(false);

    const handleUpdatePassword = async () => {
        if (!passwords.new || !passwords.confirm) {
            toast.error("Please fill in both password fields");
            return;
        }

        if (passwords.new.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        if (passwords.new !== passwords.confirm) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setSaving(true);
            const res = await fetch("/api/doctor/profile/security", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: passwords.new })
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Password updated successfully");
                setPasswords({ new: "", confirm: "" });
            } else {
                toast.error(data.error || "Failed to update password");
            }
        } catch (error) {
            console.error("Password update error:", error);
            toast.error("Connection error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <Card className="border-none shadow-sm bg-muted/30">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-primary" />
                        Security & Password
                    </CardTitle>
                    <CardDescription>
                        To ensure your account is safe, update your password regularly.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="new">New Password</Label>
                        <Input
                            id="new"
                            type="password"
                            placeholder="Enter new password"
                            value={passwords.new}
                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                            className="rounded-xl h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm">Confirm Password</Label>
                        <Input
                            id="confirm"
                            type="password"
                            placeholder="Confirm new password"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            className="rounded-xl h-11"
                        />
                    </div>
                    <div className="pt-2">
                        <Button
                            onClick={handleUpdatePassword}
                            disabled={saving}
                            className="w-full md:w-auto px-8 shadow-lg shadow-primary/20 bg-linear-to-r from-primary to-primary/80 hover:to-primary"
                        >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Update Password
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-red-200/50 dark:border-red-900/30 bg-red-500/5 shadow-none ring-1 ring-red-500/10">
                <CardHeader>
                    <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Danger Zone
                    </CardTitle>
                    <CardDescription>
                        Irreversible actions for your account. Please be careful.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive" className="rounded-xl px-8 shadow-lg shadow-red-500/10 hover:bg-red-600">
                        Deactivate Account
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
