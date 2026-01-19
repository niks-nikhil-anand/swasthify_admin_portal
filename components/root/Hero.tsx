"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-primary/5 pt-16 pb-20 md:pt-24 md:pb-32 lg:pt-32 lg:pb-40">
            {/* Background Decor */}
            <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    {/* Left Column: Content */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
                        <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary backdrop-blur-sm animate-in fade-in zoom-in duration-500 delay-100">
                            Transforming Healthcare
                        </Badge>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                            Your Health. <br className="hidden lg:block" />
                            <span className="text-primary">One Place.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground w-full max-w-lg leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                            Link your ABHA, book trusted doctors, and manage lab reports securely. Expert healthcare is just a click away.
                        </p>

                        {/* Search Bar - Simplified */}
                        <div className="w-full max-w-md p-2 bg-background border border-border/50 rounded-full shadow-xl shadow-primary/5 flex items-center gap-2 animate-in fade-in zoom-in duration-700 delay-400 focus-within:ring-2 ring-primary/20 transition-all">
                            <div className="pl-4 text-muted-foreground">
                                <Search className="w-5 h-5" />
                            </div>
                            <Input
                                type="text"
                                placeholder="Search doctors, specialities, symptoms..."
                                className="border-0 shadow-none focus-visible:ring-0 px-2 h-10 text-base bg-transparent"
                            />
                            <Button className="rounded-full px-6 h-10 shadow-lg">Search</Button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                            <Link href="/doctors" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto rounded-full text-base font-semibold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all">
                                    Book Appointment <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                            <Link href="/about-us" className="w-full sm:w-auto">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full text-base font-semibold border-primary/20 bg-background/50 backdrop-blur-sm hover:bg-background/80">
                                    Learn More
                                </Button>
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex items-center gap-8 pt-6 text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-3">
                                    <div className="relative w-9 h-9 rounded-full border-2 border-background overflow-hidden">
                                        <Image src="/patient-a.png" alt="Patient A" fill className="object-cover" />
                                    </div>
                                    <div className="relative w-9 h-9 rounded-full border-2 border-background overflow-hidden">
                                        <Image src="/patient-b.png" alt="Patient B" fill className="object-cover" />
                                    </div>
                                    <div className="relative w-9 h-9 rounded-full border-2 border-background overflow-hidden">
                                        <Image src="/patient-c.png" alt="Patient C" fill className="object-cover" />
                                    </div>
                                </div>
                                <span className="font-medium ml-2">10k+ Patients</span>
                            </div>
                            <div className="w-[1px] h-4 bg-border" />
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-foreground text-lg">4.9/5</span>
                                <span>Ratings</span>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Image */}
                    <div className="relative mx-auto w-full max-w-xl lg:max-w-none animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-border/50 bg-muted aspect-[4/3] lg:aspect-square group">
                            <Image
                                src="/hero-doctor.png"
                                alt="Doctor consulting patient"
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                priority
                            />

                            {/* Floating Stats Card 1 */}
                            <div className="absolute top-12 right-8 bg-background/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-border/50 max-w-[170px] animate-in fade-in zoom-in duration-700 delay-500 hover:scale-110 transition-transform cursor-pointer">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <span className="text-2xl font-bold bg-gradient-to-tr from-green-600 to-emerald-500 bg-clip-text text-transparent">500+</span>
                                </div>
                                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Specialist Doctors</p>
                            </div>

                            {/* Floating Stats Card 2 */}
                            <div className="absolute bottom-12 left-8 bg-background/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-border/50 max-w-[190px] animate-in fade-in zoom-in duration-700 delay-700 hover:scale-110 transition-transform cursor-pointer">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-sm font-bold">24/7 Support</span>
                                </div>
                                <p className="text-xs text-muted-foreground">Always here for you.</p>
                            </div>
                        </div>

                        {/* Decorative blob behind image */}
                        <div className="absolute -inset-4 -z-10 bg-gradient-to-tr from-primary/30 to-accent/30 rounded-[3rem] blur-3xl opacity-30 animate-pulse" />
                    </div>

                </div>
            </div>
        </section>
    );
}
