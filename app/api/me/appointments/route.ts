import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getPatientUserId } from "@/lib/patient-auth";

export async function GET(req: Request) {
    try {
        const userId = await getPatientUserId(req);

        if (!userId) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }
        console.log("Debug: userId from token:", userId);

        // 1. Find Patient profile
        const patient = await db.patient.findFirst({
            where: { userId: userId }
        });
        console.log("Debug: Patient profile found:", patient);

        if (!patient) {
            console.log("Debug: No patient profile found for userId:", userId);
            return NextResponse.json(
                { error: "Patient profile not found." },
                { status: 403 }
            );
        }

        // 2. Fetch Appointments
        console.log("Debug: Fetching appointments for patientId:", patient.id);
        const appointments = await db.appointment.findMany({
            where: { 
                patientId: patient.id,
                status: {
                    not: "PENDING"
                }
            },
            include: {
                doctor: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                addresses: true
                            }
                        },
                        specializations: true
                    }
                },
                lab: {
                    include: {
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                payment: true,
                review: true
            },
            orderBy: {
                dateTime: "desc"
            }
        });
        console.log("Debug: Number of appointments found:", appointments.length);

        const formattedAppointments = appointments.map((apt) => {
            const organizer = apt.doctor || apt.lab;
            const organizerName = organizer?.user?.name || "Unknown";
            const speciality = apt.doctor ? apt.doctor.specializations.map(s => s.name).join(", ") : "Lab Test";

            // If it's a doctor, we want to include more details
            const doctorDetails = apt.doctor ? {
                profilePhoto: apt.doctor.profilePhoto,
                qualification: apt.doctor.qualification,
                experienceYears: apt.doctor.experienceYears,
                clinicName: apt.doctor.clinicName,
                hospitalName: apt.doctor.hospitalName,
                bio: apt.doctor.bio,
                // We'll fetch the address from the user's addresses if available
                address: apt.doctor.user.addresses?.[0] ? {
                    street: apt.doctor.user.addresses[0].street,
                    city: apt.doctor.user.addresses[0].city,
                    state: apt.doctor.user.addresses[0].state,
                    zipCode: apt.doctor.user.addresses[0].zipCode,
                    latitude: apt.doctor.user.addresses[0].latitude,
                    longitude: apt.doctor.user.addresses[0].longitude,
                } : null
            } : null;

            const isPast = new Date(apt.dateTime) < new Date();

            return {
                id: apt.id,
                doctorId: apt.doctorId,
                doctor: organizerName,
                speciality: speciality,
                date: apt.dateTime.toISOString(),
                type: apt.type === "VIDEO" ? "Video Consultation" : "In-Person Visit",
                status: apt.status === "CONFIRMED" ? (isPast ? "Completed" : "Upcoming") : apt.status,
                img: apt.doctor?.profilePhoto || organizerName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
                rawStatus: apt.status,
                canReview: Boolean(apt.doctorId) && !apt.review && (apt.status === "COMPLETED" || (apt.status === "CONFIRMED" && isPast)),
                review: apt.review ? {
                    id: apt.review.id,
                    rating: apt.review.rating,
                    comment: apt.review.comment,
                    createdAt: apt.review.createdAt.toISOString(),
                } : null,
                // New fields for details view
                doctorDetails: doctorDetails,
                consultationFee: apt.consultationFee,
                appointmentType: apt.type,
                reason: apt.cancellationReason || "Routine Checkup", // Example, adjust if reason field exists
                queueNumber: apt.queueNumber,
                payment: apt.payment ? {
                    amount: apt.payment.amount,
                    discountAmount: apt.payment.discountAmount,
                    platformFee: apt.payment.platformFee,
                    finalAmount: apt.payment.finalAmount,
                    status: apt.payment.status
                } : null
            };
        });
        console.log("Debug: Formatted appointments count:", formattedAppointments.length);

        return NextResponse.json(formattedAppointments);

    } catch (error) {
        console.error("Fetch appointments error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
