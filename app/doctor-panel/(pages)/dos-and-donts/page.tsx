"use client";

import { CheckCircle2, XCircle, ShieldCheck, AlertCircle, Laptop, HeartPulse, UserCheck, MessageSquare, ClipboardCheck, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function DosAndDontsPage() {
    const dos = [
        {
            title: "Maintain Digital Records",
            description: "Strictly document every consultation and patient interaction in the platform's EMR system.",
            icon: <ClipboardCheck className="w-5 h-5 text-emerald-500" />
        },
        {
            title: "Verify Patient Identity",
            description: "Always confirm the patient's identity at the start of a video or audio consultation.",
            icon: <UserCheck className="w-5 h-5 text-emerald-500" />
        },
        {
            title: "Professional Workspace",
            description: "Conduct consultations from a well-lit, quiet, and professional environment.",
            icon: <Laptop className="w-5 h-5 text-emerald-500" />
        },
        {
            title: "Data Privacy (GDPR/HIPAA)",
            description: "Ensure patient confidentiality and secure handling of all medical data.",
            icon: <Lock className="w-5 h-5 text-emerald-500" />
        },
        {
            title: "Clear Communication",
            description: "Provide clear, written instructions and prescriptions after every session.",
            icon: <MessageSquare className="w-5 h-5 text-emerald-500" />
        }
    ];

    const donts = [
        {
            title: "Offline Prescriptions",
            description: "Avoid prescribing medications without a formal digital consultation on the platform.",
            icon: <XCircle className="w-5 h-5 text-rose-500" />
        },
        {
            title: "Personal Contact Sharing",
            description: "Never share your personal mobile number or private email with patients.",
            icon: <AlertCircle className="w-5 h-5 text-rose-500" />
        },
        {
            title: "Delayed Responding",
            description: "Don't leave patients waiting. If you are unavailable, ensure your status is updated.",
            icon: <XCircle className="w-5 h-5 text-rose-500" />
        },
        {
            title: "Insecure Data Sharing",
            description: "Refrain from sharing patient reports via unauthorized or personal social media channels.",
            icon: <ShieldCheck className="w-5 h-5 text-rose-500" />
        },
        {
            title: "Skipping Follow-ups",
            description: "Don't ignore the importance of monitoring. Always schedule follow-ups for critical cases.",
            icon: <HeartPulse className="w-5 h-5 text-rose-500" />
        }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <div className="mb-10 text-center md:text-left">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-bold tracking-tight mb-2"
                >
                    Practice Guidelines
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground"
                >
                    Essential Do's and Don'ts for healthcare professionals on Swasthify.
                </motion.p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
                {/* DO'S COLUMN */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-lg"
                    >
                        <CheckCircle2 className="w-6 h-6" />
                        The Do's - Best Practices
                    </motion.div>

                    <div className="space-y-4">
                        {dos.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 + 0.2 }}
                            >
                                <Card className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500/50" />
                                    <CardContent className="flex items-start gap-5 p-5">
                                        <div className="p-2.5 rounded-xl bg-emerald-500/10 transition-colors group-hover:bg-emerald-500/20">
                                            {item.icon}
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-base">{item.title}</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* DONT'S COLUMN */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-lg"
                    >
                        <XCircle className="w-6 h-6" />
                        The Don'ts - Risks to Avoid
                    </motion.div>

                    <div className="space-y-4">
                        {donts.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 + 0.2 }}
                            >
                                <Card className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500/50" />
                                    <CardContent className="flex items-start gap-5 p-5">
                                        <div className="p-2.5 rounded-xl bg-rose-500/10 transition-colors group-hover:bg-rose-500/20">
                                            {item.icon}
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-base">{item.title}</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Note */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-16 p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-background to-background border border-primary/20 text-center relative overflow-hidden"
            >
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                <h2 className="text-2xl font-bold mb-4">Questions about these guidelines?</h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                    Following these standards ensures the highest quality of healthcare for our patients and
                    protects your professional reputation as a Swasthify partner.
                </p>
                <button className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all">
                    Contact Compliance Officer
                </button>
            </motion.div>
        </div>
    );
}
