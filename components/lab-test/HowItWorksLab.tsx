
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
        <section className="w-full py-16 md:py-24 bg-gray-50">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">How it works?</h2>
                    <p className="text-gray-500 max-w-[600px] mx-auto text-lg">
                        Get your tests done in 3 simple steps. Use Swasthify for the most convenient experience.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-12 max-w-5xl mx-auto relative">
                    {/* Dashed line connector (hidden on mobile) */}
                    <div className="absolute top-[3.5rem] left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-gray-200 hidden md:block -z-10" />

                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center flex-1">
                            <div className="bg-white p-2 rounded-full mb-6 border-4 border-emerald-50">
                                <div className="bg-emerald-100 p-6 rounded-full transition-transform hover:scale-110 duration-300">
                                    {step.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                            <p className="text-gray-500 leading-relaxed max-w-[250px]">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
