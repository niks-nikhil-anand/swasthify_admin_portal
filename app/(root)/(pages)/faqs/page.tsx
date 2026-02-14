import React from 'react';
import { PageHero } from "@/components/shared/PageHero";
import { LabFAQ } from "@/components/lab-test/LabFAQ";
import { CTA } from "@/components/shared/CTA";

export const metadata = {
    title: "FAQ | Swasthify",
    description: "Find answers to frequently asked questions about Swasthify's services, appointments, and more.",
};

const FAQPage = () => {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <PageHero
                badge="Help Center"
                title="How can we help you?"
                description="Find everything you need to know about Swasthify, from booking appointments to managing your health records."
            />

            <LabFAQ />

            <CTA
                title="Still have questions?"
                description="Our team is here to help you 24/7. Feel free to reach out to us for any assistance."
                primaryAction={{ text: "Contact Support", href: "/contact" }}
                secondaryAction={{ text: "Register Now", href: "/register" }}
            />
        </div>
    );
};

export default FAQPage;