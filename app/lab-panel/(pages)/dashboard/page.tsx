"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Activity, ArrowUpRight, Clock, Plus, TestTube, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";

// Mock Data
const revenueData = [
    { name: "Jan", revenue: 45000, tests: 120 },
    { name: "Feb", revenue: 52000, tests: 145 },
    { name: "Mar", revenue: 48000, tests: 135 },
    { name: "Apr", revenue: 61000, tests: 180 },
    { name: "May", revenue: 55000, tests: 160 },
    { name: "Jun", revenue: 67000, tests: 210 },
    { name: "Jul", revenue: 72000, tests: 240 },
];

const mockAppointments = [
    {
        id: "APT-2024-001",
        patient: "Rahul Sharma",
        test: "Full Body Checkup",
        date: "Today, 10:30 AM",
        status: "PENDING",
        amount: "₹1,499"
    },
    {
        id: "APT-2024-002",
        patient: "Priya Patel",
        test: "Thyroid Profile",
        date: "Today, 11:15 AM",
        status: "COMPLETED",
        amount: "₹899"
    },
    {
        id: "APT-2024-003",
        patient: "Amit Kumar",
        test: "Lipid Profile",
        date: "Today, 12:00 PM",
        status: "IN_PROGRESS",
        amount: "₹699"
    },
    {
        id: "APT-2024-004",
        patient: "Sneha Gupta",
        test: "Vitamin D Test",
        date: "Yesterday, 02:30 PM",
        status: "REPORT_READY",
        amount: "₹1,200"
    }
];

export default function LabDashboardPage() {
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
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹72,400</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                            <span className="text-emerald-500 font-medium">+15%</span> from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Test Requests</CardTitle>
                        <TestTube className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">240</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                            <span className="text-emerald-500 font-medium">+8%</span> from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
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
                        <div className="text-2xl font-bold">1,203</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                            <span className="text-emerald-500 font-medium">+12%</span> from last month
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
                            {mockAppointments.map((apt) => (
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
                        </div>
                        <Button variant="outline" className="w-full mt-4" size="sm">
                            View All Orders
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
