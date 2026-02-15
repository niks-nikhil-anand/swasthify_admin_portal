"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const specialties = [
    {
        title: "Dentist",
        description: "Teething troubles? Schedule a dental checkup",
        image: "/images/specialities/dentist_v2.png",
    },
    {
        title: "Gynecologist/Obstetrician",
        description: "Explore for women's health, pregnancy and infertility treatments",
        image: "/images/specialities/gynecologist_v2.png",
    },
    {
        title: "Dietitian/Nutrition",
        description: "Get guidance on eating right, weight management and sports nutrition",
        image: "/images/specialities/dietitian_v2.png",
    },
    {
        title: "Physiotherapist",
        description: "Pulled a muscle? Get it treated by a trained physiotherapist",
        image: "/images/specialities/physiotherapist_v2.png",
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
    show: { opacity: 1, y: 0 }
};

export function InClinic() {
    return (
        <section className="py-20  bg-muted/40">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="space-y-3 mb-12 text-center md:text-left"
                >
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">
                        Book an Appointment for <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 rounded-md">In-Clinic Consultation</span>
                    </h2>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
                        Find experienced doctors across all specialties and book your visit in seconds.
                    </p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6"
                >
                    {specialties.map((specialty, index) => (
                        <Link href="/login" key={index}>
                            <motion.div
                                variants={item}
                                whileHover={{ scale: 1.02 }}
                                className="group cursor-pointer bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 h-full"
                            >
                                <div className="relative h-28 md:h-48 w-full overflow-hidden">
                                    <Image
                                        src={specialty.image}
                                        alt={specialty.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-3 md:p-5 text-center">
                                    <h3 className="font-bold text-xs md:text-lg text-foreground mb-1 md:mb-2 group-hover:text-primary transition-colors line-clamp-1 md:line-clamp-none">
                                        {specialty.title}
                                    </h3>
                                    <p className="text-muted-foreground text-[10px] md:text-sm leading-relaxed line-clamp-2 md:line-clamp-none">
                                        {specialty.description}
                                    </p>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
