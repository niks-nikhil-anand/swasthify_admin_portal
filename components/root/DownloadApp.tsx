"use client";


import Image from "next/image";

export function DownloadApp() {
    return (
        <section className="py-24 bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-0">

                    {/* Left Side - Mobile App Image */}
                    <div className="w-full lg:w-5/12 flex justify-center lg:justify-end relative order-2 lg:order-1">
                        {/* Decorative Elements */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/50 rounded-full blur-3xl -z-10" />

                        <div className="relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <Image
                                src="/images/swasthify_app_mockup.png"
                                alt="Swasthify Mobile App Interface"
                                width={500}
                                height={500}
                                className="object-contain drop-shadow-2xl rounded-lg"
                                priority
                            />
                        </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="w-full lg:w-5/12 order-1 lg:order-2 text-center lg:text-left">
                        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                            Download the <span className="text-primary">Swasthify</span> app
                        </h2>

                        <p className="text-muted-foreground text-lg md:text-xl mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Access video consultation with India's top doctors.
                            Connect online 24/7 from the comfort of your home.
                        </p>

                        <div className="mb-12">
                            <label className="block text-sm font-semibold text-foreground mb-4 opacity-80">
                                Get the link to download the app
                            </label>
                            <div className="flex gap-3 max-w-md mx-auto lg:mx-0 w-full">
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
                            <button className="flex items-center gap-3 bg-foreground text-background px-6 py-3.5 rounded-xl hover:bg-foreground/90 transition-all hover:-translate-y-1 shadow-xl min-w-[200px]">
                                <svg
                                    viewBox="0 0 24 24"
                                    className="w-7 h-7 fill-current"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M5 20.5v-13l13.5 6.5-13.5 6.5z" />
                                    <path d="M14.6 11.2L4.4 1a1.5 1.5 0 0 0-1.8.2l8.4 10z" fillOpacity="0.1" />
                                    <path d="M14.6 12.8L11 9.2l-6.5 6.4 10.1-2.8z" fillOpacity="0.1" />
                                </svg>
                                <div className="text-left">
                                    <div className="text-[10px] font-medium leading-none mb-1 opacity-80">GET IT ON</div>
                                    <div className="text-base font-bold leading-none">Google Play</div>
                                </div>
                            </button>

                            <button className="flex items-center gap-3 bg-foreground text-background px-6 py-3.5 rounded-xl hover:bg-foreground/90 transition-all hover:-translate-y-1 shadow-xl min-w-[200px]">
                                <svg
                                    viewBox="0 0 24 24"
                                    className="w-7 h-7 fill-current"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-.93 3.8-.93.62 0 2.45.19 3.6 1.92-3.72 1.8-3.1 6.55 1.76 8.5-.88 1.85-2.09 3.73-4.24 2.74zm-2.8-15.6c.92-1.13.68-2.65.65-2.68-1.55.19-2.86 1.05-3.32 2.15-.3.72-.19 2.05 1.05 2.54.34-.69.88-1.42 1.62-2.01z" />
                                </svg>
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
