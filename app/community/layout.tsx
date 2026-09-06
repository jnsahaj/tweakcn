import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen  flex-col">
     <div className="wrapper flex-1 overflow-y-auto   max-h-screen flex flex-col ">
       <Header />
      <main className="flex flex-1 flex-col   overflow-hidden">{children}</main>
     </div>
      <Footer />
    </div>
  );
}
