import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { FeatureComparison } from "@/components/pricing/FeatureComparison";
import { PricingFAQ } from "@/components/pricing/PricingFAQ";
import { PricingTestimonials } from "@/components/pricing/PricingTestimonials";
import { PricingCTA } from "@/components/pricing/PricingCTA";

export default function PricingPage() {
    const tiers = [
        {
            name: "Starter",
            id: "starter",
            href: "#",
            price: { monthly: "Free", annually: "Free" },
            description: "Everything you need to get started with your clinic.",
            features: [
                "1 User Seat",
                "Basic Patient Management",
                "50 Appointments/mo",
                "Basic Reports",
                "Email Support",
            ],
            cta: "Start free",
            mostPopular: false,
        },
        {
            name: "Pro",
            id: "pro",
            href: "#",
            price: { monthly: "₹2,999", annually: "₹29,990" },
            description: "Advanced features for growing clinics and hospitals.",
            features: [
                "Up to 5 User Seats",
                "Advanced Patient Records",
                "Unlimited Appointments",
                "Lab Integration",
                "API Access",
                "Priority Email & Chat Support",
            ],
            cta: "Get Started",
            mostPopular: true,
        },
        {
            name: "Enterprise",
            id: "enterprise",
            href: "#",
            price: { monthly: "Custom", annually: "Custom" },
            description: "Dedicated support and infrastructure for large healthcare networks.",
            features: [
                "Unlimited User Seats",
                "Custom API Integrations",
                "Dedicated Account Manager",
                "SLA & Uptime Guarantee",
                "On-premise Deployment Option",
                "24/7 Phone Support",
                "Dedicated Onboarding",
            ],
            cta: "Request demo",
            mostPopular: false,
        },
    ];

    return (
        <div className="bg-page-bg min-h-screen py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-base font-semibold leading-7 text-primary">Pricing</h2>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        Choose the right plan for your clinic
                    </p>
                </div>
                <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-muted-foreground">
                    Simple, transparent pricing that grows with you. Try any plan free for 14 days.
                </p>
                <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {tiers.map((tier, tierIdx) => (
                        <div
                            key={tier.id}
                            className={`flex flex-col justify-between rounded-3xl p-8 ring-1 xl:p-10 ${tier.mostPopular
                                ? "bg-white/5 ring-2 ring-primary relative"
                                : "bg-white ring-gray-200 dark:bg-gray-900/50 dark:ring-gray-800"
                                }`}
                        >
                            <div>
                                <div className="flex items-center justify-between gap-x-4">
                                    <h3
                                        id={tier.id}
                                        className={`text-lg font-semibold leading-8 ${tier.mostPopular ? "text-primary" : "text-foreground"
                                            }`}
                                    >
                                        {tier.name}
                                    </h3>
                                    {tier.mostPopular ? (
                                        <p className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold leading-5 text-primary">
                                            Most popular
                                        </p>
                                    ) : null}
                                </div>
                                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                                    {tier.description}
                                </p>
                                <p className="mt-6 flex items-baseline gap-x-1">
                                    <span className="text-4xl font-bold tracking-tight text-foreground">
                                        {tier.price.monthly}
                                    </span>
                                    {tier.price.monthly !== "Free" && tier.price.monthly !== "Custom" && (
                                        <span className="text-sm font-semibold leading-6 text-muted-foreground">
                                            /month
                                        </span>
                                    )}
                                </p>
                                <ul
                                    role="list"
                                    className="mt-8 space-y-3 text-sm leading-6 text-muted-foreground"
                                >
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex gap-x-3">
                                            <Check
                                                className="h-6 w-5 flex-none text-primary"
                                                aria-hidden="true"
                                            />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Button
                                asChild
                                className={`mt-8 w-full ${tier.mostPopular
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                    : "bg-primary/10 text-primary hover:bg-primary/20"
                                    }`}
                                variant={tier.mostPopular ? "default" : "outline"}
                            >
                                <a href={tier.href} aria-describedby={tier.id}>
                                    {tier.cta}
                                </a>
                            </Button>
                        </div>
                    ))}
                </div>
            </div>


            <FeatureComparison />

            <PricingTestimonials />

            <PricingFAQ />

            <PricingCTA />
        </div >
    );
}
