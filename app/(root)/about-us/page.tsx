"use client";

import { CTA } from "@/components/shared/CTA";
import { HeroSection } from "./components/HeroSection";
import { MissionVisionSection } from "./components/MissionVisionSection";
import { ValuesSection } from "./components/ValuesSection";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <HeroSection />
            <MissionVisionSection />
            <ValuesSection />

            <CTA
                title="Be Part of Our Mission"
                description="Join us in our journey to make healthcare accessible to everyone. Experience the difference with Swasthify."
                primaryAction={{ text: "Join Now", href: "/register/patient" }}
            />
        </div>
    );
}
