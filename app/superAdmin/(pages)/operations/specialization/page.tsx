"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTable, FacetedFilter } from "@/components/superAdmin/DataTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Copy, Edit, Eye, MoreHorizontal, Plus, Trash, Stethoscope, User, Building } from "lucide-react"
import { AddSpecializationModal } from "./components/AddSpecializationModal"
import { ViewSpecializationModal } from "./components/ViewSpecializationModal"
import { AlertModal } from "@/components/superAdmin/modals/AlertModal"
import { toast } from "sonner"

type Specialization = {
    id: string
    name: string
    description: string | null
    image: string | null
    type: "DOCTOR" | "LAB" | "ALL"
    createdAt: string
}

export default function SpecializationsPage() {
    const [isMounted, setIsMounted] = useState(false)
    const [specializations, setSpecializations] = useState<Specialization[]>([])
    const [loading, setLoading] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const [selectedSpecialization, setSelectedSpecialization] = useState<Specialization | undefined>(undefined)

    useEffect(() => {
        setIsMounted(true)
        fetchSpecializations()
    }, [])

    const fetchSpecializations = async () => {
        try {
            const response = await fetch("/api/admin/specializations")
            if (response.ok) {
                const data = await response.json()
                setSpecializations(data)
            }
        } catch (error) {
            console.error("Failed to fetch specializations", error)
            toast.error("Failed to fetch specializations")
        } finally {
            setLoading(false)
        }
    }

    const handleView = (spec: Specialization) => {
        setSelectedSpecialization(spec)
        setIsViewModalOpen(true)
    }

    const handleEdit = (spec: Specialization) => {
        setSelectedSpecialization(spec)
        setIsModalOpen(true)
    }

    const handleDelete = (spec: Specialization) => {
        setSelectedSpecialization(spec)
        setIsAlertOpen(true)
    }

    const onConfirmDelete = async () => {
        if (!selectedSpecialization) return

        setIsDeleting(true)
        try {
            const response = await fetch(`/api/admin/specializations/${selectedSpecialization.id}`, {
                method: "DELETE"
            })
            if (response.ok) {
                toast.success("Specialization deleted")
                fetchSpecializations()
                setIsAlertOpen(false)
            } else {
                const data = await response.json()
                toast.error(data.error || "Failed to delete")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsDeleting(false)
        }
    }

    const columns: ColumnDef<Specialization>[] = [
        {
            accessorKey: "image",
            header: "Image",
            cell: ({ row }) => {
                const imageUrl = row.getValue("image") as string
                return (
                    <div className="h-10 w-10 rounded-md overflow-hidden bg-muted flex items-center justify-center border">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={row.getValue("name")}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <Stethoscope className="h-5 w-5 text-muted-foreground/50" />
                        )}
                    </div>
                )
            },
        },
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
            cell: ({ row }) => <div className="font-semibold">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "type",
            header: "Entity",
            cell: ({ row }) => {
                const type = row.getValue("type") as string
                return (
                    <Badge
                        variant={type === "ALL" ? "default" : "secondary"}
                        className="flex w-fit items-center gap-1"
                    >
                        {type === "LAB" ? <Building className="h-3 w-3" /> : <User className="h-3 w-3" />}
                        {type}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => (
                <div className="max-w-[400px] truncate" title={row.getValue("description")}>
                    {row.getValue("description") || "No description"}
                </div>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ row }) => {
                const date = row.getValue("createdAt") as string
                return <div>{new Date(date).toLocaleDateString()}</div>
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const spec = row.original

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
                                onClick={() => navigator.clipboard.writeText(spec.id)}
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleView(spec)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(spec)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => handleDelete(spec)}
                            >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    if (!isMounted) {
        return null
    }

    return (
        <div className="p-6 space-y-6">
            <AlertModal
                isOpen={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                onConfirm={onConfirmDelete}
                loading={isDeleting}
                title="Delete Specialization"
                description={`Are you sure you want to delete "${selectedSpecialization?.name}"? This action cannot be undone.`}
            />
            <ViewSpecializationModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                data={selectedSpecialization}
            />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Specialization Management</h1>
                    <p className="text-muted-foreground">Manage doctor specialities and categories</p>
                </div>
                <Button onClick={() => {
                    setSelectedSpecialization(undefined)
                    setIsModalOpen(true)
                }} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Specialization
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Specializations</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                    ) : specializations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
                            <div className="bg-primary/5 p-6 rounded-full">
                                <div className="bg-primary/10 p-4 rounded-full">
                                    <Stethoscope className="h-10 w-10 text-primary" />
                                </div>
                            </div>
                            <div className="space-y-2 max-w-md">
                                <h3 className="text-xl font-bold tracking-tight">No Specializations Found</h3>
                                <p className="text-muted-foreground text-sm">
                                    You haven't added any specializations yet. Start by adding one.
                                </p>
                            </div>
                            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Your First Specialization
                            </Button>
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={specializations}
                            searchKey="name"
                        />
                    )}
                </CardContent>
            </Card>

            <AddSpecializationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchSpecializations}
                initialData={selectedSpecialization}
            />
        </div>
    )
}