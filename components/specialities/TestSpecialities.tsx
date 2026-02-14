"use client";

import { motion } from "framer-motion";
import { Search, FlaskConical, Activity, Heart, Droplets, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const testCategories = [
    {
        title: "Fever & Infection",
        count: "15+ Tests",
        icon: <Zap className="w-8 h-8 text-orange-500" />,
        color: "bg-orange-50 dark:bg-orange-950/20",
    },
    {
        title: "Diabetes Care",
        count: "12+ Tests",
        icon: <Activity className="w-8 h-8 text-blue-500" />,
        color: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
        title: "Heart Health",
        count: "10+ Tests",
        icon: <Heart className="w-8 h-8 text-red-500" />,
        color: "bg-red-50 dark:bg-red-950/20",
    },
    {
        title: "Kidney Health",
        count: "8+ Tests",
        icon: <FlaskConical className="w-8 h-8 text-purple-500" />,
        color: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
        title: "Liver Health",
        count: "9+ Tests",
        icon: <Droplets className="w-8 h-8 text-emerald-500" />,
        color: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
        title: "Women's Health",
        count: "20+ Tests",
        icon: <Activity className="w-8 h-8 text-pink-500" />,
        color: "bg-pink-50 dark:bg-pink-950/20",
    },
];

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
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

export function TestSpecialities() {
    return (
        <section className="py-24 bg-muted/20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <motion.h2
                        className="text-3xl font-bold tracking-tight sm:text-5xl"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Diagnostic <span className="text-primary italic">Categories</span>
                    </motion.h2>
                    <motion.p
                        className="text-muted-foreground text-lg max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        Find the right tests by health concern. NABL certified labs, accurate results, and home sample collection.
                    </motion.p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {testCategories.map((category, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            whileHover={{ y: -8 }}
                            className="bg-card hover:bg-card/80 p-8 rounded-[2rem] border border-border shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
                        >
                            <div className="flex items-start justify-between">
                                <div className={`p-4 rounded-2xl ${category.color} mb-6 transition-transform duration-500 group-hover:scale-110 shadow-sm`}>
                                    {category.icon}
                                </div>
                                <Search className="w-6 h-6 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                {category.title}
                            </h3>
                            <p className="text-muted-foreground mb-6 font-medium">
                                {category.count}
                            </p>
                            <Button variant="ghost" className="p-0 hover:bg-transparent text-primary font-bold group-hover:translate-x-2 transition-transform">
                                Explore Tests <Zap className="w-4 h-4 ml-2 fill-primary" />
                            </Button>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
