import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function LabFAQ() {
    const faqs = [
        {
            question: "How do I book an appointment?",
            answer: "You can search for a doctor by specialty or name, view their profile, and select a convenient time slot. You can choose between video consultation or in-clinic visit."
        },
        {
            question: "Is my health data secure?",
            answer: "Yes, Swasthify takes data privacy very seriously. All your health records are encrypted and stored securely. We follow strict data protection guidelines."
        },
        {
            question: "Can I book appointments for family members?",
            answer: "Absolutely! You can add family members to your profile and manage their appointments and health records easily from one account."
        },
        {
            question: "What is ABHA ID?",
            answer: "ABHA (Ayushman Bharat Health Account) is a unique health ID for Indian citizens. Linking it with Swasthify helps you access your digital health records seamlessly."
        },
        {
            question: "How do I get my prescription?",
            answer: "After your consultation, the digital prescription will be instantly available in your app. You can download it or share it with pharmacies directly."
        }
    ];

    return (
        <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Header Column */}
                    <div className="lg:col-span-4">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
                            Frequently Asked <br className="hidden lg:block" /> Questions
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Got questions? We have answers. Find everything you need to know about Swasthify.
                        </p>
                    </div>

                    {/* Accordion Column */}
                    <div className="lg:col-span-8">
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {faqs.map((faq, index) => (
                                <AccordionItem key={index} value={`item-${index}`} className="border border-border/50 rounded-xl px-2 bg-background data-[state=open]:border-primary/20 data-[state=open]:bg-primary/5 transition-all">
                                    <AccordionTrigger className="text-left text-lg font-medium px-4 hover:no-underline hover:text-primary transition-colors">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed px-4 pb-4 text-base">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    );
}
