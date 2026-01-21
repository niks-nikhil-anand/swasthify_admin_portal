"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, TrendingUp, Activity, ArrowUpRight, Clock, Plus, Megaphone } from "lucide-react";
import Link from "next/link";

export default function DoctorPanelPage() {
    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Doctor Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Welcome back, Dr. Anand. Here's your daily overview.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button asChild variant="outline" className="gap-2">
                        <Link href="/doctor-panel/campaign">
                            <Megaphone className="h-4 w-4" />
                            New Campaign
                        </Link>
                    </Button>
                    <Button asChild className="gap-2 accent-blue-500">
                        <Link href="/doctor-panel/appointment">
                            <Plus className="h-4 w-4" />
                            New Appointment
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,234</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                            <span className="text-emerald-500 font-medium">+12%</span> from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            4 remaining
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenue (Month)</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹1.2L</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                            <span className="text-emerald-500 font-medium">+8%</span> from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">7</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Requires attention
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Upcoming Appointments */}
                <Card className="lg:col-span-4 hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                        <CardTitle>Upcoming Appointments</CardTitle>
                        <CardDescription>
                            You have 4 appointments remaining today.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { name: "Rahul Sharma", time: "10:30 AM", type: "General Checkup", status: "In Progress" },
                                { name: "Priya Patel", time: "11:15 AM", type: "Follow up", status: "Waiting" },
                                { name: "Amit Kumar", time: "12:00 PM", type: "Consultation", status: "Confirmed" },
                                { name: "Sneha Gupta", time: "02:30 PM", type: "Report Review", status: "Confirmed" },
                            ].map((apt, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {apt.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{apt.name}</p>
                                            <p className="text-xs text-muted-foreground">{apt.type}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-sm font-medium">
                                            <Clock className="h-3 w-3 text-muted-foreground" />
                                            {apt.time}
                                        </div>
                                        <span className={cn(
                                            "text-[10px] px-2 py-0.5 rounded-full mt-1 inline-block",
                                            apt.status === "In Progress" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                                                apt.status === "Waiting" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                                                    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                        )}>
                                            {apt.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="lg:col-span-3 hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Latest actions and updates.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { title: "New Patient Registered", desc: "Rajesh Kumar registered via app", time: "2h ago" },
                                { title: "Campaign Sent", desc: "Monsoon Health Tips sent to 500 patients", time: "4h ago" },
                                { title: "Appointment Cancelled", desc: "Vikram Singh cancelled appointment", time: "5h ago" },
                                { title: "Lab Report Uploaded", desc: "Report for Anita Desai is ready", time: "1d ago" },
                            ].map((activity, i) => (
                                <div key={i} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                                    <div className="h-2 w-2 mt-2 rounded-full bg-primary/30 ring-4 ring-primary/10" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{activity.title}</p>
                                        <p className="text-xs text-muted-foreground line-clamp-1">{activity.desc}</p>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                        {activity.time}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}
