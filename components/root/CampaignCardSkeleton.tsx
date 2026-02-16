import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const CampaignCardSkeleton = () => {
    return (
        <Card className="h-full overflow-hidden border border-emerald-500/10 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[3rem] flex flex-col">
            <CardHeader className="p-8 pb-4 space-y-6">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-4 w-20 rounded-full" />
                </div>
                <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-4 w-1/2 rounded-lg" />
                </div>
            </CardHeader>

            <CardContent className="px-8 pb-8 flex-1 flex flex-col justify-between space-y-8">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>

                <div className="p-5 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50 flex items-center gap-5">
                    <Skeleton className="h-16 w-16 rounded-2xl shrink-0" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-40" />
                    </div>
                </div>
            </CardContent>

            <CardFooter className="px-8 py-8 pt-0 mt-auto">
                <div className="flex items-center justify-between w-full p-6 py-5 bg-white dark:bg-zinc-900 rounded-[2.2rem] border border-zinc-100 dark:border-zinc-800">
                    <div className="space-y-1">
                        <Skeleton className="h-3 w-10" />
                        <Skeleton className="h-8 w-20" />
                    </div>
                    <Skeleton className="h-12 w-32 rounded-2xl" />
                </div>
            </CardFooter>
        </Card>
    );
};
