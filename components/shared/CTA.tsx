import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface CTAProps {
    title?: React.ReactNode;
    description?: string;
    primaryAction?: {
        text: string;
        href: string;
    };
    secondaryAction?: {
        text: string;
        href: string;
    };
}

export function CTA({
    title = "Ready to experience better healthcare?",
    description = "Join thousands of users who trust Swasthify for their medical needs. Start your journey today.",
    primaryAction = { text: "Get Started Now", href: "/register/patient" },
    secondaryAction = { text: "View Services", href: "/services" }
}: CTAProps) {
    return (
        <section className="py-20 md:py-32">
            <div className="container mx-auto px-4">
                <div className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-gradient-to-b from-background to-muted/50 p-8 md:p-20 text-center">

                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-full bg-gradient-to-b from-primary/5 to-transparent blur-3xl -z-10" />

                    <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Sparkles className="w-4 h-4" />
                            <span>Transform your health journey</span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700">
                            {title}
                        </h2>

                        <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                            {description}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
                            <Button asChild size="lg" className="h-14 px-8 rounded-full text-base font-semibold w-full sm:w-auto shadow-none transition-all hover:scale-105">
                                <Link href={primaryAction.href}>
                                    {primaryAction.text}
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="ghost" className="h-14 px-8 rounded-full text-base font-medium w-full sm:w-auto hover:bg-transparent hover:text-primary transition-colors group">
                                <Link href={secondaryAction.href} className="flex items-center gap-2">
                                    {secondaryAction.text}
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
