"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDownRight, ArrowUpRight, DollarSign, Users, Activity, CalendarCheck } from "lucide-react";

// Mock Data
const patientData = [
    { name: "Jan", patients: 40, visits: 24 },
    { name: "Feb", patients: 30, visits: 13 },
    { name: "Mar", patients: 20, visits: 58 },
    { name: "Apr", patients: 27, visits: 39 },
    { name: "May", patients: 18, visits: 48 },
    { name: "Jun", patients: 23, visits: 38 },
    { name: "Jul", patients: 34, visits: 43 },
];

const appointmentData = [
    { name: "Mon", total: 12, completed: 10 },
    { name: "Tue", total: 15, completed: 12 },
    { name: "Wed", total: 8, completed: 8 },
    { name: "Thu", total: 10, completed: 9 },
    { name: "Fri", total: 18, completed: 15 },
    { name: "Sat", total: 5, completed: 4 },
];

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
                <p className="text-muted-foreground">Detailed insights into your practice performance.</p>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹45,231.89</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                            <span className="text-emerald-500 font-medium">+20.1%</span> from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Patients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+2350</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                            <span className="text-emerald-500 font-medium">+180.1%</span> from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Appointment Rate</CardTitle>
                        <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">85%</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <ArrowDownRight className="h-3 w-3 text-red-500" />
                            <span className="text-red-500 font-medium">-4%</span> from last week
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +1 scheduled for tomorrow
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="demographics" disabled>Demographics</TabsTrigger>
                    <TabsTrigger value="reports" disabled>Reports</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        {/* Main Patient Growth Chart */}
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Patient Growth</CardTitle>
                                <CardDescription>
                                    Patient visits vs New Registrations over the last 7 months
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={patientData}>
                                            <defs>
                                                <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                                            />
                                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                                            <Area type="monotone" dataKey="patients" stroke="#8884d8" fillOpacity={1} fill="url(#colorPatients)" />
                                            <Area type="monotone" dataKey="visits" stroke="#82ca9d" fillOpacity={1} fill="url(#colorVisits)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Appointment Success Chart */}
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Weekly Appointments</CardTitle>
                                <CardDescription>
                                    Total scheduled vs Completed
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={appointmentData}>
                                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                                cursor={{ fill: 'hsl(var(--muted))' }}
                                            />
                                            <Bar dataKey="total" fill="hsl(var(--primary)/0.3)" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}