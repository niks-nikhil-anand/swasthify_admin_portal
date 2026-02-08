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
            by: ['sessionId'],
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

export async function getCampaignStats(days: number = 7) {
    const startDate = startOfDay(subDays(new Date(), days));

    const [views, clicks] = await Promise.all([
        prisma.pageView.groupBy({
            by: ['campaignId'],
            where: {
                createdAt: { gte: startDate },
                campaignId: { not: null },
            },
            _count: { campaignId: true },
        }),
        prisma.analyticsEvent.groupBy({
            by: ['campaignId'],
            where: {
                createdAt: { gte: startDate },
                eventType: 'campaign_click',
                campaignId: { not: null },
            },
            _count: { campaignId: true },
        }),
    ]);

    // Combine data
    const statsMap: Record<string, { views: number; clicks: number }> = {};

    views.forEach(v => {
        if (v.campaignId) {
            statsMap[v.campaignId] = { views: v._count.campaignId, clicks: 0 };
        }
    });

    clicks.forEach(c => {
        if (c.campaignId && statsMap[c.campaignId]) {
            statsMap[c.campaignId].clicks = c._count.campaignId;
        }
    });

    return Object.entries(statsMap).map(([id, data]) => ({
        id,
        views: data.views,
        clicks: data.clicks,
        ctr: data.views > 0 ? ((data.clicks / data.views) * 100).toFixed(1) : "0",
    })).sort((a, b) => b.views - a.views).slice(0, 10);
}

export async function getEngagementStats(days: number = 7) {
    const startDate = startOfDay(subDays(new Date(), days));

    const scrollEvents = await prisma.analyticsEvent.groupBy({
        by: ['eventValue'],
        where: {
            createdAt: { gte: startDate },
            eventType: 'scroll_depth',
        },
        _count: { eventValue: true },
    });

    return scrollEvents.map(s => ({
        depth: s.eventValue,
        count: s._count.eventValue,
    })).sort((a, b) => {
        const valA = parseInt(a.depth?.replace('%', '') || '0');
        const valB = parseInt(b.depth?.replace('%', '') || '0');
        return valA - valB;
    });
}

export async function getPageAnalytics(days: number = 7) {
    const startDate = startOfDay(subDays(new Date(), days));

    const stats = await prisma.pageView.groupBy({
        by: ['path'],
        where: { createdAt: { gte: startDate } },
        _count: {
            path: true,
            sessionId: true,
        },
        orderBy: {
            _count: {
                path: 'desc',
            },
        },
    });

    return stats.map(s => ({
        path: s.path,
        views: s._count?.path || 0,
        uniqueVisitors: s._count?.sessionId || 0,
    }));
}
