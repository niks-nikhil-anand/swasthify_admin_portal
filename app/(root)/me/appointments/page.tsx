"use client";

import { Calendar, Clock, MapPin, ChevronRight, Video, User, CheckCircle2, XCircle, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

const appointments = [
    {
        id: "APT-001",
        doctor: "Dr. Sarah Johnson",
        speciality: "Cardiologist",
        date: "Tomorrow, 10:30 AM",
        type: "Video Consultation",
        status: "Upcoming",
        img: "SJ",
    },
    {
        id: "APT-002",
        doctor: "Dr. Michael Chen",
        speciality: "Dermatologist",
        date: "Friday, 02:15 PM",
        type: "In-Clinic Visit",
        status: "Upcoming",
        img: "MC",
    },
    {
        id: "APT-003",
        doctor: "Dr. Emily Davis",
        speciality: "General Physician",
        date: "25 Jan, 2026",
        type: "Video Consultation",
        status: "Completed",
        img: "ED",
    },
];

export default function AppointmentsPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">My Appointments</h1>
                    <p className="text-muted-foreground mt-1">Manage all your upcoming and past medical consultations.</p>
                </div>
                <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
                    Book New Appointment
                </button>
            </div>

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
                                        apt.status === "Upcoming" ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30" : "bg-green-100 text-green-600 dark:bg-green-900/30"
                                    )}>
                                        {apt.status === "Upcoming" ? <Timer className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                                        {apt.status}
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-muted-foreground">{apt.speciality}</p>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 pt-2">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar className="h-3.5 w-3.5 text-primary" /> {apt.date}
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
                                    <button className="px-5 py-2 text-xs font-bold text-red-600 border border-red-200 dark:border-red-900/30 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State Mockup */}
            <div className="pt-8 text-center border-2 border-dashed border-border/50 rounded-3xl p-12">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Need a checkup?</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
                    Schedule an appointment with our specialist and get the care you deserve.
                </p>
            </div>
        </div>
    );
}
