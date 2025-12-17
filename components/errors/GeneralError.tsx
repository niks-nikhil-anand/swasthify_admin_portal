"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

interface GeneralErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GeneralError({ error, reset }: GeneralErrorProps) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-destructive/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-xl w-full text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center"
                >
                    <div className="p-4 bg-destructive/10 rounded-full">
                        <AlertCircle className="w-16 h-16 text-destructive" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="space-y-4"
                >
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Something went wrong!
                    </h1>
                    <div className="space-y-2">
                        <p className="text-muted-foreground text-lg">
                            We apologize for the inconvenience. An unexpected error has occurred.
                        </p>
                        {process.env.NODE_ENV === 'development' && (
                            <div className="mt-4 p-4 bg-muted rounded-lg text-left overflow-auto max-h-40 text-xs font-mono">
                                <p className="font-bold text-destructive">Error details:</p>
                                <p>{error.message || "Unknown error"}</p>
                                {error.digest && <p className="text-muted-foreground mt-1">Digest: {error.digest}</p>}
                            </div>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Button
                        onClick={reset}
                        size="lg"
                        className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Try Again
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto gap-2"
                    >
                        <Link href="/">
                            <Home className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
