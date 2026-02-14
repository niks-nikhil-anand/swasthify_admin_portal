"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const packages = [
    {
        title: "Comprehensive Full Body Checkup",
        includes: "84 Tests included",
        price: "₹1,499",
        originalPrice: "₹2,999",
        discount: "50% OFF",
        tag: "Bestseller"
    },
    {
        title: "Women Advanced Health Package",
        includes: "72 Tests included",
        price: "₹1,999",
        originalPrice: "₹3,499",
        discount: "43% OFF",
        tag: "Popular"
    },
    {
        title: "Senior Citizen Wellness",
        includes: "65 Tests included",
        price: "₹1,299",
        originalPrice: "₹2,499",
        discount: "48% OFF",
        tag: "Special Care"
    }
];

export function PopularCheckups() {
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
                            Popular <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 rounded-md">Health Packages</span>
                        </h2>
                        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
                            Save big with our curated health screening bundles designed for every age group and lifestyle.
                        </p>
                    </motion.div>
                    <Button variant="outline" className="hidden md:flex rounded-full px-8 h-12 font-bold group">
                        View All Packages <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {packages.map((pkg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="relative overflow-hidden border-2 hover:border-emerald-500 transition-all duration-300 group h-full flex flex-col rounded-[2rem] shadow-xl hover:shadow-2xl">
                                {pkg.tag && (
                                    <div className="absolute top-4 right-4 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full z-10">
                                        {pkg.tag}
                                    </div>
                                )}
                                <CardHeader className="pt-10 pb-6 px-8 bg-muted/10 group-hover:bg-emerald-500/5 transition-colors">
                                    <CardTitle className="text-2xl font-bold leading-tight group-hover:text-emerald-600 transition-colors">{pkg.title}</CardTitle>
                                    <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-2 flex items-center gap-2">
                                        <Zap className="w-4 h-4 fill-emerald-600" /> {pkg.includes}
                                    </p>
                                </CardHeader>
                                <CardContent className="px-8 py-6 flex-1">
                                    <div className="space-y-3 mb-8">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                            <span>NABL Certified Lab</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="w-4 h-4 text-emerald-500" />
                                            <span>Results in 24 Hours</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-muted-foreground line-through text-lg">{pkg.originalPrice}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-4xl font-black text-foreground">{pkg.price}</span>
                                            <span className="bg-red-100 text-red-600 text-xs font-black px-2 py-1 rounded-lg">
                                                {pkg.discount}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="px-8 pb-8 pt-0">
                                    <Button className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold shadow-lg shadow-emerald-200 dark:shadow-none hover:scale-[1.02] transition-all">
                                        Book Now
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
