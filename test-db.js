
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const appointment = await prisma.appointment.findFirst({
            include: {
                patient: true,
                doctor: {
                    include: {
                        user: true
                    }
                }
            }
        });
        console.log("Latest Appointment:", JSON.stringify(appointment, null, 2));
    } catch (error) {
        console.error("DB Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
