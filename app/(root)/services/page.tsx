"use client";

import { Video, MapPin, FlaskConical, Stethoscope, ArrowRight, Ambulance, HeartPulse, Building2 } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/root/Navbar";
import { Footer } from "@/components/root/Footer";

const allServices = [
    {
        title: "Video Consultation",
        description: "Connect with top specialists from the comfort of your home via secure video calls. Get prescriptions and medical advice instantly.",
        icon: Video,
        href: "/consultation",
        color: "bg-blue-50 text-blue-600",
        features: ["Instant Connect", "Digital Prescriptions", "Secure & Private"]
    },
    {
        title: "Find Doctor Near Me",
        description: "Locate and book appointments with the best doctors in your neighborhood. Filter by specialty, experience, and fees.",
        icon: MapPin,
        href: "/find-doctor",
        color: "bg-green-50 text-green-600",
        features: ["Verified Reviews", "Instant Booking", "GPS Navigation"]
    },
    {
        title: "Lab Tests",
        description: "Book diagnostic tests online and get sample collection from your doorstep. Receive accurate reports within 24 hours.",
        icon: FlaskConical,
        href: "/lab-tests",
        color: "bg-purple-50 text-purple-600",
        features: ["Home Collection", "NABL Accredited Labs", "Smart Reports"]
    },
    {
        title: "Surgeries",
        description: "Expert surgical care with end-to-end assistance and cashless insurance support. We take care of admission to discharge.",
        icon: Stethoscope,
        href: "/surgeries",
        color: "bg-orange-50 text-orange-600",
        features: ["Insurance Support", "Care Buddy", "Free Second Opinion"]
    },
    {
        title: "Emergency Ambulance",
        description: "24/7 GPS-enabled ambulance service with basic to advanced life support systems. Quickest response time guaranteed.",
        icon: Ambulance,
        href: "/ambulance",
        color: "bg-red-50 text-red-600",
        features: ["GPS Tracking", "24/7 Support", "Ventilator Support"]
    },
    {
        title: "Health Checkups",
        description: "Comprehensive health packages for all age groups. Preventive care to keep you and your family healthy.",
        icon: HeartPulse,
        href: "/health-checkups",
        color: "bg-pink-50 text-pink-600",
        features: ["Full Body Checkup", "Tax Benefits", "Consultation Included"]
    },
    {
        title: "Corporate Wellness",
        description: "Tailored health and wellness plans for organizations. Boost employee productivity and health.",
        icon: Building2,
        href: "/corporate",
        color: "bg-indigo-50 text-indigo-600",
        features: ["On-site Camps", "Tele-consultation", "Wellness Analytics"]
    }
];

export default function ServicesPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="bg-muted/40 py-12 md:py-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                                Comprehensive Healthcare Services
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8">
                                From online consultations to complex surgeries, Swasthify is your one-stop solution for all medical needs.
                            </p>
                        </div>
                        <div className="flex-1 relative">
                            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-border/50">
                                <img
                                    src="/images/empowering.png"
                                    alt="Empowering Healthcare"
                                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            {/* Decorative elements behind image */}
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent/10 rounded-full blur-xl" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {allServices.map((service, index) => (
                            <div
                                key={index}
                                className="group bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-8 rounded-2xl border border-border flex flex-col"
                            >
                                <div className={`w-14 h-14 rounded-xl mb-6 ${service.color} flex items-center justify-center`}>
                                    <service.icon className="w-7 h-7" />
                                </div>

                                <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                                    {service.title}
                                </h3>

                                <p className="text-muted-foreground mb-6 leading-relaxed">
                                    {service.description}
                                </p>

                                <div className="space-y-3 mb-8">
                                    {service.features.map((feature, fIndex) => (
                                        <div key={fIndex} className="flex items-center text-sm text-foreground/80">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/60 mr-2" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto pt-6 border-t border-border/50">
                                    <Link
                                        href={service.href}
                                        className="inline-flex items-center text-primary font-bold hover:gap-2 transition-all"
                                    >
                                        Book Now <ArrowRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-20 bg-primary/5 border-y border-primary/10">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Can't find what you're looking for?</h2>
                    <p className="text-muted-foreground mb-8 text-lg">
                        Our support team is available 24/7 to assist you with any healthcare related queries.
                    </p>
                    <button className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all">
                        Contact Support
                    </button>
                </div>
            </section>
        </div>
    );
}
