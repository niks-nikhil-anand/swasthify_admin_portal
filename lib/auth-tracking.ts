import { db } from "./db";
import { headers } from "next/headers";

export type AuthLogType = "SIGN_IN" | "SIGN_UP";

export async function logAuthEvent(userId: string, type: AuthLogType) {
    try {
        const headersList = await headers();
        const userAgent = headersList.get("user-agent") || "";
        const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || headersList.get("x-real-ip") || "";

        // Extract info from User-Agent
        const uaInfo = parseUserAgent(userAgent);

        // Extract location info from common deployment headers (Vercel/Cloudflare etc)
        const country = headersList.get("x-vercel-ip-country") || headersList.get("cf-ipcountry") || "";
        const region = headersList.get("x-vercel-ip-country-region") || "";
        const city = headersList.get("x-vercel-ip-city") || "";
        const timezone = headersList.get("x-vercel-ip-timezone") || "";
        const ipCountry = country; // Using country as ip_country as requested

        await db.authLog.create({
            data: {
                userId,
                type,
                deviceType: uaInfo.deviceType,
                os: uaInfo.os,
                osVersion: uaInfo.osVersion,
                browser: uaInfo.browser,
                browserVersion: uaInfo.browserVersion,
                country,
                region,
                city,
                timezone,
                ipCountry,
                ipAddress,
            }
        });
    } catch (error) {
        console.error("Error logging auth event:", error);
        // Don't throw error to prevent auth from failing due to logging failure
    }
}

function parseUserAgent(ua: string) {
    let deviceType = "desktop";
    let os = "Unknown";
    let osVersion = "Unknown";
    let browser = "Unknown";
    let browserVersion = "Unknown";

    // Device Type Detection
    if (/mobile/i.test(ua)) deviceType = "mobile";
    else if (/tablet/i.test(ua) || /ipad/i.test(ua)) deviceType = "tablet";

    // OS Detection
    if (/android/i.test(ua)) {
        os = "Android";
        const match = ua.match(/android\s([0-9\._]+)/i);
        if (match) osVersion = match[1];
    } else if (/iphone|ipad|ipod/i.test(ua)) {
        os = "iOS";
        const match = ua.match(/OS\s([0-9\._]+)/i);
        if (match) osVersion = match[1].replace(/_/g, ".");
    } else if (/windows/i.test(ua)) {
        os = "Windows";
        const match = ua.match(/Windows\sNT\s([0-9\._]+)/i);
        if (match) {
            const versionMap: Record<string, string> = { "10.0": "10", "6.3": "8.1", "6.2": "8", "6.1": "7" };
            osVersion = versionMap[match[1]] || match[1];
        }
    } else if (/macintosh|mac\sos\sx/i.test(ua)) {
        os = "macOS";
        const match = ua.match(/Mac\sOS\sX\s([0-9\._]+)/i);
        if (match) osVersion = match[1].replace(/_/g, ".");
    }

    // Browser Detection
    if (/edg/i.test(ua)) {
        browser = "Edge";
        const match = ua.match(/edg\/([0-9\.]+)/i);
        if (match) browserVersion = match[1];
    } else if (/chrome/i.test(ua) && !/chromium/i.test(ua)) {
        browser = "Chrome";
        const match = ua.match(/chrome\/([0-9\.]+)/i);
        if (match) browserVersion = match[1];
    } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
        browser = "Safari";
        const match = ua.match(/version\/([0-9\.]+)/i);
        if (match) browserVersion = match[1];
    } else if (/firefox/i.test(ua)) {
        browser = "Firefox";
        const match = ua.match(/firefox\/([0-9\.]+)/i);
        if (match) browserVersion = match[1];
    }

    return { deviceType, os, osVersion, browser, browserVersion };
}
