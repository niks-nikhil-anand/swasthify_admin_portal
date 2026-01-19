"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";

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

export function InClinic() {
    return (
        <section className="py-20  bg-muted/40">
            <div className="container mx-auto px-4">
                <div className="mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                        Book an appointment for an in-clinic consultation
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Find experienced doctors across all specialties
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {specialties.map((item, index) => (
                        <div
                            key={index}
                            className="group cursor-pointer bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="relative h-48 w-full overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
