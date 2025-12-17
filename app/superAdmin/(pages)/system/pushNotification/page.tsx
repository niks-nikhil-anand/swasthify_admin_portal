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
import { ArrowUpDown, Bell, CheckCircle, Copy, Eye, MoreHorizontal, Send } from "lucide-react"

type Notification = {
    id: string
    title: string
    message: string
    audience: "All Users" | "Doctors" | "Patients" | "Specific"
    sentDate: string
    status: "Sent" | "Scheduled"
}

const data: Notification[] = [
    {
        id: "NOT-001",
        title: "Welcome to Swasthify",
        message: "Thank you for joining our platform. Update your profile to get started.",
        audience: "All Users",
        sentDate: "2024-03-01",
        status: "Sent",
    },
    {
        id: "NOT-002",
        title: "Policy Update",
        message: "We have updated our terms of service and privacy policy.",
        audience: "All Users",
        sentDate: "2024-03-10",
        status: "Sent",
    },
    {
        id: "NOT-003",
        title: "Holiday Schedule",
        message: "Labs will be closed on March 25th for Holi.",
        audience: "Patients",
        sentDate: "2024-03-24",
        status: "Scheduled",
    },
    {
        id: "NOT-004",
        title: "New Feature: Video Calls",
        message: "Doctors can now initiate high-quality video consultations directly from the dashboard.",
        audience: "Doctors",
        sentDate: "2024-03-15",
        status: "Sent",
    },
    {
        id: "NOT-005",
        title: "System Maintenance",
        message: "Scheduled maintenance on Sunday, 2 AM - 4 AM.",
        audience: "All Users",
        sentDate: "2024-03-20",
        status: "Sent",
    },
]

const columns: ColumnDef<Notification>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
    },
    {
        accessorKey: "message",
        header: "Message",
        cell: ({ row }) => <div className="max-w-[300px] truncate text-muted-foreground">{row.getValue("message")}</div>,
    },
    {
        accessorKey: "audience",
        header: "Audience",
        cell: ({ row }) => (
            <Badge variant="outline">
                {row.getValue("audience")}
            </Badge>
        ),
    },
    {
        accessorKey: "sentDate",
        header: "Date",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <div className="flex items-center gap-2">
                    {status === "Sent" ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                        <Bell className="h-3 w-3 text-blue-500" />
                    )}
                    <span>{status}</span>
                </div>
            )
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const notification = row.original

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
                            onClick={() => navigator.clipboard.writeText(notification.id)}
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
                            <Send className="mr-2 h-4 w-4" />
                            Resend
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export default function PushNotificationsPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Push Notifications</h1>
                <Button>
                    <Send className="mr-2 h-4 w-4" /> Send Notification
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>History</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={data} searchKey="title" />
                </CardContent>
            </Card>

        </div>
    )
}
