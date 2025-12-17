"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
    Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart,
    RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts"

export default function AnalyticsPage() {
    // 1. Line Chart: User Growth
    const userGrowthData = [
        { month: 'Jan', doctors: 400, patients: 2400 },
        { month: 'Feb', doctors: 450, patients: 2800 },
        { month: 'Mar', doctors: 500, patients: 3500 },
        { month: 'Apr', doctors: 520, patients: 3900 },
        { month: 'May', doctors: 600, patients: 4500 },
        { month: 'Jun', doctors: 650, patients: 5100 },
    ];

    // 2. Pie Chart: Appointment Distribution
    const appointmentData = [
        { name: 'Completed', value: 400, color: '#10b981' },
        { name: 'Scheduled', value: 300, color: '#3b82f6' },
        { name: 'Cancelled', value: 100, color: '#ef4444' },
        { name: 'No Show', value: 50, color: '#f59e0b' },
    ];

    // 3. Bar Chart: Lab Performance
    const labPerformanceData = [
        { name: 'City Path', tests: 1200 },
        { name: 'Global Diag', tests: 950 },
        { name: 'TrustCare', tests: 1400 },
        { name: 'HealthFirst', tests: 800 },
        { name: 'MediCore', tests: 1100 },
    ];

    // 4. Radar Chart: Department Metrics (Cardiology vs Pediatrics)
    const departmentData = [
        { subject: 'Satisfaction', A: 120, B: 110, fullMark: 150 },
        { subject: 'Efficiency', A: 98, B: 130, fullMark: 150 },
        { subject: 'Volume', A: 86, B: 130, fullMark: 150 },
        { subject: 'Revenue', A: 99, B: 100, fullMark: 150 },
        { subject: 'Wait Time', A: 85, B: 90, fullMark: 150 },
        { subject: 'Staffing', A: 65, B: 85, fullMark: 150 },
    ];

    // 5. Radial Bar Chart: Monthly Targets
    const targetData = [
        { name: 'Revenue', uv: 90, fill: '#8884d8' },
        { name: 'Patients', uv: 75, fill: '#83a6ed' },
        { name: 'Visits', uv: 50, fill: '#8dd1e1' },
        { name: 'Surgery', uv: 40, fill: '#82ca9d' },
        { name: 'Labs', uv: 85, fill: '#a4de6c' },
    ];

    // 6. Stacked Area Chart: Revenue Streams
    const revenueStreamData = [
        { month: 'Jan', consult: 4000, lab: 2400, surgery: 2400 },
        { month: 'Feb', consult: 3000, lab: 1398, surgery: 2210 },
        { month: 'Mar', consult: 2000, lab: 9800, surgery: 2290 },
        { month: 'Apr', consult: 2780, lab: 3908, surgery: 2000 },
        { month: 'May', consult: 1890, lab: 4800, surgery: 2181 },
        { month: 'Jun', consult: 2390, lab: 3800, surgery: 2500 },
    ];

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Analytics Overview</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* 1. User Growth */}
                <Card className="col-span-1 lg:col-span-2">
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
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend />
                                <Line type="monotone" dataKey="patients" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="doctors" stroke="#06b6d4" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 2. Monthly Targets (Radial Bar) */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Monthly Targets</CardTitle>
                        <CardDescription>Progress towards goals (%)</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={10} data={targetData}>
                                <RadialBar
                                    label={{ position: 'insideStart', fill: '#fff' }}
                                    background
                                    dataKey="uv"
                                />
                                <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ top: '50%', right: 0, transform: 'translate(0, -50%)', lineHeight: '24px' }} />
                                <Tooltip />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 3. Appointment Status */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Appointment Distribution</CardTitle>
                        <CardDescription>By status</CardDescription>
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
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 4. Department Metrics (Radar) */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Dept. Comparison</CardTitle>
                        <CardDescription>Cardiology (A) vs Pediatrics (B)</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={departmentData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" fontSize={10} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} />
                                <Radar name="Cardiology" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                <Radar name="Pediatrics" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                                <Legend />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 5. Top Labs (Bar) */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Top Diagnostics Labs</CardTitle>
                        <CardDescription>Test volume</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={labPerformanceData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                                <XAxis type="number" fontSize={12} stroke="#888888" tickLine={false} axisLine={false} />
                                <YAxis dataKey="name" type="category" fontSize={10} width={80} stroke="#888888" tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                                <Bar dataKey="tests" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 6. Revenue Streams (Stacked Area) */}
                <Card className="col-span-1 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Revenue Streams</CardTitle>
                        <CardDescription>Income breakdown over time</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueStreamData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="month" fontSize={12} stroke="#888888" tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} stroke="#888888" tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="consult" stackId="1" stroke="#8884d8" fill="#8884d8" />
                                <Area type="monotone" dataKey="lab" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                                <Area type="monotone" dataKey="surgery" stackId="1" stroke="#ffc658" fill="#ffc658" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
