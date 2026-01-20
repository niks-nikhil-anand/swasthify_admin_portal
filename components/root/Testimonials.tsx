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
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
                    >
                        What Our Patients Say
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-lg text-muted-foreground max-w-2xl mx-auto"
                    >
                        Trusted by thousands of satisfied users.
                    </motion.p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div key={index} variants={item} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                            <Card className="border-none shadow-lg bg-muted/20 hover:bg-muted/30 transition-colors h-full">
                                <CardContent className="p-8 flex flex-col gap-6 h-full">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-5 h-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                            />
                                        ))}
                                    </div>

                                    <p className="text-lg italic text-muted-foreground leading-relaxed grow">
                                        "{testimonial.content}"
                                    </p>

                                    <div className="flex items-center gap-4 mt-auto">
                                        <Avatar className="h-12 w-12 border-2 border-background">
                                            <AvatarImage src={testimonial.image} alt={testimonial.name} />
                                            <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-foreground">{testimonial.name}</p>
                                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
