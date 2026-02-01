import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Loader2, AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface DeleteLabModalProps {
    isOpen: boolean;
    onClose: () => void;
    labId: string | null;
    labName: string | null;
    onSuccess: () => void;
}

export function DeleteLabModal({
    isOpen,
    onClose,
    labId,
    labName,
    onSuccess,
}: DeleteLabModalProps) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!labId) return;

        try {
            setLoading(true);
            const res = await fetch(`/api/user/lab/${labId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to delete lab");
            }

            toast.success("Lab deleted successfully");
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to delete lab");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                    <div className="flex items-center gap-3 text-red-600 mb-2">
                        <div className="p-2 bg-red-100 rounded-full">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <AlertDialogTitle className="text-xl">Delete Lab Account?</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription asChild className="space-y-3">
                        <div className="text-muted-foreground text-sm space-y-3">
                            <p className="font-medium text-gray-900">
                                You are about to delete the account for <span className="font-bold">{labName || "this lab"}</span>.
                            </p>
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
                                <p className="font-bold mb-1">Warning: This action cannot be undone.</p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>The User account will be permanently deleted.</li>
                                    <li>All associated lab profile data will be removed.</li>
                                    <li>Access to the platform will be immediately revoked.</li>
                                </ul>
                            </div>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4">
                    <div className="flex w-full gap-2 sm:justify-end">
                        <Button variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700 gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            Delete Permanently
                        </Button>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
