const { prisma } = require('./lib/prisma');

async function testSitemap() {
    const baseUrl = 'https://swasthify.in';
    const staticRoutes = [
        '', '/aboutUs', '/contact', '/faqs', '/how-it-works', '/pricing', '/services',
        '/specialities', '/privacyPolicy', '/termsService', '/doctors', '/labs',
        '/doctor-partner', '/lab-partner', '/pharmacy-partner', '/login', '/register',
        '/auth/doctor', '/auth/superAdmin',
    ];

    try {
        const doctors = await prisma.doctor.findMany({ where: { isProfileComplete: true }, select: { id: true } });
        const labs = await prisma.lab.findMany({ where: { isProfileComplete: true }, select: { id: true } });
        console.log('Doctors found:', doctors.length);
        console.log('Labs found:', labs.length);
        console.log('Total URLs expected:', staticRoutes.length + doctors.length + labs.length);
    } catch (e) {
        console.error('Prisma Error:', e.message);
    }
}

testSitemap();
