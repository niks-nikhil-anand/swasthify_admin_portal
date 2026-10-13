import { db } from "@/lib/db";

export async function recalculateDoctorRating(doctorId: string) {
    const result = await db.review.aggregate({
        where: { doctorId },
        _avg: { rating: true },
        _count: { rating: true },
    });

    await db.doctor.update({
        where: { id: doctorId },
        data: {
            averageRating: result._avg.rating ?? 0,
            totalReviews: result._count.rating,
        },
    });
}

export function canReviewAppointment(status: string, dateTime: Date | string) {
    const appointmentDate = new Date(dateTime);
    return status === "COMPLETED" || (status === "CONFIRMED" && appointmentDate < new Date());
}
