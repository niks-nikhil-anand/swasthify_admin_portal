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
                    <div className="w-full lg:w-5/12 flex flex-col gap-6 justify-center">
                        {/* Award Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl border border-emerald-100 dark:border-emerald-900/30 relative overflow-hidden group hover:shadow-2xl transition-all"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[100px] transition-transform group-hover:scale-110" />

                            <div className="relative z-10 flex flex-col">
                                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                                    <Trophy className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-1">Awarded</h3>
                                <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Startup Winner 2025</p>
                                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Bihar Entrepreneurship Association</p>
                            </div>
                        </motion.div>

                        {/* Tea Mount Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl border border-emerald-100 dark:border-emerald-900/30 relative overflow-hidden group hover:shadow-2xl transition-all"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[100px] transition-transform group-hover:scale-110" />

                            <div className="relative z-10 flex flex-col">
                                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 font-bold text-xl group-hover:scale-110 transition-transform">
                                    TM
                                </div>
                                <h3 className="text-xl font-bold mb-3">Tea Mount</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Tea Mount is a consumer brand that has become a symbol of disciplined and sustainable growth.
                                </p>
                            </div>
                        </motion.div>
                    </div>

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
