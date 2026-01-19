
import { Check, X, Minus } from "lucide-react";

export function FeatureComparison() {
    const features = [
        { name: "Patient Management", starter: true, pro: true, enterprise: true },
        { name: "Appointment Scheduling", starter: "50/mo", pro: "Unlimited", enterprise: "Unlimited" },
        { name: "Lab Integration", starter: false, pro: true, enterprise: true },
        { name: "Electronic Health Records", starter: "Basic", pro: "Advanced", enterprise: "Advanced" },
        { name: "Billing & Invoicing", starter: false, pro: true, enterprise: true },
        { name: "SMS Reminders", starter: false, pro: true, enterprise: true },
        { name: "API Access", starter: false, pro: true, enterprise: true },
        { name: "Custom Branding", starter: false, pro: false, enterprise: true },
        { name: "Dedicated Support", starter: false, pro: "Chat", enterprise: "Phone + Manager" },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900 mb-4">Compare Plans</h2>
                    <p className="text-gray-500 max-w-[600px] mx-auto text-lg">
                        Detailed feature breakdown to help you choose the right plan.
                    </p>
                </div>

                <div className="overflow-hidden border border-gray-200 rounded-2xl shadow-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-200">
                                    <th className="py-6 px-6 text-lg font-semibold text-gray-900 w-1/4">Features</th>
                                    <th className="py-6 px-6 text-lg font-semibold text-gray-900 text-center w-1/4 border-l border-gray-200">Starter</th>
                                    <th className="py-6 px-6 text-lg font-semibold text-primary text-center w-1/4 bg-primary/5 border-l border-r border-primary/20 relative">
                                        Pro
                                        <div className="absolute top-0 left-0 w-full h-1 bg-primary/20"></div>
                                    </th>
                                    <th className="py-6 px-6 text-lg font-semibold text-gray-900 text-center w-1/4">Enterprise</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {features.map((feature, index) => (
                                    <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="py-4 px-6 text-gray-700 font-medium group-hover:text-gray-900">{feature.name}</td>
                                        <td className="py-4 px-6 text-center border-l border-gray-100">
                                            {renderValue(feature.starter)}
                                        </td>
                                        <td className="py-4 px-6 text-center bg-primary/5 border-l border-r border-primary/10 group-hover:bg-primary/10 transition-colors">
                                            {renderValue(feature.pro)}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {renderValue(feature.enterprise)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}

function renderValue(value: boolean | string) {
    if (typeof value === "boolean") {
        return value ? (
            <div className="flex justify-center"><Check className="h-5 w-5 text-emerald-500" /></div>
        ) : (
            <div className="flex justify-center"><Minus className="h-5 w-5 text-gray-300" /></div>
        );
    }
    return <span className="text-sm font-semibold text-gray-900">{value}</span>;
}
