import { polar } from "@/lib/polar";
import { getCurrentUserId } from "@/lib/shared";
import { CustomerPortal } from "@polar-sh/nextjs";

export const GET = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: process.env.NODE_ENV === "production" ? "production" : "sandbox",
  getCustomerId: async (req) => {
    const userId = await getCurrentUserId(req);
    const customer = await polar.customers.getExternal({ externalId: userId });
    return customer.id;
  },
});
