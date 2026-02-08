"use server";

import { prisma } from "@/lib/prisma";
import { startOfDay, subDays, format } from "date-fns";

export async function getAnalyticsSummary(days: number = 7) {
    const startDate = startOfDay(subDays(new Date(), days));

    const [totalViews, uniqueVisitors, events] = await Promise.all([
        prisma.pageView.count({
            where: { createdAt: { gte: startDate } },
        }),
        prisma.pageView.groupBy({
            by: ['visitorId'],
            where: { createdAt: { gte: startDate } },
        }),
        prisma.analyticsEvent.findMany({
            where: {
                createdAt: { gte: startDate },
                eventType: "time_on_page",
            },
        }),
    ]);

    // Calculate Average Time on Page
    const durations = events.map(e => parseInt(e.eventValue?.replace('s', '') || '0'));
    const avgDuration = durations.length > 0
        ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
        : 0;

    // Calculate Bounce Rate (approximate: sessions with only 1 page view)
    const sessionViews = await prisma.pageView.groupBy({
        by: ['sessionId'],
        where: { createdAt: { gte: startDate } },
        _count: { sessionId: true },
    });

    const bounces = sessionViews.filter(s => s._count.sessionId === 1).length;
    const bounceRate = sessionViews.length > 0
        ? Math.round((bounces / sessionViews.length) * 100)
        : 0;

    return {
        totalViews,
        uniqueVisitors: uniqueVisitors.length,
        avgDuration: `${avgDuration}s`,
        bounceRate: `${bounceRate}%`,
    };
}

export async function getTrafficData(days: number = 7) {
    const startDate = startOfDay(subDays(new Date(), days));

    const views = await prisma.pageView.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true },
    });

    // Group by day
    const dailyData: Record<string, number> = {};
    for (let i = 0; i <= days; i++) {
        const day = format(subDays(new Date(), i), 'MMM dd');
        dailyData[day] = 0;
    }

    views.forEach(v => {
        const day = format(v.createdAt, 'MMM dd');
        if (dailyData[day] !== undefined) {
            dailyData[day]++;
        }
    });

    return Object.entries(dailyData)
        .map(([date, views]) => ({ date, views }))
        .reverse();
}

export async function getDeviceStats(days: number = 7) {
    const startDate = startOfDay(subDays(new Date(), days));

    const stats = await prisma.pageView.groupBy({
        by: ['deviceType'],
        where: { createdAt: { gte: startDate } },
        _count: { deviceType: true },
    });

    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

    return stats.map((s, i) => ({
        name: s.deviceType || 'Unknown',
        value: s._count.deviceType,
        color: COLORS[i % COLORS.length],
    }));
}


export async function getPageAnalytics(days: number = 7) {
    const startDate = startOfDay(subDays(new Date(), days));
    const ALLOWED_PATHS = ["/", "/contact", "/about-us", "/pricing"];

    // Fetch all page views for the period to calculate unique visitors accurately
    const pageViews = await prisma.pageView.findMany({
        where: {
            createdAt: { gte: startDate },
            path: { in: ALLOWED_PATHS }
        },
        select: {
            path: true,
            visitorId: true,
        }
    });

    // Group by path and count unique visitors using a Set
    const pathStats: Record<string, { views: number; visitors: Set<string> }> = {};

    pageViews.forEach((pv: { path: string; visitorId: string | null }) => {
        if (!pathStats[pv.path]) {
            pathStats[pv.path] = { views: 0, visitors: new Set() };
        }
        pathStats[pv.path].views++;
        if (pv.visitorId) {
            pathStats[pv.path].visitors.add(pv.visitorId);
        }
    });

    return Object.entries(pathStats)
        .map(([path, stats]) => ({
            path,
            views: stats.views,
            uniqueVisitors: stats.visitors.size,
        }))
        .sort((a, b) => b.views - a.views);
}
