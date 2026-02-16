import Razorpay from "razorpay";

if (!process.env.RAZORPAY_LIVE_API_KEY || !process.env.RAZORPAY_SECRET_API_KEY) {
    console.error("RAZORPAY_LIVE_API_KEY or RAZORPAY_SECRET_API_KEY is not defined");
}

export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_LIVE_API_KEY!,
    key_secret: process.env.RAZORPAY_SECRET_API_KEY!,
});
