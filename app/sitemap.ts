import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://swasthify.in';

    // Static routes
    const staticRoutes = [
        '',
        '/aboutUs',
        '/contact',
        '/faqs',
        '/how-it-works',
        '/pricing',
        '/services',
        '/specialities',
        '/privacyPolicy',
        '/termsService',
        '/doctors',
        '/labs',
        '/doctor-partner',
        '/lab-partner',
        '/pharmacy-partner',
        '/login',
        '/register',
        '/auth/doctor',
        '/auth/superAdmin',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    let doctorRoutes: any[] = [];
    let labRoutes: any[] = [];

    try {
        // Dynamic routes for doctors
        const doctors = await prisma.doctor.findMany({
            where: { isProfileComplete: true },
            select: { id: true, updatedAt: true },
        });

        doctorRoutes = doctors.map((doctor) => ({
            url: `${baseUrl}/doctors/${doctor.id}`,
            lastModified: doctor.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));

        // Dynamic routes for labs
        const labs = await prisma.lab.findMany({
            where: { isProfileComplete: true },
            select: { id: true, updatedAt: true },
        });

        labRoutes = labs.map((lab) => ({
            url: `${baseUrl}/labs/${lab.id}`,
            lastModified: lab.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));
    } catch (error) {
        console.error('Sitemap dynamic fetching error:', error);
    }

    return [...staticRoutes, ...doctorRoutes, ...labRoutes];
}
