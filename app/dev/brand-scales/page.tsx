import { notFound } from "next/navigation";
import { BrandScalesLab } from "@/features/brand-palettes/dev/brand-scales-lab";

export const metadata = { title: "Brand scales lab (dev)", robots: "noindex, nofollow" };

/** Dev-only page for tuning the brand scale generator. 404 in production builds. */
export default function BrandScalesDevPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <BrandScalesLab />;
}
