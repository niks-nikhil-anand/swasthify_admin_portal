"use server";

import { prisma } from "@/lib/prisma";
import {
    startOfDay,
    endOfDay,
    subDays,
    format,
    startOfMonth,
    endOfMonth,
    subMonths,
    eachDayOfInterval,
    isWithinInterval
} from "date-fns";
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

export async function getDoctorAnalyticsData() {
    const doctorId = await getDoctorId();
    if (!doctorId) return null;

    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(lastMonthStart);

    // 1. Fetch Key Metrics
    const [
        totalRevenueRes,
        lastMonthRevenueRes,
        totalPatientsCount,
        lastMonthPatientsCount,
        activeCampaigns,
        totalAppointments,
        completedAppointments,
        lastMonthTotalAppointments,
        lastMonthCompletedAppointments
    ] = await Promise.all([
        // Total revenue (current month)
        prisma.payment.aggregate({
            _sum: { amount: true },
            where: {
                appointment: { doctorId },
                status: "SUCCESS",
                createdAt: { gte: currentMonthStart }
            }
        }),
        // Revenue last month
        prisma.payment.aggregate({
            _sum: { amount: true },
            where: {
                appointment: { doctorId },
                status: "SUCCESS",
                createdAt: { gte: lastMonthStart, lte: lastMonthEnd }
            }
        }),
        // Total unique patients
        prisma.appointment.groupBy({
            by: ['patientId'],
            where: { doctorId }
        }).then(res => res.length),
        // Unique patients last month
        prisma.appointment.groupBy({
            by: ['patientId'],
            where: {
                doctorId,
                createdAt: { gte: lastMonthStart, lte: lastMonthEnd }
            }
        }).then(res => res.length),
        // Active campaigns
        prisma.campaign.count({
            where: { doctorId, status: "ACTIVE" }
        }),
        // Appointment rate (current month)
        prisma.appointment.count({
            where: { doctorId, createdAt: { gte: currentMonthStart } }
        }),
        prisma.appointment.count({
            where: { doctorId, status: "COMPLETED", createdAt: { gte: currentMonthStart } }
        }),
        // Appointment rate (last month)
        prisma.appointment.count({
            where: { doctorId, createdAt: { gte: lastMonthStart, lte: lastMonthEnd } }
        }),
        prisma.appointment.count({
            where: { doctorId, status: "COMPLETED", createdAt: { gte: lastMonthStart, lte: lastMonthEnd } }
        })
    ]);

    const currentRevenue = totalRevenueRes._sum.amount || 0;
    const lastMonthRevenue = lastMonthRevenueRes._sum.amount || 0;
    const revenueTrend = lastMonthRevenue > 0
        ? ((currentRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;

    const patientTrend = lastMonthPatientsCount > 0
        ? ((totalPatientsCount - lastMonthPatientsCount) / lastMonthPatientsCount) * 100
        : 0;

    const currentRate = totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0;
    const lastMonthRate = lastMonthTotalAppointments > 0 ? (lastMonthCompletedAppointments / lastMonthTotalAppointments) * 100 : 0;
    const rateTrend = currentRate - lastMonthRate;

    // 2. Patient Growth Data (Last 7 Months)
    const months = Array.from({ length: 7 }, (_, i) => subMonths(now, 6 - i));
    const patientGrowthData = await Promise.all(months.map(async (month) => {
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);

        const [patients, visits] = await Promise.all([
            // Unique patients in this month
            prisma.appointment.groupBy({
                by: ['patientId'],
                where: {
                    doctorId,
                    createdAt: { gte: monthStart, lte: monthEnd }
                }
            }).then(res => res.length),
            // Total visits in this month
            prisma.appointment.count({
                where: { doctorId, createdAt: { gte: monthStart, lte: monthEnd } }
            })
        ]);

        return {
            name: format(month, "MMM"),
            patients,
            visits
        };
    }));

    // 3. Weekly Appointment Data (Last 7 Days)
    const days = eachDayOfInterval({
        start: subDays(now, 6),
        end: now
    });

    const weeklyAppointmentData = await Promise.all(days.map(async (day) => {
        const dayStart = startOfDay(day);
        const dayEnd = endOfDay(day);

        const [total, completed] = await Promise.all([
            prisma.appointment.count({
                where: { doctorId, dateTime: { gte: dayStart, lte: dayEnd } }
            }),
            prisma.appointment.count({
                where: {
                    doctorId,
                    dateTime: { gte: dayStart, lte: dayEnd },
                    status: "COMPLETED"
                }
            })
        ]);

        return {
            name: format(day, "EEE"),
            total,
            completed
        };
    }));

    return {
        metrics: {
            revenue: {
                total: currentRevenue,
                trend: revenueTrend.toFixed(1)
            },
            patients: {
                total: totalPatientsCount,
                trend: patientTrend.toFixed(1)
            },
            appointmentRate: {
                rate: Math.round(currentRate),
                trend: rateTrend.toFixed(1)
            },
            activeCampaigns
        },
        patientGrowthData,
        weeklyAppointmentData
    };
}
