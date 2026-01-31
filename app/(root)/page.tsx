import dynamic from "next/dynamic";
import {
  HeroSkeleton,
  ServicesSkeleton,
  DiagnosticTestsSkeleton,
  HealthPackagesSkeleton,
  AbhaIntegrationSkeleton,
  HowItWorksSkeleton,
  SpecialitiesSkeleton,
  InClinicSkeleton,
  TestimonialsSkeleton,
  DownloadAppSkeleton,
} from "@/components/root/Skeletons";

const Hero = dynamic(() => import("@/components/root/Hero").then((mod) => mod.Hero), {
  loading: () => <HeroSkeleton />,
});
const Services = dynamic(() => import("@/components/root/Services").then((mod) => mod.Services), {
  loading: () => <ServicesSkeleton />,
});
const DiagnosticTests = dynamic(() => import("@/components/root/DiagnosticTests").then((mod) => mod.DiagnosticTests), {
  loading: () => <DiagnosticTestsSkeleton />,
});
const HealthPackages = dynamic(() => import("@/components/root/HealthPackages").then((mod) => mod.HealthPackages), {
  loading: () => <HealthPackagesSkeleton />,
});
const AbhaIntegration = dynamic(() => import("@/components/root/AbhaIntegration").then((mod) => mod.AbhaIntegration), {
  loading: () => <AbhaIntegrationSkeleton />,
});
const HowItWorks = dynamic(() => import("@/components/root/HowItWorks").then((mod) => mod.HowItWorks), {
  loading: () => <HowItWorksSkeleton />,
});
const Specialities = dynamic(() => import("@/components/root/Specialities").then((mod) => mod.Specialities), {
  loading: () => <SpecialitiesSkeleton />,
});
const InClinic = dynamic(() => import("@/components/root/InClinic").then((mod) => mod.InClinic), {
  loading: () => <InClinicSkeleton />,
});
const Testimonials = dynamic(() => import("@/components/root/Testimonials").then((mod) => mod.Testimonials), {
  loading: () => <TestimonialsSkeleton />,
});
const DownloadApp = dynamic(() => import("@/components/root/DownloadApp").then((mod) => mod.DownloadApp), {
  loading: () => <DownloadAppSkeleton />,
});

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Hero />
        <Services />
        <DiagnosticTests />
        <HealthPackages />
        <AbhaIntegration />
        <HowItWorks />
        <Specialities />
        <InClinic />
        <Testimonials />
        <DownloadApp />
      </main>
    </div>
  );
}
