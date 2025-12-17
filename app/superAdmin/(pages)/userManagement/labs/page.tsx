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
import { ArrowUpDown, Copy, Edit, FlaskConical, MapPin, MoreHorizontal, Phone, Trash, Eye } from "lucide-react"

type Lab = {
    id: string
    name: string
    contact: string
    email: string
    location: string
    status: "Active" | "Inactive" | "Maintenance"
    rating: number
}

const data: Lab[] = [
    {
        id: "1",
        name: "City Path Labs",
        contact: "+91 80000 11111",
        email: "contact@citypath.com",
        location: "Mumbai, MH",
        status: "Active",
        rating: 4.5,
    },
    {
        id: "2",
        name: "Global Diagnostics",
        contact: "+91 80000 22222",
        email: "info@globaldiag.com",
        location: "Delhi, DL",
        status: "Active",
        rating: 4.2,
    },
    {
        id: "3",
        name: "TrustCare Labs",
        contact: "+91 80000 33333",
        email: "support@trustcare.com",
        location: "Bangalore, KA",
        status: "Maintenance",
        rating: 4.8,
    },
    {
        id: "4",
        name: "HealthFirst Diagnostics",
        contact: "+91 80000 44444",
        email: "lab@healthfirst.com",
        location: "Hyderabad, TS",
        status: "Inactive",
        rating: 3.9,
    },
]

const columns: ColumnDef<Lab>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Lab Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {row.getValue("location")}
            </div>
        ),
    },
    {
        accessorKey: "contact",
        header: "Contact",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {row.getValue("contact")}
            </div>
        ),
    },
    {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                ⭐ {row.getValue("rating")}
            </Badge>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge
                    variant={
                        status === "Active"
                            ? "success"
                            : status === "Inactive"
                                ? "secondary"
                                : "warning"
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
            const lab = row.original

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
                            onClick={() => navigator.clipboard.writeText(lab.id)}
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
                            Edit Lab
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Lab
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export default function LabsPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Labs Management</h1>
                <Button>
                    <FlaskConical className="mr-2 h-4 w-4" /> Add Lab
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Labs</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={data} searchKey="name" />
                </CardContent>
            </Card>

        </div>
    )
}
