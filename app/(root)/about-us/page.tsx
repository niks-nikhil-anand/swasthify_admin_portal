"use client";

import { Users, Heart, Shield, Award, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative w-full py-20 md:py-32 overflow-hidden bg-primary/5">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl -z-10" />
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-3xl -z-10" />

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm md:text-base mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        Our Story
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        Revolutionizing <span className="text-primary">Healthcare Access</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        At Swasthify, we believe quality healthcare should be accessible to everyone, everywhere. We're bridging the gap between patients and providers with technology.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
                            <Badge variant="outline" className="px-4 py-1.5 text-sm border-primary/20 text-primary bg-primary/5">
                                <Heart className="w-3.5 h-3.5 mr-2 fill-primary" />
                                Our Mission
                            </Badge>

                            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                                Empowering <br />
                                <span className="text-primary">Healthier Lives</span>
                            </h2>

                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Our mission is to simplify the healthcare journey by providing a unified platform for appointments, diagnostics, and medical records. We strive to make healthcare transparent, affordable, and efficient for every individual.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {[
                                    "Seamless Booking",
                                    "Digital Records",
                                    "Verified Providers",
                                    "24/7 Support"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <span className="font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative animate-in fade-in slide-in-from-right-8 duration-700 delay-300 group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-50 -z-10 group-hover:opacity-70 transition-opacity duration-500" />
                            <div className="relative rounded-3xl overflow-hidden border border-border bg-card shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-700">
                                <Image
                                    src="/images/specialties/our_services.png"
                                    alt="Our Services"
                                    width={600}
                                    height={400}
                                    className="object-cover w-full h-[400px]"
                                />
                            </div>

                            <div className="absolute -bottom-8 -left-8 bg-card p-6 rounded-2xl shadow-xl border border-border max-w-xs animate-in fade-in zoom-in duration-700 delay-500">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Award className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-3xl text-primary">50k+</p>
                                        <p className="text-sm text-muted-foreground font-medium">Lives Impacted</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-muted/30 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <Badge variant="secondary" className="mb-4">Core Principles</Badge>
                        <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
                        <p className="text-xl text-muted-foreground">
                            The principles that guide every decision we make at Swasthify.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Users,
                                title: "Patient First",
                                desc: "Every feature we build starts with the patient's needs in mind. We prioritize user experience and accessibility above all.",
                                color: "text-blue-500",
                                bg: "bg-blue-500/10"
                            },
                            {
                                icon: Shield,
                                title: "Trust & Safety",
                                desc: "We adhere to the highest standards of data privacy and medical ethics. Your health data is secure with us.",
                                color: "text-green-500",
                                bg: "bg-green-500/10"
                            },
                            {
                                icon: Heart,
                                title: "Empathy",
                                desc: "We understand that healthcare is personal. We treat every interaction with compassion, care, and understanding.",
                                color: "text-red-500",
                                bg: "bg-red-500/10"
                            }
                        ].map((value, i) => (
                            <Card key={i} className="border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <CardContent className="p-8">
                                    <div className={`w-14 h-14 rounded-2xl ${value.bg} flex items-center justify-center ${value.color} mb-6`}>
                                        <value.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{value.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24">
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
