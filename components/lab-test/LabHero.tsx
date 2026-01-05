
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function LabHero() {
    return (
        <section className="w-full bg-emerald-50 py-12 md:py-24 lg:py-32 xl:py-48">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                            Book Diagnostic Tests From Home
                        </h1>
                        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                            Safe, reliable, and convenient home sample collection. Get reports online.
                        </p>
                    </div>
                    <div className="w-full max-w-sm space-y-2">
                        <form className="flex space-x-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-8" placeholder="Search for tests or packages" />
                            </div>
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">Search</Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
