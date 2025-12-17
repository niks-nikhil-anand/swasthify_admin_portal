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
import { AlertTriangle, ArrowUpDown, Copy, Eye, MessageSquareWarning, MoreHorizontal, ShieldAlert } from "lucide-react"

type Complaint = {
    id: string
    complainant: string
    against: string
    category: "Medical Negligence" | "Billing Issue" | "Behavioral" | "Other"
    status: "New" | "Investigating" | "Resolved" | "Dismissed"
    date: string
}

const data: Complaint[] = [
    {
        id: "CMP-501",
        complainant: "Rahul Dravid",
        against: "Dr. Heinz Doofenshmirtz",
        category: "Billing Issue",
        status: "New",
        date: "2024-03-20",
    },
    {
        id: "CMP-502",
        complainant: "Smriti Mandhana",
        against: "City Path Labs",
        category: "Other",
        status: "Investigating",
        date: "2024-03-18",
    },
    {
        id: "CMP-503",
        complainant: "Virat Kohli",
        against: "Dr. Gregory House",
        category: "Behavioral",
        status: "Resolved",
        date: "2024-03-15",
    },
    {
        id: "CMP-504",
        complainant: "Anonymous",
        against: "Global Diagnostics",
        category: "Medical Negligence",
        status: "New",
        date: "2024-03-19",
    },
]

const columns: ColumnDef<Complaint>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <div className="font-mono text-xs">{row.getValue("id")}</div>,
    },
    {
        accessorKey: "complainant",
        header: "Complainant",
    },
    {
        accessorKey: "against",
        header: "Against",
        cell: ({ row }) => (
            <div className="font-semibold text-red-600/80">
                {row.getValue("against")}
            </div>
        ),
    },
    {
        accessorKey: "category",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Category
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
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
                        status === "New"
                            ? "danger"
                            : status === "Resolved"
                                ? "success"
                                : "warning"
                    }
                >
                    {status}
                </Badge>
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
            const complaint = row.original

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
                            onClick={() => navigator.clipboard.writeText(complaint.id)}
                        >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                            <ShieldAlert className="mr-2 h-4 w-4" />
                            Escalate
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export default function ComplaintsPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Complaints & Grievances</h1>
                <Button variant="destructive">
                    <MessageSquareWarning className="mr-2 h-4 w-4" /> File Complaint
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Complaints</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={data} searchKey="category" />
                </CardContent>
            </Card>

        </div>
    )
}
