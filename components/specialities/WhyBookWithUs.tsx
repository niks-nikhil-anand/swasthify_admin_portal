
import { Home, ShieldCheck, Percent, UserCheck } from "lucide-react";

export function WhyBookWithUs() {
    const features = [
        {
            icon: <UserCheck className="h-10 w-10 text-blue-500" />,
            title: "Expert Doctors & Verified Labs",
            description: "Consult with top-tier specialists or get NABL certified reports from trusted labs.",
            bg: "bg-blue-100 dark:bg-blue-900/20"
        },
        {
            icon: <Home className="h-10 w-10 text-emerald-500" />,
            title: "Safe Home Sample Collection",
            description: "Experience hassle-free diagnostics with safe and professional home sample pick-up.",
            bg: "bg-emerald-100 dark:bg-emerald-900/20"
        },
        {
            icon: <ShieldCheck className="h-10 w-10 text-purple-500" />,
            title: "Secure & Digital Reports",
            description: "Access your 100% private and accurate health records anytime, anywhere online.",
            bg: "bg-purple-100 dark:bg-purple-900/20"
        }
    ];

    return (
        <section className="w-full py-24 px-4 md:px-6 bg-background overflow-hidden">
            <div className="container mx-auto">
                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight text-center">Why Book With Us?</h2>
                    <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
                        We prioritize your health with seamless, high-quality, and affordable healthcare services.
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center p-12 rounded-[2.5rem] bg-card/50 backdrop-blur-sm border border-border shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-2 transition-all duration-500 group">
                            <div className={`p-8 rounded-full ${feature.bg} mb-8 transition-transform duration-500 group-hover:scale-110 shadow-inner`}>
                                {feature.icon}
                            </div>
                            <h3 className="font-extrabold text-2xl text-foreground mb-4 text-center">{feature.title}</h3>
                            <p className="text-center text-muted-foreground text-lg leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
