import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const CampaignCardSkeleton = () => {
    return (
        <Card className="overflow-hidden border-muted flex flex-col h-full">
            <div className="h-2 bg-muted" />
            <CardHeader className="p-5 pb-0 space-y-4">
                <div className="flex justify-between items-start">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div>
                    <Skeleton className="h-7 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </CardHeader>

            <CardContent className="p-5 flex-1">
                <div className="space-y-4">
                    {/* Description */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>

                    {/* Doctor Mini Profile */}
                    <div className="flex items-center gap-3 pt-4 border-t mt-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1.5">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-5 pt-0 mt-auto">
                <div className="flex items-center justify-between w-full">
                    <div className="space-y-1">
                        <Skeleton className="h-3 w-10" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="h-9 w-28 rounded-md" />
                </div>
            </CardFooter>
        </Card>
    );
};
