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
            staggerChildren: 0.05
        }
    }
};

const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { stiffness: 50 } }
};

export function Specialities() {
    return (
        <section className="pt-20 bg-background overflow-hidden">
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
                    <Link href="/specialities" className="hidden md:block">
                        <Button variant="ghost" className="group gap-2 text-primary font-semibold hover:bg-primary/5 shadow-sm">
                            See All Specialities
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6"
                >
                    {specialities.map((speciality, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="group bg-card/60 backdrop-blur-md hover:bg-card hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)] transition-all duration-500 p-4 md:p-8 rounded-[2rem] border border-border/50 hover:border-emerald-500/30 flex flex-col items-center text-center h-full"
                        >
                            <div className={`w-16 h-16 md:w-32 md:h-32 relative mb-2 md:mb-4 ${speciality.color} rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-emerald-500/20 overflow-hidden`}>
                                <div className="absolute inset-0 rounded-full bg-linear-to-tr from-white/60 dark:from-background/40 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity z-10" />
                                <div className="absolute inset-0 rounded-full scale-0 group-hover:scale-150 bg-emerald-500/5 blur-2xl transition-transform duration-700 -z-10" />
                                <Image
                                    src={speciality.image}
                                    alt={speciality.title}
                                    fill
                                    className="object-cover rounded-full"
                                />
                            </div>

                            <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2 px-1 text-xs md:text-base">
                                {speciality.title}
                            </h3>

                            <div className="text-[10px] md:text-sm text-muted-foreground mb-2 md:mb-4">
                                starts from <span className="font-bold text-foreground text-xs md:text-base">{speciality.price}</span>
                            </div>

                            <span className="mt-auto text-[10px] md:text-xs font-bold text-primary opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center bg-primary/10 px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-md shadow-primary/10">
                                Consult <ChevronRight className="w-2 h-2 md:w-3 md:h-3 ml-1" />
                            </span>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="mt-12 text-center md:hidden">
                    <Link href="/specialities">
                        <Button variant="outline" className="rounded-full px-8 font-semibold hover:bg-primary hover:text-white transition-all duration-300 shadow-lg shadow-primary/20">
                            See all specialities <ChevronRight className="w-5 h-5 ml-1" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
