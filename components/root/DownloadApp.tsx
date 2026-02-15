"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Phone, ArrowRight, Download } from "lucide-react";

export function DownloadApp() {
    return (
        <section className=" relative py-21 md:py-32 bg-background overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] -translate-y-1/2" />
                <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px] -translate-y-1/2" />

                {/* Modern Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            <div className="container relative z-10 mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">

                    {/* Left Side - Mobile App Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full lg:w-1/2 justify-center hidden md:flex"
                    >
                        {/* Interactive Glow Ring */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[500px] aspect-square rounded-full bg-linear-to-tr from-emerald-500/20 via-blue-500/10 to-transparent blur-3xl opacity-50 animate-pulse" />

                        <motion.div
                            animate={{
                                y: [0, -20, 0],
                                rotateZ: [0, 1, 0]
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="relative z-10 w-full max-w-[450px]"
                        >
                            <Image
                                src="/app_mockup.png"
                                alt="Swasthify Mobile App Mockup"
                                width={600}
                                height={900}
                                className="object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] rounded-[3rem] w-full h-auto scale-110"
                                priority
                            />

                            {/* Floating Feature Badges */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                                className="absolute -right-4 top-1/4 hidden md:flex items-center gap-3 bg-card/80 backdrop-blur-xl border border-border/50 p-4 rounded-2xl shadow-2xl"
                            >
                                <div className="p-2 bg-emerald-500/20 rounded-lg">
                                    <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <span className="font-bold text-sm text-foreground">24/7 Consultation</span>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                                className="absolute -left-4 bottom-1/4 hidden md:flex items-center gap-3 bg-card/80 backdrop-blur-xl border border-border/50 p-4 rounded-2xl shadow-2xl"
                            >
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="font-bold text-sm text-foreground">Instant Reports</span>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Content */}
                    <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-bold border border-emerald-500/20"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Now available on Mobile
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-foreground leading-[1.1]"
                        >
                            Experience Healthcare <br className="hidden md:block" />
                            <span className="text-emerald-600 dark:text-emerald-400 drop-shadow-sm">At Your Fingertips</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl font-medium"
                        >
                            Download the Swasthify app to manage appointments, access digital health records, and consult with specialists anytime, anywhere.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="w-full max-w-md space-y-4"
                        >
                            <div className="group relative flex items-center p-1.5 bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl md:rounded-[1.5rem] focus-within:ring-2 focus-within:ring-emerald-500/50 transition-all shadow-2xl shadow-emerald-500/5">
                                <div className="flex items-center px-4 md:px-6 py-2 md:py-3 bg-muted/50 rounded-xl md:rounded-2xl border border-border/50 mr-2 shrink-0">
                                    <span className="text-foreground font-bold">+91</span>
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-base md:text-lg text-foreground placeholder:text-muted-foreground/60 w-full"
                                />
                                <button className="hidden sm:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl md:rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-emerald-600/20">
                                    Get Link <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                            <button className="sm:hidden w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg ring-4 ring-emerald-500/10">
                                Get Download Link <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-nowrap gap-2 md:gap-4 justify-center lg:justify-start pt-4"
                        >
                            <button className="flex items-center gap-2 md:gap-4 bg-foreground text-background px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-2xl hover:bg-foreground/90 transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-95 group shrink-0">
                                <Image src="/icons/playstore.png" alt="Play Store" width={28} height={28} className="w-6 h-6 md:w-7 md:h-7 object-contain" />
                                <div className="text-left">
                                    <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider opacity-60 whitespace-nowrap">Get it on</p>
                                    <p className="text-sm md:text-base font-black whitespace-nowrap">Google Play</p>
                                </div>
                            </button>
                            <button className="flex items-center gap-2 md:gap-4 bg-foreground text-background px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-2xl hover:bg-foreground/90 transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-95 group shrink-0">
                                <Image src="/icons/app-store.png" alt="App Store" width={28} height={28} className="w-6 h-6 md:w-7 md:h-7 object-contain" />
                                <div className="text-left">
                                    <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider opacity-60 whitespace-nowrap">Download on the</p>
                                    <p className="text-sm md:text-base font-black whitespace-nowrap">App Store</p>
                                </div>
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
