"use client";

import { Calendar, Search, Stethoscope, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export function HowItWorks() {
    const steps = [
        {
            icon: Search,
            title: "Search Doctor",
            description: "Find the best specialist near you or online for your specific needs."
        },
        {
            icon: Calendar,
            title: "Book Appointment",
            description: "Choose a convenient time slot and book your appointment instantly."
        },
        {
            icon: Stethoscope,
            title: "Consultation",
            description: "Visit the clinic or consult via video call with our expert doctors."
        },
        {
            icon: FileText,
            title: "Get Prescription",
            description: "Receive your digital prescription and medical records securely."
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
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
                    >
                        How Swasthify Works
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-lg text-muted-foreground max-w-2xl mx-auto"
                    >
                        Simple steps to get the best healthcare experience.
                    </motion.p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {steps.map((step, index) => (
                        <motion.div key={index} variants={item} className="relative flex flex-col items-center text-center group">
                            {/* Connecting Line (Desktop only) */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-8 left-1/2 w-full h-[2px] bg-border -z-10" />
                            )}

                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 transition-transform duration-300"
                            >
                                <step.icon className="w-8 h-8 text-primary" />
                            </motion.div>

                            <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
