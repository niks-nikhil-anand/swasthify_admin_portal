"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"
import { Copy, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"

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

interface TicketDetailsModalProps {
    ticket: SupportTicket | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onTicketUpdated?: () => void
}

export function TicketDetailsModal({ ticket, open, onOpenChange, onTicketUpdated }: TicketDetailsModalProps) {
    const [status, setStatus] = useState<string>(ticket?.status || "OPEN")
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        if (ticket) {
            setStatus(ticket.status)
        }
    }, [ticket])

    if (!ticket) return null

    const handleCopyId = () => {
        navigator.clipboard.writeText(ticket.id)
        toast.success("Ticket ID copied to clipboard")
    }

    const handleStatusChange = async (newStatus: string) => {
        setStatus(newStatus)
        setUpdating(true)
        try {
            const res = await fetch(`/api/tickets/${ticket.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            })

            if (!res.ok) throw new Error("Failed to update status")

            toast.success("Status updated successfully")
            if (onTicketUpdated) onTicketUpdated()
        } catch (error) {
            console.error(error)
            toast.error("Failed to update status")
            setStatus(ticket.status) // Revert on error
        } finally {
            setUpdating(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Ticket Details</DialogTitle>
                    <DialogDescription>
                        Detailed information for ticket <span className="font-mono">{ticket.id}</span>
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                    {/* Header Info */}
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label className="text-right text-muted-foreground">ID</Label>
                        <div className="col-span-3 flex items-center gap-2">
                            <code className="bg-muted px-2 py-1 rounded text-sm font-mono flex-1 truncate">
                                {ticket.id}
                            </code>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyId}>
                                <Copy className="h-4 w-4" />
                                <span className="sr-only">Copy ID</span>
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label className="text-right text-muted-foreground">Status</Label>
                        <div className="col-span-3">
                            <Select value={status} onValueChange={handleStatusChange} disabled={updating}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="OPEN">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-red-500" />
                                            <span>OPEN</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="IN_PROGRESS">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-yellow-500" />
                                            <span>IN PROGRESS</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="CLOSED">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span>CLOSED</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="ARCHIVED">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-gray-500" />
                                            <span>ARCHIVED</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label className="text-right text-muted-foreground">Date</Label>
                        <div className="col-span-3 text-sm text-muted-foreground">
                            {format(new Date(ticket.createdAt), "PPP p")}
                        </div>
                    </div>

                    <Separator />

                    {/* User Info */}
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label className="text-right text-muted-foreground">Name</Label>
                        <div className="col-span-3 font-medium">{ticket.name}</div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label className="text-right text-muted-foreground">Email</Label>
                        <div className="col-span-3">{ticket.email}</div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label className="text-right text-muted-foreground">Phone</Label>
                        <div className="col-span-3">{ticket.phone}</div>
                    </div>

                    <Separator />

                    {/* Message Content */}
                    <div className="grid grid-cols-4 gap-4 items-start">
                        <Label className="text-right text-muted-foreground pt-1">Subject</Label>
                        <div className="col-span-3 font-medium">{ticket.subject}</div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 items-start">
                        <Label className="text-right text-muted-foreground pt-1">Message</Label>
                        <div className="col-span-3 bg-muted/50 p-4 rounded-lg text-sm whitespace-pre-wrap">
                            {ticket.message}
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    )
}
