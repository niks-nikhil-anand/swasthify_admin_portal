"use client";

import { useState } from "react";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Appointment } from "./AppointmentCard";

interface ReviewModalProps {
    appointment: Appointment | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmitted: () => Promise<void> | void;
}

export function ReviewModal({ appointment, open, onOpenChange, onSubmitted }: ReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const reset = () => {
        setRating(0);
        setComment("");
    };

    const handleSubmit = async () => {
        if (!appointment) return;

        if (rating < 1) {
            toast.error("Please choose a star rating");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/me/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    appointmentId: appointment.id,
                    rating,
                    comment,
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Failed to submit review");
                return;
            }

            toast.success("Review submitted successfully");
            await onSubmitted();
            reset();
            onOpenChange(false);
        } catch {
            toast.error("Something went wrong while submitting your review");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                onOpenChange(nextOpen);
                if (!nextOpen) reset();
            }}
        >
            <DialogContent className="rounded-3xl sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Review {appointment?.doctor || "Doctor"}</DialogTitle>
                    <DialogDescription>
                        Share your experience from this appointment. Your review helps other patients make a better choice.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-2">
                    <div className="flex items-center justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="rounded-xl p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                aria-label={`${star} star${star > 1 ? "s" : ""}`}
                            >
                                <Star
                                    className={cn(
                                        "h-9 w-9",
                                        star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"
                                    )}
                                />
                            </button>
                        ))}
                    </div>

                    <Textarea
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        maxLength={1000}
                        placeholder="Write a short review..."
                        className="min-h-32 rounded-2xl resize-none"
                    />
                    <p className="text-xs text-muted-foreground text-right">{comment.length}/1000</p>
                </div>

                <DialogFooter>
                    <Button variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button className="rounded-xl" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Review
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
