"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-background pt-16 pb-20 md:pt-24 md:pb-32 lg:pt-32 lg:pb-40">
            {/* Background Decor */}
            <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-64 h-64 bg-accent/5 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    {/* Left Column: Content */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
                        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
                            <span>Transformation Healthcare</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
                            Your Health. <br className="hidden lg:block" />
                            <span className="text-primary">One Place.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground w-full max-w-lg leading-relaxed">
                            Link your ABHA, book trusted doctors, and manage lab reports securely.  Expert healthcare is just a click away.
                        </p>

                        {/* Search Bar - Simplified */}
                        <div className="w-full max-w-md p-2 bg-background border border-border rounded-full shadow-lg flex items-center gap-2">
                            <div className="pl-4 text-muted-foreground">
                                <Search className="w-5 h-5" />
                            </div>
                            <Input
                                type="text"
                                placeholder="Search doctors, specialities, symptoms..."
                                className="border-0 shadow-none focus-visible:ring-0 px-2 h-10 text-base"
                            />
                            <Button className="rounded-full px-6">Search</Button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
                            <Link href="/doctors" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto rounded-full text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30">
                                    Book Appointment
                                </Button>
                            </Link>
                            <Link href="/about-us" className="w-full sm:w-auto">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full text-base font-semibold">
                                    Learn More
                                </Button>
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex items-center gap-8 pt-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-background" />
                                    <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-background" />
                                    <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-background" />
                                </div>
                                <span className="font-medium">10k+ Patients</span>
                            </div>
                            <div className="w-[1px] h-4 bg-border" />
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-foreground text-lg">4.9/5</span>
                                <span>Ratings</span>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Image */}
                    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/50 bg-muted aspect-[4/3] lg:aspect-square">
                            <Image
                                src="/hero-doctor.png"
                                alt="Doctor consulting patient"
                                fill
                                className="object-cover"
                                priority
                            />

                            {/* Floating Stats Card 1 */}
                            <div className="absolute top-8 right-8 bg-background/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-border/50 max-w-[160px] animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <span className="text-xl font-bold">500+</span>
                                </div>
                                <p className="text-xs text-muted-foreground font-medium">Specialist Doctors</p>
                            </div>

                            {/* Floating Stats Card 2 */}
                            <div className="absolute bottom-12 left-8 bg-background/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-border/50 max-w-[180px] animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    <span className="text-sm font-semibold">24/7 Support</span>
                                </div>
                                <p className="text-xs text-muted-foreground">Always here for you.</p>
                            </div>
                        </div>

                        {/* Decorative blob behind image */}
                        <div className="absolute -inset-4 -z-10 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-[2.5rem] blur-2xl opacity-40" />
                    </div>

                </div>
            </div>
        </section>
    );
}
