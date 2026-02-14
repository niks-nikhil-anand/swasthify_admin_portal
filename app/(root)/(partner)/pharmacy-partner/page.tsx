"use client"

import {
    Store,
    Pill,
    Truck,
    Smartphone,
    TrendingUp,
    ShieldCheck
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FAQ } from "@/components/root/FAQ"
import { useState } from "react"
import { toast } from "sonner"

export default function PharmacyPartnerPage() {
    const [email, setEmail] = useState("")

    const handleJoinWaitlist = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) {
            toast.error("Please enter your email address")
            return
        }
        // Placeholder for future API call
        toast.success("Joined Waitlist!", {
            description: "We'll notify you when we launch for pharmacies."
        })
        setEmail("")
    }

    return (
        <div className="min-h-screen bg-background w-full overflow-x-hidden">
            {/* Hero Section - Coming Soon */}
            <section className="relative bg-linear-to-br from-primary/10 via-background to-background pt-24 pb-20 md:pt-40 md:pb-40 overflow-hidden w-full">
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8 mb-12">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium text-sm md:text-base mb-2 md:mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            Coming Soon to Swasthify
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-6 duration-700">
                            Digitize Your <span className="text-primary">Pharmacy</span> Business
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200 px-4">
                            We are building a comprehensive platform to help you manage inventory, receive online orders, and grow your customer base. Be the first to know when we launch.
                        </p>

                        {/* Waitlist Form */}
                        <div className="max-w-md mx-auto mt-8 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
                            <form onSubmit={handleJoinWaitlist} className="flex flex-col sm:flex-row gap-3">
                                <Input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="h-12 bg-background"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Button type="submit" size="lg" className="h-12 px-8 font-semibold">
                                    Notify Me
                                </Button>
                            </form>
                            <p className="text-sm text-muted-foreground mt-3">
                                Join 2,000+ pharmacies already on the waitlist.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-green-400/10 rounded-full blur-3xl -z-10 opacity-70 pointer-events-none" />
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-3xl -z-10 opacity-70 pointer-events-none" />
            </section>

            {/* Benefits Preview */}
            <section className="py-16 md:py-24 bg-muted/30 w-full">
                <div className="container max-w-7xl mx-auto px-4 md:px-6">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">What's Coming?</h2>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            A sneak peek into the features designed to empower your pharmacy.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {[
                            {
                                icon: Store,
                                title: "Online Storefront",
                                desc: "Create your digital store in minutes and let customers order medicines from the comfort of their homes."
                            },
                            {
                                icon: Truck,
                                title: "Hyperlocal Delivery",
                                desc: "Integrated delivery partners to help you deliver medicines efficiently to your local customers."
                            },
                            {
                                icon: Pill,
                                title: "Inventory Management",
                                desc: "Smart inventory tracking with low-stock alerts and expiration expiry management."
                            },
                            {
                                icon: Smartphone,
                                title: "Digital Prescriptions",
                                desc: "Receive and verify digital prescriptions directly from patients and doctors on the Swasthify network."
                            },
                            {
                                icon: TrendingUp,
                                title: "Business Growth",
                                desc: "Analytics and insights to help you understand sales trends and grow your revenue."
                            },
                            {
                                icon: ShieldCheck,
                                title: "Compliance Ready",
                                desc: "Built-in features to ensure your pharmacy stays compliant with the latest regulations."
                            }
                        ].map((feature, idx) => (
                            <Card key={idx} className="border-none shadow-sm hover:shadow-md transition-all bg-card/50">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-lg md:text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm md:text-base">
                                        {feature.desc}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <FAQ
                title="Common Questions"
                description="Everything you need to know about our upcoming pharmacy program."
                items={[
                    { question: "When will the pharmacy platform launch?", answer: "We are currently in the beta phase and plan to launch nationwide in Q4 2026. Join the waitlist to get early access." },
                    { question: "Do I need a drug license to join?", answer: "Yes, a valid drug license (Form 20/21) is mandatory to register as a pharmacy partner on Swasthify." },
                    { question: "Will Swasthify handle delivery?", answer: "We offer both models: you can use your own delivery staff or leverage our network of delivery partners." },
                    { question: "Can I manage inventory through the app?", answer: "Yes! Our platform includes a full-fledged inventory management system that syncs in real-time." },
                    { question: "Is there a registration fee?", answer: "Pre-registration is free. We will announce our pricing models (commission or subscription) closer to the launch date." },
                    { question: "How will I receive orders?", answer: "You will have a dedicated partner app and web dashboard to manage incoming orders, prescriptions, and deliveries." },
                ]}
            />
        </div>
    )
}