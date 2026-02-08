"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Activity, ArrowUpRight, Clock, Plus, TestTube, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useCallback } from "react";
import { getLabDashboardStats, getLabRevenueOverview, getRecentLabOrders } from "./actions";
import { Skeleton } from "@/components/ui/skeleton";

function LabDashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
                ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Skeleton className="col-span-4 h-[400px] rounded-xl" />
                <Skeleton className="col-span-3 h-[400px] rounded-xl" />
            </div>
        </div>
    );
}

export default function LabDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [revenueData, setRevenueData] = useState<any[]>([]);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);

    const fetchData = useCallback(async () => {
        try {
            const [dashboardStats, revData, orders] = await Promise.all([
                getLabDashboardStats(),
                getLabRevenueOverview(),
                getRecentLabOrders()
            ]);
            setStats(dashboardStats);
            setRevenueData(revData);
            setRecentOrders(orders);
        } catch (error) {
            console.error("Failed to fetch lab dashboard data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) return <LabDashboardSkeleton />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Lab Dashboard</h1>
                    <p className="text-muted-foreground">Overview of your laboratory performance.</p>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline" className="gap-2">
                        <Link href="/lab-panel/tests">
                            <TestTube className="h-4 w-4" />
                            Manage Tests
                        </Link>
                    </Button>
                    <Button className="gap-2 accent-blue-500">
                        <Plus className="h-4 w-4" />
                        New Order
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue (Month)</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{stats?.revenue.total.toLocaleString() || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <ArrowUpRight className={`h-3 w-3 ${stats?.revenue.trend >= 0 ? "text-emerald-500" : "text-destructive"}`} />
                            <span className={`${stats?.revenue.trend >= 0 ? "text-emerald-500" : "text-destructive"} font-medium`}>
                                {stats?.revenue.trend >= 0 ? "+" : ""}{stats?.revenue.trend}%
                            </span> from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Test Requests (Month)</CardTitle>
                        <TestTube className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.testRequests.total || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <ArrowUpRight className={`h-3 w-3 ${stats?.testRequests.trend >= 0 ? "text-emerald-500" : "text-destructive"}`} />
                            <span className={`${stats?.testRequests.trend >= 0 ? "text-emerald-500" : "text-destructive"} font-medium`}>
                                {stats?.testRequests.trend >= 0 ? "+" : ""}{stats?.testRequests.trend}%
                            </span> from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.pendingReports || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Requires immediate attention
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.patients.total || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                            <span className="text-emerald-500 font-medium">+{stats?.patients.trend}%</span> from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Revenue Chart */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                        <CardDescription>
                            Monthly revenue performance for the current year.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `₹${value / 1000}k`}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                        formatter={(value) => [`₹${value}`, "Revenue"]}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="hsl(var(--primary))"
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>
                            Latest test requests and their status.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentOrders.map((apt) => (
                                <div key={apt.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border hover:bg-muted/50 transition-colors">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{apt.patient}</p>
                                        <p className="text-xs text-muted-foreground">{apt.test}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <Badge
                                            variant={
                                                apt.status === "COMPLETED" ? "default" :
                                                    apt.status === "REPORT_READY" ? "success" :
                                                        apt.status === "IN_PROGRESS" ? "warning" : "secondary"
                                            }
                                            className="text-[10px] px-2 py-0 h-5"
                                        >
                                            {apt.status === "REPORT_READY" ? "Ready" : apt.status.replace("_", " ")}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">{apt.date.split(",")[0]}</span>
                                    </div>
                                </div>
                            ))}
                            {recentOrders.length === 0 && (
                                <div className="text-center py-10 text-muted-foreground">
                                    No recent orders found.
                                </div>
                            )}
                        </div>
                        <Button asChild variant="outline" className="w-full mt-4" size="sm">
                            <Link href="/lab-panel/orders">
                                View All Orders
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

