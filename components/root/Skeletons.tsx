import { Skeleton } from "@/components/ui/skeleton";

export function HeroSkeleton() {
    return (
        <section className="relative overflow-hidden bg-primary/5 pt-16 pb-20 md:pt-24 md:pb-32 lg:pt-32 lg:pb-40">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
                        <Skeleton className="h-8 w-48 rounded-full" />
                        <div className="space-y-4 w-full flex flex-col items-center lg:items-start">
                            <Skeleton className="h-12 md:h-16 w-3/4 max-w-lg" />
                            <Skeleton className="h-12 md:h-16 w-1/2 max-w-xs" />
                        </div>
                        <Skeleton className="h-6 w-full max-w-lg" />
                        <div className="w-full max-w-md p-2 bg-background border border-border/50 rounded-full shadow-xl shadow-primary/5 flex items-center gap-2">
                            <Skeleton className="h-10 w-full rounded-full" />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
                            <Skeleton className="h-12 w-full sm:w-40 rounded-full" />
                            <Skeleton className="h-12 w-full sm:w-40 rounded-full" />
                        </div>
                        <div className="flex items-center gap-8 pt-6">
                            <Skeleton className="h-10 w-32 rounded-full" />
                            <Skeleton className="h-4 w-[1px]" />
                            <Skeleton className="h-10 w-24 rounded-full" />
                        </div>
                    </div>
                    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
                        <Skeleton className="w-full aspect-[4/3] lg:aspect-square rounded-[2.5rem]" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export function ServicesSkeleton() {
    return (
        <section className="py-20 bg-muted/40">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4 flex flex-col items-center">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-6 w-full max-w-md" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-card p-3 md:p-8 rounded-2xl border border-border flex flex-col items-start h-full h-64">
                            <Skeleton className="h-16 w-16 rounded-xl mb-6" />
                            <Skeleton className="h-6 w-3/4 mb-4" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-5/6 mb-8" />
                            <Skeleton className="h-10 w-full mt-auto rounded-md" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function DiagnosticTestsSkeleton() {
    return (
        <section className="container mx-auto py-12 px-4 md:px-6">
            <div className="flex flex-col space-y-4">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-80" />
                    <Skeleton className="h-6 w-48 rounded-full" />
                </div>
                <div className="flex space-x-4 p-4 overflow-hidden">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-[300px] shrink-0 border rounded-xl p-6 h-48 flex flex-col justify-between">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Skeleton className="h-6 w-32" />
                                    <Skeleton className="h-6 w-16" />
                                </div>
                                <Skeleton className="h-4 w-full" />
                            </div>
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function HealthPackagesSkeleton() {
    return (
        <div className="bg-gray-50 bg-opacity-50">
            <section className="container mx-auto py-12 px-4 md:px-6">
                <div className="flex flex-col space-y-6">
                    <Skeleton className="h-12 w-96 mb-2" />
                    <div className="flex space-x-6 mb-6">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="border-2 rounded-xl overflow-hidden h-full flex flex-col bg-card">
                                <Skeleton className="h-32 md:h-56 w-full" />
                                <div className="p-3 md:p-6 flex-1 space-y-3">
                                    <Skeleton className="h-6 w-full" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                                <div className="p-3 md:p-6 pt-0 space-y-4">
                                    <div className="flex items-baseline space-x-2">
                                        <Skeleton className="h-8 w-24" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export function AbhaIntegrationSkeleton() {
    return (
        <section className="py-24 bg-linear-to-br from-primary/5 via-white to-accent/5 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 order-2 lg:order-1">
                        <Skeleton className="h-8 w-48 rounded-full" />
                        <Skeleton className="h-12 md:h-16 w-full max-w-lg" />
                        <Skeleton className="h-6 w-full max-w-md" />
                        <Skeleton className="h-14 w-40 rounded-full" />
                    </div>
                    <div className="relative mx-auto w-full max-w-md lg:max-w-none order-1 lg:order-2">
                        <Skeleton className="w-full aspect-video lg:aspect-[4/3] rounded-[2rem]" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export function HowItWorksSkeleton() {
    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 flex flex-col items-center space-y-4">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-6 w-full max-w-md" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex flex-col items-center text-center space-y-4">
                            <Skeleton className="h-12 w-12 md:h-16 md:w-16 rounded-2xl" />
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function SpecialitiesSkeleton() {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 md:mb-12 gap-4">
                    <div className="space-y-2 flex flex-col items-center md:items-start">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-6 w-48" />
                    </div>
                    <Skeleton className="h-6 w-32 hidden md:block" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex flex-col items-center p-4 border rounded-2xl h-48 space-y-3">
                            <Skeleton className="h-16 w-16 md:h-32 md:w-32 rounded-full" />
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function InClinicSkeleton() {
    return (
        <section className="py-20 bg-muted/40">
            <div className="container mx-auto px-4">
                <div className="mb-10 space-y-3 flex flex-col items-center md:items-start">
                    <Skeleton className="h-10 w-3/4 max-w-2xl" />
                    <Skeleton className="h-6 w-1/2 max-w-lg" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-2xl overflow-hidden border bg-card">
                            <Skeleton className="h-28 md:h-48 w-full" />
                            <div className="p-3 md:p-5 space-y-2">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function TestimonialsSkeleton() {
    return (
        <section className="py-10 bg-background overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 px-4 flex flex-col items-center space-y-4">
                    <Skeleton className="h-8 w-32 rounded-full" />
                    <Skeleton className="h-12 w-64" />
                    <Skeleton className="h-6 w-full max-w-md" />
                </div>
                <div className="flex md:grid md:grid-cols-3 gap-6 overflow-hidden">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="min-w-[85vw] md:min-w-0 md:col-span-1 border rounded-2xl p-8 h-64 flex flex-col justify-between">
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map(star => <Skeleton key={star} className="h-5 w-5 rounded-sm" />)}
                            </div>
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-3/4 mb-4" />
                            <div className="flex items-center gap-4 mt-auto pt-4 border-t">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function DownloadAppSkeleton() {
    return (
        <section className="py-24 bg-linear-to-br from-blue-50/50 via-white to-purple-50/50 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-0">
                    <div className="w-full lg:w-5/12 flex justify-center lg:justify-end order-2 lg:order-1 px-4 lg:px-0">
                        <Skeleton className="w-[300px] h-[600px] rounded-3xl" />
                    </div>
                    <div className="w-full lg:w-5/12 order-1 lg:order-2 text-center lg:text-left space-y-8 flex flex-col items-center lg:items-start">
                        <Skeleton className="h-12 md:h-16 w-3/4" />
                        <Skeleton className="h-6 w-full max-w-lg" />
                        <div className="w-full space-y-4">
                            <Skeleton className="h-5 w-48" />
                            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                                <Skeleton className="h-14 w-full rounded-xl" />
                                <Skeleton className="h-14 w-32 rounded-xl" />
                            </div>
                        </div>
                        <div className="flex gap-4 w-full justify-center lg:justify-start">
                            <Skeleton className="h-16 w-48 rounded-xl" />
                            <Skeleton className="h-16 w-48 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function HomePageSkeleton() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                <HeroSkeleton />
                <ServicesSkeleton />
                <DiagnosticTestsSkeleton />
                <HealthPackagesSkeleton />
                <AbhaIntegrationSkeleton />
                <HowItWorksSkeleton />
                <SpecialitiesSkeleton />
                <InClinicSkeleton />
                <TestimonialsSkeleton />
                <DownloadAppSkeleton />
            </main>
        </div>
    );
}
