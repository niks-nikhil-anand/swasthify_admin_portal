
import { Beaker, Home, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function HowItWorksLab() {
    const steps = [
        {
            icon: <Beaker className="h-8 w-8 text-emerald-600" />,
            title: "Book tests & packages",
            description: "Choose from a wide range of diagnostics tests or health packages."
        },
        {
            icon: <Home className="h-8 w-8 text-emerald-600" />,
            title: "Home sample collection",
            description: "Expert phlebotomist collects sample from your doorstep safely."
        },
        {
            icon: <FileText className="h-8 w-8 text-emerald-600" />,
            title: "Reports online",
            description: "Get accurate, NABL certified reports on email and app within 24hrs."
        }
    ];

    return (
        <section className="w-full py-16 md:py-24 bg-background border-y border-border/40">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">How it works?</h2>
                    <p className="text-muted-foreground max-w-[600px] mx-auto text-lg">
                        Get your tests done in 3 simple steps. We've simplified the process for you.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
                    {/* Dashed line connector (hidden on mobile) */}
                    <div className="absolute top-12 left-[16%] right-[16%] h-0.5 border-t-2 border-dashed border-emerald-200/50 hidden md:block -z-10" />

                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards" style={{ animationDelay: `${index * 200}ms` }}>
                            <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card w-full h-full relative overflow-hidden group">
                                <CardContent className="p-8 flex flex-col items-center h-full">
                                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-full mb-6 border-4 border-white dark:border-background shadow-sm z-10">
                                        <div className="bg-emerald-100 dark:bg-emerald-900/40 p-5 rounded-full transition-transform group-hover:scale-110 duration-500">
                                            {step.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {step.description}
                                    </p>
                                </CardContent>
                                {/* Bottom Accent */}
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500/0 group-hover:bg-emerald-500 transition-colors duration-300" />
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
