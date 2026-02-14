
import { LabHero } from "@/components/specialities/LabHero";
import { HowItWorksLab } from "@/components/specialities/HowItWorksLab";
import { HealthConcern } from "@/components/specialities/HealthConcern";
import { VitalCheckups } from "@/components/specialities/VitalCheckups";
import { WhyBookWithUs } from "@/components/specialities/WhyBookWithUs";
import { LabFAQ } from "@/components/specialities/LabFAQ";
import { DiagnosticTests } from "@/components/root/DiagnosticTests";
import { HealthPackages } from "@/components/root/HealthPackages";

export default function LabTestPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                <LabHero />
                <HowItWorksLab />
                <HealthConcern />
                <VitalCheckups />
                <DiagnosticTests />
                <HealthPackages />
                <WhyBookWithUs />
                <LabFAQ />
            </main>
        </div>
    );
}
