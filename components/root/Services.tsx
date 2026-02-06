"use client";

import { Video, MapPin, FlaskConical, Stethoscope, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const services = [
    {
        title: "Find Doctor Near Me",
        description: "Locate and book appointments with the best doctors in your neighborhood.",
        icon: MapPin,
        href: "/find-doctor",
        color: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    },
    {
        title: "Lab Tests",
        description: "Book diagnostic tests online and get sample collection from your doorstep.",
        icon: FlaskConical,
        href: "/lab-tests",
        color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    },
    {
        title: "Surgeries",
        description: "Expert surgical care with end-to-end assistance and cashless insurance support.",
        icon: Stethoscope,
        href: "/surgeries",
        color: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    },
    {
        title: "Video Consultation",
        description: "Connect with top specialists from the comfort of your home via secure video calls.",
        icon: Video,
        href: "/consultation",
        color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { stiffness: 50 } }
};

export function Services() {
    return (
        <section className="py-20 bg-muted/40">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center md:text-left mb-16 px-4"
                >
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground mb-6">
                        <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 rounded-md">Integrated Healthcare</span> Services for Every Need
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl md:mx-0 mx-auto leading-relaxed">
                        Access world-class medical expertise, advanced diagnostics, and surgical care – all through one unified platform.
                    </p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8"
                >
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            whileHover={{ scale: 1.03 }}
                            className="bg-card hover:shadow-xl transition-all duration-300 p-3 md:p-8 rounded-2xl border border-border flex flex-col items-start h-full"
                        >
                            <div className={`p-2 md:p-4 rounded-xl mb-3 md:mb-6 ${service.color} transition-colors`}>
                                <service.icon className="w-5 h-5 md:w-8 md:h-8" />
                            </div>

                            <h3 className="text-sm md:text-xl font-bold text-foreground mb-2 md:mb-3">
                                {service.title}
                            </h3>

                            <p className="text-muted-foreground text-xs md:text-base mb-4 md:mb-8 grow line-clamp-3 md:line-clamp-none">
                                {service.description}
                            </p>

                            <Link href={service.href} className="w-full mt-auto">
                                <Button variant="outline" size="sm" className="w-full group justify-between h-8 md:h-10 text-xs md:text-sm px-2 md:px-4 shadow-sm hover:shadow-primary/10">
                                    Book Now
                                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
