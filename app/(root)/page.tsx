
import { Navbar } from "@/components/root/Navbar";
import { Hero } from "@/components/root/Hero";
import { Footer } from "@/components/root/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
