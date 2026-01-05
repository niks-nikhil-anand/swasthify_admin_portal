
import { Beaker, Home, FileText } from "lucide-react";

export function HowItWorksLab() {
    const steps = [
        {
            icon: <Beaker className="h-8 w-8 text-emerald-600" />,
            title: "Book tests & packages",
            description: "Choose from a wide range of tests"
        },
        {
            icon: <Home className="h-8 w-8 text-emerald-600" />,
            title: "Home sample collection",
            description: "Experienced phlebotomist at your doorstep"
        },
        {
            icon: <FileText className="h-8 w-8 text-emerald-600" />,
            title: "Reports online",
            description: "Get accurate reports on email/app"
        }
    ];

    return (
        <section className="w-full py-12 md:py-16 bg-white">
            <div className="container px-4 md:px-6">
                <h2 className="text-2xl font-bold text-center mb-10">How it works?</h2>
                <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 relative">
                    {/* Dashed line connector (hidden on mobile) */}
                    <div className="absolute top-8 left-20 right-20 h-0.5 border-t-2 border-dashed border-gray-200 hidden md:block -z-10" />

                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center max-w-[200px] bg-white p-2">
                            <div className="bg-emerald-50 p-4 rounded-full mb-4">
                                {step.icon}
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                            <p className="text-sm text-gray-500">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
