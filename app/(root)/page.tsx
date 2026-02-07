import dynamic from "next/dynamic";

const Hero = dynamic(() => import("@/components/root/Hero").then((mod) => mod.Hero));
const Services = dynamic(() => import("@/components/root/Services").then((mod) => mod.Services));
const DoctorSection = dynamic(() => import("@/components/root/DoctorSection").then((mod) => mod.DoctorSection));
const HealthPackages = dynamic(() => import("@/components/root/HealthPackages").then((mod) => mod.HealthPackages));
const LabSection = dynamic(() => import("@/components/root/LabSection").then((mod) => mod.LabSection));
const AbhaIntegration = dynamic(() => import("@/components/root/AbhaIntegration").then((mod) => mod.AbhaIntegration));
const HowItWorks = dynamic(() => import("@/components/root/HowItWorks").then((mod) => mod.HowItWorks));
const Specialities = dynamic(() => import("@/components/root/Specialities").then((mod) => mod.Specialities));
const InClinic = dynamic(() => import("@/components/root/InClinic").then((mod) => mod.InClinic));
const Testimonials = dynamic(() => import("@/components/root/Testimonials").then((mod) => mod.Testimonials));
const DownloadApp = dynamic(() => import("@/components/root/DownloadApp").then((mod) => mod.DownloadApp));

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background">
      {/* Global Background Decorations */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px]" />

        {/* Pattern Overlay */}
        <div className="absolute inset-0 mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]">
          <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="plus-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30 25v10M25 30h10" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-muted-foreground/20" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#plus-pattern)" />
          </svg>
        </div>
      </div>

      <main className="flex-1 relative z-10">
        <Hero />
        <Services />
        <DoctorSection />
        <HealthPackages />
        <LabSection />
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
