
import { LabHero } from "@/components/lab-test/LabHero";
import { HowItWorksLab } from "@/components/lab-test/HowItWorksLab";
import { HealthConcern } from "@/components/lab-test/HealthConcern";
import { VitalCheckups } from "@/components/lab-test/VitalCheckups";
import { WhyBookWithUs } from "@/components/lab-test/WhyBookWithUs";
import { LabFAQ } from "@/components/lab-test/LabFAQ";
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
