import { Calendar, Search, Stethoscope, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function HowItWorks() {
    const steps = [
        {
            icon: Search,
            title: "Search Doctor",
            description: "Find the best specialist near you or online for your specific needs."
        },
        {
            icon: Calendar,
            title: "Book Appointment",
            description: "Choose a convenient time slot and book your appointment instantly."
        },
        {
            icon: Stethoscope,
            title: "Consultation",
            description: "Visit the clinic or consult via video call with our expert doctors."
        },
        {
            icon: FileText,
            title: "Get Prescription",
            description: "Receive your digital prescription and medical records securely."
        }
    ];

    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">How Swasthify Works</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Simple steps to get the best healthcare experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="relative flex flex-col items-center text-center group">
                            {/* Connecting Line (Desktop only) */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-8 left-1/2 w-full h-[2px] bg-border -z-10" />
                            )}

                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <step.icon className="w-8 h-8 text-primary" />
                            </div>

                            <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
