"use client"

import { useState, useEffect } from "react"
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
import { ArrowUpDown, Copy, Edit, MoreHorizontal, Phone, Trash, User, Eye, Activity } from "lucide-react"

type Patient = {
    id: string
    name: string
    age: number
    gender: "Male" | "Female" | "Other"
    contact: string
    bloodGroup: string
    lastVisit: string
    status: "Active" | "Inactive"
}

const data: Patient[] = [
    {
        id: "1",
        name: "Rahul Dravid",
        age: 45,
        gender: "Male",
        contact: "+91 98765 00001",
        bloodGroup: "O+",
        lastVisit: "2024-03-01",
        status: "Active",
    },
    {
        id: "2",
        name: "Smriti Mandhana",
        age: 28,
        gender: "Female",
        contact: "+91 98765 00002",
        bloodGroup: "A+",
        lastVisit: "2024-02-28",
        status: "Active",
    },
    {
        id: "3",
        name: "Virat Kohli",
        age: 35,
        gender: "Male",
        contact: "+91 98765 00003",
        bloodGroup: "B+",
        lastVisit: "2024-01-15",
        status: "Inactive",
    },
    {
        id: "4",
        name: "Mithali Raj",
        age: 39,
        gender: "Female",
        contact: "+91 98765 00004",
        bloodGroup: "AB+",
        lastVisit: "2024-03-05",
        status: "Active",
    },
    {
        id: "5",
        name: "Sachin Tendulkar",
        age: 50,
        gender: "Male",
        contact: "+91 98765 00005",
        bloodGroup: "O-",
        lastVisit: "2023-12-10",
        status: "Active",
    },
]

const columns: ColumnDef<Patient>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "age",
        header: "Age",
    },
    {
        accessorKey: "gender",
        header: "Gender",
    },
    {
        accessorKey: "bloodGroup",
        header: "Blood Group",
        cell: ({ row }) => (
            <Badge variant="outline" className="font-mono">
                {row.getValue("bloodGroup")}
            </Badge>
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
        accessorKey: "lastVisit",
        header: "Last Visit",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge
                    variant={status === "Active" ? "success" : "secondary"}
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
            const patient = row.original

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
                            onClick={() => navigator.clipboard.writeText(patient.id)}
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
                            Edit Patient
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Activity className="mr-2 h-4 w-4" />
                            Medical History
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Patient
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]


export default function PatientsPage() {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Patient Management</h1>
                <Button>
                    <User className="mr-2 h-4 w-4" /> Add Patient
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Patients</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={data} searchKey="name" />
                </CardContent>
            </Card>

        </div>
    )
}
