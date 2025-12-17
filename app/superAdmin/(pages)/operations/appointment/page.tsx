"use client"

import { DataTable } from "@/components/superAdmin/DataTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Calendar, Copy, Edit, Eye, MoreHorizontal, Video } from "lucide-react"

type Appointment = {
    id: string
    patientName: string
    doctorName: string
    date: string
    time: string
    type: "Online" | "Offline"
    status: "Scheduled" | "Completed" | "Cancelled"
}

const data: Appointment[] = [
    {
        id: "APT-001",
        patientName: "Rahul Dravid",
        doctorName: "Dr. Heinz Doofenshmirtz",
        date: "2024-03-20",
        time: "10:00 AM",
        type: "Online",
        status: "Scheduled",
    },
    {
        id: "APT-002",
        patientName: "Smriti Mandhana",
        doctorName: "Dr. Gregory House",
        date: "2024-03-21",
        time: "11:30 AM",
        type: "Offline",
        status: "Completed",
    },
    {
        id: "APT-003",
        patientName: "Virat Kohli",
        doctorName: "Dr. Shaun Murphy",
        date: "2024-03-22",
        time: "02:00 PM",
        type: "Online",
        status: "Cancelled",
    },
    {
        id: "APT-004",
        patientName: "Mithali Raj",
        doctorName: "Dr. Meredith Grey",
        date: "2024-03-23",
        time: "04:15 PM",
        type: "Offline",
        status: "Scheduled",
    },
    {
        id: "APT-005",
        patientName: "Sachin Tendulkar",
        doctorName: "Dr. Stephen Strange",
        date: "2024-03-24",
        time: "09:00 AM",
        type: "Online",
        status: "Scheduled",
    },
]

const columns: ColumnDef<Appointment>[] = [
    {
        accessorKey: "patientName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Patient
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue("patientName")}</div>,
    },
    {
        accessorKey: "doctorName",
        header: "Doctor",
    },
    {
        accessorKey: "date",
        header: "Date",
    },
    {
        accessorKey: "time",
        header: "Time",
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
            const type = row.getValue("type") as string;
            return (
                <div className="flex items-center gap-2">
                    {type === "Online" ? <Video className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                    {type}
                </div>
            )
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge
                    variant={
                        status === "Scheduled"
                            ? "warning"
                            : status === "Completed"
                                ? "success"
                                : "danger"
                    }
                >
                    {status}
                </Badge>
            )
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
                        <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Reschedule
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export default function AppointmentsPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
                <Button>
                    <Calendar className="mr-2 h-4 w-4" /> New Appointment
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={data} searchKey="patientName" />
                </CardContent>
            </Card>

        </div>
    )
}
