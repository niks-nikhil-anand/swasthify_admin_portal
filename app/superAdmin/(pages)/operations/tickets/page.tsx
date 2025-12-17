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
import { ArrowUpDown, CheckCircle, Clock, Copy, MoreHorizontal, Ticket } from "lucide-react"

type SupportTicket = {
    id: string
    user: string
    subject: string
    priority: "High" | "Medium" | "Low"
    status: "Open" | "In Progress" | "Resolved"
    date: string
}

const data: SupportTicket[] = [
    {
        id: "TCK-1001",
        user: "Dr. Heinz Doofenshmirtz",
        subject: "Login issues on mobile app",
        priority: "High",
        status: "Open",
        date: "2024-03-18",
    },
    {
        id: "TCK-1002",
        user: "City Path Labs",
        subject: "Report download failing",
        priority: "Medium",
        status: "In Progress",
        date: "2024-03-17",
    },
    {
        id: "TCK-1003",
        user: "Rahul Dravid",
        subject: "Update profile picture not working",
        priority: "Low",
        status: "Resolved",
        date: "2024-03-15",
    },
    {
        id: "TCK-1004",
        user: "Global Diagnostics",
        subject: "Billing invoice incorrect",
        priority: "High",
        status: "Open",
        date: "2024-03-19",
    },
    {
        id: "TCK-1005",
        user: "Smriti Mandhana",
        subject: "Feature request: Dark mode",
        priority: "Low",
        status: "Resolved",
        date: "2024-03-10",
    },
]

const columns: ColumnDef<SupportTicket>[] = [
    {
        accessorKey: "id",
        header: "Ticket ID",
        cell: ({ row }) => <div className="font-mono text-xs">{row.getValue("id")}</div>,
    },
    {
        accessorKey: "subject",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Subject
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium max-w-[200px] truncate" title={row.getValue("subject")}>{row.getValue("subject")}</div>,
    },
    {
        accessorKey: "user",
        header: "User",
    },
    {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => {
            const priority = row.getValue("priority") as string
            return (
                <Badge
                    variant={
                        priority === "High"
                            ? "danger"
                            : priority === "Medium"
                                ? "warning"
                                : "secondary"
                    }
                >
                    {priority}
                </Badge>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <div className="flex items-center gap-2">
                    {status === "Resolved" ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                        <Clock className="h-3 w-3 text-yellow-500" />
                    )}
                    <span>{status}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "date",
        header: "Date",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const ticket = row.original

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
                            onClick={() => navigator.clipboard.writeText(ticket.id)}
                        >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            View Ticket
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            Update Status
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export default function TicketsPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
                <Button>
                    <Ticket className="mr-2 h-4 w-4" /> Create Ticket
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={data} searchKey="subject" />
                </CardContent>
            </Card>

        </div>
    )
}
