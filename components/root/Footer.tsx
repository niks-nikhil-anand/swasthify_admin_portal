import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";

export function Footer() {
    const quickLinks = [
        { label: "Home", href: "#" },
        { label: "Doctors", href: "#" },
        { label: "How It Works", href: "/how-it-works" },
        { label: "Contact", href: "#" },
        { label: "Pricing", href: "/pricing" },
    ];

    const services = [
        { label: "Online Booking", href: "#" },
        { label: "Health Records", href: "#" },
        { label: "Join as Lab Partner", href: "/lab-partner" },
        { label: "Emergency Care", href: "#" },
        { label: "Join as Doctor", href: "/doctor-profile" },

    ];

    const legalLinks = [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
    ];

    return (
        <footer className="bg-muted/40 border-t border-border/50 py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

                    <div className="space-y-6">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="relative h-20 w-20 transition-transform group-hover:scale-110 duration-300">
                                <Image src="/logo2.jpeg" alt="Swasthify Logo" fill className="object-contain" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                Swasthify
                            </span>
                        </Link>
                        <p className="text-muted-foreground leading-relaxed max-w-xs transition-colors hover:text-foreground/80">
                            Connecting patients with the best healthcare professionals for a healthier tomorrow.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="hover:text-primary transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Services</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {services.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="hover:text-primary transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Contact</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-primary" />
                                <a href="mailto:support@swasthify.com" className="hover:text-primary transition-colors">
                                    support@swasthify.com
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary" />
                                <a href="tel:+911234567890" className="hover:text-primary transition-colors">
                                    +91 123 456 7890
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-primary mt-1" />
                                <span>123 Health Street, Wellness City, India</span>
                            </li>
                        </ul>

                        <div className="mt-6">
                            <h4 className="text-sm font-semibold text-foreground mb-3">Follow Us</h4>
                            <div className="flex gap-4">
                                <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors bg-blue-100/50 dark:bg-blue-900/20 p-2 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/40">
                                    <Facebook className="h-4 w-4" />
                                </a>
                                <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors bg-sky-100/50 dark:bg-sky-900/20 p-2 rounded-full hover:bg-sky-200 dark:hover:bg-sky-900/40">
                                    <Twitter className="h-4 w-4" />
                                </a>
                                <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors bg-pink-100/50 dark:bg-pink-900/20 p-2 rounded-full hover:bg-pink-200 dark:hover:bg-pink-900/40">
                                    <Instagram className="h-4 w-4" />
                                </a>
                                <a href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors bg-indigo-100/50 dark:bg-indigo-900/20 p-2 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-900/40">
                                    <Linkedin className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Swasthify. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        {legalLinks.map((link) => (
                            <Link key={link.label} href={link.href} className="text-muted-foreground hover:text-foreground text-sm">
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
