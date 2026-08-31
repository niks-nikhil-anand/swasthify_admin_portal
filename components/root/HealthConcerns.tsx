"use client";

import Link from "next/link";
import { ArrowUpRight, Brain, HeartPulse, Baby, Bone, Dna, Flower2, Salad, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";

const concerns = [
    { label: "Fever & cold", icon: Stethoscope }, { label: "Headache", icon: Brain }, { label: "Heart health", icon: HeartPulse }, { label: "Women's health", icon: Flower2 },
    { label: "Child health", icon: Baby }, { label: "Joint pain", icon: Bone }, { label: "Digestive health", icon: Salad }, { label: "Skin concerns", icon: Dna },
];

export function HealthConcerns() {
    return <section className="bg-muted/35 py-20 md:py-28"><div className="container mx-auto px-4"><div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div className="max-w-2xl"><p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-primary">Start with how you feel</p><h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Not sure which doctor you need?</h2><p className="mt-3 text-lg leading-relaxed text-muted-foreground">Tell us what you’re looking for and we’ll help you find the right care.</p></div><Link href="/specialities" className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:gap-3">View all specialties <ArrowUpRight className="h-4 w-4" /></Link></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">{concerns.map(({ label, icon: Icon }, index) => <motion.div key={label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}><Link href="/doctors" className="group flex min-h-28 h-full items-center gap-3 rounded-2xl border border-border/70 bg-background p-4 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 md:min-h-32 md:flex-col md:items-start md:justify-between md:p-5"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"><Icon className="h-5 w-5" /></div><span className="text-sm font-semibold text-foreground md:text-base">{label}</span></Link></motion.div>)}</div></div></section>;
}
