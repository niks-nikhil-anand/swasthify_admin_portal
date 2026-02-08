"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, User, Activity, Settings, CreditCard, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { FeatureComparison } from "@/components/pricing/FeatureComparison";
import { PricingFAQ } from "@/components/pricing/PricingFAQ";
import { PricingTestimonials } from "@/components/pricing/PricingTestimonials";
import { CTA } from "@/components/shared/CTA";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function PricingPage() {
    const [view, setView] = useState<"patient" | "doctor">("patient");

    const patientServices = [
        {
            name: "General Consultation",
            price: "₹199",
            description: "Connect with certified general physicians for common ailments.",
            features: [
                "24/7 Availability",
                "Instant Connections",
                "Digital Prescriptions",
                "Follow-up Reminders",
            ],
            icon: <Activity className="w-6 h-6 text-primary" />,
        },
        {
            name: "Specialist Consultation",
            price: "₹499",
            description: "Expert advice from top-tier specialists across all departments.",
            features: [
                "Vetted Specialists",
                "Video/Audio Consultation",
                "Detailed Health Reports",
                "Secure Data Sharing",
            ],
            icon: <ShieldCheck className="w-6 h-6 text-primary" />,
            mostPopular: true,
        },
        {
            name: "Lab & Diagnostics",
            price: "₹99",
            description: "Book essential tests and diagnostics at your convenience.",
            features: [
                "Home Sample Collection",
                "Digital Test Results",
                "Comparative Analysis",
                "Accredited Labs",
            ],
            icon: <Zap className="w-6 h-6 text-primary" />,
        },
    ];

    const doctorFeatures = [
        {
            name: "Fee Control Dashboard",
            description: "Complete autonomy over your consultation and service fees.",
            features: [
                "Set Custom Consultation Fees",
                "Dynamic Follow-up Pricing",
                "Urgent Care Surcharges",
                "Global Currency Support",
            ],
            icon: <Settings className="w-6 h-6 text-primary" />,
        },
        {
            name: "Revenue Management",
            description: "Track your earnings and manage payouts with total transparency.",
            features: [
                "Instant Payout Processing",
                "Detailed Earnings Reports",
                "Tax & GST Automation",
                "0% Platform Commission",
            ],
            icon: <CreditCard className="w-6 h-6 text-primary" />,
            mostPopular: true,
        },
        {
            name: "Patient Acquisition",
            description: "Grow your practice with our integrated marketing tools.",
            features: [
                "Verified Badge Profile",
                "Review Management",
                "Appointment Analytics",
                "Marketing Campaign Support",
            ],
            icon: <User className="w-6 h-6 text-primary" />,
        },
    ];

    const activeData = view === "patient" ? patientServices : doctorFeatures;

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative w-full py-20 md:py-24 overflow-hidden bg-primary/5 dark:bg-primary/2">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl -z-10" />

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm md:text-base mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {view === "patient" ? "Patient-First Pricing" : "Empowering Doctors"}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        {view === "patient" ? (
                            <>Affordable care, <br /> <span className="text-primary font-extrabold italic">zero hidden costs</span></>
                        ) : (
                            <>You define your value, <br /> <span className="text-primary font-extrabold italic">we handle the rest</span></>
                        )}
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        {view === "patient"
                            ? "Transparent pricing for every service. Know exactly what you pay before you book. No surprises, just quality care."
                            : "Take control of your practice. Set your own fees, manage your earnings, and grow your digital presence with Swasthify."}
                    </p>

                    {/* View Toggle */}
                    <div className="flex justify-center mb-0 md:mb-8">
                        <div className="inline-flex p-1 bg-muted rounded-xl shadow-inner border border-border/50 backdrop-blur-sm">
                            <button
                                onClick={() => setView("patient")}
                                className={cn(
                                    "px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2",
                                    view === "patient"
                                        ? "bg-background text-primary shadow-md scale-105"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <User className="w-4 h-4" />
                                For Patients
                            </button>
                            <button
                                onClick={() => setView("doctor")}
                                className={cn(
                                    "px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2",
                                    view === "doctor"
                                        ? "bg-background text-primary shadow-md scale-105"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Activity className="w-4 h-4" />
                                For Doctors
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing/Feature Cards */}
            <section className="-mt-12 py-12 relative z-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {activeData.map((item, index) => (
                            <div key={item.name} className="flex flex-col animate-in fade-in slide-in-from-bottom-12 duration-700 fill-mode-backwards" style={{ animationDelay: `${index * 150}ms` }}>
                                <Card
                                    className={cn(
                                        "flex flex-col h-full relative transition-all duration-500 hover:shadow-2xl group border-2 ring-0",
                                        item.mostPopular
                                            ? "border-primary/50 shadow-xl scale-105 z-10 bg-background/80 backdrop-blur-md"
                                            : "border-border/50 hover:-translate-y-2 bg-background/40 backdrop-blur-sm hover:border-primary/20"
                                    )}
                                >
                                    {item.mostPopular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                            <Badge className="bg-primary hover:bg-primary/90 px-4 py-1.5 text-sm shadow-lg border-none">
                                                {view === "patient" ? "Best Value" : "Recommended"}
                                            </Badge>
                                        </div>
                                    )}

                                    <CardHeader className="text-center pb-6 pt-10">
                                        <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 ring-4 ring-primary/5">
                                            {item.icon}
                                        </div>
                                        <CardTitle className="text-2xl font-bold tracking-tight">{item.name}</CardTitle>
                                        <CardDescription className="text-muted-foreground mt-3 min-h-[48px] px-2 leading-relaxed">
                                            {item.description}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="flex-1 px-8">
                                        {view === "patient" && (
                                            <div className="flex flex-col items-center justify-center mb-8 bg-primary/5 rounded-2xl py-6 border border-primary/10">
                                                <span className="text-sm font-medium text-primary/60 uppercase tracking-wider mb-1">Starting from</span>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-4xl font-black text-foreground">{(item as any).price}</span>
                                                </div>
                                            </div>
                                        )}

                                        <ul className="space-y-4">
                                            {item.features.map((feature) => (
                                                <li key={feature} className="flex items-start gap-3 text-sm text-foreground/85 font-medium">
                                                    <div className="p-0.5 rounded-full bg-primary/15 mt-1">
                                                        <Check className="h-3.5 w-3.5 text-primary stroke-3" />
                                                    </div>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>

                                    <CardFooter className="px-8 pb-10 pt-6">
                                        <Button
                                            asChild
                                            className={cn(
                                                "w-full h-12 text-base font-bold shadow-lg transition-all duration-300",
                                                item.mostPopular
                                                    ? "bg-primary hover:bg-primary/90 hover:shadow-primary/20"
                                                    : "bg-background border-2 border-primary/20 text-primary hover:bg-primary/5"
                                            )}
                                        >
                                            <a href={view === "patient" ? "/register/patient" : "/register/doctor"} className="flex items-center justify-center gap-2">
                                                {view === "patient" ? "Book Now" : "Start Your Practice"}
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </a>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <FeatureComparison />

            <PricingTestimonials />

            <PricingFAQ />

            <CTA
                title={view === "patient" ? "Ready to find your doctor?" : "Ready to modernize your practice?"}
                description={view === "patient"
                    ? "Join thousands of patients who trust Swasthify for quality healthcare at transparent prices. Book your first consultation today."
                    : "Join thousands of healthcare professionals who trust Swasthify to manage their clinics and hospitals more efficiently."}
                primaryAction={{
                    text: view === "patient" ? "Find a Doctor" : "Get Started for Free",
                    href: view === "patient" ? "/doctors" : "/register/doctor"
                }}
                secondaryAction={{ text: "Contact Support", href: "/contact" }}
            />
        </div>
    );
}
