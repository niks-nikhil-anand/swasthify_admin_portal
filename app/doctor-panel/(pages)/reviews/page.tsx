"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Loader2, Search, Star } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

type Review = {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    patient: {
        profilePic?: string | null;
        user: {
            name: string;
            email: string;
            profilePic?: string | null;
        };
    };
    appointment?: {
        id: string;
        dateTime: string;
        status: string;
        type: string;
    } | null;
};

type ReviewResponse = {
    summary: {
        averageRating: number;
        totalReviews: number;
        distribution: { rating: number; count: number }[];
    };
    reviews: Review[];
};

export default function DoctorReviewsPage() {
    const [data, setData] = useState<ReviewResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch("/api/doctor/reviews");
                const result = await response.json();

                if (!response.ok) {
                    toast.error(result.error || "Failed to load reviews");
                    return;
                }

                setData(result);
            } catch (error) {
                toast.error("Something went wrong while loading reviews");
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const filteredReviews = useMemo(() => {
        const reviews = data?.reviews || [];
        return reviews.filter((review) => {
            const text = `${review.patient.user.name} ${review.patient.user.email} ${review.comment || ""}`.toLowerCase();
            return text.includes(searchTerm.toLowerCase());
        });
    }, [data, searchTerm]);

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const summary = data?.summary;
    const totalReviews = summary?.totalReviews || 0;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Reviews</h1>
                <p className="text-muted-foreground font-medium">See verified feedback from patients who booked appointments with you.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="rounded-3xl border-border/50">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Average Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2">
                            <span className="text-5xl font-black">{(summary?.averageRating || 0).toFixed(1)}</span>
                            <span className="pb-2 text-muted-foreground">/ 5</span>
                        </div>
                        <div className="mt-3 flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`h-5 w-5 ${star <= Math.round(summary?.averageRating || 0) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-border/50">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Total Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-5xl font-black">{totalReviews}</p>
                        <p className="mt-3 text-sm text-muted-foreground">Only verified appointment reviews are counted.</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-border/50">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Rating Spread</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {(summary?.distribution || []).map((item) => (
                            <div key={item.rating} className="flex items-center gap-3">
                                <span className="w-8 text-xs font-bold">{item.rating} ★</span>
                                <Progress value={totalReviews ? (item.count / totalReviews) * 100 : 0} className="h-2" />
                                <span className="w-6 text-right text-xs text-muted-foreground">{item.count}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search patient or comment..."
                    className="h-12 rounded-2xl pl-10"
                />
            </div>

            <div className="space-y-4">
                {filteredReviews.length === 0 ? (
                    <div className="rounded-3xl border-2 border-dashed border-border/50 p-12 text-center">
                        <p className="font-bold">No reviews found</p>
                        <p className="mt-1 text-sm text-muted-foreground">Patient reviews will appear here after completed appointments.</p>
                    </div>
                ) : (
                    filteredReviews.map((review) => (
                        <Card key={review.id} className="rounded-3xl border-border/50">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-12 w-12 rounded-2xl">
                                        <AvatarImage src={review.patient.user.profilePic || undefined} />
                                        <AvatarFallback className="rounded-2xl bg-primary/10 text-primary font-bold">
                                            {review.patient.user.name?.[0] || "P"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <h3 className="font-bold">{review.patient.user.name}</h3>
                                                <p className="text-xs text-muted-foreground">
                                                    Appointment {review.appointment ? format(new Date(review.appointment.dateTime), "dd MMM yyyy, hh:mm a") : "not linked"}
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
                                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                            {review.comment || "No written comment."}
                                        </p>
                                        <p className="mt-3 text-xs font-medium text-muted-foreground">
                                            Reviewed on {format(new Date(review.createdAt), "dd MMM yyyy")}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
