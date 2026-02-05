"use client";

import { ClipboardList, Plus, Search, FileText, Calendar, Link as LinkIcon, MoreVertical, ShieldCheck, HeartPulse, Pill, Syringe } from "lucide-react";
import { cn } from "@/lib/utils";

const records = [
    {
        id: "REC-001",
        title: "Medical Prescription - viral Fever",
        type: "Prescription",
        doctor: "Dr. Sarah Johnson",
        date: "05 Feb, 2026",
        icon: Pill,
        iconColor: "text-blue-500",
        iconBg: "bg-blue-50",
    },
    {
        id: "REC-002",
        title: "Vaccination Record - COVID-19 Booster",
        type: "Vaccination",
        doctor: "General Health Clinic",
        date: "12 Dec, 2025",
        icon: Syringe,
        iconColor: "text-purple-500",
        iconBg: "bg-purple-50",
    },
    {
        id: "REC-003",
        title: "Blood Pressure History - Weekly Log",
        type: "Health Log",
        doctor: "Self Tracked",
        date: "Last updated: Today",
        icon: HeartPulse,
        iconColor: "text-red-500",
        iconBg: "bg-red-50",
    },
];

export default function HealthRecordsPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Health Records</h1>
                    <p className="text-muted-foreground mt-1">Your digital vault for all medical documents and history.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
                    <Plus className="h-4 w-4" /> Upload Record
                </button>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-background border border-border/50 rounded-2xl p-6 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Storage Used</p>
                        <h3 className="text-xl font-bold text-foreground">12.5 MB / 1 GB</h3>
                    </div>
                </div>
                <div className="bg-background border border-border/50 rounded-2xl p-6 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Documents</p>
                        <h3 className="text-xl font-bold text-foreground">24 Files</h3>
                    </div>
                </div>
                <div className="bg-background border border-border/50 rounded-2xl p-6 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <LinkIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Linked Providers</p>
                        <h3 className="text-xl font-bold text-foreground">5 Hospitals</h3>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-lg font-bold text-foreground">Recent Documents</h2>
                    <button className="text-sm font-bold text-primary hover:underline underline-offset-4">View All</button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {records.map((record) => (
                        <div key={record.id} className="bg-background border border-border/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-5 group">
                            <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center border border-border/50 group-hover:scale-110 transition-transform", record.iconBg)}>
                                <record.icon className={cn("h-7 w-7", record.iconColor)} />
                            </div>

                            <div className="flex-1 space-y-1">
                                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{record.title}</h3>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                                        <Calendar className="h-3 w-3" /> {record.date}
                                    </span>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                                        <FileText className="h-3 w-3" /> {record.type}
                                    </span>
                                    <span className="text-xs text-primary font-bold">
                                        {record.doctor}
                                    </span>
                                </div>
                            </div>

                            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all">
                                <MoreVertical className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Empty State / Shared Access */}
            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <ClipboardList className="h-10 w-10 text-primary" />
                </div>
                <div className="flex-1 text-center md:text-left space-y-2">
                    <h3 className="text-xl font-bold text-foreground">Share Records with Doctors</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        You can securely share your medical history and test reports with verified doctors on Swasthify for more accurate diagnosis and treatment.
                    </p>
                </div>
                <button className="px-8 py-3 bg-foreground text-background font-bold rounded-xl hover:opacity-90 transition-opacity shrink-0">
                    Manage Access
                </button>
            </div>
        </div>
    );
}
