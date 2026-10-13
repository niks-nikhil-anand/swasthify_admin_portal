"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Loader2, Search, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type AdminReview = {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    patient: {
        user: {
            name: string;
            email: string;
        };
    };
    doctor: {
        user: {
            name: string;
            email: string;
        };
    } | null;
    appointment?: {
        id: string;
        dateTime: string;
        status: string;
        type: string;
    } | null;
};

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<AdminReview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteReview, setDeleteReview] = useState<AdminReview | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchReviews = async () => {
        try {
            const response = await fetch("/api/admin/reviews");
            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Failed to load reviews");
                return;
            }

            setReviews(data.reviews || []);
        } catch (error) {
            toast.error("Something went wrong while loading reviews");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const filteredReviews = useMemo(() => {
        return reviews.filter((review) => {
            const text = `${review.doctor?.user.name || ""} ${review.patient.user.name} ${review.patient.user.email} ${review.comment || ""}`.toLowerCase();
            return text.includes(searchTerm.toLowerCase());
        });
    }, [reviews, searchTerm]);

    const averageRating = reviews.length
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

    const handleDelete = async () => {
        if (!deleteReview) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/admin/reviews/${deleteReview.id}`, {
                method: "DELETE",
            });
            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Failed to delete review");
                return;
            }

            toast.success("Review deleted");
            setDeleteReview(null);
            await fetchReviews();
        } catch (error) {
            toast.error("Something went wrong while deleting review");
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Doctor Reviews</h1>
                    <p className="text-muted-foreground">Moderate verified patient reviews across the platform.</p>
                </div>
                <Button variant="outline" onClick={fetchReviews}>Refresh Data</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Total Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-black">{reviews.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Average Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-black">{averageRating.toFixed(1)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Five Star Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-black">{reviews.filter((review) => review.rating === 5).length}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search doctor, patient, or comment..."
                    className="h-11 rounded-2xl pl-10"
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Doctor Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredReviews.length === 0 ? (
                        <div className="rounded-3xl border-2 border-dashed border-border/50 p-12 text-center">
                            <p className="font-bold">No reviews found</p>
                            <p className="mt-1 text-sm text-muted-foreground">Verified doctor reviews will appear here.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="px-3 py-3 font-semibold">Doctor</th>
                                        <th className="px-3 py-3 font-semibold">Patient</th>
                                        <th className="px-3 py-3 font-semibold">Rating</th>
                                        <th className="px-3 py-3 font-semibold">Comment</th>
                                        <th className="px-3 py-3 font-semibold">Appointment</th>
                                        <th className="px-3 py-3 font-semibold">Reviewed</th>
                                        <th className="px-3 py-3 text-right font-semibold">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredReviews.map((review) => (
                                        <tr key={review.id} className="border-b last:border-0">
                                            <td className="px-3 py-4 font-medium">{review.doctor?.user.name || "N/A"}</td>
                                            <td className="px-3 py-4">
                                                <div className="font-medium">{review.patient.user.name}</div>
                                                <div className="text-xs text-muted-foreground">{review.patient.user.email}</div>
                                            </td>
                                            <td className="px-3 py-4">
                                                <Badge variant="secondary" className="gap-1">
                                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                    {review.rating}
                                                </Badge>
                                            </td>
                                            <td className="px-3 py-4 max-w-xs text-muted-foreground">
                                                <p className="line-clamp-2">{review.comment || "No written comment."}</p>
                                            </td>
                                            <td className="px-3 py-4 text-muted-foreground">
                                                {review.appointment ? format(new Date(review.appointment.dateTime), "dd MMM yyyy") : "Not linked"}
                                            </td>
                                            <td className="px-3 py-4 text-muted-foreground">
                                                {format(new Date(review.createdAt), "dd MMM yyyy")}
                                            </td>
                                            <td className="px-3 py-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => setDeleteReview(review)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <AlertDialog open={Boolean(deleteReview)} onOpenChange={(open) => !open && setDeleteReview(null)}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this review?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This removes the review from public doctor pages and recalculates the doctor rating immediately.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(event) => {
                                event.preventDefault();
                                handleDelete();
                            }}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete Review
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
