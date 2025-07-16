"use server";

import { polar } from "@/lib/polar";
import { getCurrentUser, logError } from "@/lib/shared";
import { getOrCreateCustomer } from "./customer";

export const createCheckout = async () => {
  try {
    const user = await getCurrentUser();
    const customer = await getOrCreateCustomer(user);
    const checkout = await polar.checkouts.create({
      products: [process.env.NEXT_PUBLIC_TWEAKCN_PRO_PRODUCT_ID!],
      customerId: customer?.id,
      successUrl: `${process.env.BASE_URL}/success?checkout_id={CHECKOUT_ID}`,
    });

    return { url: checkout.url };
  } catch (error) {
    logError(error as Error, { action: "createCheckout" });
    return { error: "Failed to create checkout" };
  }
};
