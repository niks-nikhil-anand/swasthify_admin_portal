
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FlaskConical, Activity, Heart, Droplets, Zap, ShieldCheck, Clock, ArrowRight, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

const diagnosticTests = [
    {
        id: 1,
        title: "Complete Blood Count (CBC)",
        includes: "24 Tests included",
        price: "₹299",
        originalPrice: "₹599",
        discount: "50% OFF",
        image: "/images/tests/cbc.png",
        tag: "Essential"
    },
    {
        id: 2,
        title: "Diabetes Screening (HbA1c)",
        includes: "2 Tests included",
        price: "₹399",
        originalPrice: "₹799",
        discount: "50% OFF",
        image: "/images/tests/diabetes.png",
        tag: "Top Choice"
    },
    {
        id: 3,
        title: "Thyroid Profile (T3 T4 TSH)",
        includes: "3 Tests included",
        price: "₹499",
        originalPrice: "₹999",
        discount: "50% OFF",
        image: "/images/tests/thyroid.png",
        tag: "Popular"
    },
    {
        id: 4,
        title: "Lipid Profile (Cholesterol)",
        includes: "8 Tests included",
        price: "₹549",
        originalPrice: "₹1,099",
        discount: "50% OFF",
        image: "/images/tests/lipid.png",
        tag: "Heart Health"
    },
    {
        id: 5,
        title: "Vitamin B12 & D",
        includes: "2 Tests included",
        price: "₹899",
        originalPrice: "₹1,799",
        discount: "50% OFF",
        image: "/images/tests/vitamins.png",
        tag: "Immunity"
    },
    {
        id: 6,
        title: "Liver Function Test (LFT)",
        includes: "11 Tests included",
        price: "₹599",
        originalPrice: "₹1,199",
        discount: "50% OFF",
        image: "/images/tests/lft.png",
        tag: "Advanced"
    },
    {
        id: 7,
        title: "Kidney Function Test (KFT)",
        includes: "10 Tests included",
        price: "₹599",
        originalPrice: "₹1,199",
        discount: "50% OFF",
        image: "/images/tests/kft.png",
        tag: "Advanced"
    },
    {
        id: 8,
        title: "Iron Deficiency Profile",
        includes: "4 Tests included",
        price: "₹699",
        originalPrice: "₹1,399",
        discount: "50% OFF",
        image: "/images/tests/iron.png",
        tag: "Recommended"
    },
    {
        id: 9,
        title: "CRP (C-Reactive Protein)",
        includes: "1 Test included",
        price: "₹399",
        originalPrice: "₹799",
        discount: "50% OFF",
        image: "/images/tests/crp.png",
        tag: "Infection"
    },
    {
        id: 10,
        title: "Electrolyte Profile",
        includes: "3 Tests included",
        price: "₹499",
        originalPrice: "₹999",
        discount: "50% OFF",
        image: "/images/tests/electrolyte.png",
        tag: "Essential"
    },
    {
        id: 11,
        title: "Urine Routine & Microscopy",
        includes: "1 Test included",
        price: "₹199",
        originalPrice: "₹399",
        discount: "50% OFF",
        image: "/images/tests/urine.png",
        tag: "Essential"
    },
    {
        id: 12,
        title: "Dengue NS1 Antigen",
        includes: "1 Test included",
        price: "₹599",
        originalPrice: "₹1,199",
        discount: "50% OFF",
        image: "/images/tests/dengue.png",
        tag: "Seasonal"
    },
    {
        id: 13,
        title: "Allergy Screening",
        includes: "36 Tests included",
        price: "₹1,499",
        originalPrice: "₹2,999",
        discount: "50% OFF",
        image: "/images/tests/allergy.png",
        tag: "Diagnostic"
    },
    {
        id: 14,
        title: "Dual Marker (Pregnancy)",
        includes: "2 Tests included",
        price: "₹2,499",
        originalPrice: "₹4,999",
        discount: "50% OFF",
        image: "/images/tests/dual_marker.png",
        tag: "Premium"
    }
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
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export function TestSpecialities() {
    const [visibleCount, setVisibleCount] = useState(6);
    const visibleTests = diagnosticTests.slice(0, visibleCount);

    const showMore = () => {
        setVisibleCount((prev: number) => Math.min(prev + 6, diagnosticTests.length));
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
                            Diagnostic <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 rounded-md">Individual Tests</span>
                        </h2>
                        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
                            Accurate results for your health concerns. NABL certified labs, home sample collection, and digital reports.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {visibleTests.map((test) => (
                            <motion.div
                                key={test.id}
                                layout
                                variants={item}
                                initial="hidden"
                                animate="show"
                                exit={{ opacity: 0, scale: 0.95 }}
                                whileHover={{ y: -8 }}
                            >
                                <Link href="/login">
                                    <Card className="relative overflow-hidden border-2 hover:border-emerald-500 transition-all duration-300 group h-full flex flex-col rounded-[1.5rem] md:rounded-[2rem] shadow-lg hover:shadow-2xl bg-card cursor-pointer">
                                        {test.tag && (
                                            <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-emerald-600 text-white text-[8px] md:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 md:px-3 md:py-1 rounded-full z-10">
                                                {test.tag}
                                            </div>
                                        )}

                                        <div className="relative h-28 md:h-40 w-full flex items-center justify-center pt-6">
                                            <div className="w-24 h-24 md:w-32 md:h-32 relative bg-muted rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 overflow-hidden shadow-inner border-4 border-background">
                                                <Image
                                                    src={test.image}
                                                    alt={test.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-linear-to-tr from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>

                                        <CardHeader className="pt-4 md:pt-6 pb-2 md:pb-4 px-3 md:px-6 text-center">
                                            <CardTitle className="text-sm md:text-lg font-bold leading-tight line-clamp-2 min-h-[40px] md:min-h-[48px] group-hover:text-emerald-600 transition-colors">
                                                {test.title}
                                            </CardTitle>
                                        </CardHeader>

                                        <CardContent className="px-3 md:px-6 py-2 md:py-4 flex-1">
                                            <div className="flex flex-col items-center">
                                                <p className="text-muted-foreground text-[10px] md:text-xs">Test starts from</p>
                                                <span className="text-muted-foreground line-through text-[10px] md:text-sm">{test.originalPrice}</span>
                                                <div className="flex items-center gap-1.5 md:gap-2">
                                                    <span className="text-lg md:text-2xl font-black text-foreground">{test.price}</span>
                                                    <Badge className="text-[8px] md:text-[10px] font-bold px-1.5 py-0 h-4 md:h-5 bg-red-50 text-red-600 border-red-100 hover:bg-red-100 shadow-none">
                                                        {test.discount}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardContent>

                                        <CardFooter className="px-3 md:px-6 pb-4 md:pb-6 pt-0 mt-auto">
                                            <Button className="w-full h-8 md:h-10 rounded-xl md:rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs md:text-sm font-bold shadow-md hover:scale-[1.02] transition-all">
                                                Book Now
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {visibleCount < diagnosticTests.length && (
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
