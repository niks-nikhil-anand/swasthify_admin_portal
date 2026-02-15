"use client";

import React, { useEffect, useState } from "react";
import { CampaignCard, Campaign } from "./CampaignCard";
import { CampaignCardSkeleton } from "./CampaignCardSkeleton";
import { Button } from "@/components/ui/button";
import { ChevronRight, Stethoscope } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function DoctorSection() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch("/api/public/campaigns?source=doctor&limit=3");
                if (!response.ok) throw new Error("Failed to fetch doctors");
                const result = await response.json();
                setCampaigns(Array.isArray(result) ? result : result.data);
            } catch (error) {
                console.error("Error fetching doctors:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    return (
        <section className="py-12 md:py-24 bg-transparent relative overflow-hidden">
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
                            Book an Appointment for <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 rounded-md">In-Clinic Consultation</span>
                        </h2>
                        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
                            Find experienced doctors across all specialties for personalized in-person care.
                        </p>
                    </motion.div>
                    <Link href="/doctors">
                        <Button variant="ghost" className="group gap-2 text-primary font-semibold hover:bg-primary/5 shadow-sm">
                            See All Doctors
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <CampaignCardSkeleton key={i} />
                        ))}
                    </div>
                ) : campaigns.length > 0 ? (
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {campaigns.slice(0, 3).map((campaign) => (
                                <CampaignCard key={campaign.id} campaign={campaign} />
                            ))}
                        </div>
                        <div className="flex justify-center">
                            <Link href="/doctors">
                                <Button size="lg" variant="outline" className="rounded-full px-8 font-semibold hover:bg-primary hover:text-white transition-all duration-300">
                                    Show more doctors
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-16 bg-card/40 backdrop-blur-md rounded-[3rem] border border-dashed border-emerald-500/20 max-w-2xl mx-auto">
                        <Stethoscope className="w-16 h-16 text-emerald-500/20 mx-auto mb-6" />
                        <h3 className="text-xl font-bold text-foreground">No featured doctors available</h3>
                        <p className="text-muted-foreground mt-2 px-8">
                            We're currently updating our doctor listings. Check back later or browse all doctors.
                        </p>
                        <Link href="/doctors" className="mt-8 inline-block">
                            <Button variant="outline" className="rounded-full px-8 shadow-lg shadow-emerald-500/5">Browse All Doctors</Button>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
