"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";

interface ContactTechModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ContactTechModal({ isOpen, onClose }: ContactTechModalProps) {
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!subject.trim() || !body.trim()) {
            toast.error("Please fill in both subject and message");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/contact-tech", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ subject, body }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Support request sent successfully!");
                setSubject("");
                setBody("");
                onClose();
            } else {
                toast.error(data.error || "Failed to send support request");
            }
        } catch (error) {
            console.error("Support request error:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsLoading(true); // Keep it loading for a brief moment to avoid flicker, or just set to false
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <DialogTitle>Contact Tech Team</DialogTitle>
                    </div>
                    <DialogDescription>
                        If you have any problems or UI issues, send me a mail.
                        We'll get back to you ASAP.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium">
                            Subject
                        </label>
                        <Input
                            id="subject"
                            placeholder="e.g., UI Bug on Reports Page"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="body" className="text-sm font-medium">
                            Message
                        </label>
                        <Textarea
                            id="body"
                            placeholder="Describe the issue or feedback..."
                            className="min-h-[150px]"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Send Email"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
