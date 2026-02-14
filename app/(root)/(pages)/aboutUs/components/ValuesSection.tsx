"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Shield, Heart } from "lucide-react";

export function ValuesSection() {
    return (
        <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
                    <Badge variant="secondary" className="mb-4">Core Principles</Badge>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Core Values</h2>
                    <p className="text-lg md:text-xl text-muted-foreground">
                        The principles that guide every decision we make at Swasthify.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
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
                            <CardContent className="p-6 md:p-8">
                                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${value.bg} flex items-center justify-center ${value.color} mb-4 md:mb-6`}>
                                    <value.icon className="w-6 h-6 md:w-7 md:h-7" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">{value.title}</h3>
                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{value.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
