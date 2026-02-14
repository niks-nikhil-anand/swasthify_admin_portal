"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function HeroSkeleton() {
    return (
        <div className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6">
                        <Skeleton className="h-12 w-3/4" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-5/6" />
                        <div className="flex gap-4 pt-4">
                            <Skeleton className="h-12 w-32 rounded-full" />
                            <Skeleton className="h-12 w-32 rounded-full" />
                        </div>
                    </div>
                    <div className="flex-1 w-full">
                        <Skeleton className="h-[400px] w-full rounded-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function GridSkeleton({ title }: { title: string }) {
    return (
        <div className="py-24 bg-muted/20">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-6 w-96" />
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-6 border rounded-[2rem] p-8 flex flex-col items-center text-center">
                            <Skeleton className="h-24 w-24 rounded-3xl" />
                            <div className="space-y-4 w-full flex flex-col items-center">
                                <Skeleton className="h-8 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            <div className="space-y-2 w-full">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                            <Skeleton className="h-12 w-full rounded-2xl" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function FAQSectionSkeleton() {
    return (
        <div className="py-24 bg-background">
            <div className="container mx-auto px-4 max-w-3xl">
                <Skeleton className="h-10 w-48 mx-auto mb-12" />
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full rounded-lg" />
                    ))}
                </div>
            </div>
        </div>
    );
}

export function WhyBookSkeleton() {
    return (
        <div className="py-24 bg-muted/10">
            <div className="container mx-auto px-4 text-center">
                <Skeleton className="h-10 w-64 mx-auto mb-12" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-4 text-center">
                            <Skeleton className="h-20 w-20 rounded-full mx-auto" />
                            <Skeleton className="h-6 w-32 mx-auto" />
                            <Skeleton className="h-4 w-48 mx-auto" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
