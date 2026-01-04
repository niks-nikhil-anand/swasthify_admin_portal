"use client";

import Image from "next/image";
import { Apple, Smartphone } from "lucide-react";

export function DownloadApp() {
    return (
        <section className="py-24 bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">

                    {/* Left Side - Mobile App Image */}
                    <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative order-2 lg:order-1">
                        {/* Decorative Elements */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/50 rounded-full blur-3xl -z-10" />

                        <div className="relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <Image
                                src="/images/swasthify_app_mockup_new.png"
                                alt="Swasthify Mobile App Interface"
                                width={600}
                                height={800}
                                className="object-contain drop-shadow-2xl scale-110"
                                priority
                            />
                        </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="w-full lg:w-1/2 lg:pl-4 order-1 lg:order-2 text-center lg:text-left">
                        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                            Download the <span className="text-primary">Swasthify</span> app
                        </h2>

                        <p className="text-muted-foreground text-lg md:text-xl mb-12 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                            Access video consultation with India's top doctors.
                            Connect online 24/7 from the comfort of your home.
                        </p>

                        <div className="mb-12">
                            <label className="block text-sm font-semibold text-foreground mb-4 opacity-80">
                                Get the link to download the app
                            </label>
                            <div className="flex gap-3 max-w-md mx-auto lg:mx-0">
                                <span className="inline-flex items-center px-4 py-3 border border-border bg-background text-foreground font-medium rounded-xl shadow-sm">
                                    +91
                                </span>
                                <input
                                    type="tel"
                                    placeholder="Enter phone number"
                                    className="flex-1 px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background shadow-sm text-base"
                                />
                                <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                                    Send SMS
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                            <button className="flex items-center gap-3 bg-foreground text-background px-6 py-3.5 rounded-xl hover:bg-foreground/90 transition-all hover:-translate-y-1 shadow-xl">
                                <Smartphone className="w-7 h-7" />
                                <div className="text-left">
                                    <div className="text-[10px] font-medium leading-none mb-1 opacity-80">GET IT ON</div>
                                    <div className="text-base font-bold leading-none">Google Play</div>
                                </div>
                            </button>

                            <button className="flex items-center gap-3 bg-foreground text-background px-6 py-3.5 rounded-xl hover:bg-foreground/90 transition-all hover:-translate-y-1 shadow-xl">
                                <Apple className="w-7 h-7" />
                                <div className="text-left">
                                    <div className="text-[10px] font-medium leading-none mb-1 opacity-80">Download on the</div>
                                    <div className="text-base font-bold leading-none">App Store</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
