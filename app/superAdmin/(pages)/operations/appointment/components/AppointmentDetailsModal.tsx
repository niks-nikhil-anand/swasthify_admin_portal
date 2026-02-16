"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Mail, Phone, User, Video, MapPin, Activity, CreditCard, Stethoscope, Microscope } from "lucide-react"
import { format } from "date-fns"

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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl font-bold">Appointment Details</DialogTitle>
                        <Badge
                            variant={
                                appointment.status === "CONFIRMED"
                                    ? "success"
                                    : appointment.status === "PENDING"
                                        ? "warning"
                                        : appointment.status === "COMPLETED"
                                            ? "secondary"
                                            : "danger"
                            }
                        >
                            {appointment.status}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    {/* Patient Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                            <User className="h-5 w-5 text-primary" />
                            Patient Information
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Name:</span>
                                <span className="font-medium">{appointment.patientName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Email:</span>
                                <span className="font-medium">{appointment.patientEmail}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Phone:</span>
                                <span className="font-medium">{appointment.patientPhone}</span>
                            </div>
                            {appointment.patientDetails?.gender && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Gender:</span>
                                    <span className="font-medium">{appointment.patientDetails.gender}</span>
                                </div>
                            )}
                            {appointment.patientDetails?.dob && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">DOB:</span>
                                    <span className="font-medium">
                                        {format(new Date(appointment.patientDetails.dob), "PPP")}
                                    </span>
                                </div>
                            )}
                            {appointment.patientDetails?.bloodGroup && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Blood Group:</span>
                                    <Badge variant="outline">{appointment.patientDetails.bloodGroup}</Badge>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Provider Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                            {isDoctor ? (
                                <Stethoscope className="h-5 w-5 text-primary" />
                            ) : (
                                <Microscope className="h-5 w-5 text-primary" />
                            )}
                            {isDoctor ? "Doctor Information" : "Lab Information"}
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Name:</span>
                                <span className="font-medium">{appointment.providerName}</span>
                            </div>
                            {isDoctor && appointment.doctorSpecialization && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Specialization:</span>
                                    <span className="font-medium">{appointment.doctorSpecialization}</span>
                                </div>
                            )}
                            {isLab && appointment.labTestName && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Test:</span>
                                    <span className="font-medium">{appointment.labTestName}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="space-y-4 md:col-span-2">
                        <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                            <Activity className="h-5 w-5 text-primary" />
                            Appointment Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Date</p>
                                    <p className="font-medium">{format(new Date(appointment.dateTime), "PPP")}</p>
                                </div>
                            </div>
                            <div className="items-center gap-3 bg-muted/50 p-3 rounded-lg flex">
                                <Clock className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Time</p>
                                    <p className="font-medium">{format(new Date(appointment.dateTime), "p")}</p>
                                </div>
                            </div>
                            <div className="items-center gap-3 bg-muted/50 p-3 rounded-lg flex">
                                {appointment.type === "VIDEO" ? (
                                    <Video className="h-5 w-5 text-muted-foreground" />
                                ) : (
                                    <MapPin className="h-5 w-5 text-muted-foreground" />
                                )}
                                <div>
                                    <p className="text-xs text-muted-foreground">Type</p>
                                    <p className="font-medium">{appointment.type}</p>
                                </div>
                            </div>
                            <div className="items-center gap-3 bg-muted/50 p-3 rounded-lg flex">
                                <CreditCard className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Fee</p>
                                    <p className="font-medium">₹{appointment.consultationFee}</p>
                                </div>
                            </div>
                        </div>

                        {appointment.type === "VIDEO" && appointment.videoLink && (
                            <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Video className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-sm font-semibold text-primary">Meeting Link</p>
                                        <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                                            {appointment.videoLink}
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href={appointment.videoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors"
                                >
                                    Join Meeting
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
