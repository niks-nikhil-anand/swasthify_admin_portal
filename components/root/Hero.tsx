"use client";

import Link from "next/link";

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-background py-20 md:py-32">
            {/* Background Decor */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-64 h-64 bg-accent/10 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="container mx-auto flex flex-col items-center text-center px-4 gap-8">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
                    <span>Transformation Healthcare</span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-4xl">
                    Your health. <span className="text-primary">One place.</span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                    Link your ABHA, book doctors, upload lab reports — secure & consent-based.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
                    <Link href="/book" className="px-8 py-3.5 text-base font-semibold text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5">
                        Book Appointment
                    </Link>
                    <Link href="/learn-more" className="px-8 py-3.5 text-base font-semibold text-foreground bg-background border border-border rounded-full hover:bg-muted/50 transition-all hover:-translate-y-0.5">
                        Learn More
                    </Link>
                </div>

                {/* Stats or Trust Indicators (Optional) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-8 border-t border-border/50 w-full max-w-4xl">
                    <div className="flex flex-col gap-1">
                        <span className="text-3xl font-bold text-foreground">10k+</span>
                        <span className="text-sm text-muted-foreground">Patients Served</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-3xl font-bold text-foreground">500+</span>
                        <span className="text-sm text-muted-foreground">Specialists</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-3xl font-bold text-foreground">24/7</span>
                        <span className="text-sm text-muted-foreground">Support</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-3xl font-bold text-foreground">4.9</span>
                        <span className="text-sm text-muted-foreground">User Rating</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
