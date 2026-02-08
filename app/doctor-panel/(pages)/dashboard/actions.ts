"use server";

import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, subDays, format, startOfMonth } from "date-fns";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function getDoctorId() {
    const cookieStore = await cookies();
    const token = cookieStore.get("DOCTOR");
    if (!token) return null;

    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token.value, secret);

        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            include: { doctor: true }
        });

        return user?.doctor?.id || null;
    } catch (e) {
        return null;
    }
}

export async function getDoctorDashboardStats() {
    const doctorId = await getDoctorId();
    if (!doctorId) return null;

    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const monthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subDays(monthStart, 1));

    const [
        totalPatients,
        appointmentsToday,
        completedToday,
        monthlyRevenue,
        lastMonthRevenue,
        pendingReports
    ] = await Promise.all([
        // Total unique patients for this doctor
        prisma.appointment.groupBy({
            by: ['patientId'],
            where: { doctorId }
        }).then((res: any[]) => res.length as any),

        // Appointments today
        prisma.appointment.count({
            where: {
                doctorId,
                dateTime: { gte: todayStart, lte: todayEnd }
            }
        }) as any,

        // Completed today
        prisma.appointment.count({
            where: {
                doctorId,
                dateTime: { gte: todayStart, lte: todayEnd },
                status: "COMPLETED"
            }
        }) as any,

        // Revenue this month
        prisma.payment.aggregate({
            _sum: { amount: true },
            where: {
                appointment: { doctorId },
                status: "SUCCESS",
                createdAt: { gte: monthStart }
            }
        }),

        // Revenue last month (for trend)
        prisma.payment.aggregate({
            _sum: { amount: true },
            where: {
                appointment: { doctorId },
                status: "SUCCESS",
                createdAt: { gte: lastMonthStart, lt: monthStart }
            }
        }),

        // Pending reports (assigned to this doctor)
        prisma.labReport.count({
            where: {
                doctorId,
                status: "PENDING"
            }
        }) as any
    ]);

    const currentRevenue = monthlyRevenue._sum.amount || 0;
    const previousRevenue = lastMonthRevenue._sum.amount || 0;
    const revenueTrend = previousRevenue > 0
        ? Math.round(((currentRevenue - previousRevenue) / previousRevenue) * 100)
        : 0;

    return {
        patients: {
            total: totalPatients,
            trend: 12 // Mock trend for now as we don't have historical patient growth easily accessible without more complex queries
        },
        appointmentsToday: {
            total: appointmentsToday,
            remaining: appointmentsToday - completedToday
        },
        revenue: {
            total: currentRevenue,
            trend: revenueTrend
        },
        pendingReports
    };
}

export async function getUpcomingAppointments() {
    const doctorId = await getDoctorId();
    if (!doctorId) return [];

    const now = new Date();
    const todayEnd = endOfDay(now);

    const appointments = await prisma.appointment.findMany({
        where: {
            doctorId,
            dateTime: { gte: now, lte: todayEnd },
            status: { in: ["PENDING", "CONFIRMED"] }
        },
        include: {
            patient: { select: { name: true } }
        },
        orderBy: { dateTime: 'asc' },
        take: 5
    });

    return appointments.map((apt: any) => ({
        name: apt.patient.name || "Unknown Patient",
        time: format(apt.dateTime, "hh:mm a"),
        type: apt.type === "VIDEO" ? "Video Consultation" : "In-Person Visit",
        status: apt.status === "PENDING" ? "Waiting" : "Confirmed"
    }));
}

export async function getDoctorRecentActivity() {
    const doctorId = await getDoctorId();
    if (!doctorId) return [];

    // Combine recent appointments and recent reports for activity
    const [recentAppointments, recentReports] = await Promise.all([
        prisma.appointment.findMany({
            where: { doctorId },
            orderBy: { createdAt: 'desc' },
            include: { patient: { select: { name: true } } },
            take: 3
        }),
        prisma.labReport.findMany({
            where: { doctorId },
            orderBy: { createdAt: 'desc' },
            include: { patient: { select: { name: true } }, test: { select: { name: true } } },
            take: 2
        })
    ]);

    const activities = [
        ...recentAppointments.map((apt: any) => ({
            title: apt.status === "CANCELLED" ? "Appointment Cancelled" : "New Appointment",
            desc: `${apt.patient.name} - ${apt.type}`,
            time: formatDistanceToNow(apt.createdAt),
            rawDate: apt.createdAt
        })),
        ...recentReports.map((rep: any) => ({
            title: "Report Received",
            desc: `${rep.test.name} for ${rep.patient.name}`,
            time: formatDistanceToNow(rep.createdAt),
            rawDate: rep.createdAt
        }))
    ];

    return activities.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime()).slice(0, 4);
}

function formatDistanceToNow(date: Date) {
    const diff = new Date().getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}
