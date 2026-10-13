import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function getPatientUserId(req?: Request) {
    let token: string | undefined;

    const authHeader = req?.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.slice("Bearer ".length);
    }

    if (!token) {
        const cookieStore = await cookies();
        token = cookieStore.get("PATIENT")?.value;
    }

    if (!token) return null;

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret).catch(() => ({ payload: null }));

    if (!payload || payload.role !== "PATIENT" || !payload.userId) return null;
    return payload.userId as string;
}
