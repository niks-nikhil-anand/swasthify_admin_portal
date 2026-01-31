"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function AbhaIntegration() {
    return (
        <section className="py-24 bg-linear-to-br from-primary/5 via-white to-accent/5 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Column: Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 order-2 lg:order-1"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm shadow-sm"
                        >
                            <span className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                Digital Health Revolution
                            </span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.7 }}
                            className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight"
                        >
                            Your <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">ABHA ID</span> is your key to smarter healthcare.
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.7 }}
                            className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed"
                        >
                            Link your ABHA, book trusted doctors, and manage lab reports securely. Expert healthcare is just a click away.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.7 }}
                            className="pt-4"
                        >
                            <Button size="lg" className="rounded-full px-8 py-6 text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5" disabled>
                                Coming Soon
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Right Column: Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className="relative mx-auto w-full max-w-md lg:max-w-none order-1 lg:order-2"
                    >
                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/50 bg-white/50 backdrop-blur-sm aspect-video lg:aspect-[4/3] transform hover:scale-[1.02] transition-transform duration-700">
                            <Image
                                src="/abha-illustration.png"
                                alt="ABHA Digital Health Card and Medical Records"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-tr from-primary/10 to-transparent pointer-events-none" />
                        </div>
                        {/* Decorative Elements */}
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-12 -right-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50 -z-10"
                        />
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 0] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-12 -left-12 w-64 h-64 bg-accent/20 rounded-full blur-3xl opacity-50 -z-10"
                        />
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
