import { redirect } from "next/navigation";

// This page is being moved to settings/themes
export default function DashboardRedirect() {
  redirect("/settings/themes");
}
