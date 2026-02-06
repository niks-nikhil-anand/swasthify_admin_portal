
import { User } from "lucide-react";

export function PricingTestimonials() {
    const testimonials = [
        {
            quote: "Swasthify has completely transformed how we manage our clinic. The patient records and appointment features are a lifesaver.",
            author: "Dr. Sharma",
            role: "General Physician, Mumbai"
        },
        {
            quote: "The Pro plan is incredible value. Being able to access lab reports and send prescriptions digitally has delighted our patients.",
            author: "Dr. Priya Patel",
            role: "Pediatrician, Bangalore"
        },
        {
            quote: "We switched from a legacy system to Swasthify Enterprise. The migration was smooth and the support team is top-notch.",
            author: "City Care Hospital",
            role: "Administration Dept, Delhi"
        }
    ];

    return (
        <section className="w-full py-24 bg-background">
            <div className="container px-4 md:px-6 mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-16 text-foreground">Trusted by Healthcare Professionals</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, index) => (
                        <div key={index} className="flex flex-col p-8 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 dark:border-emerald-500/20 relative transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5">
                            <div className="mb-6 text-emerald-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="opacity-50">
                                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z"></path>
                                </svg>
                            </div>
                            <p className="text-lg text-foreground/80 font-medium italic mb-6 leading-relaxed grow">
                                "{t.quote}"
                            </p>
                            <div className="flex items-center gap-4 mt-auto">
                                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                    <User className="text-emerald-600 dark:text-emerald-400" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground">{t.author}</h4>
                                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
