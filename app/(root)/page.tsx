import { Hero } from "@/components/root/Hero";
import { Services } from "@/components/root/Services";
import { Specialities } from "@/components/root/Specialities";
import { InClinic } from "@/components/root/InClinic";
import { DownloadApp } from "@/components/root/DownloadApp";
import { HowItWorks } from "@/components/root/HowItWorks";
import { Testimonials } from "@/components/root/Testimonials";
import { FAQ } from "@/components/root/FAQ";
import { AbhaIntegration } from "@/components/root/AbhaIntegration";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Hero />
        <Services />
        <AbhaIntegration />
        <HowItWorks />
        <Specialities />
        <InClinic />
        <Testimonials />
        <FAQ />
        <DownloadApp />
      </main>
    </div>
  );
}
