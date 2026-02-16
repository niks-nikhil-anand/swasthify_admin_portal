"use client";

import { Button } from "@/components/ui/button";
import { Check, Settings, CreditCard, User, ArrowRight, ShieldCheck, Zap, TrendingUp, HandCoins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function DoctorPricingPage() {
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

    const benefits = [
        {
            title: "Maximized Earnings",
            description: "Keep 100% of your consultation fees. We don't take a cut from your professional expertise.",
            icon: <HandCoins className="w-5 h-5" />
        },
        {
            title: "Instant Analytics",
            description: "Real-time insights into your practice performance and patient demographics.",
            icon: <TrendingUp className="w-5 h-5" />
        },
        {
            title: "Secure Payouts",
            description: "Automated and secure fund transfers directly to your bank account weekly.",
            icon: <ShieldCheck className="w-5 h-5" />
        }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative w-full py-12 md:py-16 overflow-hidden rounded-3xl bg-primary/5 dark:bg-primary/2 border border-primary/10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl -z-10" />

                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6"
                    >
                        Empowering Your Practice
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
                    >
                        You define your value, <br />
                        <span className="text-primary font-extrabold italic">we handle the rest</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
                    >
                        Take control of your practice. Set your own fees, manage your earnings,
                        and grow your digital presence with Swasthify's premium doctor tools.
                    </motion.p>
                </div>
            </section>

            {/* Feature Cards */}
            <section className="py-12 -mt-8 relative z-20">
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                    {doctorFeatures.map((item, index) => (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                        >
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
                                            Premium Feature
                                        </Badge>
                                    </div>
                                )}

                                <CardHeader className="text-center pb-6 pt-10">
                                    <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 ring-4 ring-primary/5">
                                        {item.icon}
                                    </div>
                                    <CardTitle className="text-2xl font-bold tracking-tight">{item.name}</CardTitle>
                                    <CardDescription className="text-muted-foreground mt-3 min-h-[48px] px-2 leading-relaxed text-sm">
                                        {item.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex-1 px-8">
                                    <ul className="space-y-4">
                                        {item.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-3 text-sm text-foreground/85 font-medium">
                                                <div className="p-0.5 rounded-full bg-primary/15 mt-1 border border-primary/20">
                                                    <Check className="h-3.5 w-3.5 text-primary stroke-[3]" />
                                                </div>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>

                                <CardFooter className="px-8 pb-10 pt-6">
                                    <Button
                                        className={cn(
                                            "w-full h-11 text-sm font-bold shadow-lg transition-all duration-300",
                                            item.mostPopular
                                                ? "bg-primary hover:bg-primary/90 hover:shadow-primary/20"
                                                : "bg-background border-2 border-primary/20 text-primary hover:bg-primary/5"
                                        )}
                                    >
                                        Manage {item.name.split(' ')[0]}
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Practical Benefits */}
            <section className="py-12 bg-muted/30 rounded-[2.5rem] border border-border/50 my-8">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Doctors Choose Swasthify</h2>
                        <p className="text-muted-foreground">The most transparent platform for healthcare professionals.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {benefits.map((benefit, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-background p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="p-3 w-fit bg-primary/10 rounded-xl mb-4 text-primary">
                                    {benefit.icon}
                                </div>
                                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 text-center">
                <div className="max-w-2xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-6">Need help optimizing your fees?</h2>
                    <p className="text-muted-foreground mb-10">
                        Our practice management experts are available to help you set the right pricing
                        strategy based on your specialty and region.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="rounded-full px-8 h-14 text-base font-semibold">
                            Speak with an Advisor
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base font-semibold">
                            View Pricing Guide
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
