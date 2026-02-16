"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Activity } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

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
    {
        title: "Cardiology",
        price: "₹799",
        image: "/images/specialities/cardiology_real.png",
        color: "bg-red-50/50 dark:bg-red-900/20",
    },
    {
        title: "Pediatrics",
        price: "₹499",
        image: "/images/specialities/pediatrics_real.png",
        color: "bg-yellow-50/50 dark:bg-yellow-900/20",
    },
    {
        title: "Orthopedics",
        price: "₹599",
        image: "/images/specialities/orthopedics_real.png",
        color: "bg-orange-50/50 dark:bg-orange-900/20",
    },
    {
        title: "Neurology",
        price: "₹899",
        image: "/images/specialities/neurology_real.png",
        color: "bg-purple-50/50 dark:bg-purple-900/20",
    },
    {
        title: "Ophthalmology",
        price: "₹499",
        image: "/images/specialities/ophthalmology_real.png",
        color: "bg-sky-50/50 dark:bg-sky-900/20",
    },
    {
        title: "Dentist",
        price: "₹249",
        image: "/images/specialities/dentist_v2.png",
        color: "bg-slate-50/50 dark:bg-slate-900/20",
    },
    {
        title: "Dietitian",
        price: "₹349",
        image: "/images/specialities/dietitian_v2.png",
        color: "bg-lime-50/50 dark:bg-lime-900/20",
    },
    {
        title: "Physiotherapist",
        price: "₹449",
        image: "/images/specialities/physiotherapist_v2.png",
        color: "bg-cyan-50/50 dark:bg-cyan-900/20",
    },
];

// Individual item animation variant
const itemFadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};


export function DoctorSpecialities() {
    const [visibleCount, setVisibleCount] = useState(6);
    const [isPatient, setIsPatient] = useState(false);

    useEffect(() => {
        setIsPatient(document.cookie.includes("PATIENT="));
    }, []);

    const showMore = () => {
        setVisibleCount((prev: number) => Math.min(prev + 6, specialities.length));
    };

    return (
        <section className="py-24 bg-background overflow-hidden">
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

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                    <AnimatePresence mode="popLayout">
                        {specialities.slice(0, visibleCount).map((speciality, index) => {
                            const targetUrl = `/doctors?specialization=${encodeURIComponent(speciality.title)}`;
                            const href = isPatient ? targetUrl : `/login?redirect=${encodeURIComponent(targetUrl)}`;
                            return (
                                <Link href={href} key={speciality.title || index}>
                                    <motion.div
                                        layout
                                        variants={itemFadeIn}
                                        initial="hidden"
                                        animate="show"
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: (index % 6) * 0.05 }}
                                        whileHover={{ y: -8 }}
                                        className="h-full"
                                    >
                                        <Card className="relative overflow-hidden border-2 hover:border-emerald-500 transition-all duration-300 group h-full flex flex-col rounded-[1.5rem] md:rounded-[2rem] shadow-lg hover:shadow-2xl bg-card cursor-pointer">
                                            <div className="relative h-28 md:h-40 w-full flex items-center justify-center pt-6">
                                                <div className={`w-24 h-24 md:w-32 md:h-32 relative ${speciality.color} rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 overflow-hidden shadow-inner border-4 border-background`}>
                                                    <Image
                                                        src={speciality.image}
                                                        alt={speciality.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            </div>

                                            <CardHeader className="pt-4 pb-2 px-3 md:px-6 text-center">
                                                <CardTitle className="text-sm md:text-lg font-bold leading-tight line-clamp-2 min-h-[40px] md:min-h-[48px] group-hover:text-emerald-600 transition-colors">
                                                    {speciality.title}
                                                </CardTitle>
                                            </CardHeader>

                                            <CardContent className="px-3 md:px-6 py-2 flex-1 text-center">
                                                <div className="flex flex-col items-center">
                                                    <p className="text-muted-foreground text-[10px] md:text-xs">Consultation starts from</p>
                                                    <span className="text-lg md:text-2xl font-black text-foreground">{speciality.price}</span>
                                                </div>
                                            </CardContent>

                                            <CardFooter className="px-3 md:px-6 pb-4 md:pb-6 pt-2 mt-auto">
                                                <Button className="w-full h-8 md:h-10 rounded-xl md:rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs md:text-sm font-bold shadow-md hover:scale-[1.02] transition-all">
                                                    Consult Now
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {visibleCount < specialities.length && (
                    <div className="mt-16 text-center">
                        <Button
                            onClick={showMore}
                            variant="outline"
                            className="rounded-full px-10 h-14 text-lg font-bold border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-600 transition-all group gap-2"
                        >
                            <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            Show More Specialities
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
