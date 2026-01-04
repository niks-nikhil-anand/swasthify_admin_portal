import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
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
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Frequently Asked Questions</h2>
                    <p className="text-lg text-muted-foreground">
                        Got questions? We have answers.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left text-lg font-medium">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
