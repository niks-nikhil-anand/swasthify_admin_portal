"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, Stethoscope, Image as ImageIcon, AlignLeft, User, Building } from "lucide-react"
import { format } from "date-fns"

interface ViewSpecializationModalProps {
    isOpen: boolean
    onClose: () => void
    data?: {
        id: string
        name: string
        description: string | null
        image: string | null
        type: "DOCTOR" | "LAB" | "ALL"
        createdAt: string
    }
}

export function ViewSpecializationModal({
    isOpen,
    onClose,
    data
}: ViewSpecializationModalProps) {
    if (!data) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <Stethoscope className="h-5 w-5 text-primary" />
                        </div>
                        <Badge variant="outline">Specialization Details</Badge>
                    </div>
                    <DialogTitle className="text-2xl font-bold">{data.name}</DialogTitle>
                    <DialogDescription>
                        Overview of {data.name} specialization
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Image Section */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <ImageIcon className="h-4 w-4" />
                            <span>Specialization Image</span>
                        </div>
                        <div className="h-48 w-full rounded-xl overflow-hidden bg-muted border flex items-center justify-center">
                            {data.image ? (
                                <img
                                    src={data.image}
                                    alt={data.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <Stethoscope className="h-12 w-12 text-muted-foreground/30" />
                            )}
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <AlignLeft className="h-4 w-4" />
                            <span>Description</span>
                        </div>
                        <div className="bg-muted/30 p-4 rounded-xl border min-h-[100px]">
                            <p className="text-sm leading-relaxed">
                                {data.description || "No description provided for this specialization."}
                            </p>
                        </div>
                    </div>

                    {/* Metadata Section */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-3 rounded-xl border space-y-1">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                <Calendar className="h-3 w-3" />
                                <span>Created At</span>
                            </div>
                            <p className="text-sm font-medium">
                                {format(new Date(data.createdAt), "PPP")}
                            </p>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-xl border space-y-1">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                {data.type === "LAB" ? <Building className="h-3 w-3" /> : <User className="h-3 w-3" />}
                                <span>Entity Type</span>
                            </div>
                            <p className="text-sm font-medium flex items-center gap-2">
                                <Badge variant="secondary" className="font-semibold">
                                    {data.type}
                                </Badge>
                            </p>
                        </div>
                    </div>

                    <div className="bg-muted/30 p-3 rounded-xl border space-y-1 overflow-hidden">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                            <span>Specialization ID</span>
                        </div>
                        <p className="text-xs font-mono text-muted-foreground break-all">
                            {data.id}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
