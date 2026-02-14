
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Droplet, Activity, Pipette } from "lucide-react";

export function VitalCheckups() {
    const checkups = [
        {
            title: "Lipid Profile",
            tests: "LDL Cholesterol, HDL Cholesterol +3 Tests",
            icon: <Droplet className="h-6 w-6 text-red-500" />
        },
        {
            title: "Liver Profile",
            tests: "Gamma Glutamyl Transferase, Total Bilirubin +3 Tests",
            icon: <Activity className="h-6 w-6 text-yellow-500" />
        },
        {
            title: "Blood Sugar",
            tests: "Hba1C, Fasting Blood Sugar +3 Tests",
            icon: <Pipette className="h-6 w-6 text-blue-500" />
        },
        {
            title: "Thyroid Profile",
            tests: "T3, T4, TSH Ultra-sensitive",
            icon: <Activity className="h-6 w-6 text-purple-500" />
        },
        {
            title: "Iron Deficiency",
            tests: "Iron, TIBC, Transferrin Saturation",
            icon: <Droplet className="h-6 w-6 text-red-700" />
        },
        {
            title: "Vitamin D",
            tests: "25-OH Vitamin D (Total)",
            icon: <Activity className="h-6 w-6 text-orange-400" />
        },
        {
            title: "Complete Hemogram",
            tests: "Hb, RBC, WBC, Platelets, MCV, MCH...",
            icon: <Droplet className="h-6 w-6 text-red-600" />
        }
    ];

    return (
        <section className="w-full py-16 px-4 md:px-6 bg-muted/30">
            <div className="container mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-10">Recommended Vital Checkups</h2>
                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex space-x-4 pb-4">
                        {checkups.map((checkup, index) => (
                            <Card key={index} className="w-[300px] shrink-0 hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start space-x-4 mb-4">
                                        <div className="p-2 bg-muted rounded-lg">
                                            {checkup.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{checkup.title}</h3>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-6 h-10 whitespace-normal line-clamp-2">
                                        {checkup.tests}
                                    </p>
                                    <div className="flex justify-end">
                                        <Button variant="outline" className="border-emerald-600 dark:border-emerald-500 text-emerald-600 dark:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30">
                                            Book
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </section>
    );
}
