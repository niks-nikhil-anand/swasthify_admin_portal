import { Sidebar } from "@/components/superAdmin/Sidebar";
import { Navbar } from "@/components/superAdmin/Navbar";

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-page-bg w-full">
            {/* Sidebar: Hidden on mobile, fixed on desktop */}
            <div className="hidden md:flex flex-col w-64 fixed inset-y-0 z-50">
                <Sidebar className="w-full h-full" />
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col md:pl-64">
                <Navbar />
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
