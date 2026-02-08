import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { parseUserAgent } from "@/lib/analytics-utils";

const ALLOWED_PATHS = ["/", "/contact", "/about-us", "/pricing"];

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { type, data } = body;

        // Path filtering safeguard
        const path = data.path || "/";
        if (!ALLOWED_PATHS.includes(path)) {
            return NextResponse.json({ success: true, message: "Path skipped" });
        }

        const headersList = await headers();
        const userAgent = headersList.get("user-agent") || "";
        const uaInfo = parseUserAgent(userAgent);

        // Extract location info from headers (Vercel/CF)
        const country = headersList.get("x-vercel-ip-country") || headersList.get("cf-ipcountry") || data.country || "Unknown";
        const city = headersList.get("x-vercel-ip-city") || data.city || "Unknown";

        if (type === "pageview") {
            await prisma.pageView.create({
                data: {
                    sessionId: data.sessionId,
                    userId: data.userId,
                    path: path,
                    referrer: data.referrer,
                    deviceType: uaInfo.deviceType,
                    os: uaInfo.os,
                    browser: uaInfo.browser,
                    country: country,
                    city: city,
                    campaignId: data.campaignId,
                    metadata: data.metadata || {},
                },
            });
        } else if (type === "event") {
            await prisma.analyticsEvent.create({
                data: {
                    sessionId: data.sessionId,
                    userId: data.userId,
                    eventType: data.eventType,
                    eventValue: data.eventValue?.toString(),
                    path: path,
                    campaignId: data.campaignId,
                    metadata: data.metadata || {},
                },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Analytics collection error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
