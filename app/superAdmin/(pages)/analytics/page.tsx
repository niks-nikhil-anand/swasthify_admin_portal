"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
    Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart,
    RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts"
import {
    getAnalyticsSummary,
    getTrafficData,
    getDeviceStats,
    getPageAnalytics
} from "./actions"
import { Users, Eye, Clock, ArrowUpRight, Smartphone, FileText } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

function AnalyticsSkeleton() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-[250px]" />
                <Skeleton className="h-4 w-[100px]" />
            </div>

            {/* Summary Cards Skeleton */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-[120px] mb-2" />
                            <Skeleton className="h-3 w-[150px]" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Traffic Trend Skeleton */}
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <Skeleton className="h-6 w-[150px] mb-2" />
                        <Skeleton className="h-4 w-[200px]" />
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <Skeleton className="h-full w-full" />
                    </CardContent>
                </Card>

                {/* Device Distribution Skeleton */}
                <Card className="col-span-1">
                    <CardHeader>
                        <Skeleton className="h-6 w-[100px] mb-2" />
                        <Skeleton className="h-4 w-[150px]" />
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                        <Skeleton className="h-40 w-40 rounded-full" />
                    </CardContent>
                </Card>

                {/* Page-wise Stats Table Skeleton */}
                <Card className="col-span-1 lg:col-span-3">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <Skeleton className="h-6 w-[120px]" />
                        </div>
                        <Skeleton className="h-4 w-[250px] mt-2" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function AnalyticsPage() {
    const [summary, setSummary] = useState<any>(null)
    const [traffic, setTraffic] = useState<any[]>([])
    const [devices, setDevices] = useState<any[]>([])
    const [pageStats, setPageStats] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [s, t, d, p] = await Promise.all([
                    getAnalyticsSummary(),
                    getTrafficData(),
                    getDeviceStats(),
                    getPageAnalytics()
                ])
                setSummary(s)
                setTraffic(t)
                setDevices(d)
                setPageStats(p)
            } catch (error) {
                console.error("Failed to fetch analytics:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return <AnalyticsSkeleton />
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Analytics Overview</h1>
                <p className="text-sm text-muted-foreground">Last 7 days</p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
                        <Eye className="w-4 h-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary?.totalViews.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total views across site</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                        <Users className="w-4 h-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary?.uniqueVisitors.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total unique sessions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
                        <Clock className="w-4 h-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary?.avgDuration}</div>
                        <p className="text-xs text-muted-foreground">Avg. time per session</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                        <ArrowUpRight className="w-4 h-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary?.bounceRate}</div>
                        <p className="text-xs text-muted-foreground">Single page sessions</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Traffic Trend */}
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <CardTitle>Website Traffic</CardTitle>
                        </div>
                        <CardDescription>Daily page views trend</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={traffic}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                <XAxis dataKey="date" fontSize={12} stroke="#888888" tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} stroke="#888888" tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="views" stroke="#10b981" fillOpacity={1} fill="url(#colorViews)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Device Distribution */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Devices</CardTitle>
                        <CardDescription>Mobile vs Desktop usage</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={devices}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {devices.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Page-wise Stats Table */}
                <Card className="col-span-1 lg:col-span-3">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-emerald-600" />
                            <CardTitle>Top Pages</CardTitle>
                        </div>
                        <CardDescription>Performance breakdown by page path</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Page Path</TableHead>
                                    <TableHead className="text-right">Views</TableHead>
                                    <TableHead className="text-right">Unique Visitors</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pageStats.map((stat) => (
                                    <TableRow key={stat.path}>
                                        <TableCell className="font-medium font-mono text-xs">{stat.path}</TableCell>
                                        <TableCell className="text-right">{stat.views.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">{stat.uniqueVisitors.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                                {pageStats.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                                            No page data available for this period
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
