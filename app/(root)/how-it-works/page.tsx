import { Button } from "@/components/ui/button";
import { UserPlus, Link as LinkIcon, Activity, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function HowItWorksPage() {
    const steps = [
        {
            id: 1,
            title: "Register & Login",
            description: "Create your account on Swasthify to get started.",
            details: "Sign up using your email or mobile number. Securely log in to access your dashboard.",
            icon: UserPlus,
        },
        {
            id: 2,
            title: "Link ABHA",
            description: "Connect your Ayushman Bharat Health Account.",
            details: "Seamlessly link your ABHA ID to sync your health records and avail government health schemes.",
            icon: LinkIcon,
        },
        {
            id: 3,
            title: "Manage Health Records",
            description: "Access and organize your medical history.",
            details: "Upload reports, view prescriptions, and share your digital health records with doctors securely.",
            icon: Activity,
        },
    ];

    return (
        <div className="bg-page-bg min-h-screen py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-base font-semibold leading-7 text-primary">Simple & Secure</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        How Swasthify Works
                    </p>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        Get started with your digital health journey in three simple steps.
                    </p>
                </div>

                <div className="flex flex-col gap-24">
                    {/* Main Content: Timeline */}
                    <div className="mx-auto max-w-5xl w-full">
                        <div className="relative">
                            {/* Vertical line for mobile */}
                            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border md:hidden"></div>

                            {/* Horizontal line for desktop */}
                            <div className="hidden md:block absolute left-6 right-6 top-8 h-0.5 bg-border"></div>

                            <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-3 md:gap-8 relative">
                                {steps.map((step) => (
                                    <div key={step.id} className="relative flex md:flex-col gap-6 md:gap-4 group">
                                        {/* Icon Circle */}
                                        <div className="relative z-10 flex-none h-12 w-12 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            <step.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-auto pt-1 md:pt-4 text-left md:text-center">
                                            <h3 className="text-lg font-semibold leading-6 text-foreground">
                                                {step.title}
                                            </h3>
                                            <p className="mt-2 text-sm text-muted-foreground font-medium">
                                                {step.description}
                                            </p>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                {step.details}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-16 flex justify-center">
                            <Button size="lg" className="gap-2">
                                Get Started <UserPlus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* New Section: ABHA Primer (Full Width) */}
                    <div className="mx-auto max-w-4xl w-full">
                        <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-sm text-center">
                            <h3 className="text-2xl font-bold tracking-tight text-foreground mb-4">
                                What is ABHA?
                            </h3>
                            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
                                Ayushman Bharat Health Account (ABHA) is a unique 14-digit number that allows you to access and share your digital health records digitally.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 text-left sm:text-center">
                                <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-muted/50">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Activity className="h-5 w-5" />
                                    </div>
                                    <span className="text-sm font-medium text-foreground">Securely store all your medical history in one place.</span>
                                </div>
                                <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-muted/50">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <ExternalLink className="h-5 w-5" />
                                    </div>
                                    <span className="text-sm font-medium text-foreground">Share records instantly with doctors and hospitals.</span>
                                </div>
                                <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-muted/50">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <LinkIcon className="h-5 w-5" />
                                    </div>
                                    <span className="text-sm font-medium text-foreground">Link effectively with insurance and health schemes.</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button size="lg" asChild className="w-full sm:w-auto">
                                    <Link href="#">Start linking ABHA</Link>
                                </Button>
                                <Button variant="outline" size="lg" asChild className="w-full sm:w-auto gap-2">
                                    <a href="https://abdm.gov.in/" target="_blank" rel="noopener noreferrer">
                                        ABHA Sandbox Guide <ExternalLink className="h-4 w-4" />
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
