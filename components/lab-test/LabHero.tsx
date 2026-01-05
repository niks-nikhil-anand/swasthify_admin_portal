
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function LabHero() {
    return (
        <section className="w-full relative py-12 md:py-24 lg:py-32 xl:py-48 flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url("/images/lab-test/lab_test_hero_bg.png")' }}
            >
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>
            </div>

            <div className="container relative z-10 px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-gray-900">
                            Book Diagnostic Tests From Home
                        </h1>
                        <p className="mx-auto max-w-[700px] text-gray-700 md:text-xl font-medium">
                            Safe, reliable, and convenient home sample collection. Get reports online.
                        </p>
                    </div>
                    <div className="w-full max-w-md space-y-2">
                        <form className="flex space-x-2 p-1 bg-white rounded-lg shadow-lg border border-gray-200">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    className="pl-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-11 text-base"
                                    placeholder="Search for tests or packages (e.g. Thyroid, Lipid)"
                                />
                            </div>
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white h-11 px-6 font-semibold">
                                Search
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
