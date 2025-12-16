"use client";

import { Users, Heart, Shield, Award, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 bg-muted/30 overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Revolutionizing Healthcare Access
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                            At Swasthify, we believe quality healthcare should be accessible to everyone, everywhere. We're bridging the gap between patients and providers with technology.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                <Heart className="w-4 h-4" />
                                Our Mission
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">
                                Empowering Healthier Lives
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                Our mission is to simplify the healthcare journey by providing a unified platform for appointments, diagnostics, and medical records. We strive to make healthcare transparent, affordable, and efficient.
                            </p>
                            <div className="flex flex-col gap-4">
                                {[
                                    "Seamless Appointment Booking",
                                    "Digital Health Records",
                                    "Verified Healthcare Providers",
                                    "24/7 Support"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        <span className="font-medium text-foreground">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-2xl overflow-hidden bg-muted relative shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-500">
                                {/* Placeholder for About Image - Use a nice gradient/pattern until image is available */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                    <Users className="w-32 h-32 text-primary/40" />
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-xl border border-border max-w-xs">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-2xl">50k+</p>
                                        <p className="text-sm text-muted-foreground">Lives Impacted</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
                        <p className="text-muted-foreground">
                            The principles that guide every decision we make at Swasthify.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Users,
                                title: "Patient First",
                                desc: "Every feature we build starts with the patient's needs in mind."
                            },
                            {
                                icon: Shield,
                                title: "Trust & Safety",
                                desc: "We adhere to the highest standards of data privacy and medical ethics."
                            },
                            {
                                icon: Heart,
                                title: "Empathy",
                                desc: "We understand that healthcare is personal and treat every user with care."
                            }
                        ].map((value, i) => (
                            <div key={i} className="bg-background p-8 rounded-2xl border border-border/50 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                                    <value.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                                <p className="text-muted-foreground">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="bg-primary rounded-3xl p-12 text-center text-primary-foreground relative overflow-hidden">
                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Ready to experience better healthcare?
                            </h2>
                            <p className="text-primary-foreground/80 text-lg mb-8">
                                Join thousands of users who trust Swasthify for their medical needs.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <button className="px-8 py-3 bg-white text-primary rounded-full font-bold hover:bg-gray-100 transition-colors">
                                    Get Started
                                </button>
                                <Link href="/services" className="px-8 py-3 bg-primary-foreground/10 border border-primary-foreground/20 text-white rounded-full font-bold hover:bg-primary-foreground/20 transition-colors">
                                    View Services
                                </Link>
                            </div>
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                    </div>
                </div>
            </section>
        </div>
    );
}
