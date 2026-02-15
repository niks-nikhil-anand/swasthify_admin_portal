"use client";

import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CTA } from "@/components/shared/CTA";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to send message");
            }

            toast.success("Message sent successfully!", {
                description: "We will get back to you soon."
            });
            setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.", {
                description: "Please try again later."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "phone") {
            const numericValue = value.replace(/[^0-9]/g, "").slice(0, 10);
            setFormData({ ...formData, [name]: numericValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative w-full py-12 md:py-32 overflow-hidden bg-primary/5">
                <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-background to-primary/5 opacity-50" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-primary/10 rounded-full blur-3xl -z-10" />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-xs md:text-sm lg:text-base mb-4 md:mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        We'd love to hear from you
                    </div>
                    <h1 className="text-3xl md:text-6xl font-bold tracking-tight mb-4 md:mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        Get in Touch with <span className="text-primary">Swasthify</span>
                    </h1>
                    <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 mb-4 md:mb-0">
                        Have questions about our services or need assistance? We're here to help. Reach out to us and we'll respond as soon as possible.
                    </p>
                </div>
            </section>

            <section className="py-12 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto items-start">

                        {/* Contact Information */}
                        <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Contact Information</h2>
                                <p className="text-muted-foreground text-base md:text-lg">
                                    Fill out the form or contact us directly using the details below. Our team is ready to assist you.
                                </p>
                            </div>

                            <div className="grid gap-4 md:gap-6">
                                {[
                                    {
                                        icon: Phone,
                                        title: "Phone Number",
                                        lines: ["+91 97592 25515"],
                                        color: "text-blue-500",
                                        bg: "bg-blue-500/10"
                                    },
                                    {
                                        icon: Mail,
                                        title: "Email Address",
                                        lines: ["support@swasthify.in", "info@swasthify.in"],
                                        color: "text-green-500",
                                        bg: "bg-green-500/10"
                                    },
                                    {
                                        icon: MapPin,
                                        title: "Office Location",
                                        lines: ["Rajendra Nagar, Patna, Bihar, 800016"],
                                        color: "text-purple-500",
                                        bg: "bg-purple-500/10"
                                    },
                                    {
                                        icon: Clock,
                                        title: "Business Hours",
                                        lines: ["Mon - Fri: 9:00 AM - 8:00 PM", "Sat - Sun: 10:00 AM - 6:00 PM"],
                                        color: "text-orange-500",
                                        bg: "bg-orange-500/10"
                                    }
                                ].map((item, index) => (
                                    <Card key={index} className="border-border/50 hover:shadow-lg transition-all duration-300 group overflow-hidden">
                                        <CardContent className="p-4 md:p-6 flex items-start gap-4">
                                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${item.bg} flex items-center justify-center ${item.color} shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                                <item.icon className="w-5 h-5 md:w-6 md:h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-base md:text-lg mb-1">{item.title}</h3>
                                                {item.lines.map((line, i) => {
                                                    let href = "";
                                                    let target = undefined;
                                                    let rel = undefined;

                                                    if (item.icon === Phone) {
                                                        href = `tel:${line.replace(/\s+/g, "")}`;
                                                    } else if (item.icon === Mail) {
                                                        href = `mailto:${line}`;
                                                    } else if (item.icon === MapPin) {
                                                        href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(line)}`;
                                                        target = "_blank";
                                                        rel = "noopener noreferrer";
                                                    }

                                                    if (href) {
                                                        return (
                                                            <a
                                                                key={i}
                                                                href={href}
                                                                target={target}
                                                                rel={rel}
                                                                className="block text-sm md:text-base text-muted-foreground hover:text-primary transition-colors"
                                                            >
                                                                {line}
                                                            </a>
                                                        );
                                                    }

                                                    return <p key={i} className="text-sm md:text-base text-muted-foreground">{line}</p>;
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-300 lg:mt-0">
                            <Card className="border-border/50 shadow-xl overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-primary to-accent" />
                                <CardContent className="p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-6 md:mb-8">
                                        <div className="p-2 md:p-3 rounded-full bg-primary/10 text-primary">
                                            <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold">Send us a Message</h3>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                                        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    placeholder="John Doe"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="h-10 md:h-12 bg-muted/30 focus:bg-background transition-colors"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    placeholder="john@example.com"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="h-10 md:h-12 bg-muted/30 focus:bg-background transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number</Label>
                                                <div className="relative">
                                                    <div className="absolute left-0 top-0 h-full px-3 flex items-center border-r border-input bg-muted/50 text-muted-foreground text-sm font-medium rounded-l-md">
                                                        +91
                                                    </div>
                                                    <Input
                                                        type="tel"
                                                        id="phone"
                                                        name="phone"
                                                        placeholder="9876543210"
                                                        required
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        className="h-10 md:h-12 pl-16 bg-muted/30 focus:bg-background transition-colors"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="subject">Subject</Label>
                                                <Input
                                                    id="subject"
                                                    name="subject"
                                                    placeholder="How can we help?"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    className="h-10 md:h-12 bg-muted/30 focus:bg-background transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message</Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                placeholder="Tell us more about your inquiry..."
                                                rows={6}
                                                required
                                                value={formData.message}
                                                onChange={handleChange}
                                                className="resize-y bg-muted/30 focus:bg-background transition-colors"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full h-10 md:h-12 text-base font-semibold shadow-lg hover:shadow-primary/25 transition-all"
                                        >
                                            {isSubmitting ? (
                                                "Sending..."
                                            ) : (
                                                <>
                                                    Send Message <Send className="w-4 h-4 ml-2" />
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
            <CTA
                title="Still have questions?"
                description="Our team is here to help. But if you're ready to get started, you can register for free right now."
                primaryAction={{ text: "Register Now", href: "/register" }}
                secondaryAction={{ text: "View FAQ", href: "/faqs" }}
            />
        </div>
    );
}
