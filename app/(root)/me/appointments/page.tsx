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

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink } from "lucide-react";

interface Appointment {
    id: string;
    doctor: string;
    speciality: string;
    date: string;
    type: string;
    status: string;
    img: string;
    rawStatus: string;
    consultationFee?: number;
    reason?: string;
    doctorDetails?: {
        profilePhoto?: string;
        qualification?: string;
        experienceYears?: number;
        clinicName?: string;
        hospitalName?: string;
        bio?: string;
        address?: {
            street: string;
            city: string;
            state: string;
            zipCode: string;
            latitude?: number;
            longitude?: number;
        } | null;
    } | null;
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
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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
                        <div
                            key={apt.id}
                            className={cn(
                                "group relative overflow-hidden bg-background border border-border/50 rounded-3xl transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 p-5 sm:p-6",
                                apt.status === "Upcoming" ? "hover:border-blue-500/30" :
                                    apt.status === "CANCELLED" ? "hover:border-red-500/30" :
                                        "hover:border-emerald-500/30"
                            )}
                        >
                            {/* Status Accent Line */}
                            <div className={cn(
                                "absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-500",
                                apt.status === "Upcoming" ? "bg-blue-500 shadow-[2px_0_15px_-3px_rgba(59,130,246,0.3)]" :
                                    apt.status === "CANCELLED" ? "bg-red-500 shadow-[2px_0_15px_-3px_rgba(239,68,68,0.3)]" :
                                        "bg-emerald-500 shadow-[2px_0_15px_-3px_rgba(16,185,129,0.3)]"
                            )} />

                            <div className="flex flex-col md:flex-row items-start md:items-center gap-5 sm:gap-6 relative z-10">
                                {/* Header section with Image and Status - flexible for mobile */}
                                <div className="flex items-center justify-between w-full md:w-auto gap-4">
                                    <Avatar className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-2 border-primary/10 shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500">
                                        <AvatarImage src={apt.img.length > 2 ? apt.img : undefined} className="object-cover" />
                                        <AvatarFallback className="bg-primary/5 text-primary text-xl font-black rounded-2xl">
                                            {apt.img.length <= 2 ? apt.img : apt.doctor.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Status Badge - visible on mobile at the top right */}
                                    <div className="md:hidden">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm",
                                            apt.status === "Upcoming" ? "bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/30 dark:border-blue-800/20" :
                                                apt.status === "CANCELLED" ? "bg-red-50 text-red-600 border border-red-100 dark:bg-red-950/30 dark:border-red-800/20" :
                                                    "bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-800/20"
                                        )}>
                                            {apt.status === "Upcoming" ? <Timer className="h-3 w-3 animate-pulse" /> :
                                                apt.status === "CANCELLED" ? <XCircle className="h-3 w-3" /> :
                                                    <CheckCircle2 className="h-3 w-3" />}
                                            {apt.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4 w-full text-left">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                        <div className="space-y-1">
                                            <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white leading-tight tracking-tight group-hover:text-primary transition-colors duration-300">
                                                {apt.doctor}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest py-0.5 px-2.5 rounded-lg border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
                                                    {apt.speciality}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Status Badge Desktop */}
                                        <div className="hidden md:block">
                                            <span className={cn(
                                                "inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-sm transition-all duration-300 group-hover:shadow-md",
                                                apt.status === "Upcoming" ? "bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/30 dark:border-blue-800/20 shadow-blue-500/5" :
                                                    apt.status === "CANCELLED" ? "bg-red-50 text-red-600 border border-red-100 dark:bg-red-950/30 dark:border-red-800/20 shadow-red-500/5" :
                                                        "bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-800/20 shadow-emerald-500/5"
                                            )}>
                                                {apt.status === "Upcoming" ? <Timer className="h-3.5 w-3.5 animate-pulse" /> :
                                                    apt.status === "CANCELLED" ? <XCircle className="h-3.5 w-3.5" /> :
                                                        <CheckCircle2 className="h-3.5 w-3.5" />}
                                                {apt.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-2 border-t border-b border-zinc-100 dark:border-zinc-800/50">
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Consultation</p>
                                            <div className="flex items-center gap-2 group/date">
                                                <div className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 group-hover/date:border-primary/30 transition-colors">
                                                    <Calendar className="h-3.5 w-3.5 text-primary" />
                                                </div>
                                                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{formatAppointmentDate(apt.date)}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Scheduled At</p>
                                            <div className="flex items-center gap-2 group/time">
                                                <div className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 group-hover/time:border-primary/30 transition-colors">
                                                    <Clock className="h-3.5 w-3.5 text-primary" />
                                                </div>
                                                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{apt.date.split("T")[1]?.substring(0, 5) || "Check details"}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Method</p>
                                            <div className="flex items-center gap-2 group/method">
                                                <div className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 group-hover/method:border-primary/30 transition-colors">
                                                    {apt.type === "Video Consultation" ? <Video className="h-3.5 w-3.5 text-primary" /> : <MapPin className="h-3.5 w-3.5 text-primary" />}
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                                                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{apt.type}</span>
                                                    {apt.type === "In-Person Visit" && apt.doctorDetails?.address && (
                                                        <a
                                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                                `${apt.doctorDetails.address.street}, ${apt.doctorDetails.address.city}, ${apt.doctorDetails.address.state}`
                                                            )}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1 text-[10px] text-primary hover:underline font-black uppercase tracking-wider"
                                                        >
                                                            <ExternalLink className="h-2.5 w-2.5" />
                                                            Navigate
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Charges</p>
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                                                    <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
                                                </div>
                                                <span className="text-sm font-bold text-zinc-900 dark:text-white">₹{apt.consultationFee || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-border/50">
                                    <button
                                        onClick={() => {
                                            setSelectedAppointment(apt);
                                            setIsDetailsModalOpen(true);
                                        }}
                                        className="flex-1 px-6 py-3 md:py-2.5 text-[11px] font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 shadow-sm"
                                    >
                                        View Details
                                    </button>
                                    {(apt.status === "Upcoming") && (
                                        <button
                                            onClick={() => handleCancelClick(apt.id)}
                                            className="px-6 py-3 md:py-2.5 text-[11px] font-black uppercase tracking-wider text-red-600 bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl hover:bg-red-100 transition-all duration-300 shadow-sm"
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

            <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
                <DialogContent className="max-w-2xl rounded-3xl overflow-hidden p-0 gap-0 border-none shadow-2xl">
                    <DialogHeader className="p-6 bg-primary/5 border-b border-primary/10">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <div className="text-left">
                                <DialogTitle className="text-2xl font-bold text-foreground">Appointment Details</DialogTitle>
                                <DialogDescription className="font-medium text-muted-foreground">Comprehensive overview of your consultation</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {selectedAppointment && (
                            <>
                                {/* Appointment Info Section */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                        Consultation Information
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            { icon: Calendar, label: "Date", value: formatAppointmentDate(selectedAppointment.date) },
                                            { icon: Clock, label: "Time", value: selectedAppointment.date.split("T")[1]?.substring(0, 5) || "Check details" },
                                            { icon: Video, label: "Type", value: selectedAppointment.type },
                                            { icon: CheckCircle2, label: "Status", value: selectedAppointment.status },
                                            { icon: ArrowUpDown, label: "Fee", value: `₹${selectedAppointment.consultationFee || 0}` },
                                            { icon: AlertCircle, label: "Reason", value: selectedAppointment.reason || "General Consultation" },
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-3 bg-muted/30 rounded-2xl border border-border/50">
                                                <item.icon className="h-4 w-4 text-primary shrink-0" />
                                                <div>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{item.label}</p>
                                                    <p className="text-sm font-bold">{item.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Doctor Info Section */}
                                <div className="space-y-6 pt-4 border-t border-border/50">
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                        Doctor Information
                                    </h4>

                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                        <Avatar className="h-24 w-24 sm:h-32 sm:w-32 rounded-3xl border-4 border-background shadow-xl">
                                            <AvatarImage src={selectedAppointment.img.length > 2 ? selectedAppointment.img : undefined} className="object-cover" />
                                            <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                                                {selectedAppointment.img.length <= 2 ? selectedAppointment.img : selectedAppointment.doctor.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 space-y-3 text-center sm:text-left">
                                            <div>
                                                <h3 className="text-2xl font-bold text-foreground">{selectedAppointment.doctor}</h3>
                                                <p className="text-primary font-bold">{selectedAppointment.speciality}</p>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                                <Badge variant="secondary" className="rounded-xl font-bold py-1 px-3">
                                                    {selectedAppointment.doctorDetails?.qualification || "Specialist"}
                                                </Badge>
                                                <Badge variant="outline" className="rounded-xl font-bold py-1 px-3 border-primary/20 bg-primary/5 text-primary">
                                                    {selectedAppointment.doctorDetails?.experienceYears}+ Years Exp.
                                                </Badge>
                                            </div>

                                            {(selectedAppointment.doctorDetails?.clinicName || selectedAppointment.doctorDetails?.hospitalName) && (
                                                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground font-medium">
                                                    <MapPin className="h-4 w-4 text-primary" />
                                                    {selectedAppointment.doctorDetails.clinicName || selectedAppointment.doctorDetails.hospitalName}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {selectedAppointment.doctorDetails?.bio && (
                                        <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                                            <p className="text-sm text-foreground/80 leading-relaxed italic">
                                                "{selectedAppointment.doctorDetails.bio}"
                                            </p>
                                        </div>
                                    )}

                                    {selectedAppointment.doctorDetails?.address && (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h5 className="text-xs font-bold text-muted-foreground uppercase">Clinic Location</h5>
                                                <a
                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                        `${selectedAppointment.doctorDetails.address.street}, ${selectedAppointment.doctorDetails.address.city}, ${selectedAppointment.doctorDetails.address.state}`
                                                    )}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                    View on Maps
                                                </a>
                                            </div>
                                            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex gap-4">
                                                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center border border-border shrink-0">
                                                    <MapPin className="h-5 w-5 text-primary" />
                                                </div>
                                                <p className="text-sm font-medium text-foreground">
                                                    {selectedAppointment.doctorDetails.address.street}, {selectedAppointment.doctorDetails.address.city}, {selectedAppointment.doctorDetails.address.state}, {selectedAppointment.doctorDetails.address.zipCode}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

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
