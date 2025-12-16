import { Hero } from "@/components/root/Hero";
import { Services } from "@/components/root/Services";
import { Specialities } from "@/components/root/Specialities";
import { InClinic } from "@/components/root/InClinic";
import { DownloadApp } from "@/components/root/DownloadApp";
import { Footer } from "@/components/root/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Hero />
        <Services />
        <Specialities />
        <InClinic />
      </main>
    </div>
  );
}
