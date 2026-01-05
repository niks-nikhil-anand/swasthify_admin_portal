import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Image from "next/image";

export function HealthConcern() {
    const concerns = [
        { image: "/images/lab-test/concerns/fever.png", label: "Fever", bg: "bg-orange-50" },
        { image: "/images/lab-test/concerns/diabetes.png", label: "Diabetes", bg: "bg-blue-50" },
        { image: "/images/lab-test/concerns/skin.png", label: "Skin", bg: "bg-purple-50" },
        { image: "/images/lab-test/concerns/kidney.png", label: "Kidney", bg: "bg-rose-50" },
        { image: "/images/lab-test/concerns/digestion.png", label: "Digestion", bg: "bg-yellow-50" },
        { image: "/images/lab-test/concerns/cancer.png", label: "Cancer", bg: "bg-pink-50" },
        { image: "/images/lab-test/concerns/heart.png", label: "Heart", bg: "bg-red-50" },
    ];

    return (
        <section className="w-full py-16 px-4 md:px-6 bg-white">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900">Find Tests by Health Concern</h2>
                </div>

                <ScrollArea className="w-full whitespace-nowrap pb-6">
                    <div className="flex space-x-8 px-4 justify-start md:justify-center w-max md:w-full">
                        {concerns.map((item, index) => (
                            <div key={index} className="flex flex-col items-center space-y-4 cursor-pointer group">
                                <div className={`w-32 h-32 rounded-full ${item.bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm border border-gray-100 overflow-hidden`}>
                                    <Image
                                        src={item.image}
                                        alt={item.label}
                                        width={100}
                                        height={100}
                                        className="object-contain p-2"
                                    />
                                </div>
                                <span className="text-base font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors">{item.label}</span>
                            </div>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </section>
    );
}
