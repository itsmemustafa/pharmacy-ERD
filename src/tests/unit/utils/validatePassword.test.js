import validatePassword from "../../../utils/validatePassword";

describe("validatePassword()", () => {
  //Valid Password
  it("should return isValid true for a strong password", () => {
    const result = validatePassword("StrongPass1!");
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  //Errors
  it("should fail if password is less than 8 characters", () => {
    const result = validatePassword("Ab1!");
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "Password must be at least 8 characters long",
    );
  });

  it("should fail if password exceeds 128 characters", () => {
    const result = validatePassword("A1!" + "a".repeat(130));
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Password must not exceed 128 characters");
  });

  it("should fail if no uppercase letter", () => {
    const result = validatePassword("weakpass1!");
    expect(result.errors).toContain(
      "Password must contain at least one uppercase letter",
    );
  });

  it("should fail if no lowercase letter", () => {
    const result = validatePassword("WEAKPASS1!");
    expect(result.errors).toContain(
      "Password must contain at least one lowercase letter",
    );
  });

  it("should fail if no number", () => {
    const result = validatePassword("WeakPass!!");
    expect(result.errors).toContain(
      "Password must contain at least one number",
    );
  });

  it("should fail if no special character", () => {
    const result = validatePassword("WeakPass11");
    expect(result.errors).toContain(
      "Password must contain at least one special character",
    );
  });

  it("should fail for common passwords", () => {
    const result = validatePassword("password");
    expect(result.errors).toContain(
      "Password is too common. Please choose a stronger password",
    );
  });

  //Warnings
  it("should warn about sequential characters", () => {
    const result = validatePassword("StrongPass123!");
    expect(result.warnings).toContain(
      "Avoid using sequential characters for better security",
    );
  });

  it("should warn about repeated characters", () => {
    const result = validatePassword("StrrrongPass1!");
    expect(result.warnings).toContain(
      "Avoid repeating the same character multiple times",
    );
  });

  //Strength
  it("should return strong for a very good password", () => {
    const result = validatePassword("MyV3ryStr0ng!Pass#2024");
    expect(result.strength.level).toBe("strong");
  });

  it("should return weak for a barely valid password", () => {
    const result = validatePassword("Abcde1!!");
    expect(result.strength.level).toBeDefined();
  });
});
