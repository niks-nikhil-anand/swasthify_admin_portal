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
}

export function TicketDetailsModal({ ticket, open, onOpenChange }: TicketDetailsModalProps) {
    if (!ticket) return null

    const handleCopyId = () => {
        navigator.clipboard.writeText(ticket.id)
        toast.success("Ticket ID copied to clipboard")
    }

    const getStatusBadge = (status: string) => {
        if (status === "CLOSED") {
            return (
                <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <Badge>CLOSED</Badge>
                </div>
            )
        }
        if (status === "IN_PROGRESS") {
            return (
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <Badge variant="warning">IN_PROGRESS</Badge>
                </div>
            )
        }
        return (
            <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-500" />
                <Badge variant="destructive">OPEN</Badge>
            </div>
        )
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
                            {getStatusBadge(ticket.status)}
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
