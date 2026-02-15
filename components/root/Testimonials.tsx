"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Heart, Quote, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function Testimonials() {
    const testimonials = [
        {
            name: "Priya Sharma",
            role: "Patient",
            image: "/patient-a.png",
            content: "Swasthify made it so easy to find a specialist. The video consultation was seamless and I got my prescription immediately.",
            rating: 5,
            color: "emerald"
        },
        {
            name: "Rahul Mehta",
            role: "Patient",
            image: "/patient-b.png",
            content: "I love having all my family's health records in one place. Booking appointments is a breeze now.",
            rating: 5,
            color: "blue"
        },
        {
            name: "Anjali Gupta",
            role: "Patient",
            image: "/patient-c.png",
            content: "The best healthcare app I've used. Very user-friendly and the support team is super helpful.",
            rating: 5,
            color: "emerald"
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 40 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 100
            } as any
        }
    };

    return (
        <section className="relative py-10 md:py-24 bg-background overflow-hidden">
            {/* Background Decorations - Enhanced Depth */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-emerald-500/5 rounded-full blur-[160px]" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px]" />

                {/* Refined Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[60px_60px] mask-[radial-gradient(ellipse_80%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            <div className="container relative z-10 mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs md:text-sm font-black uppercase tracking-[0.2em] border border-emerald-500/20 backdrop-blur-md shadow-2xl shadow-emerald-500/5"
                    >
                        <Sparkles className="w-3.5 h-3.5 fill-emerald-500/20" />
                        Community Trust
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: 0.7 }}
                        className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-[1.1]"
                    >
                        Trusted by <span className="text-transparent bg-clip-text bg-linear-to-br from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400">Thousands</span> <br />
                        of Happy Patients.
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.7 }}
                        className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed"
                    >
                        Join the healthcare revolution and experience seamless, professional care from the comfort of your home.
                    </motion.p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-12 -mx-4 px-4 md:grid md:grid-cols-3 md:gap-10 md:overflow-visible md:pb-0 md:px-0 scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            whileHover={{ y: -12, transition: { duration: 0.4, ease: "easeOut" } }}
                            className="min-w-[85vw] md:min-w-0 snap-center flex"
                        >
                            <Card className="relative border-white/10 dark:border-white/5 shadow-2xl bg-card/40 backdrop-blur-3xl rounded-[3rem] w-full group overflow-hidden transition-all duration-500 hover:shadow-emerald-500/10 hover:border-emerald-500/20">
                                {/* Quote Icon Decoration */}
                                <div className="absolute top-8 right-8 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors">
                                    <Quote size={80} strokeWidth={1.5} />
                                </div>

                                <CardContent className="p-10 flex flex-col gap-8 h-full relative z-10">
                                    <div className="flex gap-1.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-5 h-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400 shadow-sm" : "text-muted/20"}`}
                                            />
                                        ))}
                                    </div>

                                    <p className="text-xl text-foreground font-semibold leading-relaxed grow italic">
                                        "{testimonial.content}"
                                    </p>

                                    <div className="flex items-center gap-5 pt-6 border-t border-white/5">
                                        <div className="relative">
                                            <div className="absolute -inset-1 bg-linear-to-br from-emerald-500/40 to-blue-500/40 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <Avatar className="h-14 w-14 border-2 border-white/20 relative">
                                                <AvatarImage src={testimonial.image} alt={testimonial.name} />
                                                <AvatarFallback className="bg-emerald-500/10 text-emerald-600 font-black">{testimonial.name[0]}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-extrabold text-lg text-foreground leading-tight">{testimonial.name}</p>
                                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest mt-0.5">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </CardContent>

                                {/* Bottom Shimmer */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-emerald-500/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}
