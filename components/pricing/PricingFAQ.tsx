
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function PricingFAQ() {
    const faqs = [
        {
            question: "Can I switch plans later?",
            answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be applied to your next billing cycle."
        },
        {
            question: "Is there a free trial?",
            answer: "We offer a free 'Starter' plan forever. For paid features, you can request a demo to see them in action."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept major credit cards, debit cards, and UPI for Indian customers. Enterprise plans can be paid via bank transfer."
        },
        {
            question: "Is my data secure?",
            answer: "Absolutely. We use bank-grade encryption and comply with all healthcare data protection regulations including HIPAA and DISHA guidelines."
        },
        {
            question: "Do you offer discounts for non-profits?",
            answer: "Yes, we support non-profit healthcare organizations. Please contact our sales team for special pricing."
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
