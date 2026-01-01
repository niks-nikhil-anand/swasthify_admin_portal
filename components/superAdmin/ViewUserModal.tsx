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
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type AppUser = {
    id: string
    name: string
    email: string
    phone?: string | null // phone might be optional/null in schema
    role: string
    status: string
    createdAt: string
}

interface ViewUserModalProps {
    user: AppUser | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ViewUserModal({ user, open, onOpenChange }: ViewUserModalProps) {
    if (!user) return null

    const handleCopyId = () => {
        navigator.clipboard.writeText(user.id)
        toast.success("User ID copied to clipboard")
    }

    const variantMap: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
        "ACTIVE": "success",
        "PENDING": "warning",
        "BLOCKED": "destructive",
        "ARCHIVED": "secondary"
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>User Details</DialogTitle>
                    <DialogDescription>
                        Detailed information for <span className="font-medium text-foreground">{user.name}</span>
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label className="text-right text-muted-foreground">ID</Label>
                        <div className="col-span-3 flex items-center gap-2">
                            <code className="bg-muted px-2 py-1 rounded text-sm font-mono flex-1 truncate">
                                {user.id}
                            </code>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyId}>
                                <Copy className="h-4 w-4" />
                                <span className="sr-only">Copy ID</span>
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label className="text-right text-muted-foreground">Name</Label>
                        <div className="col-span-3 font-medium">{user.name}</div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label className="text-right text-muted-foreground">Email</Label>
                        <div className="col-span-3">{user.email}</div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label className="text-right text-muted-foreground">Phone</Label>
                        <div className="col-span-3">{user.phone || "-"}</div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label className="text-right text-muted-foreground">Role</Label>
                        <div className="col-span-3">
                            <Badge variant="outline">{user.role}</Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label className="text-right text-muted-foreground">Status</Label>
                        <div className="col-span-3">
                            <Badge variant={variantMap[user.status] || "default"}>
                                {user.status}
                            </Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label className="text-right text-muted-foreground">Joined</Label>
                        <div className="col-span-3 text-sm text-muted-foreground">
                            {format(new Date(user.createdAt), "PPP p")}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
