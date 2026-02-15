"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, Activity, Fingerprint, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AbhaIntegration() {
    return (
        <section className="relative py-12 md:py-36 bg-background overflow-hidden">
            {/* Background Decorations - Enhanced Depth */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-emerald-500/3 rounded-full blur-[160px]" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/4 rounded-full blur-[140px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/2 rounded-full blur-[120px]" />

                {/* Refined Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[60px_60px] mask-[radial-gradient(ellipse_80%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            <div className="container relative z-10 mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-20 lg:gap-32">

                    {/* Left Side - Text Content with Glass Card Base */}
                    <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-10 order-2 lg:order-1 relative">
                        {/* Subtle decorative glow behind text */}
                        <div className="absolute -left-10 top-0 w-40 h-40 bg-emerald-400/10 blur-[80px] -z-10" />

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/7 text-emerald-600 dark:text-emerald-400 text-xs md:text-sm font-black uppercase tracking-[0.2em] border border-emerald-500/20 backdrop-blur-md shadow-2xl shadow-emerald-500/5"
                        >
                            <Sparkles className="w-3.5 h-3.5 fill-emerald-500/20" />
                            Digital Health Revolution
                        </motion.div>

                        <div className="space-y-6">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1, duration: 0.7 }}
                                className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-foreground leading-[1.05]"
                            >
                                Your <span className="relative inline-block">
                                    <span className="relative z-10 text-transparent bg-clip-text bg-linear-to-br from-emerald-500 via-emerald-600 to-blue-600 dark:from-emerald-400 dark:via-emerald-300 dark:to-blue-400 drop-shadow-sm">ABHA ID</span>
                                    <motion.span
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "100%" }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.8, duration: 1 }}
                                        className="absolute bottom-2 left-0 h-3 bg-emerald-500/10 -rotate-1 rounded-full -z-10"
                                    />
                                </span> <br className="hidden md:block" />
                                <span className="text-foreground/90">Gateway to Smart Health.</span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2, duration: 0.7 }}
                                className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl font-medium"
                            >
                                Connect your ABHA, consult doctors, and secure your reports. Build your unified digital health record for life-long accessibility.
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.7 }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full"
                        >
                            {[
                                { icon: ShieldCheck, text: "End-to-End Encryption", desc: "Your data stays private", color: "emerald" },
                                { icon: Activity, text: "Universal Portability", desc: "Access anywhere in India", color: "blue" },
                                { icon: Fingerprint, text: "Biometric Integration", desc: "Secure identity verified", color: "emerald" },
                                { icon: CheckCircle2, text: "NHA Government Verified", desc: "Fully compliant standards", color: "blue" }
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="flex items-start gap-4 p-5 rounded-[2rem] bg-card/30 backdrop-blur-2xl border border-border/40 hover:border-emerald-500/40 transition-all duration-500 group shadow-[0_8px_30px_rgb(0,0,0,0.02)]"
                                >
                                    <div className={`p-3 rounded-2xl transition-all ${feature.color === 'emerald'
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20 group-hover:ring-emerald-500"
                                        : "bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20 group-hover:ring-blue-500"
                                        }`}>
                                        <feature.icon className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="font-extrabold text-sm md:text-base text-foreground leading-tight">{feature.text}</span>
                                        <span className="text-[10px] md:text-xs text-muted-foreground mt-1 font-medium">{feature.desc}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.7 }}
                            className="pt-6 relative"
                        >
                            <Button size="lg" className="group rounded-full px-12 py-8 text-xl font-black shadow-2xl shadow-emerald-600/20 bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.05] transition-all relative overflow-hidden active:scale-95" disabled>
                                <span className="relative z-10 flex items-center gap-3">
                                    Coming Soon
                                </span>
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </Button>
                        </motion.div>
                    </div>

                    {/* Right Side - Enhanced Illustration Container */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full lg:w-1/2 flex justify-center order-1 lg:order-2"
                    >
                        {/* Layered Glow Rings */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] max-w-[600px] aspect-square rounded-full bg-linear-to-tr from-emerald-500/10 via-blue-500/5 to-transparent blur-[120px] opacity-60 animate-pulse" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] max-w-[400px] aspect-square rounded-full border border-emerald-500/10 animate-[spin_20s_linear_infinite]" />

                        <motion.div
                            animate={{
                                y: [0, -25, 0],
                                rotate: [0, 1.5, 0]
                            }}
                            transition={{
                                duration: 12,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="relative z-10 w-full max-w-[580px] group"
                        >
                            <div className="hidden md:block relative rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-[0_80px_100px_-30px_rgba(0,0,0,0.3)] ring-1 ring-white/10 p-2 md:p-3 bg-white/5 backdrop-blur-sm">
                                <div className="rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border border-emerald-500/20">
                                    <Image
                                        src="/abha-illustration.png"
                                        alt="ABHA Digital Healthcare Illustration"
                                        width={1000}
                                        height={1000}
                                        className="object-contain w-full h-auto transition-transform duration-1000 group-hover:scale-105 group-hover:rotate-1"
                                        priority
                                    />
                                </div>

                                {/* Overlay Glass Shine */}
                                <div className="absolute inset-0 bg-linear-to-tr from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            </div>

                            {/* Premium Floating Badges */}
                            <motion.div
                                animate={{ y: [0, -12, 0], x: [0, 5, 0] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -right-8 top-[15%] hidden md:flex items-center gap-4 bg-white/80 dark:bg-card/90 backdrop-blur-3xl border border-emerald-500/20 p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-emerald-500/20"
                            >
                                <div className="p-3 bg-emerald-500/20 rounded-2xl shadow-inner">
                                    <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-black text-xs text-foreground uppercase tracking-widest leading-none">Verified NHA</span>
                                    <span className="text-[10px] text-muted-foreground font-bold mt-1">NABL & ABDM Compliant</span>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 15, 0], x: [0, -8, 0] }}
                                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -left-10 bottom-[10%] hidden md:flex items-center gap-4 bg-white/80 dark:bg-card/90 backdrop-blur-3xl border border-blue-500/20 p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-blue-500/20"
                            >
                                <div className="p-3 bg-blue-500/20 rounded-2xl shadow-inner">
                                    <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-black text-xs text-foreground uppercase tracking-widest leading-none">Instant Sync</span>
                                    <span className="text-[10px] text-muted-foreground font-bold mt-1">Live Health Records</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
