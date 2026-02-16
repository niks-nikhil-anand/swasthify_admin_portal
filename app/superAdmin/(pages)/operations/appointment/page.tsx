"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/superAdmin/DataTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Calendar, Copy, Eye, MoreHorizontal, Video, MapPin, Stethoscope, Microscope } from "lucide-react"
import { format } from "date-fns"
import { AppointmentDetailsModal } from "./components/AppointmentDetailsModal"

type Appointment = {
    id: string
    patientName: string
    patientEmail: string
    patientPhone: string
    providerName: string
    doctorId: string | null
    labId: string | null
    dateTime: string
    type: string
    status: string
    consultationFee: number
    videoLink: string | null
    doctorSpecialization?: string
    labTestName?: string
}

export default function AppointmentsPage() {
    const [isMounted, setIsMounted] = useState(false)
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        fetchAppointments()
    }, [])

    const fetchAppointments = async () => {
        try {
            const response = await fetch("/api/superAdmin/appointments")
            if (response.ok) {
                const data = await response.json()
                setAppointments(data)
            }
        } catch (error) {
            console.error("Failed to fetch appointments", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleViewDetails = (appointment: Appointment) => {
        setSelectedAppointment(appointment)
        setIsModalOpen(true)
    }

    const columns: ColumnDef<Appointment>[] = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => <div className="text-xs font-mono">{(row.getValue("id") as string).slice(0, 8)}...</div>,
        },
        {
            accessorKey: "patientName",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4"
                    >
                        Patient
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="font-medium">{row.getValue("patientName")}</div>,
        },
        {
            accessorKey: "providerName",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4"
                    >
                        Provider
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const apt = row.original
                return (
                    <div className="flex items-center gap-2">
                        {apt.doctorId ? <Stethoscope className="h-3 w-3 text-muted-foreground" /> : <Microscope className="h-3 w-3 text-muted-foreground" />}
                        {row.getValue("providerName")}
                    </div>
                )
            }
        },
        {
            accessorKey: "dateTime",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4"
                    >
                        Date & Time
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const date = new Date(row.getValue("dateTime"))
                return (
                    <div className="flex flex-col">
                        <span>{format(date, "dd MMM yyyy")}</span>
                        <span className="text-xs text-muted-foreground">{format(date, "hh:mm a")}</span>
                    </div>
                )
            }
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => {
                const type = row.getValue("type") as string;
                return (
                    <div className="flex items-center gap-2">
                        {type === "VIDEO" ? <Video className="h-3 w-3" /> : (type === "IN_PERSON" ? <MapPin className="h-3 w-3" /> : <Calendar className="h-3 w-3" />)}
                        <span className="capitalize">{type.toLowerCase().replace('_', ' ')}</span>
                    </div>
                )
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string
                return (
                    <Badge
                        variant={
                            status === "CONFIRMED"
                                ? "success"
                                : status === "PENDING"
                                    ? "warning"
                                    : status === "COMPLETED"
                                        ? "secondary"
                                        : "danger"
                        }
                    >
                        {status}
                    </Badge>
                )
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const appointment = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(appointment.id)}
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewDetails(appointment)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const facetedFilters = [
        {
            columnId: "status",
            title: "Status",
            options: [
                { label: "Pending", value: "PENDING" },
                { label: "Confirmed", value: "CONFIRMED" },
                { label: "Completed", value: "COMPLETED" },
                { label: "Cancelled", value: "CANCELLED" },
                { label: "Rescheduled", value: "RESCHEDULED" },
            ],
        },
        {
            columnId: "type",
            title: "Type",
            options: [
                { label: "Video", value: "VIDEO", icon: Video },
                { label: "In Person", value: "IN_PERSON", icon: MapPin },
                { label: "Lab Walk-in", value: "LAB_WALK_IN", icon: Calendar },
                { label: "Lab Home Collection", value: "LAB_HOME_COLLECTION", icon: MapPin },
            ],
        },
    ]

    if (!isMounted) {
        return null
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
                <Button variant="outline" onClick={fetchAppointments}>
                    Refresh Data
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={appointments}
                            searchKey="patientName"
                            facetedFilters={facetedFilters}
                        />
                    )}
                </CardContent>
            </Card>

            <AppointmentDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                appointment={selectedAppointment}
            />
        </div>
    )
}
