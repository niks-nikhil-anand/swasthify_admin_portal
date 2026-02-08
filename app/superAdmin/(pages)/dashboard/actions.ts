"use server";

import { prisma } from "@/lib/prisma";
import { startOfDay, subDays, format } from "date-fns";

export async function getDashboardStats() {
    const now = new Date();
    const lastMonth = subDays(now, 30);
    const lastWeek = subDays(now, 7);

    const [
        totalRevenue,
        revenueLastMonth,
        doctorCount,
        activeDoctors,
        patientCount,
        patientsThisWeek,
        appointmentCount,
        pendingAppointments,
        cancelledLastWeek,
        completedThisMonth,
        labCount,
        campaignCount
    ] = await Promise.all([
        // Total Revenue
        prisma.payment.aggregate({
            _sum: { amount: true },
            where: { status: "SUCCESS" }
        }),
        // Revenue last 30 days for trend
        prisma.payment.aggregate({
            _sum: { amount: true },
            where: {
                status: "SUCCESS",
                createdAt: { gte: lastMonth }
            }
        }),
        // Total Doctors
        prisma.doctor.count(),
        // Active Doctors (User status active)
        prisma.doctor.count({
            where: { user: { status: "ACTIVE" } }
        }),
        // Total Patients
        prisma.patient.count(),
        // New Patients this week
        prisma.patient.count({
            where: { createdAt: { gte: lastWeek } }
        }),
        // Total Appointments
        prisma.appointment.count(),
        // Pending Appointments
        prisma.appointment.count({
            where: { status: "PENDING" }
        }),
        // Cancelled last 7 days
        prisma.appointment.count({
            where: {
                status: "CANCELLED",
                updatedAt: { gte: lastWeek }
            }
        }),
        // Completed this month
        prisma.appointment.count({
            where: {
                status: "COMPLETED",
                updatedAt: { gte: startOfDay(new Date(now.getFullYear(), now.getMonth(), 1)) }
            }
        }),
        // Labs
        prisma.lab.count(),
        // Campaigns
        prisma.campaign.count()
    ]);

    return {
        revenue: {
            total: totalRevenue._sum.amount || 0,
            trend: revenueLastMonth._sum.amount ? Math.round(((revenueLastMonth._sum.amount || 0) / (totalRevenue._sum.amount || 1)) * 100) : 0
        },
        doctors: {
            total: doctorCount,
            active: activeDoctors
        },
        patients: {
            total: patientCount,
            newThisWeek: patientsThisWeek
        },
        appointments: {
            total: appointmentCount,
            pending: pendingAppointments,
            cancelledLastWeek,
            completedThisMonth
        },
        labs: {
            total: labCount
        },
        campaigns: {
            total: campaignCount
        }
    };
}

export async function getAppointmentTrends(days: number = 7) {
    const startDate = startOfDay(subDays(new Date(), days));

    const appointments = await prisma.appointment.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true }
    });

    const dailyData: Record<string, number> = {};
    for (let i = 0; i < days; i++) {
        const day = format(subDays(new Date(), i), 'EEE');
        dailyData[day] = 0;
    }

    appointments.forEach((apt: { createdAt: Date }) => {
        const day = format(apt.createdAt, 'EEE');
        if (dailyData[day] !== undefined) {
            dailyData[day]++;
        }
    });

    return Object.entries(dailyData)
        .map(([name, total]) => ({ name, total }))
        .reverse();
}

export async function getAppointmentStatusDistribution() {
    const stats = await prisma.appointment.groupBy({
        by: ['status'],
        _count: { status: true }
    });

    const colorMap: Record<string, string> = {
        COMPLETED: "#10b981",
        PENDING: "#f59e0b",
        CANCELLED: "#ef4444",
        CONFIRMED: "#3b82f6",
        RESCHEDULED: "#8b5cf6"
    };

    return stats.map((s: { status: string; _count: { status: number } }) => ({
        name: s.status,
        value: s._count.status,
        color: colorMap[s.status] || "#94a3b8"
    }));
}

export async function getTopDoctors(limit: number = 5) {
    const doctors = await prisma.doctor.findMany({
        take: limit,
        include: {
            user: {
                select: { name: true }
            },
            _count: {
                select: { appointments: { where: { status: "COMPLETED" } } }
            }
        },
        orderBy: {
            averageRating: 'desc'
        }
    });

    return doctors.map((d: { user: { name: string | null }; qualification: string | null; averageRating: number | null; _count: { appointments: number }; profilePhoto: string | null }) => ({
        name: d.user.name,
        specialty: d.qualification || "Specialist",
        rating: d.averageRating,
        consults: d._count.appointments,
        img: d.profilePhoto || "/avatars/doctor-default.png"
    }));
}

export async function getRecentAppointments(limit: number = 5) {
    const appointments = await prisma.appointment.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
            patient: { select: { name: true } },
            doctor: { include: { user: { select: { name: true } } } }
        }
    });

    return appointments.map((apt: { id: string; patient: { name: string | null }; doctor: { user: { name: string | null } } | null; dateTime: Date; status: string; type: string }) => ({
        id: apt.id.substring(0, 8).toUpperCase(),
        patient: apt.patient.name || "Unknown Patient",
        doctor: apt.doctor?.user.name || "N/A",
        time: format(apt.dateTime, "hh:mm a"),
        status: apt.status,
        type: apt.type
    }));
}

export async function getAdminAlerts() {
    const [pendingDoctors, pendingLabs, inReviewCampaigns] = await Promise.all([
        prisma.user.count({ where: { role: "DOCTOR", isVerified: false } }),
        prisma.user.count({ where: { role: "LAB", isVerified: false } }),
        prisma.campaign.count({ where: { status: "IN_REVIEW" } })
    ]);

    const alerts = [];
    if (pendingDoctors > 0) {
        alerts.push({ title: "Doctor Approvals", count: pendingDoctors, type: "urgent", desc: "Awaiting verification" });
    }
    if (pendingLabs > 0) {
        alerts.push({ title: "Lab Approvals", count: pendingLabs, type: "urgent", desc: "Awaiting verification" });
    }
    if (inReviewCampaigns > 0) {
        alerts.push({ title: "Campaign Reviews", count: inReviewCampaigns, type: "warning", desc: "Active reviews" });
    }

    return alerts;
}

export async function getPatientVisits(days: number = 7) {
    const startDate = startOfDay(subDays(new Date(), days));

    // Simplified: "New" if patient created in last 7 days, "Returning" otherwise
    const appointments = await prisma.appointment.findMany({
        where: { dateTime: { gte: startDate } },
        include: { patient: { select: { createdAt: true } } }
    });

    const dailyData: Record<string, { new: number, returning: number }> = {};
    for (let i = 0; i < days; i++) {
        const day = format(subDays(new Date(), i), 'EEE');
        dailyData[day] = { new: 0, returning: 0 };
    }

    appointments.forEach((apt: { dateTime: Date; patient: { createdAt: Date } }) => {
        const day = format(apt.dateTime, 'EEE');
        if (dailyData[day]) {
            // If patient was created in the last 7 days, consider them "new" for this chart's context
            if (apt.patient.createdAt >= startDate) {
                dailyData[day].new++;
            } else {
                dailyData[day].returning++;
            }
        }
    });

    return Object.entries(dailyData)
        .map(([name, stats]) => ({ name, ...stats }))
        .reverse();
}
