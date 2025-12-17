"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  IndianRupee,
  MoreHorizontal,
  Star,
  TrendingUp,
  Users,
  XCircle
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"

export default function DashboardPage() {
  // --- Data Mockups ---

  const appointmentTrends = [
    { name: "Mon", total: 120 },
    { name: "Tue", total: 145 },
    { name: "Wed", total: 110 },
    { name: "Thu", total: 155 },
    { name: "Fri", total: 180 },
    { name: "Sat", total: 140 },
    { name: "Sun", total: 90 },
  ]

  const statusDistribution = [
    { name: "Completed", value: 65, color: "#10b981" }, // emerald-500
    { name: "Pending", value: 20, color: "#f59e0b" },   // amber-500
    { name: "Cancelled", value: 15, color: "#ef4444" }, // red-500
  ]

  const doctorAvailability = [
    { department: "Cardio", available: 10, booked: 8 },
    { department: "Ortho", available: 8, booked: 7 },
    { department: "Neuro", available: 6, booked: 2 },
    { department: "Pedia", available: 12, booked: 10 },
    { department: "Derma", available: 9, booked: 9 },
  ]

  const topDoctors = [
    { name: "Dr. Heinz Doofenshmirtz", specialty: "Villainy (Cardiology)", rating: 4.9, consults: 145, img: "/avatars/01.png" },
    { name: "Dr. Gregory House", specialty: "Diagnostics", rating: 4.8, consults: 132, img: "/avatars/02.png" },
    { name: "Dr. Shaun Murphy", specialty: "Surgery", rating: 5.0, consults: 120, img: "/avatars/03.png" },
    { name: "Dr. Meredith Grey", specialty: "General Surgery", rating: 4.7, consults: 115, img: "/avatars/04.png" },
  ]

  const recentAppointments = [
    { id: "APT-101", patient: "Rahul Dravid", doctor: "Dr. House", time: "10:00 AM", status: "Completed", type: "Video" },
    { id: "APT-102", patient: "Smriti Mandhana", doctor: "Dr. Grey", time: "10:30 AM", status: "In Progress", type: "Clinic" },
    { id: "APT-103", patient: "Virat Kohli", doctor: "Dr. Murphy", time: "11:00 AM", status: "Pending", type: "Video" },
    { id: "APT-104", patient: "Mithali Raj", doctor: "Dr. Strange", time: "11:15 AM", status: "Cancelled", type: "Clinic" },
  ]

  const alerts = [
    { title: "Pending Approvals", count: 5, type: "urgent", desc: "Doctors awaiting verification" },
    { title: "Missed Appointments", count: 12, type: "warning", desc: "No-show report generated" },
    { title: "Supply Alert", count: 3, type: "info", desc: "Low stock in Lab B" },
  ]

  // New Charts Data
  const dailyTargetsData = [
    { name: 'Revenue', uv: 90, fill: '#8884d8' },
    { name: 'Appts', uv: 80, fill: '#83a6ed' },
    { name: 'Patients', uv: 45, fill: '#8dd1e1' },
    { name: 'Labs', uv: 70, fill: '#82ca9d' },
  ];

  const systemHealthData = [
    { subject: 'CPU Load', A: 45, fullMark: 100 },
    { subject: 'Memory', A: 60, fullMark: 100 },
    { subject: 'Disk I/O', A: 30, fullMark: 100 },
    { subject: 'API Latency', A: 20, fullMark: 100 },
    { subject: 'DB Conn', A: 50, fullMark: 100 },
    { subject: 'Network', A: 40, fullMark: 100 },
  ];

  const patientVisitsData = [
    { name: 'Mon', new: 20, returning: 40 },
    { name: 'Tue', new: 25, returning: 45 },
    { name: 'Wed', new: 30, returning: 35 },
    { name: 'Thu', new: 22, returning: 50 },
    { name: 'Fri', new: 35, returning: 60 },
    { name: 'Sat', new: 40, returning: 30 },
    { name: 'Sun', new: 15, returning: 20 },
  ];

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Platform overview & real-time analytics.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="hidden md:flex">
            <Calendar className="mr-2 h-4 w-4" /> Jan 20, 2024 - Feb 20, 2024
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* Metrics Row 1: Primary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹ 14,23,500</div>
            <div className="flex items-center text-xs text-emerald-600">
              <TrendingUp className="mr-1 h-3 w-3" /> +12% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <div className="flex items-center text-xs text-blue-600">
              <Users className="mr-1 h-3 w-3" /> 12 Active now
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,340</div>
            <div className="flex items-center text-xs text-purple-600">
              <TrendingUp className="mr-1 h-3 w-3" /> +230 this week
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,520</div>
            <p className="text-xs text-muted-foreground">Lifetime bookings</p>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Row 2: Secondary / Operational Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-orange-50 border-orange-100 dark:bg-orange-950/20 dark:border-orange-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900 dark:text-orange-100">Pending Bookings</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">42</div>
            <p className="text-xs text-orange-600/80">Requires confirmation</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100 dark:bg-red-950/20 dark:border-red-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-900 dark:text-red-100">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700 dark:text-red-300">18</div>
            <p className="text-xs text-red-600/80">Last 7 days</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">850</div>
            <p className="text-xs text-emerald-600/80">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Wait Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14 min</div>
            <p className="text-xs text-muted-foreground">-2 min from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section 1 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Appointment Trends - Area Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Appointment Trends</CardTitle>
            <CardDescription>Daily bookings over the last week</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={appointmentTrends}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.4} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution - Donut Chart */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Appointment Status</CardTitle>
            <CardDescription>Distribution overview</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section 2 - NEW Charts from User Request */}
      <div className="grid gap-4 md:grid-cols-3">

        {/* Daily Targets - Radial Bar */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Targets</CardTitle>
            <CardDescription>Performance goals (%)</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={10} data={dailyTargetsData}>
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

        {/* System Health - Radar */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={systemHealthData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Current" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Patient Visits - Composed Chart (Bar + Line) */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Visits</CardTitle>
            <CardDescription>New vs Returning</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={patientVisitsData}>
                <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Legend />
                <CartesianGrid stroke="#f5f5f5" />
                <Bar dataKey="new" barSize={20} fill="#413ea0" />
                <Line type="monotone" dataKey="returning" stroke="#ff7300" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      {/* Detailed Info Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

        {/* Top Doctors List */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Performing Doctors</CardTitle>
            <CardDescription>Based on completed consultations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {topDoctors.map((doctor, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{doctor.name}</p>
                      <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      <span className="text-sm font-bold">{doctor.rating}</span>
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      {doctor.consults} Consults
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Appointments & Alerts */}
        <div className="col-span-4 space-y-4">
          {/* Activity Feed */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Appointments</CardTitle>
                <CardDescription>Real-time booking updates</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                View All <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{apt.patient}</p>
                      <p className="text-xs text-muted-foreground">{apt.doctor} • {apt.type}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-xs text-right hidden sm:block">
                        <p className="font-medium">{apt.time}</p>
                        <p className="text-muted-foreground">Today</p>
                      </div>
                      <Badge variant={apt.status === "Completed" ? "success" : apt.status === "Cancelled" ? "danger" : apt.status === "In Progress" ? "default" : "secondary"}>
                        {apt.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts / Actions Required */}
          <Card className="border-l-4 border-l-orange-500 bg-orange-50/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Actions Required
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {alerts.map((alert, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${alert.type === 'urgent' ? 'bg-red-500' : 'bg-orange-400'}`} />
                    <span className="text-sm font-medium">{alert.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground hidden sm:inline">{alert.desc}</span>
                    <Badge variant="outline" className="bg-background">{alert.count}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}