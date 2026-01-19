"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { FeatureComparison } from "@/components/pricing/FeatureComparison";
import { PricingFAQ } from "@/components/pricing/PricingFAQ";
import { PricingTestimonials } from "@/components/pricing/PricingTestimonials";
import { CTA } from "@/components/shared/CTA";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PricingPage() {
    const tiers = [
        {
            name: "Starter",
            id: "starter",
            href: "#",
            price: { monthly: "Free", annually: "Free" },
            description: "Everything you need to get started with your clinic.",
            features: [
                "1 User Seat",
                "Basic Patient Management",
                "50 Appointments/mo",
                "Basic Reports",
                "Email Support",
            ],
            cta: "Start free",
            mostPopular: false,
        },
        {
            name: "Pro",
            id: "pro",
            href: "#",
            price: { monthly: "₹2,999", annually: "₹29,990" },
            description: "Advanced features for growing clinics and hospitals.",
            features: [
                "Up to 5 User Seats",
                "Advanced Patient Records",
                "Unlimited Appointments",
                "Lab Integration",
                "API Access",
                "Priority Email & Chat Support",
            ],
            cta: "Get Started",
            mostPopular: true,
        },
        {
            name: "Enterprise",
            id: "enterprise",
            href: "#",
            price: { monthly: "Custom", annually: "Custom" },
            description: "Dedicated support and infrastructure for large healthcare networks.",
            features: [
                "Unlimited User Seats",
                "Custom API Integrations",
                "Dedicated Account Manager",
                "SLA & Uptime Guarantee",
                "On-premise Deployment Option",
                "24/7 Phone Support",
                "Dedicated Onboarding",
            ],
            cta: "Request demo",
            mostPopular: false,
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative w-full py-20 md:py-32 overflow-hidden bg-primary/5">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl -z-10" />

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm md:text-base mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        Transparent Pricing
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        Choose the right plan <br /> for <span className="text-primary">your clinic</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        Simple, transparent pricing that grows with you. Try any plan free for 14 days. No hidden fees.
                    </p>
                </div>
            </section>

            {/* Pricing Tiers */}
            <section className="-mt-20 py-12 relative z-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {tiers.map((tier, index) => (
                            <div key={tier.id} className={`flex flex-col animate-in fade-in slide-in-from-bottom-12 duration-700 fill-mode-backwards`} style={{ animationDelay: `${index * 150}ms` }}>
                                <Card
                                    className={`flex flex-col h-full relative transition-all duration-300 hover:shadow-2xl ${tier.mostPopular
                                        ? "border-primary shadow-xl scale-105 z-10 bg-background"
                                        : "border-border/50 hover:-translate-y-2 bg-background/50 backdrop-blur-sm"
                                        }`}
                                >
                                    {tier.mostPopular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                            <Badge className="bg-primary px-4 py-1.5 text-sm shadow-md">Most Popular</Badge>
                                        </div>
                                    )}

                                    <CardHeader className="text-center pb-8 pt-10">
                                        <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                                        <CardDescription className="text-muted-foreground mt-2 min-h-[40px]">
                                            {tier.description}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="flex-1 px-8">
                                        <div className="flex items-center justify-center gap-1 mb-8">
                                            <span className="text-4xl font-bold text-foreground">{tier.price.monthly}</span>
                                            {tier.price.monthly !== "Free" && tier.price.monthly !== "Custom" && (
                                                <span className="text-muted-foreground self-end mb-1">/mo</span>
                                            )}
                                        </div>

                                        <ul className="space-y-4">
                                            {tier.features.map((feature) => (
                                                <li key={feature} className="flex items-start gap-3 text-sm text-foreground/80">
                                                    <Check className="h-5 w-5 text-primary shrink-0" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>

                                    <CardFooter className="px-8 pb-10 pt-4">
                                        <Button
                                            asChild
                                            className="w-full h-12 text-base font-semibold shadow-md"
                                            variant={tier.mostPopular ? "default" : "outline"}
                                        >
                                            <a href={tier.href}>{tier.cta}</a>
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
                title="Ready to modernize your practice?"
                description="Join thousands of healthcare professionals who trust Swasthify to manage their clinics and hospitals more efficiently."
                primaryAction={{ text: "Get Started for Free", href: "/register/doctor" }}
                secondaryAction={{ text: "Contact Sales", href: "/contact" }}
            />
        </div>
    );
}
