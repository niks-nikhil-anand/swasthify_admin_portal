
import { SpecialitiesHero } from "@/components/specialities/SpecialitiesHero";
import { DoctorSpecialities } from "@/components/specialities/DoctorSpecialities";
import { TestSpecialities } from "@/components/specialities/TestSpecialities";
import { VitalCheckups } from "@/components/specialities/VitalCheckups";
import { PopularCheckups } from "@/components/specialities/PopularCheckups";
import { WhyBookWithUs } from "@/components/specialities/WhyBookWithUs";
import { SpecialitiesCTA } from "@/components/specialities/SpecialitiesCTA";
import { LabFAQ } from "@/components/specialities/LabFAQ";

import { DoctorSection } from "@/components/root/DoctorSection";

export default function SpecialitiesPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                <SpecialitiesHero />
                <DoctorSpecialities />
                <TestSpecialities />
                <VitalCheckups />
                <PopularCheckups />

                <DoctorSection />
                <WhyBookWithUs />
                <SpecialitiesCTA />
                <LabFAQ />
            </main>
        </div>
    );
}
