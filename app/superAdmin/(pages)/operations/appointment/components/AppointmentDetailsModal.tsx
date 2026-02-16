"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Mail, Phone, User, Video, MapPin, Activity, CreditCard, Stethoscope, Microscope, X } from "lucide-react"
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface AppointmentDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    appointment: any
}

export function AppointmentDetailsModal({
    isOpen,
    onClose,
    appointment
}: AppointmentDetailsModalProps) {
    if (!appointment) return null

    const isDoctor = !!appointment.doctorId
    const isLab = !!appointment.labId

    const getStatusColor = (status: string) => {
        switch (status) {
            case "CONFIRMED": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
            case "PENDING": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
            case "COMPLETED": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
            case "CANCELLED": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
            default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-0 shadow-2xl bg-background/95 backdrop-blur-xl">
                {/* Header */}
                <div className="p-6 border-b sticky top-0 bg-background/95 backdrop-blur-md z-10 flex items-center justify-between">
                    <div>
                        <DialogTitle className="text-2xl font-bold tracking-tight">Appointment Details</DialogTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            ID: <span className="font-mono text-foreground">{appointment.id?.slice(-8).toUpperCase() || "N/A"}</span>
                        </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                    </div>
                </div>

                <div className="p-6 space-y-8">
                    {/* Main Grid: Patient & Provider */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Patient Card */}
                        <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="font-semibold text-lg">Patient</h3>
                            </div>

                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                                    <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                                        {appointment.patientName?.charAt(0) || "P"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-base">{appointment.patientName}</p>
                                    <p className="text-xs text-muted-foreground">{appointment.patientDetails?.gender} • {appointment.patientDetails?.age || "Age N/A"}</p>
                                </div>
                            </div>

                            <Separator className="bg-border/50" />

                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <Mail className="w-4 h-4" />
                                    <span className="text-foreground">{appointment.patientEmail || "No Email"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <Phone className="w-4 h-4" />
                                    <span className="text-foreground">{appointment.patientPhone || "No Phone"}</span>
                                </div>
                                {appointment.patientDetails?.bloodGroup && (
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <Activity className="w-4 h-4" />
                                        <span className="text-foreground">Blood Group: <span className="font-medium">{appointment.patientDetails.bloodGroup}</span></span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Provider Card */}
                        <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`p-2 rounded-xl ${isDoctor ? 'bg-emerald-100 dark:bg-emerald-900/20' : 'bg-purple-100 dark:bg-purple-900/20'}`}>
                                    {isDoctor ? (
                                        <Stethoscope className={`w-5 h-5 ${isDoctor ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
                                    ) : (
                                        <Microscope className={`w-5 h-5 ${!isDoctor ? 'text-purple-600 dark:text-purple-400' : ''}`} />
                                    )}
                                </div>
                                <h3 className="font-semibold text-lg">{isDoctor ? "Doctor" : "Lab"}</h3>
                            </div>

                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                                    <AvatarFallback className={`${isDoctor ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'} font-bold`}>
                                        {appointment.providerName?.charAt(0) || "D"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-base">{appointment.providerName}</p>
                                    {isDoctor && (
                                        <p className="text-xs text-muted-foreground">{appointment.doctorSpecialization}</p>
                                    )}
                                    {isLab && (
                                        <p className="text-xs text-muted-foreground">{appointment.labTestName}</p>
                                    )}
                                </div>
                            </div>

                            <Separator className="bg-border/50" />

                            <div className="space-y-1">
                                <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Hospital / Clinic Info</p>
                                <div className="flex items-start gap-2 text-sm text-foreground">
                                    <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                                    <span>{appointment.hospitalName || "Address not available"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Appointment Details Grid */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary" />
                            Appointment Info
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-card p-4 rounded-xl border shadow-sm flex flex-col items-center text-center gap-2">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 text-orange-600 rounded-lg">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Date</p>
                                    <p className="font-medium text-sm">{format(new Date(appointment.dateTime), "PPP")}</p>
                                </div>
                            </div>
                            <div className="bg-card p-4 rounded-xl border shadow-sm flex flex-col items-center text-center gap-2">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 rounded-lg">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Time</p>
                                    <p className="font-medium text-sm">{format(new Date(appointment.dateTime), "p")}</p>
                                </div>
                            </div>
                            <div className="bg-card p-4 rounded-xl border shadow-sm flex flex-col items-center text-center gap-2">
                                <div className="p-2 bg-rose-100 dark:bg-rose-900/20 text-rose-600 rounded-lg">
                                    {appointment.type === "VIDEO" ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Type</p>
                                    <p className="font-medium text-sm">{appointment.type}</p>
                                </div>
                            </div>
                            <div className="bg-card p-4 rounded-xl border shadow-sm flex flex-col items-center text-center gap-2">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 rounded-lg">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Fee</p>
                                    <p className="font-medium text-sm">₹{appointment.consultationFee}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Video Link Action */}
                    {appointment.type === "VIDEO" && appointment.videoLink && (
                        <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <Video className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold text-primary">Video Consultation Link</p>
                                    <p className="text-sm text-muted-foreground">Click the button to join the meeting room</p>
                                </div>
                            </div>
                            <Button asChild className="w-full sm:w-auto shadow-lg shadow-primary/20">
                                <a href={appointment.videoLink} target="_blank" rel="noopener noreferrer">
                                    Join Meeting Now
                                </a>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t bg-muted/20 flex justify-end gap-3 rounded-b-lg">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
