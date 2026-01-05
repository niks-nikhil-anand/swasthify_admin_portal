import Image from "next/image";
import Link from "next/link";

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
        { label: "Lab Tests", href: "/lab-test" },
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

                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Image src="/logo.png" alt="Swasthify Logo" width={32} height={32} className="h-8 w-8 object-contain" />
                            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                Swasthify
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
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
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>support@swasthify.com</li>
                            <li>+91 123 456 7890</li>
                        </ul>
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
