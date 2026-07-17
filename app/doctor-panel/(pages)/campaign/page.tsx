"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Send, Users, Eye, MousePointerClick, MoreHorizontal, Calendar, Loader2, Copy, Edit, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CreateCampaign } from "./_components/CreateCampaign";
import { toast } from "sonner";
import { CampaignDetailsModal } from "./_components/CampaignDetailsModal";
import { EditCampaignModal } from "./_components/EditCampaignModal";

interface Campaign {
    id: string;
    name: string;
    description: string | null;
    type: string;
    status: string;
    price: number;
    startDate: string;
    endDate: string;
    createdAt: string;
    stats?: {
        views?: number;
        clicks?: number;
        reach?: number;
    };
    // Detailed fields for modal (assuming API returns them)
    location?: unknown;
    schedule?: unknown;
    dailyLimit?: number;
    hourlyLimit?: number;
    totalCapacity?: number | null;
    requiredDetails?: string[];
    isVerified?: boolean;
    discountPercentage?: number;
}

export default function CampaignPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [entitlement, setEntitlement] = useState<{ allowed: boolean; reason: string | null; used: number; limit: number | null; remaining: number | null; periodEnd?: string; packageName?: string } | null>(null);

    useEffect(() => {
        fetchCampaigns();
        fetch("/api/doctor-panel/package").then((response) => response.ok ? response.json() : null).then((data) => setEntitlement(data?.entitlement || null));
    }, []);

    const fetchCampaigns = async () => {
        try {
            const res = await fetch("/api/doctor/campaigns");
            if (res.ok) {
                const data = await res.json();
                setCampaigns(data);
            } else {
                toast.error("Failed to fetch campaigns");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleCopyId = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Campaign ID copied to clipboard");
    };

    const handleViewDetails = (campaign: Campaign) => {
        setSelectedCampaign(campaign);
        setIsModalOpen(true);
    };

    const handleEditCampaign = (campaign: Campaign) => {
        setEditingCampaign(campaign);
        setIsEditModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Campaigns</h1>
                    <p className="text-muted-foreground">Engage with your patients through targeted messages.</p>
                </div>
                <CreateCampaign disabled={entitlement?.allowed === false} />
            </div>

            {entitlement && <Card className={entitlement.allowed ? "border-primary/20 bg-primary/5" : "border-destructive/30 bg-destructive/5"}><CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-3"><ShieldAlert className={entitlement.allowed ? "mt-0.5 h-5 w-5 text-primary" : "mt-0.5 h-5 w-5 text-destructive"} /><div><p className="font-semibold">{entitlement.packageName || "Package required"}</p><p className="text-sm text-muted-foreground">{entitlement.limit === null ? "Unlimited campaigns this billing period" : `${entitlement.used} of ${entitlement.limit} campaigns used · ${entitlement.remaining} remaining`}{entitlement.periodEnd ? ` · Resets ${new Date(entitlement.periodEnd).toLocaleDateString()}` : ""}</p>{!entitlement.allowed && <p className="mt-1 text-sm text-destructive">{entitlement.reason}</p>}</div></div><Button asChild variant="outline" size="sm"><Link href="/doctor-panel/package">Manage package</Link></Button></CardContent></Card>}

            {/* Campaign Stats - Placeholders for now */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Across all platforms
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
                        <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0%</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Click-through rate
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
                        <Send className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            This month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Campaigns</CardTitle>
                    <CardDescription>
                        Manage your marketing and communication campaigns.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : campaigns.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No campaigns found. Create your first campaign!
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {campaigns.map((camp) => (
                                <div key={camp.id} className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                    {/* Icon & Title */}
                                    <div className="md:col-span-4 flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <Megaphone className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm">{camp.name}</h3>
                                            <p className="text-xs text-muted-foreground mt-0.5">{camp.type} Campaign</p>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="md:col-span-2">
                                        <Badge variant={
                                            camp.status === "ACTIVE" ? "success" :
                                                camp.status === "IN_REVIEW" ? "warning" :
                                                    camp.status === "DRAFT" ? "secondary" : "outline"
                                        } className="font-normal">
                                            {camp.status.replace("_", " ")}
                                        </Badge>
                                    </div>

                                    {/* Stats Info */}
                                    <div className="md:col-span-4 grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1.5" title="Start Date">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span>{new Date(camp.startDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5" title="Reach">
                                            <Eye className="h-3.5 w-3.5" />
                                            <span>{camp.stats?.reach || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5" title="Clicks">
                                            <MousePointerClick className="h-3.5 w-3.5" />
                                            <span>{camp.stats?.clicks || 0}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="md:col-span-2 flex justify-end">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleViewDetails(camp)}>
                                                    <Eye className="w-4 h-4 mr-2" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleCopyId(camp.id)}>
                                                    <Copy className="w-4 h-4 mr-2" /> Copy ID
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>View Stats</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleEditCampaign(camp)}>
                                                    <Edit className="w-4 h-4 mr-2" /> Edit
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <CampaignDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                campaign={selectedCampaign as never}
            />

            <EditCampaignModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                campaign={editingCampaign}
                onSuccess={fetchCampaigns}
            />
        </div>
    );
}
