"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

interface UpdateEmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentEmail?: string;
    onSuccess?: () => void;
}

export function UpdateEmailModal({ isOpen, onClose, currentEmail, onSuccess }: UpdateEmailModalProps) {
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (email !== confirmEmail) {
            toast.error("Email addresses do not match");
            return;
        }

        if (email === currentEmail) {
            toast.error("New email must be different from current email");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/me/update-email", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                toast.success("Email updated successfully");
                onSuccess?.();
                onClose();
            } else {
                const error = await response.json();
                toast.error(error.error || "Failed to update email");
            }
        } catch (error) {
            console.error("Email update error:", error);
            toast.error("Internal server error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Email Address</DialogTitle>
                    <DialogDescription>
                        Enter your new email address below. You'll need to use this new email to log in next time.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-email">New Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="new-email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="pl-10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-email">Confirm New Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="confirm-email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="pl-10"
                                    value={confirmEmail}
                                    onChange={(e) => setConfirmEmail(e.target.value)}
                                    required
                                />
                            </div>
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
                                "Update Email"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
