"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Send, Users, Eye, MousePointerClick, MoreHorizontal, Calendar, Copy, TestTube, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CreateCampaign } from "./_components/CreateCampaign";
import { toast } from "sonner";
import { CampaignDetailsModal } from "./_components/CampaignDetailsModal";

export default function LabCampaignPage() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchCampaigns = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/lab/campaigns");
            if (!res.ok) throw new Error("Failed to fetch campaigns");
            const data = await res.json();
            setCampaigns(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load campaigns");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    const handleCopyId = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Campaign ID copied to clipboard");
    };

    const handleViewDetails = (campaign: any) => {
        setSelectedCampaign(campaign);
        setIsModalOpen(true);
    };

    // Derived Stats
    const activeCampaignsCount = campaigns.filter(c => c.status === "ACTIVE").length;
    const totalReach = campaigns.reduce((acc, curr) => acc + (curr.stats?.reach || 0), 0);
    const totalBookings = campaigns.reduce((acc, curr) => acc + (curr.stats?.bookings || 0), 0); // Assuming bookings stat exists

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Lab Campaigns</h1>
                    <p className="text-muted-foreground">Promote your lab packages and organize health camps.</p>
                </div>
                <CreateCampaign onSuccess={fetchCampaigns} />
            </div>

            {/* Campaign Stats Overview */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalReach.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Potential patients reached
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bookings</CardTitle>
                        <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalBookings}</div>
                        <p className="text-xs text-muted-foreground mt-1 text-emerald-600">
                            Combined bookings
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                        <Megaphone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeCampaignsCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Running currently
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Your Campaigns</CardTitle>
                    <CardDescription>
                        Manage your marketing initiatives.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <TestTube className="h-5 w-5" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <h3 className="font-semibold text-sm truncate" title={camp.name}>{camp.name}</h3>
                                            <p className="text-xs text-muted-foreground mt-0.5 truncate">{camp.type.replace(/_/g, " ")}</p>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="md:col-span-2">
                                        <Badge variant={
                                            camp.status === "ACTIVE" ? "success" :
                                                camp.status === "IN_REVIEW" ? "warning" :
                                                    camp.status === "DRAFT" ? "secondary" : "outline"
                                        } className="font-normal whitespace-nowrap">
                                            {camp.status.replace("_", " ")}
                                        </Badge>
                                    </div>

                                    {/* Stats Info */}
                                    <div className="md:col-span-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1.5" title="Start Date">
                                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                                            <span className="truncate">{new Date(camp.startDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5" title="Reach">
                                            <Eye className="h-3.5 w-3.5 shrink-0" />
                                            <span className="truncate">{camp.stats?.reach || 0} Reach</span>
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
                                                {camp.status === 'DRAFT' && <DropdownMenuItem>Edit</DropdownMenuItem>}
                                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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
                campaign={selectedCampaign}
            />
        </div>
    );
}