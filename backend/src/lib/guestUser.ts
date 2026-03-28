import { prisma } from "./prisma";

export const GUEST_USER_EMAIL = "guest@flipkart.demo";

export async function getGuestUserId(): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { email: GUEST_USER_EMAIL },
    select: { id: true },
  });
  if (!user) {
    throw new Error(
      "Guest user missing. Run: npm run db:seed (expects guest@flipkart.demo).",
    );
  }
  return user.id;
}
