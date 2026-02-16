"use client";

import { Calendar, Clock, MapPin, ChevronRight, Video, User, CheckCircle2, XCircle, Timer, Loader2, AlertCircle, Search, Filter, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";
import { formatAppointmentDate } from "@/lib/date-utils";
import Link from "next/link";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Appointment {
    id: string;
    doctor: string;
    speciality: string;
    date: string;
    type: string;
    status: string;
    img: string;
    rawStatus: string;
}

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("upcoming");
    const [sortBy, setSortBy] = useState("newest");

    const fetchAppointments = async () => {
        try {
            const response = await fetch("/api/me/appointments");
            if (response.ok) {
                const data = await response.json();
                setAppointments(data);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleCancelClick = (id: string) => {
        setCancellingId(id);
        setIsCancelModalOpen(true);
    };

    const handleCancelConfirm = async () => {
        if (!cancellingId) return;

        setIsCancelling(true);
        try {
            const response = await fetch("/api/appointments/cancel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ appointmentId: cancellingId })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Appointment cancelled successfully");
                // Refresh list
                await fetchAppointments();
            } else {
                toast.error(data.error || "Failed to cancel appointment");
            }
        } catch (error) {
            toast.error("An error occurred during cancellation");
        } finally {
            setIsCancelling(false);
            setIsCancelModalOpen(false);
            setCancellingId(null);
        }
    };

    const filteredAppointments = useMemo(() => {
        let result = appointments.filter((apt) => {
            const matchesSearch = apt.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                apt.speciality.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "all" || apt.status.toLowerCase() === statusFilter.toLowerCase();
            return matchesSearch && matchesStatus;
        });

        result.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortBy === "newest" ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [appointments, searchQuery, statusFilter, sortBy]);

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                        My <span className="text-primary italic">Appointments</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-lg">
                        Manage your upcoming health consultations and viewing history in one place.
                    </p>
                </div>
                <Link href={"/doctors"}>
                    <Button size="lg" className="rounded-2xl font-bold h-12 px-8 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                        Book New Appointment
                    </Button>
                </Link>
            </div>

            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-muted/30 p-4 rounded-3xl border border-border/50">
                <div className="md:col-span-6 relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search doctor or speciality..."
                        className="pl-10 h-11 bg-background border-none ring-1 ring-border shadow-none rounded-2xl focus-visible:ring-primary/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="md:col-span-3">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-11 bg-background border-none ring-1 ring-border shadow-none rounded-2xl focus:ring-primary/20">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-primary" />
                                <SelectValue placeholder="Status" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-3">
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="h-11 bg-background border-none ring-1 ring-border shadow-none rounded-2xl focus:ring-primary/20">
                            <div className="flex items-center gap-2">
                                <ArrowUpDown className="h-4 w-4 text-primary" />
                                <SelectValue placeholder="Sort by" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-muted-foreground font-medium">Fetching your appointments...</p>
                </div>
            ) : filteredAppointments.length > 0 ? (
                <div className="space-y-6">
                    {filteredAppointments.map((apt) => (
                        <div key={apt.id} className="bg-background border border-border/50 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-5 sm:gap-6">
                                {/* Header section with Image and Status - flexible for mobile */}
                                <div className="flex items-center justify-between w-full md:w-auto gap-4">
                                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl font-bold border border-primary/20 shrink-0">
                                        {apt.img}
                                    </div>

                                    {/* Status Badge - visible on mobile at the top right */}
                                    <div className="md:hidden">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                            apt.status === "Upcoming" ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30" :
                                                apt.status === "CANCELLED" ? "bg-red-100 text-red-600 dark:bg-red-900/30" :
                                                    "bg-green-100 text-green-600 dark:bg-green-900/30"
                                        )}>
                                            {apt.status === "Upcoming" ? <Timer className="h-3 w-3" /> :
                                                apt.status === "CANCELLED" ? <XCircle className="h-3 w-3" /> :
                                                    <CheckCircle2 className="h-3 w-3" />}
                                            {apt.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4 w-full text-left">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                        <div className="space-y-1">
                                            <h3 className="text-lg sm:text-xl font-bold text-foreground leading-tight">{apt.doctor}</h3>
                                            <p className="text-xs sm:text-sm font-medium text-muted-foreground">{apt.speciality}</p>
                                        </div>

                                        {/* Status Badge - hidden on mobile, visible on desktop */}
                                        <div className="hidden md:block">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                                apt.status === "Upcoming" ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30" :
                                                    apt.status === "CANCELLED" ? "bg-red-100 text-red-600 dark:bg-red-900/30" :
                                                        "bg-green-100 text-green-600 dark:bg-green-900/30"
                                            )}>
                                                {apt.status === "Upcoming" ? <Timer className="h-3 w-3" /> :
                                                    apt.status === "CANCELLED" ? <XCircle className="h-3 w-3" /> :
                                                        <CheckCircle2 className="h-3 w-3" />}
                                                {apt.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-1">
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <div className="p-2 bg-primary/10 rounded-xl">
                                                <Calendar className="h-3.5 w-3.5 text-primary" />
                                            </div>
                                            <span className="font-semibold">{formatAppointmentDate(apt.date)}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <div className="p-2 bg-primary/10 rounded-xl">
                                                {apt.type === "Video Consultation" ? <Video className="h-3.5 w-3.5 text-primary" /> : <MapPin className="h-3.5 w-3.5 text-primary" />}
                                            </div>
                                            <span className="font-semibold">{apt.type}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-border/50">
                                    <button className="flex-1 px-5 py-3 md:py-2 text-xs font-bold text-foreground border border-border/50 rounded-2xl hover:bg-muted/50 transition-colors">
                                        View Details
                                    </button>
                                    {apt.status === "Upcoming" && (
                                        <button
                                            onClick={() => handleCancelClick(apt.id)}
                                            className="flex-1 px-5 py-3 md:py-2 text-xs font-bold text-red-600 border border-red-200 dark:border-red-900/30 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="pt-8 text-center border-2 border-dashed border-border/50 rounded-3xl p-12">
                    <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">
                        {searchQuery || statusFilter !== "all" ? "No results found" : "Need a checkup?"}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
                        {searchQuery || statusFilter !== "all"
                            ? "Try adjusting your filters to find what you're looking for."
                            : "Schedule an appointment with our specialist and get the care you deserve."}
                    </p>
                </div>
            )}

            <AlertDialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3 text-red-600 mb-2">
                            <AlertCircle className="h-6 w-6" />
                            <AlertDialogTitle className="text-xl">Cancel Appointment?</AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-sm font-medium">
                            Are you sure you want to cancel this appointment? This action cannot be undone.
                            Your slot will be released for other patients.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4 gap-3">
                        <AlertDialogCancel className="rounded-xl border-border/50 font-bold">Nevermind</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleCancelConfirm();
                            }}
                            disabled={isCancelling}
                            className="bg-red-600 text-white hover:bg-red-700 rounded-xl font-bold px-6"
                        >
                            {isCancelling ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Cancelling...
                                </div>
                            ) : "Confirm Cancellation"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
