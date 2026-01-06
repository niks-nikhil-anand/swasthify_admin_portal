
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PricingCTA() {
    return (
        <section className="w-full py-24 bg-emerald-900 text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-400 blur-3xl"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-blue-400 blur-3xl"></div>
            </div>

            <div className="container px-4 md:px-6 mx-auto relative z-10 text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Ready to modernize your practice?</h2>
                <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                    Join thousands of healthcare professionals who trust Swasthify to manage their clinics and hospitals more efficiently.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50 text-lg px-8 py-6 h-auto font-bold rounded-xl shadow-xl shadow-emerald-900/20 transition-transform hover:-translate-y-1">
                        <Link href="/register/doctor">
                            Get Started for Free
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="border-emerald-700 text-white hover:bg-emerald-800 hover:text-white text-lg px-8 py-6 h-auto font-semibold rounded-xl transition-colors">
                        <Link href="/contact" className="flex items-center gap-2">
                            Contact Sales <ArrowRight className="h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
