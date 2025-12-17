"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                >
                    <div className="relative inline-block">
                        <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent select-none">
                            404
                        </h1>
                        <motion.div
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 10 }}
                            transition={{
                                repeat: Infinity,
                                repeatType: "reverse",
                                duration: 2,
                            }}
                            className="absolute -top-8 -right-8 text-6xl"
                        >
                            🤔
                        </motion.div>
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Page not found
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-md mx-auto">
                        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been removed, renamed, or doesn&apos;t exist.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto gap-2"
                    >
                        <Link href="javascript:history.back()">
                            <ArrowLeft className="w-4 h-4" />
                            Go Back
                        </Link>
                    </Button>
                    <Button
                        asChild
                        size="lg"
                        className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90"
                    >
                        <Link href="/">
                            <Home className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="pt-8 text-sm text-muted-foreground"
                >
                    <p>
                        If you think this is a mistake, please <Link href="/contact" className="text-primary hover:underline">contact support</Link>.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
