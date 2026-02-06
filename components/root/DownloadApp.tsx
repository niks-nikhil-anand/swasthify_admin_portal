"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function DownloadApp() {
    return (
        <section className="py-24 bg-muted/30 dark:bg-muted/10 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-0">

                    {/* Left Side - Mobile App Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full lg:w-5/12 flex justify-center lg:justify-end relative order-2 lg:order-1 px-4 lg:px-0"
                    >
                        {/* Decorative Elements */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] lg:w-[120%] lg:h-[120%] bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-3xl -z-10" />

                        <div className="relative z-10 w-full max-w-[360px] md:max-w-md lg:max-w-full">
                            <Image
                                src="/images/swasthify_app_mockup.png"
                                alt="Swasthify Mobile App Interface"
                                width={500}
                                height={500}
                                className="object-contain drop-shadow-2xl rounded-lg w-full h-auto"
                                priority
                            />
                        </div>
                    </motion.div>

                    {/* Right Side - Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-5/12 order-1 lg:order-2 text-center lg:text-left"
                    >
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground mb-6 leading-tight"
                        >
                            Download the <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 rounded-md">Swasthify App</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1, duration: 0.6 }}
                            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl md:mx-0 mx-auto leading-relaxed"
                        >
                            Access video consultation with India's top doctors. Connect online 24/7 from the comfort of your home.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="mb-12"
                        >
                            <label className="block text-sm font-semibold text-foreground mb-4 opacity-80">
                                Get the link to download the app
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0 w-full">
                                <div className="flex flex-1 gap-3 bg-background/50 dark:bg-muted/20 backdrop-blur-md p-1 rounded-2xl border border-border shadow-lg shadow-black/5 items-center">
                                    <span className="inline-flex items-center px-4 py-2 text-foreground font-medium rounded-xl bg-gray-50/50 dark:bg-muted/50">
                                        +91
                                    </span>
                                    <input
                                        type="tel"
                                        placeholder="Enter phone number"
                                        className="flex-1 px-2 py-2 bg-transparent border-none focus:ring-0 focus:outline-none text-base w-full placeholder:text-gray-400"
                                    />
                                </div>
                                <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary/25 hover:shadow-primary/30 hover:-translate-y-0.5 w-full sm:w-auto">
                                    Send SMS
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="flex gap-4 justify-center lg:justify-start w-full"
                        >
                            <button className="flex flex-1 md:flex-none items-center justify-center md:justify-start gap-3 bg-foreground text-background px-4 py-2.5 rounded-xl hover:bg-foreground/90 transition-all hover:shadow-lg hover:-translate-y-1 shadow-md min-w-0 md:min-w-[200px] border border-transparent hover:border-gray-700">
                                <Image
                                    src="/icons/playstore.png"
                                    alt="Google Play"
                                    width={28}
                                    height={28}
                                    className="w-6 h-6 md:w-7 md:h-7 object-contain shrink-0"
                                />
                                <div className="text-left min-w-0">
                                    <div className="text-[10px] font-medium leading-none mb-1 opacity-80 truncate">GET IT ON</div>
                                    <div className="text-sm md:text-base font-bold leading-none truncate">Google Play</div>
                                </div>
                            </button>

                            <button className="flex flex-1 md:flex-none items-center justify-center md:justify-start gap-3 bg-foreground text-background px-4 py-2.5 rounded-xl hover:bg-foreground/90 transition-all hover:shadow-lg hover:-translate-y-1 shadow-md min-w-0 md:min-w-[200px] border border-transparent hover:border-gray-700">
                                <Image
                                    src="/icons/app-store.png"
                                    alt="App Store"
                                    width={28}
                                    height={28}
                                    className="w-6 h-6 md:w-7 md:h-7 object-contain shrink-0"
                                />
                                <div className="text-left min-w-0">
                                    <div className="text-[10px] font-medium leading-none mb-1 opacity-80 truncate">Download on the</div>
                                    <div className="text-sm md:text-base font-bold leading-none truncate">App Store</div>
                                </div>
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
