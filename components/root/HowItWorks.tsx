"use client";

import { Calendar, Search, Stethoscope, FileText } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export function HowItWorks() {
    const steps = [
        {
            icon: Search,
            image: "/care-search-doctor-3d.png",
            title: "Search Doctor",
            description: "Find the best specialist near you or online for your specific needs."
        },
        {
            icon: Calendar,
            image: "/care-book-appointment-3d.png",
            title: "Book Appointment",
            description: "Choose a convenient time slot and book your appointment instantly."
        },
        {
            icon: Stethoscope,
            image: "/care-consultation-3d.png",
            title: "Consultation",
            description: "Visit the clinic or consult via video call with our expert doctors."
        },
        {
            icon: FileText,
            image: "/care-prescription-3d.png",
            title: "Get Prescription",
            description: "Receive your digital prescription and medical records securely."
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <section className="relative overflow-hidden bg-transparent py-20 md:py-28">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
            <div className="container relative mx-auto px-4">
                <div className="mx-auto mb-14 max-w-2xl text-center md:mb-20">
                    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                        <span className="h-2 w-2 rounded-full bg-primary" /> Your care journey
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl"
                    >
                        Healthcare made <span className="text-emerald-600 dark:text-emerald-400">simple</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
                    >
                        From finding care to keeping your records together, every step feels easier.
                    </motion.p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="relative grid gap-4 md:grid-cols-4 md:gap-5"
                >
                    <div aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-12 hidden h-px bg-linear-to-r from-primary/20 via-primary/60 to-primary/20 md:block" />
                    {steps.map((step, index) => (
                        <motion.div key={index} variants={item} className="group relative flex min-h-[154px] flex-row items-center gap-4 rounded-3xl border border-border/70 bg-card/75 p-4 text-left shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 sm:min-h-[168px] sm:p-5 md:min-h-0 md:flex-col md:items-center md:p-6 md:text-center">
                            {index < steps.length - 1 && <div aria-hidden="true" className="absolute bottom-[-18px] left-[35px] top-[76px] w-px bg-linear-to-b from-primary/50 to-primary/10 md:hidden" />}
                            <motion.div
                                whileHover={{ scale: 1.06 }}
                                className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-background shadow-lg shadow-primary/10 transition-all duration-300 group-hover:border-primary/60 group-hover:bg-primary/5 md:mb-6 md:h-24 md:w-24 md:rounded-3xl"
                            >
                                <Image src={step.image} alt="" width={112} height={112} className="h-14 w-14 object-contain md:h-20 md:w-20" />
                                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-4 border-background bg-primary text-xs font-bold text-primary-foreground">{String(index + 1).padStart(2, "0")}</span>
                            </motion.div>

                            <div className="relative z-10"><h3 className="mb-1.5 text-base font-bold text-foreground md:mb-2 md:text-lg">{step.title}</h3>
                            <p className="text-[13px] leading-6 text-muted-foreground md:text-[15px] md:leading-relaxed">
                                {step.description}
                            </p></div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
