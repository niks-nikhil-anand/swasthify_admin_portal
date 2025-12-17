export default function DoctorPanelPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Doctor Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, Doctor.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Placeholders for stats - just to show content area */}
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Total Patients</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
