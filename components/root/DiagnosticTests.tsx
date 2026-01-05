
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const tests = [
    {
        title: "Lipid Profile",
        subtitle: "Known as Lipid Profile Blood",
        price: 434,
        color: "text-emerald-500",
    },
    {
        title: "Liver Function Test",
        subtitle: "Known as Liver Function Tests Blood",
        price: 673,
        color: "text-emerald-500",
    },
    {
        title: "HbA1c",
        subtitle: "Known as Glycosylated Haemoglobin Blood",
        price: 300,
        color: "text-emerald-500",
    },
    {
        title: "Vitamin B 12",
        subtitle: "Known as Vitamin B12 Conventional Blood",
        price: 490,
        color: "text-emerald-500",
    },
    {
        title: "Beta HCG",
        subtitle: "Known as Beta Hcg Automated Blood",
        price: 850,
        color: "text-emerald-500",
    },
    {
        title: "Fasting Blood Sugar",
        subtitle: "Known as Glucose Fasting Blood",
        price: 199,
        color: "text-emerald-500",
    },
];

export function DiagnosticTests() {
    return (
        <section className="container mx-auto py-12 px-4 md:px-6">
            <div className="flex flex-col space-y-4">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Top Booked Diagnostic Tests</h2>
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-emerald-100 text-emerald-800 w-fit">
                        <Zap className="mr-1 h-3 w-3 fill-emerald-800" />
                        Get reports within 24hrs
                    </div>
                </div>

                <div className="relative">
                    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                        <div className="flex w-max space-x-4 p-4">
                            {tests.map((test, index) => (
                                <Card key={index} className="w-[300px] shrink-0 border-2 hover:border-emerald-500 transition-all duration-300">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg font-bold truncate pr-2" title={test.title}>{test.title}</CardTitle>
                                            <span className={`text-lg font-bold ${test.color}`}>₹{test.price}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground whitespace-normal h-10 line-clamp-2">{test.subtitle}</p>
                                    </CardHeader>
                                    <CardFooter>
                                        <Button className="w-full text-sky-500 bg-transparent border border-sky-200 hover:bg-sky-50 hover:text-sky-600 uppercase font-semibold">
                                            Add to Cart
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
            </div>
        </section>
    );
}
