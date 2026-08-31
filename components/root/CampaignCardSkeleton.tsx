import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const CampaignCardSkeleton = () => {
    return (
        <Card className="h-full overflow-hidden rounded-[1.75rem] border border-emerald-500/10 bg-zinc-50/80 backdrop-blur-xl dark:bg-zinc-900/80 sm:rounded-[2rem] md:rounded-[2.25rem] lg:rounded-[3rem]">
            <CardHeader className="space-y-4 p-4 pb-3 sm:space-y-5 sm:p-6 md:p-7 lg:space-y-6 lg:p-8 lg:pb-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-4 w-20 rounded-full" />
                </div>
                <div className="space-y-3">
                    <Skeleton className="h-8 w-full sm:h-9 lg:h-10" />
                    <Skeleton className="h-8 w-3/4 sm:h-9 lg:h-10" />
                    <Skeleton className="h-4 w-1/2 rounded-lg" />
                </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col justify-between space-y-6 px-4 pb-5 sm:space-y-7 sm:px-6 sm:pb-6 lg:space-y-8 lg:px-8 lg:pb-8">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>

                <div className="flex items-center gap-4 rounded-[1.5rem] border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800/50 dark:bg-zinc-900/50 sm:gap-5 sm:rounded-[2rem] sm:p-5">
                    <Skeleton className="h-14 w-14 shrink-0 rounded-2xl sm:h-16 sm:w-16" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-40" />
                    </div>
                </div>
            </CardContent>

            <CardFooter className="mt-auto px-4 pb-4 pt-0 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
                <div className="flex w-full items-center justify-between rounded-[1.25rem] border border-zinc-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:rounded-[2.2rem] sm:p-6 sm:py-5">
                    <div className="space-y-1">
                        <Skeleton className="h-3 w-10" />
                        <Skeleton className="h-8 w-20" />
                    </div>
                    <Skeleton className="h-11 w-28 rounded-2xl sm:h-12 sm:w-32" />
                </div>
            </CardFooter>
        </Card>
    );
};
