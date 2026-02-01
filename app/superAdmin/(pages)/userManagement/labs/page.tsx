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
import { ArrowUpDown, Copy, Edit, FlaskConical, Mail, MoreHorizontal, Phone, Trash, Eye, Globe } from "lucide-react"
import { LabDetailsModal } from "./components/LabDetailsModal"
import { DeleteLabModal } from "./components/DeleteLabModal"

type Lab = {
    id: string
    name: string
    contact: string
    email: string
    location: string
    status: string
    rating: number
    description: string | null
    website: string | null
    licenseNumber: string | null
    testTypes: string[]
    isVerified: boolean
}

const getColumns = (
    onViewDetails: (id: string) => void,
    onEdit: (id: string) => void,
    onDelete: (id: string, name: string) => void
): ColumnDef<Lab>[] => [
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
            cell: ({ row }) => <div className="font-medium">{row.getValue("name") || "N/A"}</div>,
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
            accessorKey: "contact",
            header: "Contact",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {row.getValue("contact") || "N/A"}
                </div>
            ),
        },
        {
            accessorKey: "rating",
            header: "Rating",
            cell: ({ row }) => (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    ⭐ {(row.getValue("rating") as number).toFixed(1)}
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
                            status === "ACTIVE"
                                ? "success"
                                : status === "INACTIVE" || status === "BLOCKED"
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
                            <DropdownMenuItem onClick={() => onViewDetails(lab.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(lab.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Lab
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-red-600 cursor-pointer"
                                onClick={() => onDelete(lab.id, lab.name)}
                            >
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
    const [isMounted, setIsMounted] = useState(false)
    const [labs, setLabs] = useState<Lab[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedLabId, setSelectedLabId] = useState<string | null>(null)
    const [selectedLabName, setSelectedLabName] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditingMode, setIsEditingMode] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        fetchLabs()
    }, [])

    const fetchLabs = async () => {
        try {
            const response = await fetch("/api/user/lab")
            if (response.ok) {
                const data = await response.json()
                setLabs(data)
            }
        } catch (error) {
            console.error("Failed to fetch labs", error)
        } finally {
            setLoading(false)
        }
    }

    const handleViewDetails = (id: string) => {
        setSelectedLabId(id)
        setIsEditingMode(false)
        setIsModalOpen(true)
    }

    const handleEdit = (id: string) => {
        setSelectedLabId(id)
        setIsEditingMode(true)
        setIsModalOpen(true)
    }

    const handleDeleteClick = (id: string, name: string) => {
        setSelectedLabId(id)
        setSelectedLabName(name)
        setIsDeleteModalOpen(true)
    }

    const handleDeleteSuccess = () => {
        setIsDeleteModalOpen(false)
        fetchLabs() // Refresh list
    }

    const columns = getColumns(handleViewDetails, handleEdit, handleDeleteClick)

    if (!isMounted) {
        return null
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Labs Management</h1>
                {/* <Button>
                    <FlaskConical className="mr-2 h-4 w-4" /> Add Lab
                </Button> */}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Labs</CardTitle>
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
                        <DataTable columns={columns} data={labs} searchKey="name" />
                    )}
                </CardContent>
            </Card>

            <LabDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                labId={selectedLabId}
                defaultEditing={isEditingMode}
            />
            <DeleteLabModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                labId={selectedLabId}
                labName={selectedLabName}
                onSuccess={handleDeleteSuccess}
            />
        </div>
    )
}
