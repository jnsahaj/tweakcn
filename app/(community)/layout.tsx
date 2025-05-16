import { Header } from "@/components/header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community - TweakCN",
  description: "Explore themes created by the community",
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto py-8">{children}</div>
    </div>
  );
}
