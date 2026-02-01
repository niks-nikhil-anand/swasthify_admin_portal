"use client"

import { DataTable } from "@/components/superAdmin/DataTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Mail, Shield } from "lucide-react"
import { UserActions } from "@/components/superAdmin/UserActions"

import { ExportUserModal } from "@/components/superAdmin/ExportUserModal"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { FacetedFilter } from "@/components/superAdmin/DataTable"

type AppUser = {
    id: string
    name: string
    email: string
    role: string // roles are strings in the enum
    status: "PENDING" | "ACTIVE" | "BLOCKED" | "ARCHIVED"
    createdAt: string
}

const columns: ColumnDef<AppUser>[] = [
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
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {row.getValue("email")}
            </div>
        ),
    },
    {
        accessorKey: "role",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Role
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        enableGrouping: true,
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                {row.getValue("role")}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        enableGrouping: true,
        cell: ({ row }) => {
            const status = row.getValue("status") as string

            const variantMap: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
                "ACTIVE": "success",
                "PENDING": "warning",
                "BLOCKED": "destructive",
                "ARCHIVED": "secondary"
            }

            return (
                <Badge variant={variantMap[status] || "default"}>
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Joined Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return format(new Date(row.getValue("createdAt")), "PPP")
        }
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <UserActions user={row.original} />,
    },
]

const filters: FacetedFilter[] = [
    {
        columnId: "role",
        title: "Role",
        options: [
            { label: "Admin", value: "ADMIN" },
            { label: "Doctor", value: "DOCTOR" },
            { label: "Patient", value: "PATIENT" },
            { label: "Super Admin", value: "SUPER_ADMIN" },
        ],
    },
    {
        columnId: "status",
        title: "Status",
        options: [
            { label: "Active", value: "ACTIVE" },
            { label: "Pending", value: "PENDING" },
            { label: "Blocked", value: "BLOCKED" },
            { label: "Archived", value: "ARCHIVED" },
        ],
    },
]

export default function UsersPage() {
    const [data, setData] = useState<AppUser[]>([])
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/user")
                if (response.ok) {
                    const result = await response.json()
                    setData(result.users)
                } else {
                    console.error("Failed to fetch users")
                }
            } catch (error) {
                console.error("Error fetching users:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">System Users</h1>
                <div className="flex gap-2">
                    <ExportUserModal data={data} />

                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between py-4">
                                <Skeleton className="h-10 w-[250px]" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-10 w-[100px]" />
                                    <Skeleton className="h-10 w-[100px]" />
                                </div>
                            </div>
                            <div className="rounded-md border">
                                <div className="h-12 border-b px-4 flex items-center gap-4 bg-muted/5">
                                    <Skeleton className="h-4 w-[150px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                    <Skeleton className="h-4 w-[100px]" />
                                    <Skeleton className="h-4 w-[100px]" />
                                    <Skeleton className="h-4 w-[150px]" />
                                    <Skeleton className="h-8 w-8 ml-auto rounded-full" />
                                </div>
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-16 border-b px-4 flex items-center gap-4">
                                        <div className="w-[150px]">
                                            <Skeleton className="h-4 w-[120px]" />
                                        </div>
                                        <div className="flex items-center gap-2 w-[200px]">
                                            <Skeleton className="h-4 w-4 rounded-full" />
                                            <Skeleton className="h-4 w-[150px]" />
                                        </div>
                                        <div className="w-[100px]">
                                            <Skeleton className="h-5 w-[80px] rounded-full" />
                                        </div>
                                        <div className="w-[100px]">
                                            <Skeleton className="h-5 w-[70px] rounded-full" />
                                        </div>
                                        <div className="w-[150px]">
                                            <Skeleton className="h-4 w-[100px]" />
                                        </div>
                                        <div className="ml-auto">
                                            <Skeleton className="h-8 w-8 rounded-md" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <DataTable columns={columns} data={data} searchKey="name" facetedFilters={filters} />
                    )}
                </CardContent>
            </Card>

        </div>
    )
}
