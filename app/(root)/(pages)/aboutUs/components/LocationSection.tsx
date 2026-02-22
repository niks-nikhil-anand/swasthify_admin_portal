"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function LocationSection() {
    return (
        <section className=" md:py-20 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="w-full">
                    <div className="text-center mb-16 relative z-10">
                        <Badge variant="outline" className="px-4 py-1.5 text-sm border-emerald-200 text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800 mb-6 rounded-full shadow-sm">
                            <MapPin className="w-3 h-3 mr-2" />
                            Our Presence
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-white dark:via-zinc-300 dark:to-white">
                            Where to Find Us
                        </h2>
                        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Centered in the heart of heritage, operating with a vision for the future. Visit our registered office in Patna.
                        </p>
                    </div>

                    <div className="relative">
                        {/* Decorative glow behind the card */}
                        <div className="absolute inset-0 bg-linear-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 blur-3xl -z-10" />

                        <Card className="border-border/50 shadow-2xl overflow-hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl hover:border-emerald-500/30 transition-all duration-500">
                            <CardContent className="p-8 md:p-12">
                                <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8 md:gap-12">

                                    {/* Icon & Title */}
                                    <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                                        <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 shadow-inner">
                                            <MapPin className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2">Registered Office</h3>
                                            <p className="text-muted-foreground">Headquarters & Operations</p>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="w-full md:w-px h-px md:h-auto bg-border/60" />

                                    {/* Address */}
                                    <div className="flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left">
                                        <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4">Address</h4>
                                        <p className="text-lg text-foreground leading-relaxed font-medium">
                                            Rajendra Nagar<br />
                                            Patna, Bihar<br />
                                            <span className="text-muted-foreground">800016</span>
                                        </p>
                                    </div>

                                    {/* Divider */}
                                    <div className="w-full md:w-px h-px md:h-auto bg-border/60" />

                                    {/* Contact */}
                                    <div className="flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left">
                                        <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4">Contact Details</h4>
                                        <div className="space-y-3">
                                            <a href="mailto:support@swasthify.in" className="block text-lg font-medium text-foreground hover:text-emerald-600 transition-colors">
                                                support@swasthify.in
                                            </a>
                                            <a href="tel:+919759225515" className="block text-lg font-medium text-foreground hover:text-emerald-600 transition-colors">
                                                +91 97592 25515
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
