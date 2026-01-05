
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Thermometer, Activity, User, HeartPulse, Stethoscope, Ribbon, Smile } from "lucide-react";

export function HealthConcern() {
    const concerns = [
        { icon: <Thermometer className="h-10 w-10 text-orange-500" />, label: "Fever", bg: "bg-orange-100" },
        { icon: <Activity className="h-10 w-10 text-blue-500" />, label: "Diabetes", bg: "bg-blue-100" },
        { icon: <Smile className="h-10 w-10 text-purple-500" />, label: "Skin", bg: "bg-purple-100" },
        { icon: <User className="h-10 w-10 text-rose-500" />, label: "Kidney", bg: "bg-rose-100" },
        { icon: <Stethoscope className="h-10 w-10 text-yellow-500" />, label: "Digestion", bg: "bg-yellow-100" },
        { icon: <Ribbon className="h-10 w-10 text-pink-500" />, label: "Cancer", bg: "bg-pink-100" },
        { icon: <HeartPulse className="h-10 w-10 text-red-500" />, label: "Heart", bg: "bg-red-100" },
    ];

    return (
        <section className="w-full py-12 px-4 md:px-6">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Find Tests by Health Concern</h2>
                    {/* <Button variant="ghost" size="sm" className="hidden md:flex">View Correct</Button> */}
                </div>

                <ScrollArea className="w-full whitespace-nowrap pb-4">
                    <div className="flex space-x-8 px-4">
                        {concerns.map((item, index) => (
                            <div key={index} className="flex flex-col items-center space-y-3 cursor-pointer group">
                                <div className={`w-24 h-24 rounded-full ${item.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                    {item.icon}
                                </div>
                                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                            </div>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </section>
    );
}
