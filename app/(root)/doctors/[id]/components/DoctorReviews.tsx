"use client";

import { format } from "date-fns";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Campaign } from "../../types";

export function DoctorReviews({ campaign }: { campaign: Campaign }) {
    const reviews = campaign.doctor.reviews || [];
    const averageRating = Number(campaign.doctor.averageRating || 0);
    const totalReviews = campaign.doctor.totalReviews || reviews.length;

    return (
        <Card className="rounded-3xl border-border/50">
            <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <span>Patient Reviews</span>
                    <span className="flex items-center gap-2 text-base font-bold text-muted-foreground">
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                        {averageRating.toFixed(1)} / 5
                        <span className="text-sm font-medium">({totalReviews} reviews)</span>
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {reviews.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 p-8 text-center">
                        <p className="font-semibold text-foreground">No reviews yet</p>
                        <p className="mt-1 text-sm text-muted-foreground">Verified patient reviews will appear here after appointments.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="rounded-2xl border border-border/50 bg-background p-4">
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-11 w-11 rounded-xl">
                                        <AvatarImage src={review.patient.user.profilePic || undefined} />
                                        <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold">
                                            {review.patient.user.name?.[0] || "P"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                            <div>
                                                <p className="font-bold text-foreground">{review.patient.user.name || "Patient"}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Reviewed on {format(new Date(review.createdAt), "dd MMM yyyy")}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`h-4 w-4 ${star <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        {review.comment && (
                                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
