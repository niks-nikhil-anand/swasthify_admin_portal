"use client";

import Link from "next/link";
import { useState } from "react";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Swasthify
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-6 items-center">
                    <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Home
                    </Link>
                    <Link href="/about-us" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        About
                    </Link>
                    <Link href="/services" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Services
                    </Link>
                    <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Contact
                    </Link>
                </div>

                <div className="hidden md:flex gap-4">
                    <button className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                        Log in
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors shadow-sm">
                        Get Started
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="sr-only">Open menu</span>
                    {isOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 18 12" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-b border-border/40 bg-background p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
                    <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">Home</Link>
                    <Link href="/about-us" className="text-sm font-medium text-muted-foreground hover:text-foreground">About</Link>
                    <Link href="/services" className="text-sm font-medium text-muted-foreground hover:text-foreground">Services</Link>
                    <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">Contact</Link>
                    <div className="flex flex-col gap-2 mt-2">
                        <button className="w-full px-4 py-2 text-sm font-medium text-primary border border-primary/20 rounded-md hover:bg-primary/5">
                            Log in
                        </button>
                        <button className="w-full px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90">
                            Get Started
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
