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
import { ArrowUpDown, CheckCircle, Clock, Copy, MoreHorizontal, Ticket } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { TicketDetailsModal } from "@/components/superAdmin/TicketDetailsModal"

type SupportTicket = {
    id: string
    name: string
    email: string
    phone: string
    subject: string
    message: string
    status: "OPEN" | "IN_PROGRESS" | "CLOSED" | "ARCHIVED"
    createdAt: string
}

export default function TicketsPage() {
    const [tickets, setTickets] = useState<SupportTicket[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
    const [detailsOpen, setDetailsOpen] = useState(false)

    const fetchTickets = async () => {
        try {
            const res = await fetch("/api/tickets")
            if (!res.ok) throw new Error("Failed to fetch")
            const data = await res.json()
            setTickets(data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load tickets")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTickets()
    }, [])

    const handleViewTicket = (ticket: SupportTicket) => {
        setSelectedTicket(ticket)
        setDetailsOpen(true)
    }

    const columns: ColumnDef<SupportTicket>[] = [
        {
            accessorKey: "id",
            header: "Ticket ID",
            cell: ({ row }) => <div className="font-mono text-xs">{row.getValue("id")}</div>,
        },
        {
            accessorKey: "subject",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Subject
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="font-medium max-w-[200px] truncate" title={row.getValue("subject")}>{row.getValue("subject")}</div>,
        },
        {
            accessorKey: "name",
            header: "User",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string
                return (
                    <div className="flex items-center gap-2">
                        {status === "CLOSED" ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                            <Clock className="h-3 w-3 text-yellow-500" />
                        )}
                        <Badge variant={status === "OPEN" ? "destructive" : status === "IN_PROGRESS" ? "warning" : "default"}>
                            {status}
                        </Badge>
                    </div>
                )
            },
        },
        {
            accessorKey: "createdAt",
            header: "Date",
            cell: ({ row }) => {
                return new Date(row.getValue("createdAt")).toLocaleDateString()
            }
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const ticket = row.original

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
                                onClick={() => {
                                    navigator.clipboard.writeText(ticket.id)
                                    toast.success("Ticket ID copied")
                                }}
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewTicket(ticket)}>
                                View Details
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-4">Loading...</div>
                    ) : (
                        <DataTable columns={columns} data={tickets} searchKey="subject" />
                    )}
                </CardContent>
            </Card>

            <TicketDetailsModal
                ticket={selectedTicket}
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
                onTicketUpdated={fetchTickets}
            />

        </div>
    )
}
