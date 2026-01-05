
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function LabFAQ() {
    return (
        <section className="w-full py-12 px-4 md:px-6 bg-gray-50">
            <div className="container mx-auto max-w-3xl">
                <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>How are samples collected?</AccordionTrigger>
                        <AccordionContent>
                            We provide free home sample collection. Our certified phlebotomist will visit your home at your scheduled time to collect samples safely and hygienically.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>When will I get my reports?</AccordionTrigger>
                        <AccordionContent>
                            Most reports are delivered within 24-48 hours via email. You can also view them in your account on our website or app.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Is it safe to get tests done at home?</AccordionTrigger>
                        <AccordionContent>
                            Yes, absolutely. Our phlebotomists follow strict safety protocols, including wearing PPE, using sterile equipment, and maintaining hygiene standards.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>Do I need to fast before the test?</AccordionTrigger>
                        <AccordionContent>
                            Fasting requirements depend on the specific test. For tests like Lipid Profile or Fasting Blood Sugar, 10-12 hours of fasting is usually required. Please check the test instructions or consult your doctor.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    );
}
