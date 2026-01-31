"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image src="/logo.png" alt="Swasthify Logo" width={50} height={50} className="h-10 w-10 object-contain" />
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Swasthify
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex gap-8 items-center">
                        <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                            Home
                        </Link>
                        <Link href="/about-us" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            About
                        </Link>
                        <Link href="/services" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Services
                        </Link>
                        <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Contact
                        </Link>
                        <Link href="/lab-test" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Lab Tests
                        </Link>
                        <Link href="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            How It Works
                        </Link>
                        <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Pricing
                        </Link>
                    </div>

                    <div className="hidden md:flex gap-4">
                        <Link href={"/login"}>
                            <button className="px-5 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-all shadow-md hover:shadow-primary/20">
                                Log in
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-foreground"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span className="sr-only">Open menu</span>
                        {isOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Drawer (Left Side) */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm bg-background/95 backdrop-blur-xl border-r shadow-2xl p-6 md:hidden flex flex-col gap-6"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                                    <Image src="/logo.png" alt="Swasthify Logo" width={40} height={40} className="h-10 w-10 object-contain" />
                                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                        Swasthify
                                    </span>
                                </Link>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 -mr-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/20"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="flex flex-col gap-1">
                                <Link href="/" onClick={() => setIsOpen(false)} className="px-4 py-3 text-base font-medium text-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-colors">
                                    Home
                                </Link>
                                <Link href="/about-us" onClick={() => setIsOpen(false)} className="px-4 py-3 text-base font-medium text-muted-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-colors">
                                    About
                                </Link>
                                <Link href="/services" onClick={() => setIsOpen(false)} className="px-4 py-3 text-base font-medium text-muted-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-colors">
                                    Services
                                </Link>
                                <Link href="/contact" onClick={() => setIsOpen(false)} className="px-4 py-3 text-base font-medium text-muted-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-colors">
                                    Contact
                                </Link>
                                <Link href="/lab-test" onClick={() => setIsOpen(false)} className="px-4 py-3 text-base font-medium text-muted-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-colors">
                                    Lab Tests
                                </Link>
                                <Link href="/how-it-works" onClick={() => setIsOpen(false)} className="px-4 py-3 text-base font-medium text-muted-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-colors">
                                    How It Works
                                </Link>
                                <Link href="/pricing" onClick={() => setIsOpen(false)} className="px-4 py-3 text-base font-medium text-muted-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-colors">
                                    Pricing
                                </Link>
                            </div>

                            <div className="mt-auto flex flex-col gap-3">
                                <Link href="/login" onClick={() => setIsOpen(false)}>
                                    <button className="w-full px-4 py-3 text-base font-medium text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors">
                                        Log in
                                    </button>
                                </Link>
                                <button className="w-full px-4 py-3 text-base font-medium text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                                    Get Started
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
