import { DashboardSidebar } from "@/components/root/DashboardSidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-muted/5">
            <div className="container mx-auto px-4 py-8 lg:py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    <DashboardSidebar />
                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
