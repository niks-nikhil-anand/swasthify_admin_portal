export interface Campaign {
    id: string;
    name: string;
    description: string | null;
    type: string;
    status: string;
    price: number;
    currency: string;
    discountPercentage: number;
    startDate: string;
    endDate: string;
    location: {
        city: string;
        state: string;
        address: string;
        pincode: string;
        district: string;
        latitude: number;
        longitude: number;
    };
    schedule: {
        days: string[];
        startTime: string;
        endTime: string;
    };
    dailyLimit: number;
    hourlyLimit: number | null;
    totalCapacity: number | null;
    requiredDetails: string[];
    bookingRules: unknown;
    eligibility: unknown;
    doctor: {
        id: string;
        userId: string;
        profilePhoto: string | null;
        experienceYears: number;
        qualification: string | null;
        bio: string | null;
        hospitalName: string | null;
        clinicName: string | null;
        averageRating: number;
        totalReviews: number;
        user: {
            name: string;
            email: string;
        };
        specializations: {
            id: string;
            name: string;
        }[];
        clinicImages: string[];
        reviews?: {
            id: string;
            rating: number;
            comment: string | null;
            createdAt: string;
            patient: {
                user: {
                    name: string;
                    profilePic?: string | null;
                };
            };
            appointment?: {
                dateTime: string;
            } | null;
        }[];
    };
    isVerified: boolean;
    doctorName?: string | null;
    doctorImage?: string | null;
    doctorExperience?: number | null;
    specialisation?: string | null;
    distanceKm?: number | null;
}
