import dynamic from "next/dynamic";
import {
    HeroSkeleton,
    GridSkeleton,
    WhyBookSkeleton,
    FAQSectionSkeleton
} from "@/components/specialities/SpecialitiesSkeletons";
import { LabSection } from "@/components/root/LabSection";

const SpecialitiesHero = dynamic(() => import("@/components/specialities/SpecialitiesHero").then(m => m.SpecialitiesHero), {
    loading: () => <HeroSkeleton />
});

const DoctorSpecialities = dynamic(() => import("@/components/specialities/DoctorSpecialities").then(m => m.DoctorSpecialities), {
    loading: () => <GridSkeleton title="Doctor Specialities" />
});

const TestSpecialities = dynamic(() => import("@/components/specialities/TestSpecialities").then(m => m.TestSpecialities), {
    loading: () => <GridSkeleton title="Diagnostic Categories" />
});

const HealthPackages = dynamic(() => import("@/components/root/HealthPackages").then(m => m.HealthPackages), {
    loading: () => <GridSkeleton title="Health Packages" />
});

const DoctorSection = dynamic(() => import("@/components/root/DoctorSection").then(m => m.DoctorSection), {
    loading: () => <GridSkeleton title="Doctors" />
});

const WhyBookWithUs = dynamic(() => import("@/components/specialities/WhyBookWithUs").then(m => m.WhyBookWithUs), {
    loading: () => <WhyBookSkeleton />
});

const CTA = dynamic(() => import("@/components/shared/CTA").then(m => m.CTA), {
    loading: () => <div className="h-[300px] w-full bg-muted animate-pulse" />
});

const LabFAQ = dynamic(() => import("@/components/specialities/LabFAQ").then(m => m.LabFAQ), {
    loading: () => <FAQSectionSkeleton />
});

export default function SpecialitiesPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                <SpecialitiesHero />
                <DoctorSpecialities />
                <TestSpecialities />
                <DoctorSection />
                <HealthPackages />
                 <LabSection />
                <WhyBookWithUs />
                <CTA
                    title="Find the Right Care Today"
                    description="Whether it's a specialist consultation or a diagnostic test, Swasthify provides trusted healthcare at your fingertips. Book your appointment now."
                    primaryAction={{ text: "Find a Doctor", href: "/doctors" }}
                    secondaryAction={{ text: "Book a Test", href: "/labs" }}
                />
                <LabFAQ />
            </main>
        </div>
    );
}
