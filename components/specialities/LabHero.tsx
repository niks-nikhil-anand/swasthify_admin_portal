
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function LabHero() {
    return (
        <section className="w-full bg-primary/5 relative py-20 md:py-32 lg:py-40 flex items-center justify-center overflow-hidden">


            <div className="container relative z-10 px-4 md:px-6">
                <div className="flex flex-col items-center space-y-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">

                    <Badge variant="secondary" className="px-4 py-1.5 backdrop-blur-md bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 text-emerald-800 dark:text-emerald-300 shadow-sm animate-in fade-in zoom-in duration-500 delay-100">
                        Diagnostics at Home
                    </Badge>

                    <div className="space-y-4 max-w-3xl">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-foreground drop-shadow-sm">
                            Book Diagnostic Tests <br />
                            <span className="text-emerald-600 bg-clip-text">From Comfort of Home</span>
                        </h1>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl font-medium leading-relaxed">
                            Safe, reliable, and convenient home sample collection. Get accurate NABL certified reports online within 24 hours.
                        </p>
                    </div>

                    <div className="w-full max-w-lg space-y-2 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                        <form className="flex p-2 bg-background/80 backdrop-blur-md rounded-full shadow-2xl border border-emerald-100 dark:border-emerald-900 ring-4 ring-emerald-50 dark:ring-emerald-900/30 focus-within:ring-emerald-200 dark:focus-within:ring-emerald-800 transition-all duration-300">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
                                <Input
                                    className="pl-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-11 text-base placeholder:text-muted-foreground/70"
                                    placeholder="Search for tests (e.g. Thyroid, Lipid)..."
                                />
                            </div>
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full h-11 px-8 font-bold shadow-lg transition-all hover:scale-105">
                                Search
                            </Button>
                        </form>
                        <p className="text-sm text-muted-foreground pt-2">
                            Popular: <span className="font-medium hover:text-emerald-600 cursor-pointer underline decoration-dotted">Full Body Checkup</span>, <span className="font-medium hover:text-emerald-600 cursor-pointer underline decoration-dotted">Diabetes</span>, <span className="font-medium hover:text-emerald-600 cursor-pointer underline decoration-dotted">Vitamin D</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
