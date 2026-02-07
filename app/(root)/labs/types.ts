export interface LabUser {
    name: string;
    email: string;
    phone?: string;
}

export interface Lab {
    id: string;
    userId: string;
    profilePhoto: string | null;
    averageRating: number;
    totalReviews: number;
    testTypes: string[];
    user: LabUser;
}

export interface Location {
    city: string;
    state: string;
    address: string;
    pincode: string;
    district: string;
    latitude: number;
    longitude: number;
}

export interface Schedule {
    days: string[];
    startTime: string;
    endTime: string;
}

export interface LabCampaign {
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
    location: Location;
    schedule: Schedule;
    dailyLimit: number;
    hourlyLimit: number | null;
    totalCapacity: number | null;
    requiredDetails: string[];
    bookingRules: any;
    eligibility: any;
    lab: Lab;
    isVerified: boolean;
}
