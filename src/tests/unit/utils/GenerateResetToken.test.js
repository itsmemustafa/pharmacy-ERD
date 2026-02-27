import GenerateResetToken from "../../../utils/GenerateResetToken.js";
import prisma from "../../../lib/prisma.js";
jest.mock("../../lib/prisma.js", () => ({
  __esModule: true,
  default: { user: { update: jest.fn() } },
}));

describe("GenerateResetToken()", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return a plain hex token", async () => {
    prisma.user.update.mockResolvedValue({});
    const token = await GenerateResetToken({ id: 1 });
    expect(token).toMatch(/^[a-f0-9]+$/);
  });

  it("should save hashed token and expiry to DB", async () => {
    prisma.user.update.mockResolvedValue({});
    await GenerateResetToken({ id: 1 });
    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 1 },
        data: expect.objectContaining({
          resetPasswordToken: expect.any(String),
          resetPasswordExpires: expect.any(Date),
        }),
      }),
    );
  });

  it("should generate a different token each call", async () => {
    prisma.user.update.mockResolvedValue({});
    const first = await GenerateResetToken({ id: 1 });
    const second = await GenerateResetToken({ id: 1 });
    expect(first).not.toBe(second);
  });
});
