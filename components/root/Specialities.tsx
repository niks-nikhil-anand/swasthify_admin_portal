"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const specialities = [
    {
        title: "Gynaecology",
        price: "₹599",
        image: "/icon-gynaecology.png",
        color: "bg-pink-50/50",
    },
    {
        title: "Sexology",
        price: "₹599",
        image: "/icon-sexology.png",
        color: "bg-indigo-50/50",
    },
    {
        title: "General physician",
        price: "₹499",
        image: "/icon-general-physician.png",
        color: "bg-blue-50/50",
    },
    {
        title: "Dermatology",
        price: "₹549",
        image: "/icon-dermatology.png",
        color: "bg-teal-50/50",
    },
    {
        title: "Psychiatry",
        price: "₹599",
        image: "/icon-psychiatry.png",
        color: "bg-green-50/50",
    },
    {
        title: "Stomach and digestion",
        price: "₹499",
        image: "/icon-stomach.png",
        color: "bg-orange-50/50",
    },
];

export function Specialities() {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            25+ Specialities
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Consult with top doctors across specialities
                        </p>
                    </div>
                    <Link href="/specialities" className="hidden md:flex items-center text-primary font-semibold hover:gap-2 transition-all group">
                        See all specialities <ChevronRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {specialities.map((item, index) => (
                        <div
                            key={index}
                            className="group flex flex-col items-center text-center p-4 rounded-2xl border border-border bg-card hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer h-full"
                        >
                            <div className={`w-32 h-32 relative mb-4 ${item.color} rounded-full flex items-center justify-center transition-transform group-hover:scale-105`}>
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/40 to-transparent pointer-events-none" />
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={100}
                                    height={100}
                                    className="object-contain drop-shadow-xl"
                                />
                            </div>

                            <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2 px-1">
                                {item.title}
                            </h3>

                            <div className="text-xs text-muted-foreground mb-4">
                                starts from <span className="font-bold text-foreground text-sm">{item.price}</span>
                            </div>

                            <span className="mt-auto text-xs font-bold text-primary opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center bg-primary/10 px-3 py-1 rounded-full">
                                Consult <ChevronRight className="w-3 h-3 ml-1" />
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link href="/specialities" className="inline-flex items-center text-primary font-semibold">
                        See all specialities <ChevronRight className="w-5 h-5 ml-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
