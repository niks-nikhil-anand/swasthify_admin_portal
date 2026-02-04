"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
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
import { DoctorCampaignDetailsModal } from "./components/DoctorCampaignDetailsModal"
import { LabCampaignDetailsModal } from "./components/LabCampaignDetailsModal"
import { EditCampaignStatusModal } from "./components/EditCampaignStatusModal"
import { ArrowUpDown, Copy, Edit, MoreHorizontal, Eye, CheckCircle, XCircle, Megaphone } from "lucide-react"

type Campaign = {
    id: string
    name: string
    doctorName: string
    type: string
    price: number
    startDate: string
    endDate: string
    status: string
    isVerified: boolean
    dailyLimit: number
    createdAt: string
    organizerType: string
}

const getColumns = (
    onViewDetails: (id: string, type: string) => void,
    onEdit: (id: string) => void,
    onDelete: (id: string) => void
): ColumnDef<Campaign>[] => [
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
            accessorKey: "doctorName",
            header: "Organizer",
            cell: ({ row }) => <div>{row.getValue("doctorName")}</div>,
        },
        {
            accessorKey: "organizerType",
            header: "Role",
            cell: ({ row }) => {
                const type = row.getValue("organizerType") as string
                return (
                    <Badge variant={type === "Doctor" ? "default" : "secondary"}>
                        {type}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "type",
            header: "Type",
        },
        {
            accessorKey: "price",
            header: "Price",
            cell: ({ row }) => {
                const price = row.getValue("price") as number
                const formatted = new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                }).format(price)
                return <div>{formatted}</div>
            },
        },
        {
            accessorKey: "startDate",
            header: "Start Date",
            cell: ({ row }) => {
                const date = row.getValue("startDate") as string
                return <div>{new Date(date).toLocaleDateString()}</div>
            },
        },
        {
            accessorKey: "endDate",
            header: "End Date",
            cell: ({ row }) => {
                const date = row.getValue("endDate") as string
                return <div>{new Date(date).toLocaleDateString()}</div>
            },
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
                                : status === "DRAFT"
                                    ? "secondary"
                                    : status === "COMPLETED"
                                        ? "outline"
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
                    <div className="flex items-center gap-2">
                        {isVerified ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                    </div>
                )
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const campaign = row.original

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
                                onClick={() => navigator.clipboard.writeText(campaign.id)}
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onViewDetails(campaign.id, campaign.organizerType)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(campaign.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Status
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

export default function CampaignsPage() {
    const [isMounted, setIsMounted] = useState(false)
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)
    const [selectedCampaignType, setSelectedCampaignType] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Edit state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [campaignToEdit, setCampaignToEdit] = useState<Campaign | undefined>(undefined)

    // Handlers
    const handleViewDetails = (id: string, type: string) => {
        setSelectedCampaignId(id)
        setSelectedCampaignType(type)
        setIsModalOpen(true)
    }

    const handleEdit = (id: string) => {
        const campaign = campaigns.find(c => c.id === id)
        if (campaign) {
            setSelectedCampaignId(id) // Also set ID for update callback if needed
            setCampaignToEdit(campaign)
            setIsEditModalOpen(true)
        }
    }

    const handleDelete = (id: string) => {
        console.log("Delete", id)
        // Implement delete logic
    }

    useEffect(() => {
        setIsMounted(true)
        fetchCampaigns()
    }, [])

    const fetchCampaigns = async () => {
        try {
            const response = await fetch("/api/admin/campaigns")
            if (response.ok) {
                const data = await response.json()
                const filteredData = data.filter((campaign: Campaign) =>
                    !campaign.isVerified || campaign.status === "IN_REVIEW"
                )
                setCampaigns(filteredData)
            }
        } catch (error) {
            console.error("Failed to fetch campaigns", error)
        } finally {
            setLoading(false)
        }
    }

    const columns = getColumns(handleViewDetails, handleEdit, handleDelete)

    if (!isMounted) {
        return null
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Campaign Operations</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Campaigns</CardTitle>
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
                    ) : campaigns.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                            <div className="bg-primary/5 p-6 rounded-full ring-1 ring-primary/20">
                                <div className="bg-primary/10 p-4 rounded-full">
                                    <Megaphone className="h-10 w-10 text-primary" />
                                </div>
                            </div>
                            <div className="space-y-2 max-w-md">
                                <h3 className="text-xl font-bold tracking-tight">No Pending Campaigns</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    There are currently no campaigns waiting for verification or review. All caught up!
                                </p>
                            </div>
                            <div className="pt-2">
                                <Button variant="outline" onClick={fetchCampaigns} className="gap-2">
                                    <ArrowUpDown className="h-4 w-4" />
                                    Refresh List
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <DataTable columns={columns} data={campaigns} searchKey="name" />
                    )}
                </CardContent>
            </Card>

            {selectedCampaignType === "Doctor" ? (
                <DoctorCampaignDetailsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    campaignId={selectedCampaignId}
                />
            ) : (
                <LabCampaignDetailsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    campaignId={selectedCampaignId}
                />
            )}

            <EditCampaignStatusModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                campaignId={selectedCampaignId}
                currentStatus={campaignToEdit?.status}
                isVerified={campaignToEdit?.isVerified}
                onUpdate={fetchCampaigns}
            />
        </div>
    )
}