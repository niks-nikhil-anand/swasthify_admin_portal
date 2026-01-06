
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
        <section className="w-full py-24 px-4 md:px-6 bg-gray-50">
            <div className="container mx-auto max-w-3xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900 mb-4">Frequently Asked Questions</h2>
                    <p className="text-gray-500 text-lg">
                        Everything you need to know about our pricing and billing.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left text-lg font-medium">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-gray-600 text-base leading-relaxed">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
