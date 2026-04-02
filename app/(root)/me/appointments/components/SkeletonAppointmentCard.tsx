import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonAppointmentCard() {
    return (
        <div className="relative overflow-hidden bg-background border border-border/50 rounded-3xl p-5 sm:p-6">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-muted" />
            <div className="flex flex-col md:flex-row items-start md:items-center gap-5 sm:gap-6 relative z-10">
                <div className="flex items-center justify-between w-full md:w-auto gap-4">
                    <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl" />
                    <div className="md:hidden">
                        <Skeleton className="h-8 w-24 rounded-xl" />
                    </div>
                </div>

                <div className="flex-1 space-y-4 w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-48 sm:w-64 rounded-lg" />
                            <Skeleton className="h-5 w-24 rounded-lg" />
                        </div>
                        <div className="hidden md:block">
                            <Skeleton className="h-10 w-32 rounded-2xl" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 py-4 border-t border-b border-muted/50">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-3 w-16 rounded" />
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-7 w-7 rounded-lg" />
                                    <Skeleton className="h-4 w-20 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto pt-4 md:pt-0">
                    <Skeleton className="h-11 w-full md:w-32 rounded-2xl" />
                    <Skeleton className="h-11 w-full md:w-32 rounded-2xl" />
                </div>
            </div>
        </div>
    );
}

export function SkeletonAppointments() {
    return (
        <div className="space-y-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
                <SkeletonAppointmentCard key={i} />
            ))}
        </div>
    );
}
