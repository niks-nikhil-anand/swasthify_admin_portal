"use client"

import { DataTable } from "@/components/superAdmin/DataTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Mail, Phone, Plus, User } from "lucide-react"

type Doctor = {
    id: string
    name: string
    specialization: string
    email: string
    phone: string
    status: "Active" | "Inactive" | "Pending"
    joinedDate: string
}

const data: Doctor[] = [
    {
        id: "1",
        name: "Dr. Rajesh Koothrappali",
        specialization: "Astrophysics",
        email: "rajesh@example.com",
        phone: "+91 98765 43210",
        status: "Active",
        joinedDate: "2024-01-15",
    },
    {
        id: "2",
        name: "Dr. Sheldon Cooper",
        specialization: "Theoretical Physics",
        email: "sheldon@example.com",
        phone: "+91 98765 43211",
        status: "Active",
        joinedDate: "2024-01-10",
    },
    {
        id: "3",
        name: "Dr. Leonard Hofstadter",
        specialization: "Experimental Physics",
        email: "leonard@example.com",
        phone: "+91 98765 43212",
        status: "Inactive",
        joinedDate: "2024-02-01",
    },
    {
        id: "4",
        name: "Dr. Gregory House",
        specialization: "Diagnostician",
        email: "house@example.com",
        phone: "+91 99999 88888",
        status: "Active",
        joinedDate: "2023-11-20",
    },
    {
        id: "5",
        name: "Dr. Meredith Grey",
        specialization: "General Surgery",
        email: "meredith@example.com",
        phone: "+91 77777 66666",
        status: "Pending",
        joinedDate: "2024-03-05",
    },
    {
        id: "6",
        name: "Dr. Derek Shepherd",
        specialization: "Neurosurgery",
        email: "derek@example.com",
        phone: "+91 55555 44444",
        status: "Active",
        joinedDate: "2024-03-01",
    },
    {
        id: "7",
        name: "Dr. Shaun Murphy",
        specialization: "Surgical Resident",
        email: "shaun@example.com",
        phone: "+91 33333 22222",
        status: "Active",
        joinedDate: "2024-02-15",
    },
]

const columns: ColumnDef<Doctor>[] = [
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
        accessorKey: "specialization",
        header: "Specialization",
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {row.getValue("email")}
            </div>
        ),
    },
    {
        accessorKey: "phone",
        header: "Contact",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {row.getValue("phone")}
            </div>
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
        accessorKey: "joinedDate",
        header: "Joined Date",
    },
]

export default function DoctorsPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Doctors Management</h1>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Doctor
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Doctors</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={data} searchKey="name" />
                </CardContent>
            </Card>

        </div>
    )
}
