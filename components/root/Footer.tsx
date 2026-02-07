import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

export function Footer() {
    const quickLinks = [
        { label: "Home", href: "/" },
        { label: "Doctors", href: "/doctors" },
        { label: "Lab Tests", href: "/labs" },
        { label: "Contact", href: "/contact" },
    ];

    const services = [
        { label: "Pharmacy Partner", href: "/pharmacy_partner" },
        { label: "Lab Partner", href: "/lab-partner" },
        { label: "Doctor Partner", href: "/doctor-profile" },
        { label: "Pricing", href: "/pricing" },

    ];

    const legalLinks = [
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms of Service", href: "/termsService" },
    ];

    return (
        <footer className="relative bg-background border-t border-border/50 pt-20 pb-12 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -z-10" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -z-10" />

            <div className="container mx-auto px-4 relative">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="md:col-span-4 space-y-6">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="relative h-16 w-16 transition-transform group-hover:scale-110 duration-500">
                                <Image src="/logo.png" alt="Swasthify Logo" fill className="object-contain" />
                            </div>
                            <span className="text-3xl font-bold bg-linear-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent tracking-tight">
                                Swasthify
                            </span>
                        </Link>
                        <p className="text-muted-foreground leading-relaxed transition-colors hover:text-foreground/80 text-[15px]">
                            Empowering individuals with seamless access to world-class healthcare. Swasthify connects you with top medical experts, simplifies appointment booking, and provides secure management of your digital health records and lab reports—all designed for a healthier, more convenient tomorrow.
                        </p>
                        <div className="pt-4">
                            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Follow Our Journey</h4>
                            <div className="flex gap-3">
                                {[
                                    { icon: Facebook, label: "Facebook", color: "hover:bg-blue-600" },
                                    { icon: Twitter, label: "Twitter", color: "hover:bg-sky-500" },
                                    { icon: Instagram, label: "Instagram", color: "hover:bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600" },
                                    { icon: Linkedin, label: "LinkedIn", color: "hover:bg-blue-700" }
                                ].map((social) => (
                                    <a
                                        key={social.label}
                                        href="#"
                                        aria-label={social.label}
                                        className={cn(
                                            "h-10 w-10 flex items-center justify-center rounded-xl bg-muted/50 text-muted-foreground hover:text-white transition-all duration-300 border border-border/50",
                                            social.color
                                        )}
                                    >
                                        <social.icon className="h-4 w-4" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-2">
                        <h3 className="font-bold text-foreground mb-6 text-lg tracking-tight">Quick Links</h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary transition-all duration-200 flex items-center group text-[15px]"
                                    >
                                        <span className="h-1 w-0 bg-primary mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-200 rounded-full" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="md:col-span-2">
                        <h3 className="font-bold text-foreground mb-6 text-lg tracking-tight">Services</h3>
                        <ul className="space-y-3">
                            {services.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary transition-all duration-200 flex items-center group text-[15px]"
                                    >
                                        <span className="h-1 w-0 bg-primary mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-200 rounded-full" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="md:col-span-4">
                        <h3 className="font-bold text-foreground mb-6 text-lg tracking-tight">Get in Touch</h3>
                        <div className="bg-muted/30 p-6 rounded-2xl border border-border/50 backdrop-blur-sm">
                            <ul className="space-y-4 text-[15px] text-muted-foreground">
                                <li className="flex items-center gap-4 group">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <a href="mailto:support@swasthify.com" className="hover:text-primary transition-colors">
                                        support@swasthify.com
                                    </a>
                                </li>
                                <li className="flex items-center gap-4 group">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <a href="tel:+919759225515" className="hover:text-primary transition-colors">
                                        +91 97592 25515
                                    </a>
                                </li>
                                <li className="flex items-start gap-4 group">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <span className="leading-snug">Rajendra nagar Patna Bihar 800016</span>
                                </li>
                            </ul>
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
