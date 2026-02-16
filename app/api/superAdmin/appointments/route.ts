import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const appointments = await db.appointment.findMany({
            include: {
                patient: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                phone: true,
                            }
                        }
                    }
                },
                doctor: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            }
                        },
                        specializations: true,
                    }
                },
                lab: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            }
                        }
                    }
                },
                labTest: true,
            },
            orderBy: {
                dateTime: 'desc'
            }
        });

        const formattedAppointments = appointments.map(apt => ({
            id: apt.id,
            patientName: apt.patient.user.name || "N/A",
            patientEmail: apt.patient.user.email,
            patientPhone: apt.patient.user.phone,
            providerName: apt.doctor?.user.name || apt.lab?.user.name || "N/A",
            doctorId: apt.doctorId,
            labId: apt.labId,
            dateTime: apt.dateTime,
            type: apt.type,
            status: apt.status,
            consultationFee: apt.consultationFee,
            videoLink: apt.videoLink,
            doctorSpecialization: apt.doctor?.specializations.map(s => s.name).join(", "),
            labTestName: apt.labTest?.name,
            patientDetails: {
                gender: apt.patient.gender,
                dob: apt.patient.dateOfBirth,
                bloodGroup: apt.patient.bloodGroup,
            }
        }));

        return NextResponse.json(formattedAppointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
