"use client";

import React, { useEffect, useState } from "react";
import { LabCampaignCard, LabCampaign } from "./LabCampaignCard";
import { LabCampaignCardSkeleton } from "./LabCampaignCardSkeleton";
import { Button } from "@/components/ui/button";
import { ChevronRight, FlaskConical } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function LabSection() {
    const [campaigns, setCampaigns] = useState<LabCampaign[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLabs = async () => {
            try {
                const response = await fetch("/api/public/campaigns?source=lab&limit=3");
                if (!response.ok) throw new Error("Failed to fetch lab tests");
                const result = await response.json();
                setCampaigns(Array.isArray(result) ? result : result.data);
            } catch (error) {
                console.error("Error fetching lab tests:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLabs();
    }, []);

    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-3 text-center md:text-left"
                    >
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">
                            Book a <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 rounded-md">Lab Test</span> from Home
                        </h2>
                        <p className="text-muted-foreground text-lg md:text-xl">
                            Get certified diagnostic services and health checkups
                        </p>
                    </motion.div>
                    <Link href="/labs">
                        <Button variant="ghost" className="group gap-2 text-primary font-semibold hover:bg-primary/5 shadow-sm">
                            See All Lab Tests
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <LabCampaignCardSkeleton key={i} />
                        ))}
                    </div>
                ) : campaigns.length > 0 ? (
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {campaigns.slice(0, 3).map((campaign) => (
                                <LabCampaignCard key={campaign.id} campaign={campaign} />
                            ))}
                        </div>
                        <div className="flex justify-center">
                            <Link href="/labs">
                                <Button size="lg" variant="outline" className="rounded-full px-8 font-semibold hover:bg-primary hover:text-white transition-all duration-300">
                                    Show more lab tests
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 bg-background rounded-2xl border border-dashed border-muted-foreground/20">
                        <FlaskConical className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground">No featured lab tests available</h3>
                        <p className="text-muted-foreground mt-2">
                            Check back later or browse all lab campaigns.
                        </p>
                        <Link href="/labs" className="mt-6 inline-block">
                            <Button variant="outline">Browse All Labs</Button>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
