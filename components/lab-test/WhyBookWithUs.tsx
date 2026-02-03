
import { Home, ShieldCheck, Percent } from "lucide-react";

export function WhyBookWithUs() {
    const features = [
        {
            icon: <Home className="h-8 w-8 text-blue-500" />,
            title: "FREE home sample collection",
            bg: "bg-blue-100 dark:bg-blue-900/20"
        },
        {
            icon: <ShieldCheck className="h-8 w-8 text-emerald-500" />,
            title: "E reports in 24 hrs",
            bg: "bg-emerald-100 dark:bg-emerald-900/20"
        },
        {
            icon: <Percent className="h-8 w-8 text-purple-500" />,
            title: "Offers & affordable prices",
            bg: "bg-purple-100 dark:bg-purple-900/20"
        }
    ];

    return (
        <section className="w-full py-16 px-4 md:px-6 bg-background">
            <div className="container mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-16">Why Book With Us?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center p-8 rounded-2xl bg-card border border-border shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className={`p-6 rounded-full ${feature.bg} mb-6`}>
                                {feature.icon}
                            </div>
                            <h3 className="font-bold text-xl text-foreground mb-2">{feature.title}</h3>
                            <p className="text-center text-muted-foreground">
                                Experience the best healthcare services at your doorstep at affordable prices.
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
