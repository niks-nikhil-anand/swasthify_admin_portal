"use client";

import { Calendar, Clock, MapPin, ChevronRight, Video, User, CheckCircle2, XCircle, Timer, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
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

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">My Appointments</h1>
                    <p className="text-muted-foreground mt-1">Manage all your upcoming and past medical consultations.</p>
                </div>
                <Link href={"/doctors"}>
                    <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
                        Book New Appointment
                    </button>
                </Link>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-muted-foreground font-medium">Fetching your appointments...</p>
                </div>
            ) : appointments.length > 0 ? (
                <div className="space-y-6">
                    {appointments.map((apt) => (
                        <div key={apt.id} className="bg-background border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl font-bold border border-primary/20">
                                    {apt.img}
                                </div>

                                <div className="flex-1 space-y-2 text-center md:text-left">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                        <h3 className="text-xl font-bold text-foreground">{apt.doctor}</h3>
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
                                    <p className="text-sm font-medium text-muted-foreground">{apt.speciality}</p>

                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 pt-2">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="h-3.5 w-3.5 text-primary" /> {formatAppointmentDate(apt.date)}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            {apt.type === "Video Consultation" ? <Video className="h-3.5 w-3.5 text-primary" /> : <MapPin className="h-3.5 w-3.5 text-primary" />}
                                            {apt.type}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button className="px-5 py-2 text-xs font-bold text-foreground border border-border/50 rounded-lg hover:bg-muted/50 transition-colors">
                                        View Details
                                    </button>
                                    {apt.status === "Upcoming" && (
                                        <button
                                            onClick={() => handleCancelClick(apt.id)}
                                            className="px-5 py-2 text-xs font-bold text-red-600 border border-red-200 dark:border-red-900/30 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
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
                    <h3 className="text-lg font-bold text-foreground">Need a checkup?</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
                        Schedule an appointment with our specialist and get the care you deserve.
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
