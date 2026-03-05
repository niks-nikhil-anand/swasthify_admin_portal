
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { LabCampaign } from "@/app/(root)/labs/types";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

function SkeletonCard() {
    return (
        <div className="animate-pulse rounded-[2rem] border-2 border-border bg-card overflow-hidden flex flex-col">
            <div className="h-28 md:h-40 flex items-center justify-center pt-6">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted" />
            </div>
            <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
                <div className="h-3 bg-muted rounded w-1/2 mx-auto" />
                <div className="h-3 bg-muted rounded w-1/3 mx-auto" />
                <div className="h-8 bg-muted rounded-xl mt-auto" />
            </div>
        </div>
    );
}

/** Format price to Indian rupee string */
function formatPrice(price: number, discountPct: number): { price: string; original: string; discount: string } {
    const original = price;
    const discounted = discountPct > 0 ? Math.round(price * (1 - discountPct / 100)) : price;
    return {
        price: `₹${discounted.toLocaleString("en-IN")}`,
        original: discountPct > 0 ? `₹${original.toLocaleString("en-IN")}` : "",
        discount: discountPct > 0 ? `${discountPct}% OFF` : "",
    };
}

export function TestSpecialities() {
    const [campaigns, setCampaigns] = useState<LabCampaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(6);
    const [isPatient, setIsPatient] = useState(false);

    useEffect(() => {
        setIsPatient(document.cookie.includes("PATIENT="));

        async function fetchLabCampaigns() {
            try {
                const res = await fetch("/api/public/campaigns?source=lab&limit=50");
                if (!res.ok) throw new Error("Failed to fetch lab campaigns");
                const result = await res.json();
                const data: LabCampaign[] = Array.isArray(result) ? result : result.data;
                setCampaigns(data);
            } catch (err) {
                console.error("Failed to load diagnostic tests:", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchLabCampaigns();
    }, []);

    const showMore = () => {
        setVisibleCount((prev) => Math.min(prev + 6, campaigns.length));
    };

    const visibleCampaigns = campaigns.slice(0, visibleCount);

    return (
        <section className="py-24 bg-background overflow-hidden">
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
                            Diagnostic <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 rounded-md">Individual Tests</span>
                        </h2>
                        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
                            Accurate results for your health concerns. NABL certified labs, home sample collection, and digital reports.
                        </p>
                    </motion.div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : campaigns.length === 0 ? (
                    <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed border-muted-foreground/20">
                        <FlaskConical className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground">No diagnostic tests available</h3>
                        <p className="text-muted-foreground mt-2">Check back later or browse all lab campaigns.</p>
                        <Link href="/labs" className="mt-6 inline-block">
                            <Button variant="outline">Browse All Labs</Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
                        >
                            <AnimatePresence mode="popLayout">
                                {visibleCampaigns.map((campaign) => {
                                    const { price, original, discount } = formatPrice(
                                        campaign.price,
                                        campaign.discountPercentage ?? 0
                                    );
                                    const targetUrl = `/labs?query=${encodeURIComponent(campaign.name)}`;
                                    const href = isPatient ? targetUrl : `/login?redirect=${encodeURIComponent(targetUrl)}`;
                                    const labPhoto = campaign.lab?.profilePhoto;
                                    const imgSrc = labPhoto || "/images/specialities/general_physician_real.png";

                                    return (
                                        <motion.div
                                            key={campaign.id}
                                            layout
                                            variants={item}
                                            initial="hidden"
                                            animate="show"
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            whileHover={{ y: -8 }}
                                        >
                                            <Link href={href}>
                                                <Card className="relative overflow-hidden border-2 hover:border-emerald-500 transition-all duration-300 group h-full flex flex-col rounded-[1.5rem] md:rounded-[2rem] shadow-lg hover:shadow-2xl bg-card cursor-pointer">
                                                    {campaign.type && (
                                                        <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-emerald-600 text-white text-[8px] md:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 md:px-3 md:py-1 rounded-full z-10">
                                                            {campaign.type}
                                                        </div>
                                                    )}

                                                    <div className="relative h-28 md:h-40 w-full flex items-center justify-center pt-6">
                                                        <div className="w-24 h-24 md:w-32 md:h-32 relative bg-muted rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 overflow-hidden shadow-inner border-4 border-background">
                                                            <Image
                                                                src={imgSrc}
                                                                alt={campaign.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                            <div className="absolute inset-0 bg-linear-to-tr from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                    </div>

                                                    <CardHeader className="pt-4 md:pt-6 pb-2 md:pb-4 px-3 md:px-6 text-center">
                                                        <CardTitle className="text-sm md:text-lg font-bold leading-tight line-clamp-2 min-h-[40px] md:min-h-[48px] group-hover:text-emerald-600 transition-colors">
                                                            {campaign.name}
                                                        </CardTitle>
                                                    </CardHeader>

                                                    <CardContent className="px-3 md:px-6 py-2 md:py-4 flex-1">
                                                        <div className="flex flex-col items-center">
                                                            <p className="text-muted-foreground text-[10px] md:text-xs">Test starts from</p>
                                                            {original && (
                                                                <span className="text-muted-foreground line-through text-[10px] md:text-sm">{original}</span>
                                                            )}
                                                            <div className="flex items-center gap-1.5 md:gap-2">
                                                                <span className="text-lg md:text-2xl font-black text-foreground">{price}</span>
                                                                {discount && (
                                                                    <Badge className="text-[8px] md:text-[10px] font-bold px-1.5 py-0 h-4 md:h-5 bg-red-50 text-red-600 border-red-100 hover:bg-red-100 shadow-none">
                                                                        {discount}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </CardContent>

                                                    <CardFooter className="px-3 md:px-6 pb-4 md:pb-6 pt-0 mt-auto">
                                                        <Button className="w-full h-8 md:h-10 rounded-xl md:rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs md:text-sm font-bold shadow-md hover:scale-[1.02] transition-all">
                                                            Book Now
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </motion.div>

                        {visibleCount < campaigns.length && (
                            <div className="mt-16 text-center">
                                <Button
                                    onClick={showMore}
                                    variant="outline"
                                    className="rounded-full px-10 h-14 text-lg font-bold border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-600 transition-all group gap-2"
                                >
                                    <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                    Show More Tests
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
