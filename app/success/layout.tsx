export default function SuccessLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-grow flex-col">{children}</main>
    </div>
  );
}
