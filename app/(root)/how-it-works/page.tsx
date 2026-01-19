"use client";

import { Button } from "@/components/ui/button";
import { UserPlus, Link as LinkIcon, Activity, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CTA } from "@/components/shared/CTA";

export default function HowItWorksPage() {
    const steps = [
        {
            id: 1,
            title: "Register & Login",
            description: "Create your account on Swasthify to get started.",
            details: "Sign up using your email or mobile number. Securely log in to access your dashboard.",
            icon: UserPlus,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            id: 2,
            title: "Link ABHA",
            description: "Connect your Ayushman Bharat Health Account.",
            details: "Seamlessly link your ABHA ID to sync your health records and avail government health schemes.",
            icon: LinkIcon,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            id: 3,
            title: "Manage records",
            description: "Access and organize your medical history.",
            details: "Upload reports, view prescriptions, and share your digital health records with doctors securely.",
            icon: Activity,
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative w-full py-20 md:py-32 overflow-hidden bg-primary/5">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-10" />

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm md:text-base mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        Simple & Secure
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        How <span className="text-primary">Swasthify</span> Works
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        Get started with your digital health journey in three simple steps. We've made it effortless for you.
                    </p>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-24 bg-background relative">
                <div className="container mx-auto px-4">
                    <div className="relative max-w-6xl mx-auto">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -z-10" />

                        <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
                            {steps.map((step, index) => (
                                <div key={step.id} className="relative group animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards" style={{ animationDelay: `${index * 200}ms` }}>
                                    <Card className="h-full border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card">
                                        <CardContent className="p-8 pt-12 relative flex flex-col h-full items-center md:items-start text-center md:text-left">
                                            {/* Number Badge */}
                                            <div className="absolute -top-6 left-1/2 md:left-8 -translate-x-1/2 md:translate-x-0 w-12 h-12 rounded-full bg-background border-4 border-primary/10 flex items-center justify-center font-bold text-lg shadow-sm z-10">
                                                {step.id}
                                            </div>

                                            {/* Icon */}
                                            <div className={`w-16 h-16 rounded-2xl ${step.bg} flex items-center justify-center ${step.color} mb-6 mt-2`}>
                                                <step.icon className="w-8 h-8" />
                                            </div>

                                            <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                                            <p className="text-primary font-medium mb-3">{step.description}</p>
                                            <p className="text-muted-foreground leading-relaxed text-sm">
                                                {step.details}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 text-center animate-in fade-in zoom-in duration-500 delay-500">
                            <Button size="lg" className="rounded-full px-8 h-12 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                                Get Started Now <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ABHA Integration Section */}
            <section className="py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <Card className="overflow-hidden border-none shadow-2xl relative bg-background">
                            {/* Gradient Border/Header */}
                            <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-primary" />

                            <div className="absolute inset-0 bg-grid-black/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

                            <CardContent className="p-8 md:p-12 text-center md:text-left">
                                <div className="flex flex-col md:flex-row gap-12 items-center">
                                    <div className="flex-1 space-y-6">
                                        <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                                            Government Integrated
                                        </Badge>
                                        <h2 className="text-3xl md:text-4xl font-bold">
                                            Unified Health Interface (ABHA)
                                        </h2>
                                        <p className="text-lg text-muted-foreground leading-relaxed">
                                            Ayushman Bharat Health Account (ABHA) is a unique 14-digit number that allows you to access and share your digital health records digitally.
                                        </p>

                                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                            <Button size="lg" className="gap-2 rounded-full">
                                                Link ABHA Now <LinkIcon className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" size="lg" asChild className="gap-2 rounded-full">
                                                <a href="https://abdm.gov.in/" target="_blank" rel="noopener noreferrer">
                                                    Learn More <ExternalLink className="h-4 w-4" />
                                                </a>
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex-1 w-full relative">
                                        <div className="grid grid-cols-1 gap-4">
                                            {[
                                                { text: "Secure Storage", icon: Activity },
                                                { text: "Instant Sharing", icon: ExternalLink },
                                                { text: "Seamless Access", icon: LinkIcon }
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border/50 hover:bg-muted transition-colors">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                        <item.icon className="w-5 h-5" />
                                                    </div>
                                                    <span className="font-medium">{item.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <CTA
                title="Start Your Health Journey"
                description="Now that you know how it works, it's time to take control of your health. Join Swasthify today."
                primaryAction={{ text: "Create Account", href: "/register/patient" }}
                secondaryAction={{ text: "Learn More", href: "/about-us" }}
            />
        </div>
    );
}
