"use client"

import { DataTable } from "@/components/superAdmin/DataTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Copy, Edit, Mail, MoreHorizontal, Shield, Trash, Eye } from "lucide-react"
import { AddUserModal } from "@/components/superAdmin/AddUserModal"
import { ExportUserModal } from "@/components/superAdmin/ExportUserModal"
import { useEffect, useState } from "react"
import { format } from "date-fns"

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
        header: "Email",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {row.getValue("email")}
            </div>
        ),
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                {row.getValue("role")}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
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
        header: "Joined Date",
        cell: ({ row }) => {
            return format(new Date(row.getValue("createdAt")), "PPP")
        }
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const user = row.original

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
                            onClick={() => navigator.clipboard.writeText(user.id)}
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
                            Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete User
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export default function UsersPage() {
    const [data, setData] = useState<AppUser[]>([])
    const [loading, setLoading] = useState(true)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const fetchUsers = async () => {
            // Start progress simulation
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(interval)
                        return 90
                    }
                    return prev + 10
                })
            }, 100)

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
                // Ensure progress completes before showing content
                setProgress(100)
                clearInterval(interval)
                setTimeout(() => {
                    setLoading(false)
                }, 500)
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
                    <AddUserModal />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-10 space-y-4">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <span>Loading users...</span>
                                <span className="font-mono">{progress}%</span>
                            </div>
                            <Progress value={progress} className="w-[60%]" />
                        </div>
                    ) : (
                        <DataTable columns={columns} data={data} searchKey="name" />
                    )}
                </CardContent>
            </Card>

        </div>
    )
}
