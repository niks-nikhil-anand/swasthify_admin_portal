"use client";

import Image from "next/image";
import { Apple, Smartphone } from "lucide-react";

export function DownloadApp() {
    return (
        <section className="py-20 bg-background overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-6xl mx-auto">

                    {/* Left Side - Mobile App Image */}
                    <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
                        {/* Abstract background shape/blob can go here if needed */}
                        <div className="relative z-10">
                            <Image
                                src="/images/swasthify_app_mockup.png"
                                alt="Swasthify Mobile App"
                                width={400}
                                height={600}
                                className="object-contain drop-shadow-2xl"
                            />
                        </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="w-full lg:w-1/2 lg:pl-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                            Download the Swasthify app
                        </h2>

                        <p className="text-muted-foreground text-lg mb-8 max-w-lg">
                            Access video consultation with India's top doctors on the Swasthify app.
                            Connect with doctors online, available 24/7, from the comfort of your home.
                        </p>

                        <div className="mb-10">
                            <label className="block text-sm font-semibold text-foreground mb-3">
                                Get the link to download the app
                            </label>
                            <div className="flex gap-2 max-w-md">
                                <span className="inline-flex items-center px-4 py-2 border border-border bg-muted/20 text-foreground font-medium rounded-lg">
                                    +91
                                </span>
                                <input
                                    type="tel"
                                    placeholder="Enter phone number"
                                    className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                                />
                                <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2 rounded-lg transition-colors">
                                    Send SMS
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <button className="flex items-center gap-3 bg-foreground text-background px-5 py-2.5 rounded-xl hover:bg-foreground/90 transition-colors">
                                <Smartphone className="w-6 h-6" />
                                <div className="text-left">
                                    <div className="text-[10px] font-medium leading-none mb-1">GET IT ON</div>
                                    <div className="text-sm font-bold leading-none">Google Play</div>
                                </div>
                            </button>

                            <button className="flex items-center gap-3 bg-foreground text-background px-5 py-2.5 rounded-xl hover:bg-foreground/90 transition-colors">
                                <Apple className="w-6 h-6" />
                                <div className="text-left">
                                    <div className="text-[10px] font-medium leading-none mb-1">Download on the</div>
                                    <div className="text-sm font-bold leading-none">App Store</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
