import { UserValidation } from "./lib/validators";

const testCases = [
  // Password Tests
  { name: "Pass: too short", data: { name: "Test", email: "t@t.com", password: "123", role: "USER" }, shouldPass: false },
  { name: "Pass: no number", data: { name: "Test", email: "t@t.com", password: "Password!", role: "USER" }, shouldPass: false },
  { name: "Pass: no symbol", data: { name: "Test", email: "t@t.com", password: "Password1", role: "USER" }, shouldPass: false },
  { name: "Pass: valid", data: { name: "Test", email: "t@t.com", password: "Password@1", role: "USER" }, shouldPass: true },
  
  // Phone Tests
  { name: "Phone: empty string", data: { name: "Test", email: "t@t.com", password: "Password@1", phone: "", role: "USER" }, shouldPass: true },
  { name: "Phone: undefined", data: { name: "Test", email: "t@t.com", password: "Password@1", role: "USER" }, shouldPass: true },
  { name: "Phone: too short", data: { name: "Test", email: "t@t.com", password: "Password@1", phone: "123", role: "USER" }, shouldPass: false },
  { name: "Phone: valid", data: { name: "Test", email: "t@t.com", password: "Password@1", phone: "9876543210", role: "USER" }, shouldPass: true },
];

console.log("Running Validation Tests...\n");

testCases.forEach((test) => {
  const result = UserValidation.safeParse(test.data);
  const passed = result.success;
  const status = passed === test.shouldPass ? "✅ PASS" : "❌ FAIL";
  console.log(`${status} - ${test.name}`);
  if (passed !== test.shouldPass && !passed) {
      console.log("   Errors:", JSON.stringify(result.error.format(), null, 2));
  }
});
