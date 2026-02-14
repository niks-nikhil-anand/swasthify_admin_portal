"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Phone, Calendar, ArrowRight } from "lucide-react";

export function SpecialitiesCTA() {
    return (
        <section className="py-24 px-4">
            <div className="container mx-auto">
                <motion.div
                    className="relative overflow-hidden bg-primary rounded-[3rem] p-12 md:p-24 text-center text-primary-foreground shadow-2xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-white/10 blur-[100px] rounded-full" />
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-emerald-500/20 blur-[100px] rounded-full" />

                    <div className="relative z-10 max-w-4xl mx-auto space-y-10">
                        <h2 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-tight">
                            Can't find what you're looking for?
                        </h2>
                        <p className="text-xl md:text-2xl text-primary-foreground/90 font-medium">
                            Our medical experts are here to help you choose the right doctor or diagnostic plan. Free consultation on choosing the right service.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
                            <Button size="lg" className="h-16 px-12 rounded-2xl bg-white text-primary hover:bg-white/90 text-xl font-bold shadow-2xl group transition-all">
                                <Calendar className="mr-3 w-6 h-6" /> Talk to an Expert
                                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </Button>
                            <Button size="lg" variant="outline" className="h-16 px-12 rounded-2xl border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 text-xl font-bold backdrop-blur-md">
                                <Phone className="mr-3 w-6 h-6" /> Call Now
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
