"use client";

import { motion } from "framer-motion";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function LabFAQ() {
    const faqs = [
        {
            question: "How does home sample collection work?",
            answer: "Once you book a test, our certified phlebotomist will visit your home at your selected slot. They will collect samples safely using sterile, single-use kits and transport them to our NABL-accredited labs in temperature-controlled containers."
        },
        {
            question: "When will I receive my test reports?",
            answer: "Most routine test reports are delivered within 24 hours via email and are also available on the app/website. Specialized tests may take 48-72 hours."
        },
        {
            question: "Do I need to fast before the test?",
            answer: "Fasting requirements vary by test. For Lipid Profile, Fasting Blood Sugar, or Thyroid tests, 10-12 hours of fasting is typically recommended. Specific instructions are provided for each test during booking."
        },
        {
            question: "Are your labs NABL accredited?",
            answer: "Yes, all our partner labs are NABL and CAP accredited, ensuring the highest standards of accuracy and reliability for your test results."
        },
        {
            question: "Is home sample collection safe?",
            answer: "Absolutely. Our phlebotomists follow strict hygiene protocols, including wearing PPE, using fresh gloves, and sealing samples immediately. We prioritize your safety and comfort."
        },
        {
            question: "Can I reschedule my appointment?",
            answer: "Yes, you can easily reschedule or cancel your appointment through the app or website up to 2 hours before the scheduled slot without any cancellation charges."
        }
    ];

    return (
        <section className="py-24 bg-muted/30 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Header Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-4"
                    >
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground mb-6 leading-tight">
                            Frequently Asked <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 rounded-md">Questions</span>
                        </h2>
                        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-8">
                            Got questions? We have answers. Find everything you need to know about our health services and portal.
                        </p>
                    </motion.div>

                    {/* Accordion Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-8"
                    >
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {faqs.map((faq, index) => (
                                <AccordionItem key={index} value={`item-${index}`} className="border border-border/50 rounded-xl px-2 bg-background data-[state=open]:border-primary/20 data-[state=open]:bg-primary/5 transition-all">
                                    <AccordionTrigger className="text-left text-lg font-medium px-4 hover:no-underline hover:text-primary transition-colors">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed px-4 pb-4 text-base">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
