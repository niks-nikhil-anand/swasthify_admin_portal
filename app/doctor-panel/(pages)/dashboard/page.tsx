"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, TrendingUp, Activity, ArrowUpRight, Clock, Plus, Megaphone, AlertCircle, RefreshCw, Edit, ShieldAlert, FileText } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import DoctorProfileForm from "@/components/doctor/DoctorProfileForm";
import { toast } from "sonner";
import { PackageStatusCard } from "@/components/doctor-panel/PackageStatusCard";
import {
    getDoctorDashboardStats,
    getUpcomingAppointments,
    getDoctorRecentActivity
} from "./actions";

interface DoctorData {
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        status: "ACTIVE" | "BLOCKED" | "PENDING" | "ARCHIVED";
        isVerified: boolean;
    };
    doctor: {
        isProfileComplete: boolean;
        profileCompletionPercentage: number;
    } | null;
}

export default function DoctorPanelPage() {
    const [loading, setLoading] = useState(true);
    const [doctorData, setDoctorData] = useState<DoctorData | null>(null);
    const [stats, setStats] = useState<any>(null);
    const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [verifying, setVerifying] = useState(false);

    const fetchDoctorData = useCallback(async () => {
        try {
            const [res, dashboardStats, appointments, activity] = await Promise.all([
                fetch("/api/doctor/me"),
                getDoctorDashboardStats(),
                getUpcomingAppointments(),
                getDoctorRecentActivity()
            ]);

            if (res.ok) {
                const data = await res.json();
                setDoctorData(data);
            }
            setStats(dashboardStats);
            setUpcomingAppointments(appointments);
            setRecentActivity(activity);
        } catch (error) {
            console.error("Failed to fetch doctor data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDoctorData();
    }, [fetchDoctorData, refreshKey]);

    const handleProfileUpdateSuccess = () => {
        setRefreshKey(prev => prev + 1); // Trigger re-fetch
    };

    const handleVerifyCheck = async () => {
        setVerifying(true);
        await fetchDoctorData();
        setVerifying(false);
        toast.info("Verification status refreshed");
    };

    if (loading) {
        return (
            <div className="space-y-8 p-6">
                <div className="flex flex-col gap-4">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Skeleton className="lg:col-span-4 h-80 rounded-xl" />
                    <Skeleton className="lg:col-span-3 h-80 rounded-xl" />
                </div>
            </div>
        );
    }

    // 1. BLOCKED STATUS
    if (doctorData?.user?.status === "BLOCKED") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-destructive/5 rounded-3xl border border-destructive/20">
                <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
                    <ShieldAlert className="h-10 w-10 text-destructive" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Account Blocked</h1>
                <p className="text-muted-foreground max-w-md mb-8 text-lg">
                    Your account has been suspended due to policy violations or security concerns. Please contact our support team to resolve this issue.
                </p>

                <div className="grid gap-6 w-full max-w-lg md:grid-cols-2">
                    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer border-destructive/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Activity className="h-5 w-5 text-blue-500" />
                                Support Center
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Raise a ticket or chat with our support executive.
                            </p>
                            <Button variant="outline" className="w-full">
                                Contact Support
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer border-destructive/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="h-5 w-5 text-orange-500" />
                                Review Policy
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Read our terms of service and doctor guidelines.
                            </p>
                            <Button variant="outline" className="w-full">
                                View Guidelines
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // 2. PENDING STATUS
    if (doctorData?.user?.status === "PENDING") {
        return (
            <div className="space-y-8">
                <div className="bg-linear-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 p-8 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    Approval Pending
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight mb-2">
                                Welcome, Dr. {doctorData?.user?.name || "Doctor"}!
                            </h1>
                            <p className="text-muted-foreground max-w-2xl text-lg">
                                Your account is currently pending approval. Please complete your profile to expedite the process.
                            </p>
                        </div>
                        <Button
                            size="lg"
                            className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 rounded-full px-8"
                            onClick={() => setIsEditModalOpen(true)}
                        >
                            Complete Profile
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-indigo-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Users className="h-5 w-5 text-indigo-500" />
                                Profile Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Add your specializations, experience, and clinic details.
                            </p>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span>Completion</span>
                                    <span className="font-bold">{doctorData?.doctor?.profileCompletionPercentage || 0}%</span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                                        style={{ width: `${doctorData?.doctor?.profileCompletionPercentage || 0}%` }}
                                    />
                                </div>
                            </div>
                            <Button onClick={() => setIsEditModalOpen(true)} className="w-full" variant="secondary">
                                Edit Profile
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Update Profile</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <DoctorProfileForm onSuccess={handleProfileUpdateSuccess} showCompletion={false} />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    // 3. ACTIVE DASHBOARD
    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Doctor Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back, Dr. {doctorData?.user?.name || "Doctor"}. Here&apos;s your daily overview.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2" onClick={() => setIsEditModalOpen(true)}>
                        <Edit className="h-4 w-4" />
                        Edit Profile
                    </Button>
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

            {/* NOT VERIFIED WARNING CARD */}
            {(!doctorData?.user?.isVerified) && (
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 flex items-start gap-4 shadow-xs">
                    <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
                        <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-200">Profile Not Verified</h3>
                        <p className="text-sm text-amber-800/80 dark:text-amber-400/80 mt-1">
                            Your documents are under review or pending upload. You cannot accept appointments or run campaigns until verified.
                        </p>
                        <div className="mt-3 flex gap-3">
                            <Button
                                size="sm"
                                variant="outline"
                                className="bg-white dark:bg-black/20 border-amber-200 hover:bg-amber-50 text-amber-700 gap-2"
                                onClick={handleVerifyCheck}
                                disabled={verifying}
                            >
                                <RefreshCw className={`h-3 w-3 ${verifying ? "animate-spin" : ""}`} />
                                {verifying ? "Checking..." : "Check Verification Status"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <PackageStatusCard />


            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.patients.total.toLocaleString() || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <ArrowUpRight className={`h-3 w-3 ${stats?.patients.trend >= 0 ? "text-emerald-500" : "text-destructive"} ${stats?.patients.trend < 0 ? "rotate-90" : ""}`} />
                            <span className={`${stats?.patients.trend >= 0 ? "text-emerald-500" : "text-destructive"} font-medium`}>
                                {stats?.patients.trend >= 0 ? "+" : ""}{stats?.patients.trend}%
                            </span> from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.appointmentsToday.total || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stats?.appointmentsToday.remaining || 0} remaining
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenue (Month)</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{(stats?.revenue.total / 1000).toFixed(1)}K</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <ArrowUpRight className={`h-3 w-3 ${stats?.revenue.trend >= 0 ? "text-emerald-500" : "text-destructive"} ${stats?.revenue.trend < 0 ? "rotate-90" : ""}`} />
                            <span className={`${stats?.revenue.trend >= 0 ? "text-emerald-500" : "text-destructive"} font-medium`}>
                                {stats?.revenue.trend >= 0 ? "+" : ""}{stats?.revenue.trend}%
                            </span> from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.pendingReports || 0}</div>
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
                            You have {stats?.appointmentsToday.remaining || 0} appointments remaining today.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {upcomingAppointments.map((apt, i) => (
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
                            {upcomingAppointments.length === 0 && (
                                <div className="text-center py-10 text-muted-foreground">
                                    No more appointments scheduled for today.
                                </div>
                            )}
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
                            {recentActivity.map((activity, i) => (
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
                            {recentActivity.length === 0 && (
                                <div className="text-center py-10 text-muted-foreground">
                                    No recent activity found.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Update Profile</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <DoctorProfileForm onSuccess={handleProfileUpdateSuccess} showCompletion={false} />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}
