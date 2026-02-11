"use client";

import React from "react";

export function HeroSection() {
    return (
        <section className="relative w-full py-16 md:py-32 overflow-hidden bg-primary/5">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary/10 rounded-full blur-3xl -z-10" />
            <div className="absolute top-0 right-0 w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-accent/10 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto px-4 text-center relative z-10">
                <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm md:text-base mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    Our Story
                </div>
                <h1 className="text-3xl md:text-6xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    Revolutionizing <span className="text-primary">Healthcare Access</span>
                </h1>
                <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    At Swasthify, we believe quality healthcare should be accessible to everyone, everywhere. We&apos;re bridging the gap between patients and providers with technology.
                </p>
            </div>
        </section>
    );
}
