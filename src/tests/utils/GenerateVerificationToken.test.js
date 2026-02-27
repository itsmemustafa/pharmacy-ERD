import GenerateVerificationToken from "../../utils/GenerateVerificationToken.js";
import prisma from "../../lib/prisma.js";

jest.mock("../../lib/prisma.js", () => ({
  __esModule: true,
  default: { user: { update: jest.fn() } },
}));

describe("GenerateVerificationToken()", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return a plain hex token", async () => {
    prisma.user.update.mockResolvedValue({});
    const token = await GenerateVerificationToken({ id: 1 });
    expect(token).toMatch(/^[a-f0-9]+$/);
  });

  it("should save hashed token and expiry to DB", async () => {
    prisma.user.update.mockResolvedValue({});
    await GenerateVerificationToken({ id: 1 });
    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 1 },
        data: expect.objectContaining({
          verificationToken: expect.any(String),
          verificationExpires: expect.any(Date),
        }),
      }),
    );
  });
});
