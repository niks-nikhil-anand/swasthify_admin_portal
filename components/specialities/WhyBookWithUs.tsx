"use client";

import { Home, ShieldCheck, UserCheck } from "lucide-react";
import { motion } from "framer-motion";

export function WhyBookWithUs() {
    const features = [
        {
            icon: <UserCheck className="h-8 w-8 md:h-10 md:w-10 text-blue-500" />,
            title: "Expert Doctors & Verified Labs",
            description: "Consult with top-tier specialists or get NABL certified reports from trusted labs.",
            bg: "bg-blue-100 dark:bg-blue-900/20",
            borderColor: "group-hover:border-blue-500/30",
            shadowColor: "group-hover:shadow-blue-500/10"
        },
        {
            icon: <Home className="h-8 w-8 md:h-10 md:w-10 text-emerald-500" />,
            title: "Safe Home Sample Collection",
            description: "Experience hassle-free diagnostics with safe and professional home sample pick-up.",
            bg: "bg-emerald-100 dark:bg-emerald-900/20",
            borderColor: "group-hover:border-emerald-500/30",
            shadowColor: "group-hover:shadow-emerald-500/10"
        },
        {
            icon: <ShieldCheck className="h-8 w-8 md:h-10 md:w-10 text-purple-500" />,
            title: "Secure & Digital Reports",
            description: "Access your 100% private and accurate health records anytime, anywhere online.",
            bg: "bg-purple-100 dark:bg-purple-900/20",
            borderColor: "group-hover:border-purple-500/30",
            shadowColor: "group-hover:shadow-purple-500/10"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6
            }
        }
    };

    return (
        <section className="hidden md:block relative w-full py-16 md:py-24 px-4 md:px-6 bg-background overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="container relative z-10 mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium border border-emerald-200 dark:border-emerald-800"
                    >
                        Our Commitment
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-foreground max-w-3xl"
                    >
                        Why Choose <span className="text-emerald-600 dark:text-emerald-400">Swasthify</span> for Your Health?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-muted-foreground text-lg md:text-xl max-w-2xl"
                    >
                        We combine expert clinical care with cutting-edge technology to make healthcare accessible, reliable, and convenient.
                    </motion.p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 lg:gap-10"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -10 }}
                            className={`group relative flex flex-col items-center p-6 md:p-10 rounded-3xl md:rounded-[3rem] bg-card/40 backdrop-blur-xl border border-border/50 hover:bg-card/60 transition-all duration-500 overflow-hidden ${feature.borderColor} hover:shadow-2xl ${feature.shadowColor} ${index === 2 ? "col-span-2 md:col-span-1" : "col-span-1"}`}
                        >
                            {/* Card Background Glow */}
                            <div className="absolute -inset-1 bg-linear-to-b from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            <div className={`relative z-10 p-5 md:p-8 rounded-2xl ${feature.bg} mb-4 md:mb-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                                <div className="relative">
                                    <div className="absolute -inset-4 bg-inherit rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                                    {feature.icon}
                                </div>
                            </div>

                            <h3 className="relative z-10 font-bold text-base md:text-2xl text-foreground mb-2 md:mb-3 text-center transition-colors duration-300">
                                {feature.title}
                            </h3>
                            <p className={`relative z-10 text-center text-muted-foreground text-xs md:text-lg leading-relaxed px-1 ${index === 2 ? "max-w-md" : ""}`}>
                                {feature.description}
                            </p>

                            <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="h-1 w-12 bg-emerald-500 rounded-full" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
