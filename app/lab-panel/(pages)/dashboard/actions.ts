"use server";

import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, subDays, format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from "date-fns";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function getLabId() {
    const cookieStore = await cookies();
    const token = cookieStore.get("LAB")?.value;
    if (!token) return null;

    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.userId as string;

        const lab = await prisma.lab.findUnique({
            where: { userId }
        });

        return lab?.id || null;
    } catch (e) {
        return null;
    }
}

export async function getLabDashboardStats() {
    const labId = await getLabId();
    if (!labId) return null;

    const now = new Date();
    const monthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(monthStart, 1));

    const [
        totalRevenue,
        lastMonthRevenue,
        testRequests,
        lastMonthTests,
        pendingReports,
        totalPatients
    ] = await Promise.all([
        // Total Revenue for this month
        prisma.payment.aggregate({
            _sum: { amount: true },
            where: {
                appointment: { labId },
                status: "SUCCESS",
                createdAt: { gte: monthStart }
            }
        }),
        // Last month revenue for trend
        prisma.payment.aggregate({
            _sum: { amount: true },
            where: {
                appointment: { labId },
                status: "SUCCESS",
                createdAt: { gte: lastMonthStart, lt: monthStart }
            }
        }),
        // Test Requests this month
        prisma.appointment.count({
            where: {
                labId,
                createdAt: { gte: monthStart }
            }
        }),
        // Last month tests for trend
        prisma.appointment.count({
            where: {
                labId,
                createdAt: { gte: lastMonthStart, lt: monthStart }
            }
        }),
        // Pending reports
        prisma.labReport.count({
            where: {
                test: { labId },
                status: "PENDING"
            }
        }),
        // Total unique patients
        prisma.appointment.groupBy({
            by: ['patientId'],
            where: { labId }
        }).then((res: any) => (res as any[]).length)
    ]);

    const currentRev = totalRevenue._sum.amount || 0;
    const prevRev = lastMonthRevenue._sum.amount || 0;
    const revenueTrend = prevRev > 0 ? Math.round(((currentRev - prevRev) / prevRev) * 100) : 0;

    const testTrend = lastMonthTests > 0 ? Math.round(((testRequests - lastMonthTests) / lastMonthTests) * 100) : 0;

    return {
        revenue: { total: currentRev, trend: revenueTrend },
        testRequests: { total: testRequests, trend: testTrend },
        pendingReports,
        patients: { total: totalPatients, trend: 10 } // Mock trend for now
    };
}

export async function getLabRevenueOverview() {
    const labId = await getLabId();
    if (!labId) return [];

    const now = new Date();
    const months = eachMonthOfInterval({
        start: subMonths(now, 6),
        end: now
    });

    const revenueData = await Promise.all(months.map(async (month) => {
        const start = startOfMonth(month);
        const end = endOfMonth(month);

        const [revenue, tests] = await Promise.all([
            prisma.payment.aggregate({
                _sum: { amount: true },
                where: {
                    appointment: { labId },
                    status: "SUCCESS",
                    createdAt: { gte: start, lte: end }
                }
            }),
            prisma.appointment.count({
                where: {
                    labId,
                    createdAt: { gte: start, lte: end }
                }
            })
        ]);

        return {
            name: format(month, 'MMM'),
            revenue: revenue._sum.amount || 0,
            tests: tests || 0
        };
    }));

    return revenueData;
}

export async function getRecentLabOrders() {
    const labId = await getLabId();
    if (!labId) return [];

    const appointments = await prisma.appointment.findMany({
        where: { labId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            patient: { select: { name: true } },
            labTest: { select: { name: true } },
            labReport: { select: { status: true } }
        }
    });

    return appointments.map((apt: any) => ({
        id: apt.id.substring(0, 12).toUpperCase(),
        patient: apt.patient.name || "Unknown",
        test: apt.labTest?.name || "Standard Test",
        date: format(apt.dateTime, "MMM dd, hh:mm a"),
        status: apt.labReport?.[0]?.status || apt.status,
        amount: `₹${apt.totalAmount || 0}`
    }));
}
