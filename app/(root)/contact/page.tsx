"use client";

import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="bg-muted/40 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Have questions about our services or need assistance? We're here to help.
                        Reach out to us and we'll respond as soon as possible.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

                        {/* Contact Information */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                                <p className="text-muted-foreground mb-8 text-lg">
                                    Fill out the form or contact us directly using the details below.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Phone Number</h3>
                                        <p className="text-muted-foreground">+91 98765 43210</p>
                                        <p className="text-muted-foreground">+91 12345 67890</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Email Address</h3>
                                        <p className="text-muted-foreground">support@swasthify.com</p>
                                        <p className="text-muted-foreground">info@swasthify.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Office Location</h3>
                                        <p className="text-muted-foreground">
                                            123 Health Tech Park, Sector 62,<br />
                                            Noida, Uttar Pradesh, 201301
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Business Hours</h3>
                                        <p className="text-muted-foreground">Mon - Fri: 9:00 AM - 8:00 PM</p>
                                        <p className="text-muted-foreground">Sat - Sun: 10:00 AM - 6:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <MessageSquare className="w-6 h-6 text-primary" />
                                Send us a Message
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="block text-sm font-medium pb-1">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder="John Doe"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="block text-sm font-medium pb-1">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="john@example.com"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="block text-sm font-medium pb-1">Phone Number</label>
                                        <div className="flex bg-background border border-input rounded-lg ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 overflow-hidden items-center">
                                            <div className="bg-muted px-3 py-2 border-r border-input text-muted-foreground text-sm font-medium">
                                                +91
                                            </div>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                placeholder="9876543210"
                                                required
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="flex h-12 w-full bg-transparent px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 border-none rounded-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="subject" className="block text-sm font-medium pb-1">Subject</label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            placeholder="How can we help?"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="message" className="block text-sm font-medium pb-1">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        placeholder="Tell us more about your inquiry..."
                                        rows={6}
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="flex w-full rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary text-primary-foreground h-12 px-6 font-bold shadow-md hover:bg-primary/90 transition-all disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    {isSubmitting ? (
                                        "Sending..."
                                    ) : (
                                        <>
                                            Send Message <Send className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
