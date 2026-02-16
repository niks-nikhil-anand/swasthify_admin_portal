"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDownRight, ArrowUpRight, DollarSign, Users, Activity, CalendarCheck, Loader2 } from "lucide-react";
import { getDoctorAnalyticsData } from "./actions";

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const analyticsData = await getDoctorAnalyticsData();
                setData(analyticsData);
            } catch (error) {
                console.error("Failed to fetch analytics data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex h-[400px] items-center justify-center text-muted-foreground">
                Failed to load analytics data.
            </div>
        );
    }

    const { metrics, patientGrowthData, weeklyAppointmentData } = data;

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
                        <div className="text-2xl font-bold">₹{metrics.revenue.total.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            {parseFloat(metrics.revenue.trend) >= 0 ? (
                                <>
                                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                                    <span className="text-emerald-500 font-medium">+{metrics.revenue.trend}%</span>
                                </>
                            ) : (
                                <>
                                    <ArrowDownRight className="h-3 w-3 text-red-500" />
                                    <span className="text-red-500 font-medium">{metrics.revenue.trend}%</span>
                                </>
                            )}
                            from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{metrics.patients.total}</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            {parseFloat(metrics.patients.trend) >= 0 ? (
                                <>
                                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                                    <span className="text-emerald-500 font-medium">+{metrics.patients.trend}%</span>
                                </>
                            ) : (
                                <>
                                    <ArrowDownRight className="h-3 w-3 text-red-500" />
                                    <span className="text-red-500 font-medium">{metrics.patients.trend}%</span>
                                </>
                            )}
                            from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Appointment Rate</CardTitle>
                        <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.appointmentRate.rate}%</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            {parseFloat(metrics.appointmentRate.trend) >= 0 ? (
                                <>
                                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                                    <span className="text-emerald-500 font-medium">+{metrics.appointmentRate.trend}%</span>
                                </>
                            ) : (
                                <>
                                    <ArrowDownRight className="h-3 w-3 text-red-500" />
                                    <span className="text-red-500 font-medium">{metrics.appointmentRate.trend}%</span>
                                </>
                            )}
                            from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.activeCampaigns}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Live on platform
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
                                        <AreaChart data={patientGrowthData}>
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
                                        <BarChart data={weeklyAppointmentData}>
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