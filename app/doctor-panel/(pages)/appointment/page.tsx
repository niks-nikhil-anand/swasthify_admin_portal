"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, MoreHorizontal, Video, Phone, Search, Filter, ArrowUpDown, User, Mail, Smartphone, Info, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function AppointmentPage() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await fetch("/api/doctor/appointments");
                const data = await res.json();
                if (res.ok) {
                    setAppointments(data.appointments);
                } else {
                    toast.error(data.error || "Failed to load appointments");
                }
            } catch (err) {
                toast.error("An error occurred while fetching appointments");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const filteredAndSortedAppointments = useMemo(() => {
        let result = appointments.filter((apt) => {
            const matchesSearch = apt.patient.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                apt.patient.user.email.toLowerCase().includes(searchTerm.toLowerCase());

            if (statusFilter === "all" || statusFilter === "today") return matchesSearch;
            if (statusFilter === "upcoming") return matchesSearch && (apt.status === "CONFIRMED" || apt.status === "PENDING");
            if (statusFilter === "past") return matchesSearch && apt.status === "COMPLETED";
            if (statusFilter === "cancelled") return matchesSearch && apt.status === "CANCELLED";

            return matchesSearch;
        });

        return result.sort((a, b) => {
            const dateA = new Date(a.dateTime).getTime();
            const dateB = new Date(b.dateTime).getTime();
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });
    }, [appointments, searchTerm, statusFilter, sortOrder]);

    const handleViewDetails = (patient: any) => {
        setSelectedPatient(patient);
        setIsDetailsOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Appointments</h1>
                    <p className="text-muted-foreground font-medium">Manage your schedule and patient visits with ease.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl font-semibold border-border/50">
                        <Calendar className="mr-2 w-4 h-4" /> Calendar View
                    </Button>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full md:max-w-md group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search by patient name or email..."
                        className="pl-10 h-12 rounded-2xl border-border/50 bg-background focus:ring-2 focus:ring-primary/20 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        className="rounded-xl text-xs font-bold hover:bg-muted/50"
                    >
                        <ArrowUpDown className="mr-2 w-3 h-3 text-primary" />
                        Sort: {sortOrder === "asc" ? "Oldest First" : "Newest First"}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="all" className="space-y-6" onValueChange={setStatusFilter}>
                <TabsList className="bg-muted/30 p-1 rounded-2xl border border-border/50">
                    <TabsTrigger value="all" className="rounded-xl px-6 font-bold transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">All</TabsTrigger>
                    <TabsTrigger value="upcoming" className="rounded-xl px-6 font-bold transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">Upcoming</TabsTrigger>
                    <TabsTrigger value="past" className="rounded-xl px-6 font-bold transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">Past</TabsTrigger>
                    <TabsTrigger value="cancelled" className="rounded-xl px-6 font-bold transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">Cancelled</TabsTrigger>
                </TabsList>

                <TabsContent value={statusFilter} className="mt-0">
                    {isLoading ? (
                        <div className="grid gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-24 w-full bg-muted/30 rounded-3xl animate-pulse" />
                            ))}
                        </div>
                    ) : filteredAndSortedAppointments.length > 0 ? (
                        <div className="grid gap-4">
                            {filteredAndSortedAppointments.map((apt) => (
                                <AppointmentCard key={apt.id} appointment={apt} onViewDetails={() => handleViewDetails(apt.patient)} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-muted/10 rounded-3xl border-2 border-dashed border-border/50">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                <Search className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold">No appointments found</h3>
                                <p className="text-muted-foreground max-w-xs">Adjust your filters or try searching for something else.</p>
                            </div>
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Patient Details Modal */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                    {selectedPatient && (
                        <>
                            <div className="bg-primary p-8 text-white relative">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <User className="w-32 h-32" />
                                </div>
                                <div className="flex items-center gap-6 relative z-10">
                                    <Avatar className="h-20 w-20 border-4 border-white/20 shadow-xl">
                                        <AvatarImage src={selectedPatient.profilePic} />
                                        <AvatarFallback className="bg-white/20 text-white font-bold text-3xl uppercase">
                                            {selectedPatient.user.name?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <DialogTitle className="text-2xl font-black">{selectedPatient.user.name}</DialogTitle>
                                        <p className="text-white/80 font-medium">Patient ID: {selectedPatient.id.substring(0, 8).toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 space-y-8 bg-background">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-bold uppercase tracking-wider">Email Address</p>
                                                <p className="text-sm font-bold text-foreground truncate">{selectedPatient.user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0">
                                                <Smartphone className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-bold uppercase tracking-wider">Phone Number</p>
                                                <p className="text-sm font-bold text-foreground">{selectedPatient.user.phone || "Not provided"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-bold uppercase tracking-wider">Gender / Blood</p>
                                                <p className="text-sm font-bold text-foreground">
                                                    {selectedPatient.gender || "N/A"} • {selectedPatient.bloodGroup || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-bold uppercase tracking-wider">Member Since</p>
                                                <p className="text-sm font-bold text-foreground">
                                                    {format(new Date(selectedPatient.createdAt), "MMM d, yyyy")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-6 border-t border-border/50">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                        <Info className="w-3 h-3 text-primary" /> Medical Notes
                                    </p>
                                    <div className="bg-muted/30 p-4 rounded-2xl">
                                        <p className="text-sm text-foreground/80 leading-relaxed italic">
                                            {selectedPatient.chronicDiseases ? `Known conditions: ${selectedPatient.chronicDiseases}` : "No documented chronic diseases or conditions."}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="p-6 bg-muted/10 border-t border-border/50 flex flex-row gap-3">
                                <Button
                                    onClick={() => setIsDetailsOpen(false)}
                                    className="flex-1 h-12 rounded-2xl font-bold bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Close Record
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

function AppointmentCard({ appointment, onViewDetails }: { appointment: any; onViewDetails: () => void }) {
    const isCancelled = appointment.status === "CANCELLED";
    const isConfirmed = appointment.status === "CONFIRMED";
    const isPending = appointment.status === "PENDING";
    const isCompleted = appointment.status === "COMPLETED";

    return (
        <Card className="group relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border-border/50 hover:border-primary/20 rounded-3xl bg-background/50 backdrop-blur-sm">
            <div className="flex items-center gap-5 flex-1">
                <div className="relative">
                    <Avatar className="h-16 w-16 border-2 border-background shadow-xl group-hover:scale-110 transition-transform duration-500">
                        <AvatarImage src={appointment.patient.profilePic} alt={appointment.patient.user.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg uppercase">
                            {appointment.patient.user.name?.[0] || 'P'}
                        </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                        "absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-background flex items-center justify-center shadow-lg",
                        isConfirmed ? "bg-emerald-500" : isCancelled ? "bg-red-500" : isPending ? "bg-amber-500" : "bg-primary"
                    )}>
                        {isConfirmed && <CheckIcon className="w-3 h-3 text-white" />}
                    </div>
                </div>
                <div className="space-y-1">
                    <h3 className="font-extrabold text-lg text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
                        {appointment.patient.user.name}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest bg-muted/50 px-2 py-0.5 rounded-lg border border-border/50">
                            {appointment.patient.gender || "Patient"}
                        </span>
                        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> In-Clinic
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-8 text-sm text-foreground/80 flex-1 sm:justify-center font-bold">
                <div className="flex flex-col items-start min-w-[120px]">
                    <p className="text-[10px] text-muted-foreground uppercase mb-1 tracking-tighter opacity-50">Date</p>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-primary/5 rounded-lg flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <span className="tracking-tight">{format(new Date(appointment.dateTime), "EEE, MMM d")}</span>
                    </div>
                </div>
                <div className="flex flex-col items-start min-w-[100px]">
                    <p className="text-[10px] text-muted-foreground uppercase mb-1 tracking-tighter opacity-50">Slot Time</p>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-primary/5 rounded-lg flex items-center justify-center">
                            <Clock className="h-4 w-4 text-primary" />
                        </div>
                        <span className="tracking-tight">{format(new Date(appointment.dateTime), "hh:mm a")}</span>
                    </div>
                </div>
                <div className="flex flex-col items-start min-w-[80px]">
                    <p className="text-[10px] text-muted-foreground uppercase mb-1 tracking-tighter opacity-50">Queue No</p>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
                            <span className="text-primary font-black text-sm">{appointment.queueNumber || "--"}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end mt-4 sm:mt-0">
                <div className={cn(
                    "px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm transition-colors",
                    isPending ? "bg-amber-100/50 text-amber-700 border-amber-200" :
                        isConfirmed ? "bg-emerald-100/50 text-emerald-700 border-emerald-200" :
                            isCompleted ? "bg-muted text-muted-foreground border-border" :
                                "bg-red-100/50 text-red-700 border-red-200"
                )}>
                    {appointment.status}
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-muted/50 border border-transparent hover:border-border/50 shadow-sm transition-all">
                            <MoreHorizontal className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-2xl border-border/50 shadow-2xl min-w-[200px] p-2">
                        <DropdownMenuLabel className="font-bold text-[10px] uppercase tracking-widest opacity-50 px-3 py-2">Appointment Control</DropdownMenuLabel>
                        <DropdownMenuItem onClick={onViewDetails} className="rounded-xl font-bold h-11 cursor-pointer focus:bg-primary/5 focus:text-primary">
                            <User className="mr-3 w-4 h-4" /> View Patient ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/50 my-1" />
                        <DropdownMenuItem className="rounded-xl font-bold h-11 cursor-pointer text-destructive focus:bg-destructive/5 focus:text-destructive">
                            <X className="mr-3 w-4 h-4" /> Cancel Booking
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </Card>
    );
}

function CheckIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}