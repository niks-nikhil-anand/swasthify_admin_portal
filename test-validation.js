const z = require("zod");

// Redefine schema here to avoid import issues
const UserValidation = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .max(16, { message: "Password must be at most 16 characters." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one symbol." }),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{10}$/.test(val), {
      message: "Phone number must be exactly 10 digits.",
    }),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "DOCTOR", "PATIENT", "LAB", "PHARMACY"]), // Simulated nativeEnum
});

const testCases = [
  { name: "Pass: too short", data: { name: "Test", email: "t@t.com", password: "123", role: "PATIENT" }, shouldPass: false },
  { name: "Pass: no number", data: { name: "Test", email: "t@t.com", password: "Password!", role: "PATIENT" }, shouldPass: false },
  { name: "Pass: no symbol", data: { name: "Test", email: "t@t.com", password: "Password1", role: "PATIENT" }, shouldPass: false },
  { name: "Pass: valid", data: { name: "Test", email: "t@t.com", password: "Password@1", role: "PATIENT" }, shouldPass: true },
  
  { name: "Phone: empty string", data: { name: "Test", email: "t@t.com", password: "Password@1", phone: "", role: "PATIENT" }, shouldPass: true },
  { name: "Phone: too short", data: { name: "Test", email: "t@t.com", password: "Password@1", phone: "123", role: "PATIENT" }, shouldPass: false },
  { name: "Phone: non-numeric", data: { name: "Test", email: "t@t.com", password: "Password@1", phone: "123456789a", role: "PATIENT" }, shouldPass: false },
  { name: "Phone: valid", data: { name: "Test", email: "t@t.com", password: "Password@1", phone: "9876543210", role: "PATIENT" }, shouldPass: true },
];

console.log("Running Validation Tests...\n");

testCases.forEach((test) => {
  const result = UserValidation.safeParse(test.data);
  const passed = result.success;
  const status = passed === test.shouldPass ? "✅ PASS" : "❌ FAIL";
  console.log(`${status} - ${test.name}`);
  if (passed !== test.shouldPass && !passed) {
      console.log("   Errors:", JSON.stringify(result.error.format(), null, 2));
  } else if (!passed && test.name.includes("Pass: no symbol")) {
       // Debug check for symbol failure
       // console.log("   Symbol failure confirmed:", JSON.stringify(result.error.format(), null, 2));
  }
});
