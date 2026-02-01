import { Sidebar } from "@/components/lab-panel/Sidebar";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function getLabData() {
    const cookieStore = await cookies();
    const token = cookieStore.get("LAB")?.value;

    if (!token) return null;

    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.userId as string;

        if (!userId) return null;

        const lab = await db.lab.findUnique({
            where: { userId },
        });
        return lab;
    } catch (e) {
        return null;
    }
}

export default async function LabPanelLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const lab = await getLabData();

    return (
        <div className="min-h-screen bg-muted/20 w-full">
            {/* Sidebar: Hidden on mobile, fixed on desktop */}
            <div className="hidden md:flex flex-col w-64 fixed inset-y-0 z-50">
                <Sidebar className="w-full h-full" />
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col md:pl-64">
                {/* Navbar placeholder - can be added later if needed */}
                <main className="flex-1 p-2 md:p-4 overflow-y-auto">
                    <div className="w-full px-4 py-2">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
