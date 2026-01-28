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
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface EditCampaignStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    campaignId: string | null;
    currentStatus?: string;
    isVerified?: boolean;
    onUpdate: () => void;
}

export function EditCampaignStatusModal({
    isOpen,
    onClose,
    campaignId,
    currentStatus,
    isVerified,
    onUpdate,
}: EditCampaignStatusModalProps) {
    const [status, setStatus] = useState<string>(currentStatus || "DRAFT");
    const [verified, setVerified] = useState<boolean>(isVerified || false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setStatus(currentStatus || "DRAFT");
            setVerified(isVerified || false);
        }
    }, [isOpen, currentStatus, isVerified]);

    const handleSave = async () => {
        if (!campaignId) return;

        try {
            setLoading(true);
            const res = await fetch(`/api/admin/campaigns/${campaignId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, isVerified: verified }),
            });

            if (!res.ok) throw new Error("Failed to update campaign");

            toast.success("Campaign updated successfully");
            onUpdate();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update campaign");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Campaign Status</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label>Campaign Status</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DRAFT">Draft</SelectItem>
                                <SelectItem value="IN_REVIEW">In Review</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="PAUSED">Paused</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg">
                        <div className="space-y-0.5">
                            <Label className="text-base">Verification</Label>
                            <p className="text-sm text-muted-foreground">
                                Mark this campaign as verified and safe.
                            </p>
                        </div>
                        <Switch
                            checked={verified}
                            onCheckedChange={setVerified}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
