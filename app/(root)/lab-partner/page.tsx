"use client"

import {
    FlaskConical,
    Microscope,
    Clock,
    TrendingUp,
    ShieldCheck,
    Star,
    Award
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import LabRegistrationForm from "@/components/root/LabRegistrationForm"
import { FAQ } from "@/components/root/FAQ"

export default function LabPartnerPage() {

    const scrollToForm = () => {
        const element = document.getElementById("registration-form");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="min-h-screen bg-background w-full overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative bg-linear-to-br from-primary/10 via-background to-background pt-20 pb-20 md:pt-32 md:pb-40 overflow-hidden w-full">
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-5xl mx-auto text-center space-y-6 md:space-y-8 mb-16">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm md:text-base mb-2 md:mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            Partner with India's Fastest Growing Network
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-6 duration-700">
                            Join Swasthify as a <span className="text-primary">Lab Partner</span>
                        </h1>
                        <h2 className="text-xl md:text-3xl lg:text-4xl font-medium text-muted-foreground animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                            Expand Your Reach. Streamline Operations. Deliver Precision.
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200 px-4">
                            Connect with thousands of patients and doctors. Digitize your lab reports, manage home collections, and grow your diagnostic business with Swasthify.
                        </p>
                    </div>

                    {/* Integrated Full Width Form */}
                    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
                        <LabRegistrationForm />
                    </div>
                </div>
                {/* Decorative background elements */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 opacity-70 pointer-events-none" />
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-3xl -z-10 opacity-70 pointer-events-none" />
            </section>

            {/* Why Partner Section */}
            <section className="py-16 md:py-24 bg-muted/30 w-full">
                <div className="container max-w-7xl mx-auto px-4 md:px-6">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">Why Partner with Swasthify?</h2>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto px-2">
                            Transform your diagnostic center into a digital powerhouse with our comprehensive lab management ecosystem.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {[
                            {
                                icon: TrendingUp,
                                title: "Boost Patient Volume",
                                desc: "Get listed on our platform and receive bookings from local patients and doctor referrals directly."
                            },
                            {
                                icon: FlaskConical,
                                title: "Digital Reports",
                                desc: "Offer modern digital reports to patients. Secure storage and easy sharing makes your lab the preferred choice."
                            },
                            {
                                icon: Clock,
                                title: "Home Collection Management",
                                desc: "Efficiently manage phlebotomist schedules and verify sample collections with our integrated tools."
                            },
                            {
                                icon: Award,
                                title: "Build Trust",
                                desc: "Verified partner badge and patient reviews help build credibility and attract more high-quality clientele."
                            },
                            {
                                icon: Microscope,
                                title: "Advanced Analytics",
                                desc: "Track your test volumes, revenue, and popular packages with detailed business insights dashboard."
                            },
                            {
                                icon: ShieldCheck,
                                title: "Zero Paperwork",
                                desc: "Automate billing, invoicing, and report generation. Focus on quality diagnostics while we handle the admin."
                            }
                        ].map((feature, idx) => (
                            <Card key={idx} className="border-none shadow-lg hover:shadow-2xl transition-all duration-300 bg-card group h-full">
                                <CardHeader>
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center text-primary mb-4">
                                        <feature.icon className="w-7 h-7" />
                                    </div>
                                    <CardTitle className="text-xl md:text-2xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                                        {feature.desc}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 md:py-24  w-full">
                <div className="container max-w-7xl mx-auto px-4 md:px-6">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">How It Works</h2>
                        <p className="text-lg text-muted-foreground">Digital transformation in 4 simple steps</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative">
                        {[
                            { step: "01", title: "Register Lab", desc: "Sign up with your business details and valid licenses." },
                            { step: "02", title: "List Tests", desc: "Add your test menu, packages, and pricing to the catalog." },
                            { step: "03", title: "Verify & Go Live", desc: "Our team verifies your compliance and activates your profile." },
                            { step: "04", title: "Get Bookings", desc: "Start receiving test bookings and home collection requests." }
                        ].map((item, idx) => (
                            <div key={idx} className="relative group h-full">
                                <div className="bg-background rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all border border-border/50 h-full flex flex-col items-center text-center md:items-start md:text-left">
                                    <div className="text-5xl md:text-6xl font-bold text-primary/10 mb-6 group-hover:text-primary/20 transition-colors">
                                        {item.step}
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold mb-3">{item.title}</h3>
                                    <p className="text-muted-foreground text-base md:text-lg">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 md:py-24 w-full">
                <div className="container max-w-7xl mx-auto px-4 md:px-6">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-16">Partner Success Stories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {[
                            {
                                name: "City Diagnostics",
                                location: "Mumbai",
                                text: "Since partnering with Swasthify, our home collection efficiency has improved by 40%. The app makes it so easy to track phlebotomists."
                            },
                            {
                                name: "Apex Pathology",
                                location: "Delhi",
                                text: "The digital reporting system is a game changer. Patients love getting reports on their phone, and we save huge costs on printing."
                            },
                            {
                                name: "Care Labs",
                                location: "Bangalore",
                                text: "Revenue from online bookings has doubled in just 3 months. The dashboard insights helped us price our health packages better."
                            },
                            {
                                name: "MediQuest",
                                location: "Hyderabad",
                                text: "Seamless onboarding and excellent support. Swasthify is truly a partner in our growth, not just an aggregator."
                            }
                        ].map((t, idx) => (
                            <Card key={idx} className="bg-background border-none shadow-md hover:shadow-xl transition-all duration-300 p-2 md:p-4">
                                <CardContent className="pt-6">
                                    <div className="flex gap-1 text-yellow-400 mb-4">
                                        {[1, 2, 3, 4, 5].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-lg md:text-xl text-muted-foreground italic mb-8 leading-relaxed">"{t.text}"</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                            {t.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">{t.name}</h4>
                                            <span className="text-sm text-primary font-medium">{t.location}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            {/* FAQ Section */}
            <FAQ
                items={[
                    { question: "What documents are needed to join?", answer: "You need valid registration certificates (NABL/NABH preferred), address proof, and GSTIN (if applicable)." },
                    { question: "Can I set my own test prices?", answer: "Yes, you have full control over your pricing. You can also create special discounted packages for Swasthify users." },
                    { question: "How are home collections managed?", answer: "You can use your own phlebotomists managed via our app, or partner with our logistics network in select cities." },
                    { question: "When do I get paid?", answer: "Settlements for online payments are processed weekly directly to your registered bank account." },
                    { question: "Is there a joining fee?", answer: "Currently, there is no joining fee. We operate on a small commission model per successful booking." },
                    { question: "How do I deliver reports?", answer: "You can upload PDF reports directly to the dashboard, which are instantly available to the patient and referring doctor." },
                ]}
            />
        </div>
    )
}