"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, ArrowRight, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function FounderSection() {
    return (
        <section className="py-20 relative overflow-hidden bg-background">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">

                    {/* Image / Content Left */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-5/12 relative"
                    >
                        <div className="relative aspect-3/4 w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-800">
                            {/* Placeholder for Founder Image - Using a gradient/icon fallback for now */}
                            <div className="absolute inset-0 bg-linear-to-br from-slate-200 to-slate-300 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center">
                                <User className="w-32 h-32 text-slate-400 dark:text-zinc-600" />
                            </div>

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                            <div className="absolute bottom-8 left-8 right-8 text-white">
                                <h3 className="text-2xl font-bold mb-1">Abhinav Kumar</h3>
                                <p className="text-emerald-300 font-medium tracking-wide text-sm uppercase">Founder & Visionary</p>
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="absolute -bottom-6 -right-6 lg:right-0 bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-xl border border-emerald-100 dark:border-emerald-900/30 max-w-[200px]"
                        >
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                                    <Trophy className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Awarded</p>
                                    <p className="font-bold text-sm leading-tight text-foreground">Startup Winner 2025</p>
                                    <p className="text-[10px] text-muted-foreground mt-1">Bihar Entrepreneurship Association</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Content Right */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-7/12"
                    >
                        <Badge className="mb-6 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 border-none px-4 py-1.5 text-sm font-medium rounded-full">
                            Meet the Founder
                        </Badge>

                        <h2 className="text-3xl md:text-5xl font-bold mb-8 text-foreground leading-tight">
                            Building Trust Through <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-500">Execution & Excellence</span>
                        </h2>

                        <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                            <p>
                                <span className="text-foreground font-semibold">Abhinav Kumar</span> is an award-winning entrepreneur from Rajendra Nagar, Patna, recognized for his ability to build sustainable businesses with a focus on operational excellence and customer trust.
                            </p>

                            <p>
                                His entrepreneurial journey began with <span className="font-medium text-emerald-600 dark:text-emerald-400">Tea Mount</span>, a consumer brand that became a symbol of disciplined growth. This success demonstrated his capability to transform ideas into revenue-generating ventures.
                            </p>

                            <div className="pl-6 border-l-4 border-emerald-500/30 my-8 italic text-foreground/80 bg-emerald-50/50 dark:bg-emerald-900/10 p-4 rounded-r-xl">
                                "The future of healthcare lies in secure, connected, and patient-centric digital systems. Swasthify is our commitment to making that future a reality."
                            </div>

                            <p>
                                Now, as the founder of <span className="font-bold text-foreground">Swasthify</span>, Abhinav is on a mission to remove healthcare inefficiencies by combining technology with accessibility. His vision is to simplify how patients and doctors connect, creating a seamless ecosystem for everyone.
                            </p>
                        </div>

                        <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Connect with Abhinav</p>
                                <div className="flex gap-4">
                                    {/* Social placeholders could go here */}
                                    <div className="h-2 w-20 bg-emerald-500/20 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
