import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const LabCampaignCardSkeleton = () => {
    return (
        <Card className="overflow-hidden border-l-4 border-l-muted border-t-0 border-r-0 border-b-0 flex flex-col h-full bg-white dark:bg-zinc-950">
            <CardHeader className="p-6 pb-2 space-y-4">
                <div className="flex justify-between items-start">
                    <Skeleton className="h-5 w-24 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </CardHeader>

            <CardContent className="p-6 flex-1 space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>

                <div className="flex items-center gap-4 p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                    <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-6 pt-0 mt-auto border-t border-zinc-50 dark:border-zinc-900">
                <div className="flex items-center justify-between w-full pt-4">
                    <div className="space-y-1">
                        <Skeleton className="h-3 w-10" />
                        <Skeleton className="h-8 w-20" />
                    </div>
                    <Skeleton className="h-11 w-32 rounded-xl" />
                </div>
            </CardFooter>
        </Card>
    );
};
