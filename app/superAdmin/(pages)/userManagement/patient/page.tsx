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
import { ArrowUpDown, Copy, Edit, MoreHorizontal, Phone, Trash, User, Eye, Activity } from "lucide-react"

type Patient = {
    id: string
    name: string
    email: string
    age: number | string
    gender: string
    contact: string
    bloodGroup: string
    lastVisit: string
    status: "Active" | "Inactive"
}

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
        accessorKey: "email",
        header: "Email",
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
    const [data, setData] = useState<Patient[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsMounted(true)
        fetchPatients()
    }, [])

    const fetchPatients = async () => {
        try {
            const response = await fetch("/api/user/patient")
            if (!response.ok) throw new Error("Failed to fetch patients")
            const patients = await response.json()
            setData(patients)
        } catch (error) {
            console.error("Error fetching patients:", error)
        } finally {
            setIsLoading(false)
        }
    }

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
                    {isLoading ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-10 w-[250px]" />
                                <Skeleton className="h-10 w-[100px]" />
                            </div>
                            <div className="rounded-md border">
                                <div className="h-12 border-b px-4 flex items-center gap-4">
                                    <Skeleton className="h-4 w-[150px]" />
                                    <Skeleton className="h-4 w-[150px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                    <Skeleton className="h-4 w-[100px]" />
                                </div>
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-16 border-b px-4 flex items-center gap-4">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[200px]" />
                                            <Skeleton className="h-3 w-[150px]" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={data}
                            searchKey="name"
                        />
                    )}
                </CardContent>
            </Card>

        </div>
    )
}
