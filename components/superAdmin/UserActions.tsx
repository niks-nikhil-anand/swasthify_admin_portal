"use client"

import { useState } from "react"
import { MoreHorizontal, Copy, Eye, Edit, Trash, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"


import { ViewUserModal } from "./ViewUserModal"
import { EditUserModal } from "./EditUserModal"

type AppUser = {
    id: string
    name: string
    email: string
    role: string
    status: string
    createdAt: string
    phone?: string | null
}

interface UserActionsProps {
    user: AppUser
}

export function UserActions({ user }: UserActionsProps) {
    const [showViewModal, setShowViewModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteAlert, setShowDeleteAlert] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleCopyId = () => {
        navigator.clipboard.writeText(user.id)
        toast.success("User ID copied to clipboard")
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const response = await fetch(`/api/user/${user.id}`, {
                method: "DELETE",
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.error || "Failed to delete user")
            } else {
                toast.success("User deleted successfully")
                router.refresh()
            }
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong")
        } finally {
            setIsDeleting(false)
            setShowDeleteAlert(false)
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={handleCopyId}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setShowViewModal(true)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit User
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setShowDeleteAlert(true)}
                        className="text-red-600 focus:text-red-600 focus:bg-red-100"
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete User
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ViewUserModal
                user={user}
                open={showViewModal}
                onOpenChange={setShowViewModal}
            />

            <EditUserModal
                user={user}
                open={showEditModal}
                onOpenChange={setShowEditModal}
            />

            <Dialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the user
                            <span className="font-medium text-foreground"> {user.name} </span>
                            and remove their data from our servers.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-4 mt-4">
                        <Button variant="outline" onClick={() => setShowDeleteAlert(false)} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
