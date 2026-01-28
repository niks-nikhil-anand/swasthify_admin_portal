"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Send, Users, Eye, MousePointerClick, MoreHorizontal, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CreateCampaign } from "./_components/CreateCampaign";

const campaigns = [
    {
        id: 1,
        title: "Monsoon Health Tips",
        status: "Active",
        sent: "2 days ago",
        reach: 1200,
        clicks: 450,
        type: "Email"
    },
    {
        id: 2,
        title: "Free Dental Checkup Camp",
        status: "Draft",
        sent: "-",
        reach: 0,
        clicks: 0,
        type: "SMS"
    },
    {
        id: 3,
        title: "Flu Shot Reminder",
        status: "Completed",
        sent: "1 week ago",
        reach: 850,
        clicks: 320,
        type: "WhatsApp"
    },
    {
        id: 4,
        title: "New Clinic Opening",
        status: "Completed",
        sent: "1 month ago",
        reach: 5000,
        clicks: 1200,
        type: "Email"
    }
];

export default function CampaignPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Campaigns</h1>
                    <p className="text-muted-foreground">Engage with your patients through targeted messages.</p>
                </div>
                <CreateCampaign />
            </div>

            {/* Campaign Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">7,050</div>
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
                        <div className="text-2xl font-bold">28%</div>
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
                        <div className="text-2xl font-bold">12k</div>
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
                    <div className="space-y-4">
                        {campaigns.map((camp) => (
                            <div key={camp.id} className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                {/* Icon & Title */}
                                <div className="md:col-span-4 flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Megaphone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">{camp.title}</h3>
                                        <p className="text-xs text-muted-foreground mt-0.5">{camp.type} Campaign</p>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="md:col-span-2">
                                    <Badge variant={
                                        camp.status === "Active" ? "default" :
                                            camp.status === "Draft" ? "secondary" : "outline"
                                    } className="font-normal">
                                        {camp.status}
                                    </Badge>
                                </div>

                                {/* Stats Info */}
                                <div className="md:col-span-4 grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1.5" title="Sent Date">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>{camp.sent}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5" title="Reach">
                                        <Eye className="h-3.5 w-3.5" />
                                        <span>{camp.reach}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5" title="Clicks">
                                        <MousePointerClick className="h-3.5 w-3.5" />
                                        <span>{camp.clicks}</span>
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
                                            <DropdownMenuItem>View Stats</DropdownMenuItem>
                                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                            {camp.status === 'Draft' && <DropdownMenuItem>Edit</DropdownMenuItem>}
                                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>


        </div>
    );
}