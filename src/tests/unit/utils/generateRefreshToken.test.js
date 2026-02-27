import generateRefreshToken from "../../../utils/refresh-token";

describe("generateRefreshToken()", () => {
  it("should return a refreshToken, hashedToken, and expiry", () => {
    const result = generateRefreshToken();
    expect(result).toHaveProperty("refreshToken");
    expect(result).toHaveProperty("hashedToken");
    expect(result).toHaveProperty("refreshTokenExpiry");
  });

  it("should return a hex string for refreshToken", () => {
    const { refreshToken } = generateRefreshToken();
    expect(refreshToken).toMatch(/^[a-f0-9]+$/);
  });

  it("should return a different token each time", () => {
    const first = generateRefreshToken();
    const second = generateRefreshToken();
    expect(first.refreshToken).not.toBe(second.refreshToken);
  });

  it("should set expiry to approximately 7 days from now", () => {
    const { refreshTokenExpiry } = generateRefreshToken();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    expect(refreshTokenExpiry).toBeGreaterThan(Date.now());
    expect(refreshTokenExpiry).toBeCloseTo(Date.now() + sevenDays, -3);
  });
});
