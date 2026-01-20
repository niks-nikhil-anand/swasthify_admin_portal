"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const specialties = [
    {
        title: "Dentist",
        description: "Teething troubles? Schedule a dental checkup",
        image: "/images/specialties/dentist.png",
    },
    {
        title: "Gynecologist/Obstetrician",
        description: "Explore for women's health, pregnancy and infertility treatments",
        image: "/images/specialties/gynecologist.png",
    },
    {
        title: "Dietitian/Nutrition",
        description: "Get guidance on eating right, weight management and sports nutrition",
        image: "/images/specialties/dietitian.png",
    },
    {
        title: "Physiotherapist",
        description: "Pulled a muscle? Get it treated by a trained physiotherapist",
        image: "/images/specialties/physiotherapist.png",
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
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-10"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                        Book an appointment for an in-clinic consultation
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Find experienced doctors across all specialties
                    </p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {specialties.map((specialty, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            whileHover={{ scale: 1.02 }}
                            className="group cursor-pointer bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
                        >
                            <div className="relative h-48 w-full overflow-hidden">
                                <Image
                                    src={specialty.image}
                                    alt={specialty.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                                    {specialty.title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {specialty.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
