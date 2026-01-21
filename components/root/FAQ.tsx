"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQProps {
    items?: FAQItem[];
    title?: string;
    description?: string;
}

export function FAQ({ items, title = "Frequently Asked Questions", description = "Got questions? We have answers. Find everything you need to know about Swasthify." }: FAQProps) {
    const defaultFaqs = [
        {
            question: "How do I book an appointment?",
            answer: "You can search for a doctor by specialty or name, view their profile, and select a convenient time slot. You can choose between video consultation or in-clinic visit."
        },
        {
            question: "Is my health data secure?",
            answer: "Yes, Swasthify takes data privacy very seriously. All your health records are encrypted and stored securely. We follow strict data protection guidelines."
        },
        {
            question: "Can I book appointments for family members?",
            answer: "Absolutely! You can add family members to your profile and manage their appointments and health records easily from one account."
        },
        {
            question: "What is ABHA ID?",
            answer: "ABHA (Ayushman Bharat Health Account) is a unique health ID for Indian citizens. Linking it with Swasthify helps you access your digital health records seamlessly."
        },
        {
            question: "How do I get my prescription?",
            answer: "After your consultation, the digital prescription will be instantly available in your app. You can download it or share it with pharmacies directly."
        }
    ];

    const faqs = items || defaultFaqs;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Header Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-4"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
                            {title.split(' ').map((word, i, arr) => (
                                i === arr.length - 1 ? (
                                    <span key={i}>
                                        <br className="hidden lg:block" /> {word}
                                    </span>
                                ) : (
                                    <span key={i}>{word} </span>
                                )
                            ))}
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            {description}
                        </p>
                    </motion.div>

                    {/* Accordion Column */}
                    <div className="lg:col-span-8">
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            <motion.div
                                variants={container}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true }}
                            >
                                {faqs.map((faq, index) => (
                                    <motion.div key={index} variants={item}>
                                        <AccordionItem value={`item-${index}`} className="border border-border/50 rounded-xl px-2 bg-background data-[state=open]:border-primary/20 data-[state=open]:bg-primary/5 transition-all mb-4">
                                            <AccordionTrigger className="text-left text-lg font-medium px-4 hover:no-underline hover:text-primary transition-colors">
                                                {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground leading-relaxed px-4 pb-4 text-base">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    );
}
