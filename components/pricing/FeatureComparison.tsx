
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

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="py-4 px-6 text-lg font-semibold text-gray-900 w-1/4">Features</th>
                                <th className="py-4 px-6 text-lg font-semibold text-gray-900 text-center w-1/4">Starter</th>
                                <th className="py-4 px-6 text-lg font-semibold text-primary text-center w-1/4">Pro</th>
                                <th className="py-4 px-6 text-lg font-semibold text-gray-900 text-center w-1/4">Enterprise</th>
                            </tr>
                        </thead>
                        <tbody>
                            {features.map((feature, index) => (
                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 text-gray-700 font-medium">{feature.name}</td>
                                    <td className="py-4 px-6 text-center">
                                        {renderValue(feature.starter)}
                                    </td>
                                    <td className="py-4 px-6 text-center bg-primary/5">
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
