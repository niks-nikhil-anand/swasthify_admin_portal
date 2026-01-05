
import { Home, ShieldCheck, Percent } from "lucide-react";

export function WhyBookWithUs() {
    const features = [
        {
            icon: <Home className="h-8 w-8 text-blue-500" />,
            title: "FREE home sample collection",
            bg: "bg-blue-100"
        },
        {
            icon: <ShieldCheck className="h-8 w-8 text-emerald-500" />,
            title: "E reports in 24 hrs",
            bg: "bg-emerald-100"
        },
        {
            icon: <Percent className="h-8 w-8 text-purple-500" />,
            title: "Offers & affordable prices",
            bg: "bg-purple-100"
        }
    ];

    return (
        <section className="w-full py-16 px-4 md:px-6">
            <div className="container mx-auto">
                <h2 className="text-2xl font-bold text-center mb-12">Why Book With Us?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center md:items-start md:flex-row gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className={`p-4 rounded-full ${feature.bg}`}>
                                {feature.icon}
                            </div>
                            <div className="text-center md:text-left">
                                <h3 className="font-semibold text-lg text-gray-800">{feature.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
