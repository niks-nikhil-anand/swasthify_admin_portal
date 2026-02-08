"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const ALLOWED_PATHS = ["/", "/contact", "/about-us", "/pricing"];

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const sessionIdRef = useRef<string | null>(null);
    const visitorIdRef = useRef<string | null>(null);
    const scrollDepthRef = useRef<Set<number>>(new Set());
    const startTimeRef = useRef<number>(Date.now());

    useEffect(() => {
        // Only track if pathname is in alphabetical allowed paths
        const isAllowed = ALLOWED_PATHS.includes(pathname);
        if (!isAllowed) return;

        // Initialize Session ID (per session)
        if (!sessionIdRef.current) {
            sessionIdRef.current = Math.random().toString(36).substring(2, 15);
        }

        // Initialize Visitor ID (persistent)
        if (!visitorIdRef.current) {
            let vid = localStorage.getItem("swasthify_visitor_id");
            if (!vid) {
                vid = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
                localStorage.setItem("swasthify_visitor_id", vid);
            }
            visitorIdRef.current = vid;
        }

        // Track Page View
        const getCampaignInfo = (path: string) => {
            const doctorMatch = path.match(/^\/doctors\/([^\/]+)/);
            const labMatch = path.match(/^\/labs\/([^\/]+)/);
            if (doctorMatch) return { campaignId: doctorMatch[1], metadata: { type: "doctor" } };
            if (labMatch) return { campaignId: labMatch[1], metadata: { type: "lab" } };
            return { campaignId: null, metadata: {} };
        };

        const campaignInfo = getCampaignInfo(pathname);
        trackPageView(pathname, campaignInfo.campaignId, campaignInfo.metadata);

        // Track Scroll Depth
        const handleScroll = (): void => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight <= 0) return;

            const scrollTop = window.scrollY;
            const progress = Math.round((scrollTop / scrollHeight) * 100);

            [25, 50, 75, 100].forEach((depth) => {
                if (progress >= depth && !scrollDepthRef.current.has(depth)) {
                    scrollDepthRef.current.add(depth);
                    trackEvent("scroll_depth", `${depth}%`);
                }
            });
        };

        window.addEventListener("scroll", handleScroll);

        // Track Time on Page (beforeunload)
        const handleBeforeUnload = () => {
            const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
            trackEvent("time_on_page", `${duration}s`);
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [pathname]);

    const trackPageView = async (path: string, campaignId?: string | null, metadata?: any) => {
        try {
            await fetch("/api/analytics/collect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "pageview",
                    data: {
                        sessionId: sessionIdRef.current,
                        visitorId: visitorIdRef.current,
                        path,
                        referrer: typeof document !== "undefined" ? document.referrer : "",
                        campaignId,
                        metadata,
                    },
                }),
            });
        } catch (error) {
            console.error("Failed to track pageview:", error);
        }
    };

    const trackEvent = async (eventType: string, eventValue: string, campaignId?: string | null, metadata?: any) => {
        try {
            await fetch("/api/analytics/collect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "event",
                    data: {
                        sessionId: sessionIdRef.current,
                        visitorId: visitorIdRef.current,
                        eventType,
                        eventValue,
                        path: pathname,
                        campaignId,
                        metadata,
                    },
                }),
            });
        } catch (error) {
            console.error("Failed to track event:", error);
        }
    };

    return null;
}
