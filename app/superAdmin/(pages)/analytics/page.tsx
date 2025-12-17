"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export default function AnalyticsPage() {
    // Data for User Growth (Line Chart)
    const userGrowthData = [
        { month: 'Jan', doctors: 400, patients: 2400 },
        { month: 'Feb', doctors: 450, patients: 2800 },
        { month: 'Mar', doctors: 500, patients: 3500 },
        { month: 'Apr', doctors: 520, patients: 3900 },
        { month: 'May', doctors: 600, patients: 4500 },
        { month: 'Jun', doctors: 650, patients: 5100 },
    ];

    // Data for Appointment Status (Pie Chart)
    const appointmentData = [
        { name: 'Completed', value: 400, color: '#10b981' }, // green-500
        { name: 'Scheduled', value: 300, color: '#3b82f6' }, // blue-500
        { name: 'Cancelled', value: 100, color: '#ef4444' }, // red-500
        { name: 'No Show', value: 50, color: '#f59e0b' },   // amber-500
    ];

    // Data for Lab Performance (Bar Chart)
    const labPerformanceData = [
        { name: 'City Path', tests: 1200 },
        { name: 'Global Diag', tests: 950 },
        { name: 'TrustCare', tests: 1400 },
        { name: 'HealthFirst', tests: 800 },
        { name: 'MediCore', tests: 1100 },
    ];

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Analytics Overview</h1>

            <div className="grid gap-6 md:grid-cols-2">
                {/* User Growth Line Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>User Growth</CardTitle>
                        <CardDescription>Doctor vs Patient registration trends</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={userGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="month" fontSize={12} stroke="#888888" tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} stroke="#888888" tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="patients" stroke="#8b5cf6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="doctors" stroke="#06b6d4" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Appointment Status Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Appointment Distribution</CardTitle>
                        <CardDescription>Breakdown by appointment status</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={appointmentData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {appointmentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Lab Performance Bar Chart */}
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Top Diagnostics Labs</CardTitle>
                        <CardDescription>Test volume by provider</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={labPerformanceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                <XAxis dataKey="name" fontSize={12} stroke="#888888" tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} stroke="#888888" tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="tests" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
