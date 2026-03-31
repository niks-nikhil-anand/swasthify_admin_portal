"use client";

import { Calendar, Clock, MapPin, Video, CheckCircle2, XCircle, Timer, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatAppointmentDate } from "@/lib/date-utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export interface Appointment {
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

interface AppointmentCardProps {
    appointment: Appointment;
    onViewDetails: (appointment: Appointment) => void;
    onCancel: (id: string) => void;
}

export function AppointmentCard({ appointment, onViewDetails, onCancel }: AppointmentCardProps) {
    const isUpcoming = appointment.status === "Upcoming";
    const isCancelled = appointment.status === "CANCELLED";

    return (
        <div
            className={cn(
                "group relative overflow-hidden bg-background border border-border/50 rounded-3xl transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 p-5 sm:p-6",
                isUpcoming ? "hover:border-blue-500/30" :
                    isCancelled ? "hover:border-red-500/30" :
                        "hover:border-emerald-500/30"
            )}
        >
            {/* Status Accent Line */}
            <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-500",
                isUpcoming ? "bg-blue-500 shadow-[2px_0_15px_-3px_rgba(59,130,246,0.3)]" :
                    isCancelled ? "bg-red-500 shadow-[2px_0_15px_-3px_rgba(239,68,68,0.3)]" :
                        "bg-emerald-500 shadow-[2px_0_15px_-3px_rgba(16,185,129,0.3)]"
            )} />

            <div className="flex flex-col md:flex-row items-start md:items-center gap-5 sm:gap-6 relative z-10">
                {/* Header section with Image and Status - flexible for mobile */}
                <div className="flex items-center justify-between w-full md:w-auto gap-4">
                    <Avatar className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-2 border-primary/10 shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500">
                        <AvatarImage src={appointment.img.length > 2 ? appointment.img : undefined} className="object-cover" />
                        <AvatarFallback className="bg-primary/5 text-primary text-xl font-black rounded-2xl">
                            {appointment.img.length <= 2 ? appointment.img : appointment.doctor.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                        </AvatarFallback>
                    </Avatar>

                    {/* Status Badge - visible on mobile at the top right */}
                    <div className="md:hidden">
                        <span className={cn(
                            "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm",
                            isUpcoming ? "bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/30 dark:border-blue-800/20" :
                                isCancelled ? "bg-red-50 text-red-600 border border-red-100 dark:bg-red-950/30 dark:border-red-800/20" :
                                    "bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-800/20"
                        )}>
                            {isUpcoming ? <Timer className="h-3 w-3 animate-pulse" /> :
                                isCancelled ? <XCircle className="h-3 w-3" /> :
                                    <CheckCircle2 className="h-3 w-3" />}
                            {appointment.status}
                        </span>
                    </div>
                </div>

                <div className="flex-1 space-y-4 w-full text-left">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div className="space-y-1">
                            <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white leading-tight tracking-tight group-hover:text-primary transition-colors duration-300">
                                {appointment.doctor}
                            </h3>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest py-0.5 px-2.5 rounded-lg border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
                                    {appointment.speciality}
                                </Badge>
                            </div>
                        </div>

                        {/* Status Badge Desktop */}
                        <div className="hidden md:block">
                            <span className={cn(
                                "inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-sm transition-all duration-300 group-hover:shadow-md",
                                isUpcoming ? "bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/30 dark:border-blue-800/20 shadow-blue-500/5" :
                                    isCancelled ? "bg-red-50 text-red-600 border border-red-100 dark:bg-red-950/30 dark:border-red-800/20 shadow-red-500/5" :
                                        "bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-800/20 shadow-emerald-500/5"
                            )}>
                                {isUpcoming ? <Timer className="h-3.5 w-3.5 animate-pulse" /> :
                                    isCancelled ? <XCircle className="h-3.5 w-3.5" /> :
                                        <CheckCircle2 className="h-3.5 w-3.5" />}
                                {appointment.status}
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
                                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{formatAppointmentDate(appointment.date)}</span>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Scheduled At</p>
                            <div className="flex items-center gap-2 group/time">
                                <div className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 group-hover/time:border-primary/30 transition-colors">
                                    <Clock className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{appointment.date.split("T")[1]?.substring(0, 5) || "Check details"}</span>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Method</p>
                            <div className="flex items-center gap-2 group/method">
                                <div className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 group-hover/method:border-primary/30 transition-colors">
                                    {appointment.type === "Video Consultation" ? <Video className="h-3.5 w-3.5 text-primary" /> : <MapPin className="h-3.5 w-3.5 text-primary" />}
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{appointment.type}</span>
                                    {appointment.type === "In-Person Visit" && appointment.doctorDetails?.address && (
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                `${appointment.doctorDetails.address.street}, ${appointment.doctorDetails.address.city}, ${appointment.doctorDetails.address.state}`
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
                                    <Timer className="h-3.5 w-3.5 text-primary" /> {/* Replaced ArrowUpDown as it was used for fee, keeping layout */}
                                </div>
                                <span className="text-sm font-bold text-zinc-900 dark:text-white">₹{appointment.consultationFee || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-border/50">
                    <button
                        onClick={() => onViewDetails(appointment)}
                        className="flex-1 px-6 py-3 md:py-2.5 text-[11px] font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 shadow-sm"
                    >
                        View Details
                    </button>
                    {isUpcoming && (
                        <button
                            onClick={() => onCancel(appointment.id)}
                            className="px-6 py-3 md:py-2.5 text-[11px] font-black uppercase tracking-wider text-red-600 bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl hover:bg-red-100 transition-all duration-300 shadow-sm"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
