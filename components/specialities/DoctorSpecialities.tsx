"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const specialities = [
    {
        title: "Gynaecology",
        price: "₹599",
        image: "/images/specialities/gynaecology_real.png",
        color: "bg-pink-50/50 dark:bg-pink-900/20",
    },
    {
        title: "Sexology",
        price: "₹599",
        image: "/images/specialities/sexology_real.png",
        color: "bg-indigo-50/50 dark:bg-indigo-900/20",
    },
    {
        title: "General physician",
        price: "₹499",
        image: "/images/specialities/general_physician_real.png",
        color: "bg-blue-50/50 dark:bg-blue-900/20",
    },
    {
        title: "Dermatology",
        price: "₹549",
        image: "/images/specialities/dermatology_real_v2.png",
        color: "bg-teal-50/50 dark:bg-teal-900/20",
    },
    {
        title: "Psychiatry",
        price: "₹599",
        image: "/images/specialities/psychiatry_real.png",
        color: "bg-green-50/50 dark:bg-green-900/20",
    },
    {
        title: "Stomach and digestion",
        price: "₹499",
        image: "/images/specialities/stomach_digestion_real.png",
        color: "bg-orange-50/50 dark:bg-orange-900/20",
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
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export function DoctorSpecialities() {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-3 text-center md:text-left"
                    >
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">
                            Wide Range of <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 rounded-md">Medical Specialities</span>
                        </h2>
                        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
                            Access top-tier healthcare across 25+ specialities. Expert doctors, seamless digital consultations, and personalized care plans.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
                >
                    {specialities.map((speciality, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            whileHover={{ y: -10 }}
                            className="group relative bg-card/40 backdrop-blur-md rounded-[2.5rem] border border-border/50 hover:border-emerald-500/30 hover:shadow-[0_40px_80px_-20px_rgba(16,185,129,0.15)] transition-all duration-500 p-6 flex flex-col items-center text-center overflow-hidden h-full"
                        >
                            <div className={`w-28 h-28 md:w-36 md:h-36 relative mb-6 ${speciality.color} rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 overflow-hidden shadow-inner`}>
                                <Image
                                    src={speciality.image}
                                    alt={speciality.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-linear-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <h3 className="font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                {speciality.title}
                            </h3>

                            <div className="text-sm text-muted-foreground mb-4">
                                starts from <span className="font-extrabold text-foreground text-base">{speciality.price}</span>
                            </div>

                            <div className="mt-auto opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                <Button size="sm" className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6">
                                    Consult Now
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
