"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface Speciality {
    id: string;
    title: string;
    price: string;
    image: string;
    color: string;
    type: string;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { stiffness: 50 } }
};

// Skeleton card shown while loading
function SkeletonCard() {
    return (
        <div className="bg-card/60 backdrop-blur-md rounded-[2rem] border border-border/50 flex flex-col items-center text-center p-4 md:p-8 h-full animate-pulse">
            <div className="w-16 h-16 md:w-32 md:h-32 rounded-full bg-muted mb-2 md:mb-4" />
            <div className="h-4 w-24 bg-muted rounded mb-1" />
            <div className="h-3 w-16 bg-muted rounded" />
        </div>
    );
}

export function Specialities() {
    const [specialities, setSpecialities] = useState<Speciality[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSpecialities() {
            try {
                const res = await fetch("/api/public/specializations?limit=6");
                if (!res.ok) throw new Error("Failed to fetch");
                const data: Speciality[] = await res.json();
                setSpecialities(data);
            } catch (err) {
                console.error("Failed to load specialities:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchSpecialities();
    }, []);

    return (
        <section className="overflow-hidden bg-background pb-24 pt-20 md:pb-36 md:pt-28">
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
                            Wide Range of <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 rounded-md">Medical Specialities</span>
                        </h2>
                        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
                            Access top-tier healthcare across 25+ specialities. Expert doctors, seamless digital consultations, and personalized care plans.
                        </p>
                    </motion.div>
                    <Link href="/specialities" className="hidden md:block">
                        <Button variant="ghost" className="group gap-2 text-primary font-semibold hover:bg-primary/5 shadow-sm">
                            See All Specialities
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : specialities.length === 0 ? (
                    <p className="text-center text-muted-foreground py-12">No specialities available at the moment.</p>
                ) : (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-6"
                    >
                        {specialities.map((speciality, index) => (
                            <Link href="/login" key={speciality.id ?? index}>
                                <motion.div
                                    variants={item}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className="group relative flex h-full min-h-[238px] cursor-pointer flex-col items-center overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/60 p-4 text-center shadow-sm backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:bg-card hover:shadow-[0_24px_55px_rgba(16,185,129,0.14)] md:min-h-[290px] md:rounded-[2rem] md:p-6"
                                >
                                    <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-primary/8 to-transparent" />
                                    <div className={`relative mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 border-background shadow-lg ring-1 ring-primary/15 transition-all duration-500 group-hover:scale-105 group-hover:ring-4 group-hover:ring-primary/15 md:mb-5 md:h-28 md:w-28 ${speciality.color}`}>
                                        <div className="absolute inset-0 rounded-full bg-linear-to-tr from-white/60 dark:from-background/40 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity z-10" />
                                        <div className="absolute inset-0 rounded-full scale-0 group-hover:scale-150 bg-emerald-500/5 blur-2xl transition-transform duration-700 -z-10" />
                                        <Image
                                            src={speciality.image}
                                            alt={speciality.title}
                                            fill
                                            className="object-cover rounded-full"
                                        />
                                    </div>

                                    <h3 className="mb-2 line-clamp-2 px-1 text-xs font-bold text-foreground transition-colors group-hover:text-primary md:text-base">
                                        {speciality.title}
                                    </h3>

                                    <div className="mb-4 rounded-full bg-muted/70 px-3 py-1 text-[10px] text-muted-foreground md:text-xs">
                                        Starts from <span className="font-bold text-foreground text-xs md:text-sm">{speciality.price}</span>
                                    </div>

                                    <span className="mt-auto flex items-center rounded-full bg-primary/10 px-3 py-1.5 text-[10px] font-bold text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground md:px-4 md:py-2 md:text-xs">
                                        View doctors <ChevronRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5 md:h-3.5 md:w-3.5" />
                                    </span>
                                </motion.div>
                            </Link>
                        ))}
                    </motion.div>
                )}

                <div className="mt-12 text-center md:hidden">
                    <Link href="/specialities">
                        <Button variant="outline" className="rounded-full px-8 font-semibold hover:bg-primary hover:text-white transition-all duration-300 shadow-lg shadow-primary/20">
                            See all specialities <ChevronRight className="w-5 h-5 ml-1" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
