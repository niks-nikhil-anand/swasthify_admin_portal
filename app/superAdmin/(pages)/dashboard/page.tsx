"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  IndianRupee,
  Star,
  TrendingUp,
  Users,
  XCircle,
  BarChart as BarChartIcon
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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  RadialBar,
  RadialBarChart,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts"
import {
  getDashboardStats,
  getAppointmentTrends,
  getAppointmentStatusDistribution,
  getTopDoctors,
  getRecentAppointments,
  getAdminAlerts,
  getPatientVisits
} from "./actions"

function DashboardSkeleton() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="col-span-4 h-[350px] rounded-xl" />
        <Skeleton className="col-span-3 h-[350px] rounded-xl" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[250px] rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [appointmentTrends, setAppointmentTrends] = useState<any[]>([])
  const [statusDistribution, setStatusDistribution] = useState<any[]>([])
  const [topDoctors, setTopDoctors] = useState<any[]>([])
  const [recentAppointments, setRecentAppointments] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [patientVisits, setPatientVisits] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          s,
          trends,
          dist,
          docs,
          apts,
          alt,
          visits
        ] = await Promise.all([
          getDashboardStats(),
          getAppointmentTrends(),
          getAppointmentStatusDistribution(),
          getTopDoctors(),
          getRecentAppointments(),
          getAdminAlerts(),
          getPatientVisits()
        ]);

        setStats(s);
        setAppointmentTrends(trends);
        setStatusDistribution(dist);
        setTopDoctors(docs);
        setRecentAppointments(apts);
        setAlerts(alt);
        setPatientVisits(visits);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [])

  if (loading) {
    return <DashboardSkeleton />
  }

  // System health data stays mock for now as it's typically from infra monitoring
  const systemHealthData = [
    { subject: 'CPU Load', A: 25, fullMark: 100 },
    { subject: 'Memory', A: 40, fullMark: 100 },
    { subject: 'Disk I/O', A: 15, fullMark: 100 },
    { subject: 'API Latency', A: 10, fullMark: 100 },
    { subject: 'DB Conn', A: 30, fullMark: 100 },
    { subject: 'Network', A: 20, fullMark: 100 },
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
            <Calendar className="mr-2 h-4 w-4" /> {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* Metrics Row 1 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹ {stats?.revenue.total.toLocaleString()}</div>
            <div className={`flex items-center text-xs ${stats?.revenue.trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              <TrendingUp className="mr-1 h-3 w-3" /> {stats?.revenue.trend}% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.doctors.total}</div>
            <div className="flex items-center text-xs text-blue-600">
              <Users className="mr-1 h-3 w-3" /> {stats?.doctors.active} Active now
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.patients.total.toLocaleString()}</div>
            <div className="flex items-center text-xs text-purple-600">
              <TrendingUp className="mr-1 h-3 w-3" /> +{stats?.patients.newThisWeek} this week
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.appointments.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Lifetime bookings</p>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Row 2 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-orange-50 border-orange-100 dark:bg-orange-950/20 dark:border-orange-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900 dark:text-orange-100">Pending Bookings</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">{stats?.appointments.pending}</div>
            <p className="text-xs text-orange-600/80">Requires confirmation</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100 dark:bg-red-950/20 dark:border-red-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-900 dark:text-red-100">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700 dark:text-red-300">{stats?.appointments.cancelledLastWeek}</div>
            <p className="text-xs text-red-600/80">Last 7 days</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{stats?.appointments.completedThisMonth}</div>
            <p className="text-xs text-emerald-600/80">This month</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Labs & Campaigns</CardTitle>
            <BarChartIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats?.labs.total} / {stats?.campaigns.total}</div>
            <p className="text-xs text-blue-600/80">Total on platform</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section 1 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Appointment Trends</CardTitle>
            <CardDescription>Daily bookings over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={appointmentTrends}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Appointment Status</CardTitle>
            <CardDescription>Overall distribution</CardDescription>
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

      {/* Charts Section 2 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Resource Engagement</CardTitle>
            <CardDescription>Labs vs Doctors vs Patients</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={10} data={[
                { name: 'Labs', uv: stats?.labs.total, fill: '#8884d8' },
                { name: 'Doctors', uv: stats?.doctors.total, fill: '#83a6ed' },
                { name: 'Patients', uv: stats?.patients.total, fill: '#8dd1e1' },
              ]}>
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

        <Card>
          <CardHeader>
            <CardTitle>System Load</CardTitle>
            <CardDescription>Real-time performance</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={systemHealthData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Current" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patient Visits</CardTitle>
            <CardDescription>New vs Returning Clients</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={patientVisits}>
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <CartesianGrid stroke="#f5f5f5" vertical={false} opacity={0.5} />
                <Bar dataKey="new" barSize={15} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="returning" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Lists Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Performing Doctors</CardTitle>
            <CardDescription>By consultation success and rating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {topDoctors.map((doctor, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={doctor.img} alt={doctor.name} />
                      <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{doctor.name}</p>
                      <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      <span className="font-bold">{doctor.rating}</span>
                    </div>
                    <div className="text-muted-foreground font-medium">
                      {doctor.consults} Consults
                    </div>
                  </div>
                </div>
              ))}
              {topDoctors.length === 0 && <p className="text-center text-sm text-muted-foreground py-10">No doctor data available</p>}
            </div>
          </CardContent>
        </Card>

        <div className="col-span-4 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Appointments</CardTitle>
                <CardDescription>Latest booking activity</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
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
                      <Badge variant={
                        apt.status === "COMPLETED" ? "success" :
                          apt.status === "CANCELLED" ? "destructive" :
                            apt.status === "PENDING" ? "warning" : "default"
                      } className="text-[10px] items-center">
                        {apt.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {recentAppointments.length === 0 && <p className="text-center text-sm text-muted-foreground py-10">No recent appointments</p>}
              </div>
            </CardContent>
          </Card>

          {alerts.length > 0 && (
            <Card className="border-l-4 border-l-orange-500 bg-orange-50/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-orange-600">
                  <AlertCircle className="h-5 w-5" />
                  System Notifications
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
          )}
        </div>
      </div>
    </div>
  )
}