import React from "react";
import { Header } from "@/components/header";

interface LegalLayoutProps {
  children: React.ReactNode;
}

export default function LegalLayout({ children }: LegalLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      {/* You might want to add a footer here later */}
    </div>
  );
}
