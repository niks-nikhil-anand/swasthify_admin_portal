"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Heart, CheckCircle2, Award } from "lucide-react";

export function MissionVisionSection() {
    return (
        <section className="py-12 md:py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-left-8 duration-700 delay-200 order-2 md:order-1">
                        <Badge variant="outline" className="px-4 py-1.5 text-sm border-primary/20 text-primary bg-primary/5">
                            <Heart className="w-3.5 h-3.5 mr-2 fill-primary" />
                            Our Mission
                        </Badge>

                        <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                            Empowering <br />
                            <span className="text-primary">Healthier Lives</span>
                        </h2>

                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
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

                    <div className="relative animate-in fade-in slide-in-from-right-8 duration-700 delay-300 group order-1 md:order-2 mb-8 md:mb-0">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-50 -z-10 group-hover:opacity-70 transition-opacity duration-500" />
                        <div className="relative rounded-3xl overflow-hidden border border-border bg-card shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-700">
                            <Image
                                src="/images/specialties/our_services.png"
                                alt="Our Services"
                                width={600}
                                height={400}
                                className="object-cover w-full h-[250px] sm:h-[300px] md:h-[400px]"
                            />
                        </div>

                        <div className="absolute -bottom-6 left-4 md:-bottom-8 md:-left-8 bg-card p-4 md:p-6 rounded-2xl shadow-xl border border-border max-w-[200px] md:max-w-xs animate-in fade-in zoom-in duration-700 delay-500 z-20">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <Award className="w-5 h-5 md:w-7 md:h-7" />
                                </div>
                                <div>
                                    <p className="font-bold text-xl md:text-3xl text-primary">50k+</p>
                                    <p className="text-xs md:text-sm text-muted-foreground font-medium">Lives Impacted</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
