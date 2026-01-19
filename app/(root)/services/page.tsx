"use client";

import { Video, MapPin, FlaskConical, Stethoscope, ArrowRight, Ambulance, HeartPulse, Building2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

const allServices = [
    {
        title: "Video Consultation",
        description: "Connect with top specialists from the comfort of your home via secure video calls. Get prescriptions and medical advice instantly.",
        icon: Video,
        href: "/consultation",
        color: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
        features: ["Instant Connect", "Digital Prescriptions", "Secure & Private"]
    },
    {
        title: "Find Doctor Near Me",
        description: "Locate and book appointments with the best doctors in your neighborhood. Filter by specialty, experience, and fees.",
        icon: MapPin,
        href: "/find-doctor",
        color: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
        features: ["Verified Reviews", "Instant Booking", "GPS Navigation"]
    },
    {
        title: "Lab Tests",
        description: "Book diagnostic tests online and get sample collection from your doorstep. Receive accurate reports within 24 hours.",
        icon: FlaskConical,
        href: "/lab-tests",
        color: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
        features: ["Home Collection", "NABL Accredited Labs", "Smart Reports"]
    },
    {
        title: "Surgeries",
        description: "Expert surgical care with end-to-end assistance and cashless insurance support. We take care of admission to discharge.",
        icon: Stethoscope,
        href: "/surgeries",
        color: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
        features: ["Insurance Support", "Care Buddy", "Free Second Opinion"]
    },
    {
        title: "Emergency Ambulance",
        description: "24/7 GPS-enabled ambulance service with basic to advanced life support systems. Quickest response time guaranteed.",
        icon: Ambulance,
        href: "/ambulance",
        color: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
        features: ["GPS Tracking", "24/7 Support", "Ventilator Support"]
    },
    {
        title: "Health Checkups",
        description: "Comprehensive health packages for all age groups. Preventive care to keep you and your family healthy.",
        icon: HeartPulse,
        href: "/health-checkups",
        color: "bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400",
        features: ["Full Body Checkup", "Tax Benefits", "Consultation Included"]
    },
    {
        title: "Corporate Wellness",
        description: "Tailored health and wellness plans for organizations. Boost employee productivity and health.",
        icon: Building2,
        href: "/corporate",
        color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
        features: ["On-site Camps", "Tele-consultation", "Wellness Analytics"]
    }
];

export default function ServicesPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative w-full py-20 md:py-32 overflow-hidden bg-primary/5">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-10" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm md:text-base mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                360° Healthcare
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
                                Comprehensive <span className="text-primary">Healthcare Services</span>
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                                From online consultations to complex surgeries, Swasthify is your one-stop solution for all medical needs. Reliable, Affordable, and Accessible.
                            </p>
                        </div>
                        <div className="flex-1 relative animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
                            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-border/50 rotate-2 hover:rotate-0 transition-all duration-500">
                                <img
                                    src="/images/empowering.png"
                                    alt="Empowering Healthcare"
                                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            {/* Decorative elements behind image */}
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-pulse" />
                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent/20 rounded-full blur-xl animate-pulse" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {allServices.map((service, index) => (
                            <Card
                                key={index}
                                className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/50 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-8 fill-mode-backwards"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <CardHeader className="relative">
                                    <div className={`w-14 h-14 rounded-xl mb-4 ${service.color} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                                        <service.icon className="w-7 h-7" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                                        {service.title}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="flex-1">
                                    <p className="text-muted-foreground mb-6 leading-relaxed">
                                        {service.description}
                                    </p>
                                    <div className="space-y-3">
                                        {service.features.map((feature, fIndex) => (
                                            <div key={fIndex} className="flex items-center text-sm text-foreground/80">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary/60 mr-2" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-6 border-t border-border/50 bg-muted/5">
                                    <Button variant="link" asChild className="p-0 h-auto font-bold text-primary hover:no-underline group/btn">
                                        <Link href={service.href} className="flex items-center gap-1">
                                            Book Now <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="pb-24">
                <div className="container mx-auto px-4">
                    <div className="bg-gray-100 rounded-[2.5rem] p-12 md:p-20 text-center text-gray-900 relative overflow-hidden shadow-2xl">
                        {/* Abstract Shapes */}
                        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/40 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

                        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                                Ready to experience <br /> better healthcare?
                            </h2>
                            <p className="text-gray-600 text-lg md:text-xl">
                                Join thousands of users who trust Swasthify for their medical needs. Start your journey today.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                                <Button size="lg" className="h-14 px-8 rounded-full text-base font-bold shadow-lg hover:shadow-xl transition-all">
                                    Get Started Now
                                </Button>
                                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-base font-bold bg-white/50 border-gray-300 text-gray-900 hover:bg-white hover:text-primary transition-all">
                                    View Services
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
