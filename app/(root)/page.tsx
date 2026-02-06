import dynamic from "next/dynamic";

const Hero = dynamic(() => import("@/components/root/Hero").then((mod) => mod.Hero));
const Services = dynamic(() => import("@/components/root/Services").then((mod) => mod.Services));
const DoctorSection = dynamic(() => import("@/components/root/DoctorSection").then((mod) => mod.DoctorSection));
const HealthPackages = dynamic(() => import("@/components/root/HealthPackages").then((mod) => mod.HealthPackages));
const AbhaIntegration = dynamic(() => import("@/components/root/AbhaIntegration").then((mod) => mod.AbhaIntegration));
const HowItWorks = dynamic(() => import("@/components/root/HowItWorks").then((mod) => mod.HowItWorks));
const Specialities = dynamic(() => import("@/components/root/Specialities").then((mod) => mod.Specialities));
const InClinic = dynamic(() => import("@/components/root/InClinic").then((mod) => mod.InClinic));
const Testimonials = dynamic(() => import("@/components/root/Testimonials").then((mod) => mod.Testimonials));
const DownloadApp = dynamic(() => import("@/components/root/DownloadApp").then((mod) => mod.DownloadApp));

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Hero />
        <Services />
        <DoctorSection />
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
