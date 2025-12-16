"use client";

import { Baby, TestTube2, Stethoscope, User, Brain, Utensils, ChevronRight } from "lucide-react";
import Link from "next/link";

const specialities = [
    {
        title: "Gynaecology",
        price: "₹599",
        icon: Baby,
        color: "bg-pink-100 text-pink-600",
    },
    {
        title: "Sexology",
        price: "₹599",
        icon: User,
        color: "bg-indigo-100 text-indigo-600",
    },
    {
        title: "General physician",
        price: "₹499",
        icon: Stethoscope,
        color: "bg-blue-100 text-blue-600",
    },
    {
        title: "Dermatology",
        price: "₹549",
        icon: User, // Using User as placeholder for face/skin
        color: "bg-purple-100 text-purple-600",
    },
    {
        title: "Psychiatry",
        price: "₹599",
        icon: Brain,
        color: "bg-red-100 text-red-600",
    },
    {
        title: "Stomach and digestion",
        price: "₹499",
        icon: Utensils,
        color: "bg-orange-100 text-orange-600",
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
                    <Link href="/specialities" className="hidden md:flex items-center text-primary font-semibold hover:gap-2 transition-all">
                        See all specialities <ChevronRight className="w-5 h-5 ml-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {specialities.map((item, index) => (
                        <div
                            key={index}
                            className="group flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-card hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
                        >
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${item.color} group-hover:scale-110 transition-transform`}>
                                <item.icon className="w-10 h-10" />
                            </div>

                            <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                {item.title}
                            </h3>

                            <div className="text-sm font-medium text-muted-foreground mb-4">
                                {item.price}
                            </div>

                            <span className="text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                                Consult now <ChevronRight className="w-3 h-3 ml-1" />
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
