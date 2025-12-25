"use client"

import {
    Globe,
    Laptop,
    Clock,
    TrendingUp,
    ShieldCheck,
    Star
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import DoctorRegistrationForm from "@/components/root/DoctorRegistrationForm"

export default function DoctorProfilePage() {

    const scrollToForm = () => {
        const element = document.getElementById("registration-form");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="min-h-screen bg-background w-full overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary/10 via-background to-background pt-20 pb-20 md:pt-32 md:pb-40 overflow-hidden w-full">
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-5xl mx-auto text-center space-y-6 md:space-y-8 mb-16">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm md:text-base mb-2 md:mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            Join the Future of Healthcare
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-6 duration-700">
                            Join Swasthify as a <span className="text-primary">Doctor</span>
                        </h1>
                        <h2 className="text-xl md:text-3xl lg:text-4xl font-medium text-muted-foreground animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                            Grow Your Practice. Simplify Your Work. Deliver Better Care.
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200 px-4">
                            At Swasthify, we empower healthcare professionals to expand their reach, streamline daily operations, and connect with patients who truly value quality care.
                        </p>
                    </div>

                    {/* Integrated Full Width Form */}
                    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
                        <DoctorRegistrationForm />
                    </div>
                </div>
                {/* Decorative background elements */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 opacity-70 pointer-events-none" />
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-3xl -z-10 opacity-70 pointer-events-none" />
            </section>

            {/* Why Partner Section */}
            <section className="py-16 md:py-24 bg-background bg-muted/30 w-full">
                <div className="container max-w-7xl mx-auto px-4 md:px-6">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">Why Partner with Swasthify?</h2>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto px-2">
                            Join a trusted digital healthcare ecosystem designed to support you at every step of your practice.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {[
                            {
                                icon: Globe,
                                title: "Expand Your Reach",
                                desc: "Connect with a wider patient base beyond your physical clinic. Reach patients across regions actively seeking qualified professionals."
                            },
                            {
                                icon: Laptop,
                                title: "Your Digital Clinic",
                                desc: "Manage appointments, records, prescriptions, and follow-ups from a secure dashboard. Spend less time on admin, more on care."
                            },
                            {
                                icon: Clock,
                                title: "Flexible Practice",
                                desc: "Set your own hours, availability, and fees. Control your schedule with options for in-clinic or online consultations."
                            },
                            {
                                icon: TrendingUp,
                                title: "Professional Growth",
                                desc: "Build your digital presence with a verified profile highlighting your expertise and patient feedback to grow credibility."
                            },
                            {
                                icon: ShieldCheck,
                                title: "Secure & Compliant",
                                desc: "Industry-grade security protects your data and patient information, ensuring complete confidentiality and peace of mind."
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
                        <p className="text-lg text-muted-foreground">Simple steps to digitize your practice</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative">
                        {[
                            { step: "01", title: "Sign Up & Create Profile", desc: "Complete your profile with qualifications, experience, and preferences." },
                            { step: "02", title: "Quick Verification", desc: "Our team verifies your credentials to ensure a trusted network." },
                            { step: "03", title: "Set Availability", desc: "Choose your consultation slots and pricing with full flexibility." },
                            { step: "04", title: "Start Consulting", desc: "Begin receiving appointments and growing your practice effortlessly." }
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
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-16">Hear from our Partners</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {[
                            {
                                name: "Dr. Ananya Mehra",
                                role: "General Physician",
                                text: "Swasthify has completely transformed how I manage my practice. The platform is intuitive, and I can focus more on patient care instead of administrative work."
                            },
                            {
                                name: "Dr. Rohan Iyer",
                                role: "Orthopedic Specialist",
                                text: "The quality of patients and platform professionalism is unmatched. Verification builds trust, and flexibility allows me to manage both clinic and online seamlessly."
                            },
                            {
                                name: "Dr. Neha Kapoor",
                                role: "Dermatologist",
                                text: "Helped me grow my online presence without technical hassle. Support is responsive and the system is extremely easy to use. Great for modern practice."
                            },
                            {
                                name: "Dr. Amit Verma",
                                role: "Pediatrician",
                                text: "From appointment scheduling to digital prescriptions, everything is smooth and reliable. Swasthify truly understands the needs of doctors."
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
                                            {t.name.charAt(4)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">{t.name}</h4>
                                            <span className="text-sm text-primary font-medium">{t.role}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 md:py-24 bg-muted/30 w-full">
                <div className="container max-w-4xl mx-auto px-4 md:px-6">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-16">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {[
                            { q: "Who can join Swasthify?", a: "Registered medical practitioners including MBBS, MD, MS, BDS, AYUSH doctors, and specialists with valid credentials can join." },
                            { q: "How do I get started?", a: "Simply sign up, complete your profile, upload your credentials for verification, and set your availability. Once approved, you can start receiving appointments." },
                            { q: "Is there a cost to join?", a: "Joining Swasthify is simple and transparent. Details about consultation fees and platform charges (if any) are clearly shared during onboarding." },
                            { q: "Can I choose my own consultation timings?", a: "Yes. You have complete control over your availability, working hours, and consultation modes (online or in-clinic)." },
                            { q: "How are patient records managed?", a: "All patient records, prescriptions, and consultation history are stored securely on the platform and can be accessed anytime." },
                            { q: "Is patient data secure?", a: "Absolutely. Swasthify follows strict data security protocols and ensures compliance with healthcare data protection standards." },
                            { q: "Will I receive support if I face any issues?", a: "Yes. Our dedicated support team is available to assist you with onboarding, technical queries, or account-related concerns." },
                            { q: "How do payments work?", a: "Payments are processed securely and credited to your account as per the agreed payout cycle, with complete transparency." }
                        ].map((faq, idx) => (
                            <AccordionItem key={idx} value={`item-${idx}`} className="border rounded-xl px-4 md:px-6 data-[state=open]:bg-muted/30 transition-colors">
                                <AccordionTrigger className="text-left text-lg md:text-xl font-medium py-6 hover:no-underline">{faq.q}</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base md:text-lg pb-6 leading-relaxed">
                                    {faq.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>
        </div>
    )
}
