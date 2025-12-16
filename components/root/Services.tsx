"use client";

import { Video, MapPin, FlaskConical, Stethoscope, ArrowRight } from "lucide-react";
import Link from "next/link";

const services = [
    {
        title: "Video Consultation",
        description: "Connect with top specialists from the comfort of your home via secure video calls.",
        icon: Video,
        href: "/consultation",
        color: "bg-blue-50 text-blue-600",
    },
    {
        title: "Find Doctor Near Me",
        description: "Locate and book appointments with the best doctors in your neighborhood.",
        icon: MapPin,
        href: "/find-doctor",
        color: "bg-green-50 text-green-600",
    },
    {
        title: "Lab Tests",
        description: "Book diagnostic tests online and get sample collection from your doorstep.",
        icon: FlaskConical,
        href: "/lab-tests",
        color: "bg-purple-50 text-purple-600",
    },
    {
        title: "Surgeries",
        description: "Expert surgical care with end-to-end assistance and cashless insurance support.",
        icon: Stethoscope, // Using Stethoscope as a proxy for medical/surgery related
        href: "/surgeries",
        color: "bg-orange-50 text-orange-600",
    },
];

export function Services() {
    return (
        <section className="py-20 bg-muted/20">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Total Health Solutions
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Comprehensive healthcare services designed for your convenience and well-being.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <Link
                            key={index}
                            href={service.href}
                            className="group relative bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-8 rounded-2xl border border-border flex flex-col items-start"
                        >
                            <div className={`p-4 rounded-xl mb-6 ${service.color}`}>
                                <service.icon className="w-8 h-8" />
                            </div>

                            <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                                {service.title}
                            </h3>

                            <p className="text-muted-foreground mb-6 line-clamp-3">
                                {service.description}
                            </p>

                            <div className="mt-auto flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                                Book Now <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
