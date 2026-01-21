import { Sidebar } from "@/components/doctor-panel/Sidebar";

export default function DoctorPanelLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-muted/20 w-full">
            {/* Sidebar: Hidden on mobile, fixed on desktop */}
            <div className="hidden md:flex flex-col w-64 fixed inset-y-0 z-50">
                <Sidebar className="w-full h-full" />
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col md:pl-64">
                {/* Navbar placeholder - can be added later if needed */}
                <main className="flex-1  py-6 overflow-y-auto">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
