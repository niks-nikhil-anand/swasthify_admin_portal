"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export function SpecialitiesHero() {
    return (
        <section className="w-full bg-linear-to-b from-primary/10 via-background to-background relative py-20 md:py-32 flex items-center justify-center overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/20 blur-3xl rounded-full opacity-50" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-emerald-500/10 blur-3xl rounded-full opacity-50" />

            <div className="container relative z-10 px-4 md:px-6">
                <div className="flex flex-col items-center space-y-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Badge variant="secondary" className="px-6 py-2 backdrop-blur-md bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 text-primary font-semibold shadow-xl hover:bg-white/50 transition-colors">
                            Complete Healthcare Solution
                        </Badge>
                    </motion.div>

                    <motion.div
                        className="space-y-4 max-w-4xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl text-foreground">
                            Expert Care & <span className="text-emerald-600 dark:text-emerald-400">Precision Diagnostics</span>
                        </h1>
                        <p className="mx-auto max-w-[800px] text-muted-foreground md:text-2xl font-medium leading-relaxed">
                            Consult with top specialists or book diagnostic tests from the comfort of your home. Quality healthcare is now just a click away.
                        </p>
                    </motion.div>

                    <motion.div
                        className="w-full max-w-2xl space-y-4 pt-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <div className="flex p-1 bg-background/60 backdrop-blur-xl rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-border/50 ring-8 ring-primary/5 focus-within:ring-primary/10 transition-all duration-500">
                            <form className="flex-1 flex items-center pr-1">
                                <div className="relative flex-1 group">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        className="pl-16 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-16 text-lg md:text-xl placeholder:text-muted-foreground/50"
                                        placeholder="Search doctors, specialities or tests..."
                                    />
                                </div>
                                <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl h-14 px-10 text-lg font-bold shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
                                    Search
                                </Button>
                            </form>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
                            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border shadow-sm">
                                <User className="w-4 h-4 text-blue-500" />
                                <span className="text-muted-foreground">Expert Doctors</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border shadow-sm">
                                <FlaskConical className="w-4 h-4 text-emerald-500" />
                                <span className="text-muted-foreground">Accurate Tests</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
