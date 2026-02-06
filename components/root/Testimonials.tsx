"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

export function Testimonials() {
    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Patient",
            image: "",
            content: "Swasthify made it so easy to find a specialist. The video consultation was seamless and I got my prescription immediately.",
            rating: 5
        },
        {
            name: "Rahul Mehta",
            role: "Patient",
            image: "",
            content: "I love having all my family's health records in one place. Booking appointments is a breeze now.",
            rating: 5
        },
        {
            name: "Anjali Gupta",
            role: "Patient",
            image: "",
            content: "The best healthcare app I've used. Very user-friendly and the support team is super helpful.",
            rating: 4
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { stiffness: 50 } }
    };

    return (
        <section className="py-10 bg-background overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-block mb-4"
                    >
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                            Community Love
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground mb-6"
                    >
                        What Our <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 rounded-md">Patients Say</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                    >
                        Trusted by thousands of satisfied users who have transformed their healthcare experience with Swasthify.
                    </motion.p>
                </div>

                {/* Mobile: Horizontal Scroll, Desktop: Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 -mx-4 px-4 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0 md:px-0 scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className="min-w-[85vw] md:min-w-0 snap-center flex"
                        >
                            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-background/50 hover:bg-background/80 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 h-full backdrop-blur-sm rounded-2xl w-full group">
                                <CardContent className="p-8 flex flex-col gap-6 h-full">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-5 h-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 dark:text-muted/20"}`}
                                            />
                                        ))}
                                    </div>

                                    <p className="text-lg text-foreground/80 leading-relaxed grow relative z-10 font-medium">
                                        "{testimonial.content}"
                                    </p>

                                    <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border/40">
                                        <Avatar className="h-12 w-12 border-2 border-primary/10 group-hover:border-primary/30 transition-colors">
                                            <AvatarImage src={testimonial.image} alt={testimonial.name} />
                                            <AvatarFallback className="bg-primary/5 text-primary font-bold">{testimonial.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-bold text-foreground">{testimonial.name}</p>
                                            <p className="text-sm text-muted-foreground font-medium">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </CardContent>
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
