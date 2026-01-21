"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
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
import { ArrowUpDown, Copy, Edit, Mail, MoreHorizontal, Phone, Plus, Trash, Eye } from "lucide-react"

type Doctor = {
    id: string
    name: string
    specialization: string
    email: string
    phone: string
    status: string
    joinedDate: string
    clinicName: string | null
    qualification: string | null
    experience: number | null
    city: string
    isVerified: boolean
}

const getColumns = (
    onViewDetails: (id: string) => void
): ColumnDef<Doctor>[] => [
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
            cell: ({ row }) => <div className="font-medium">{row.getValue("name") || "N/A"}</div>,
        },
        {
            accessorKey: "specialization",
            header: "Specialization",
            cell: ({ row }) => <div>{row.getValue("specialization") || "N/A"}</div>,
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {row.getValue("email") || "N/A"}
                </div>
            ),
        },
        {
            accessorKey: "phone",
            header: "Contact",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {row.getValue("phone") || "N/A"}
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
                            status === "ACTIVE"
                                ? "success"
                                : status === "INACTIVE" || status === "BLOCKED"
                                    ? "secondary"
                                    : "warning"
                        }
                    >
                        {status || "N/A"}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "isVerified",
            header: "Verified",
            cell: ({ row }) => {
                const isVerified = row.getValue("isVerified") as boolean
                return (
                    <Badge variant={isVerified ? "success" : "secondary"}>
                        {isVerified ? "Verified" : "Not Verified"}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "joinedDate",
            header: "Joined Date",
            cell: ({ row }) => {
                const date = row.getValue("joinedDate") as string
                return <div>{date ? new Date(date).toLocaleDateString() : "N/A"}</div>
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const doctor = row.original

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
                                onClick={() => navigator.clipboard.writeText(doctor.id)}
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onViewDetails(doctor.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onViewDetails(doctor.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Doctor
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                                <Trash className="mr-2 h-4 w-4" />
                                Delete Doctor
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

import { DoctorDetailsModal } from "./components/DoctorDetailsModal"

export default function DoctorsPage() {
    const [isMounted, setIsMounted] = useState(false)
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        fetchDoctors()
    }, [])

    const fetchDoctors = async () => {
        try {
            const response = await fetch("/api/user/doctor")
            if (response.ok) {
                const data = await response.json()
                setDoctors(data)
            }
        } catch (error) {
            console.error("Failed to fetch doctors", error)
        } finally {
            setLoading(false)
        }
    }

    const handleViewDetails = (id: string) => {
        setSelectedDoctorId(id)
        setIsModalOpen(true)
    }

    const columns = getColumns(handleViewDetails)

    if (!isMounted) {
        return null
    }

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
                    {loading ? (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between py-4">
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
                        <DataTable columns={columns} data={doctors} searchKey="name" />
                    )}
                </CardContent>
            </Card>

            <DoctorDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                doctorId={selectedDoctorId}
            />
        </div>
    )
}
