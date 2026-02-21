"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Phone } from "lucide-react";
import { toast } from "sonner";

interface UpdatePhoneModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentPhone?: string;
    onSuccess?: () => void;
}

export function UpdatePhoneModal({ isOpen, onClose, currentPhone, onSuccess }: UpdatePhoneModalProps) {
    const [phone, setPhone] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!/^\d{10}$/.test(phone)) {
            toast.error("Phone number must be exactly 10 digits");
            return;
        }

        if (phone === currentPhone) {
            toast.error("New phone number must be different from current one");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/me/update-phone", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
            });

            if (response.ok) {
                toast.success("Phone number updated successfully");
                onSuccess?.();
                onClose();
            } else {
                const error = await response.json();
                toast.error(error.error || "Failed to update phone number");
            }
        } catch (error) {
            console.error("Phone update error:", error);
            toast.error("Internal server error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Mobile Number</DialogTitle>
                    <DialogDescription>
                        Enter your new 10-digit mobile number below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-phone">New Mobile Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="new-phone"
                                    type="tel"
                                    placeholder="9876543210"
                                    className="pl-10"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    maxLength={10}
                                    required
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground">Enter 10 digits without country code.</p>
                        </div>
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
                                "Update Mobile"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
