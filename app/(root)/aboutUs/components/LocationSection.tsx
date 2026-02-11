"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function LocationSection() {
    return (
        <section className="py-12 md:py-20 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="w-full">
                    <div className="text-center mb-10 md:mb-12">
                        <Badge variant="outline" className="px-4 py-1.5 text-sm border-primary/20 text-primary bg-primary/5 mb-4">
                            Our Presence
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Where to Find Us</h2>
                        <p className="text-muted-foreground text-lg">
                            Our registered office is located in the heart of Patna, Bihar.
                        </p>
                    </div>

                    <Card className="border-border/50 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500 ">
                        <CardContent className="p-0">
                            <div className="grid md:grid-cols-2">
                                <div className="p-8 md:p-12 space-y-6">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                                        <MapPin className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">Registered Office</h3>
                                        <p className="text-lg text-muted-foreground leading-relaxed">
                                            Rajendra nagar<br />
                                            Patna, Bihar<br />
                                            800016
                                        </p>
                                    </div>
                                    <div className="pt-4">
                                        <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Contact Details</div>
                                        <p className="text-muted-foreground font-medium">support@swasthify.com</p>
                                        <p className="text-muted-foreground/80">+91 97592 25515</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
