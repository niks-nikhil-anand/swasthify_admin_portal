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
    getCampaignStats,
    getEngagementStats,
    getPageAnalytics
} from "./actions"
import { Users, Eye, Clock, ArrowUpRight, MousePointer2, Smartphone, FileText } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function AnalyticsPage() {
    const [summary, setSummary] = useState<any>(null)
    const [traffic, setTraffic] = useState<any[]>([])
    const [devices, setDevices] = useState<any[]>([])
    const [campaigns, setCampaigns] = useState<any[]>([])
    const [engagement, setEngagement] = useState<any[]>([])
    const [pageStats, setPageStats] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [s, t, d, c, e, p] = await Promise.all([
                    getAnalyticsSummary(),
                    getTrafficData(),
                    getDeviceStats(),
                    getCampaignStats(),
                    getEngagementStats(),
                    getPageAnalytics()
                ])
                setSummary(s)
                setTraffic(t)
                setDevices(d)
                setCampaigns(c)
                setEngagement(e)
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
        return <div className="p-6 flex items-center justify-center min-h-[400px]">Loading Analytics...</div>
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

                {/* Campaign Performance */}
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Top Campaigns</CardTitle>
                        <CardDescription>Reach vs Creative Click-through Rate</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={campaigns} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                                <XAxis type="number" fontSize={12} stroke="#888888" tickLine={false} axisLine={false} />
                                <YAxis dataKey="id" type="category" fontSize={10} width={80} stroke="#888888" tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                                <Legend />
                                <Bar dataKey="views" name="Reach (Views)" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                                <Bar dataKey="clicks" name="Interest (Clicks)" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Engagement / Scroll Depth */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Scroll Depth</CardTitle>
                        <CardDescription>User retention milestones</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={engagement}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                <XAxis dataKey="depth" fontSize={12} stroke="#888888" tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} stroke="#888888" tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                                <Bar dataKey="count" name="Users" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
