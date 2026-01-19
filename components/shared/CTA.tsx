import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
        <section className="pb-24 pt-0">
            <div className="container mx-auto px-4">
                <div className="bg-gray-100 rounded-[2.5rem] p-12 md:p-20 text-center text-gray-900 relative overflow-hidden shadow-2xl">
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/40 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

                    <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                            {title}
                        </h2>
                        <p className="text-gray-600 text-lg md:text-xl">
                            {description}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                            <Button asChild size="lg" className="h-14 px-8 rounded-full text-base font-bold shadow-lg hover:shadow-xl transition-all">
                                <Link href={primaryAction.href}>
                                    {primaryAction.text}
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="h-14 px-8 rounded-full text-base font-bold bg-white/50 border-gray-300 text-gray-900 hover:bg-white hover:text-primary transition-all">
                                <Link href={secondaryAction.href} className="flex items-center gap-2">
                                    {secondaryAction.text}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
