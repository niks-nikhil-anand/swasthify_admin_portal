"use client";

import { BadgeCheck, LockKeyhole, ShieldCheck, Star, Users } from "lucide-react";
import { motion } from "framer-motion";

const signals = [
    { value: "10,000+", label: "patients served", icon: Users },
    { value: "25+", label: "medical specialties", icon: BadgeCheck },
    { value: "4.9/5", label: "patient rating", icon: Star },
    { value: "100%", label: "secure records", icon: LockKeyhole },
];

export function TrustBar() {
    return (
        <section aria-label="Why patients trust Swasthify" className="relative z-20 -mt-6 px-4 pb-8 md:-mt-10 md:pb-16">
            <div className="container mx-auto"><div className="rounded-3xl border border-border/70 bg-card/95 p-5 shadow-[0_20px_60px_-30px_rgba(16,185,129,0.35)] backdrop-blur-xl md:p-7">
                <div className="mb-5 flex items-center justify-between gap-4"><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Trusted healthcare, built around you</p><div className="hidden items-center gap-2 text-xs font-medium text-muted-foreground sm:flex"><ShieldCheck className="h-4 w-4 text-primary" /> Secure by design</div></div>
                <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-8">{signals.map(({ value, label, icon: Icon }, index) => <motion.div key={label} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="flex items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div><div><p className="text-lg font-bold tracking-tight text-foreground md:text-xl">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div></motion.div>)}</div>
            </div></div>
        </section>
    );
}
