
"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";

// Mock data - In a real app this would likely come from an API or props
const packages = {
    featured: [
        {
            id: 1,
            name: "Vitamin Deficiency Health Checkup",
            testsCount: 5,
            ageRange: "11-80yrs",
            price: 899,
            originalPrice: 1200,
            discount: "25% OFF",
            image: "/images/health-packages/vitamin_deficiency.png",
        },
        {
            id: 2,
            name: "Young Indian Health Checkup",
            testsCount: 96,
            ageRange: "30-50yrs",
            price: 2599,
            originalPrice: 3400,
            discount: "24% OFF",
            image: "/images/health-packages/young_indian.png",
        },
        {
            id: 3,
            name: "Comprehensive Full Body Checkup",
            testsCount: 106,
            ageRange: "18-100yrs",
            price: 3499,
            originalPrice: 4500,
            discount: "22% OFF",
            image: "/images/health-packages/full_body.png",
        },
        {
            id: 4,
            name: "Annual Health Check - Platinum",
            testsCount: 112,
            ageRange: "18-100yrs",
            price: 4999,
            originalPrice: 6249,
            discount: "20% OFF",
            image: "/images/health-packages/platinum.png",
        },
    ],
    women: [
        {
            id: 5,
            name: "Women's Wellness Package",
            testsCount: 45,
            ageRange: "18-60yrs",
            price: 1999,
            originalPrice: 2500,
            discount: "20% OFF",
            image: "/images/health-packages/womens_wellness.png",
        },
    ],
    men: [
        {
            id: 6,
            name: "Men's Executive Health Check",
            testsCount: 50,
            ageRange: "25-60yrs",
            price: 2499,
            originalPrice: 3000,
            discount: "16% OFF",
            image: "/images/health-packages/mens_executive.png",
        },
    ]
};

export function HealthPackages() {
    return (
        <div className="bg-gray-50 bg-opacity-50">
        <section className=" container mx-auto py-12 px-4 md:px-6 ">
            <div className=" flex flex-col space-y-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Popular <span className="text-emerald-600 bg-emerald-100 px-2 rounded-md">Health Checkup Packages</span>
                </h2>

                <Tabs defaultValue="featured" className="w-full">
                    <div className="flex justify-start mb-6">
                        <TabsList className="bg-transparent h-auto p-0 space-x-6">
                            <TabsTrigger
                                value="featured"
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-gray-800 rounded-none px-0 pb-2 text-lg font-medium text-gray-500 data-[state=active]:text-gray-900"
                            >
                                Featured Checkups
                            </TabsTrigger>
                            <TabsTrigger
                                value="women"
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-gray-800 rounded-none px-0 pb-2 text-lg font-medium text-gray-500 data-[state=active]:text-gray-900"
                            >
                                Women's Health
                            </TabsTrigger>
                            <TabsTrigger
                                value="men"
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-gray-800 rounded-none px-0 pb-2 text-lg font-medium text-gray-500 data-[state=active]:text-gray-900"
                            >
                                Men's Health
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {Object.entries(packages).map(([key, items]) => (
                        <TabsContent key={key} value={key} className="mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {items.map((pkg) => (
                                    <Card key={pkg.id} className="overflow-hidden border-2 hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
                                        <div className="relative h-56 w-full bg-gray-200 overflow-hidden">
                                            <div className="absolute top-4 left-4 z-10">
                                                <Badge className="bg-emerald-600 hover:bg-emerald-700">{pkg.discount}</Badge>
                                            </div>
                                            <Image
                                                src={pkg.image}
                                                alt={pkg.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 bg-white/95 p-2 text-center text-sm font-medium text-gray-800 border-t backdrop-blur-sm">
                                                Includes {pkg.testsCount} tests
                                            </div>
                                        </div>
                                        <CardHeader className="flex-1 pb-2">
                                            <CardTitle className="text-xl line-clamp-2 min-h-[3.5rem]">{pkg.name}</CardTitle>
                                            <p className="text-sm text-muted-foreground mt-2">For Age: {pkg.ageRange}</p>
                                        </CardHeader>
                                        <CardContent className="pt-0 pb-2">
                                            <div className="flex items-baseline space-x-2">
                                                <span className="text-2xl font-bold text-emerald-600">₹{pkg.price}</span>
                                                <span className="text-sm text-gray-400 line-through">₹{pkg.originalPrice}</span>
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button variant="outline" className="w-full border-gray-300 font-semibold hover:bg-gray-50 text-gray-700">
                                                Book Now
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
         </div>
    );
}
