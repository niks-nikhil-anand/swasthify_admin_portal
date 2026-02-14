"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface PageHeroProps {
    badge?: string;
    title: string;
    description: string;
}

export function PageHero({ badge, title, description }: PageHeroProps) {
    return (
        <section className="relative w-full py-16 md:py-32 overflow-hidden bg-primary/5">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-background to-primary/5 opacity-50" />
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10"
            />

            <div className="container mx-auto px-4 relative z-10 text-center">
                {badge && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border-primary/20 font-medium mb-6">
                            {badge}
                        </Badge>
                    </motion.div>
                )}

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-4xl md:text-7xl font-bold tracking-tight mb-6"
                >
                    {title}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                >
                    {description}
                </motion.p>
            </div>
        </section>
    );
}
