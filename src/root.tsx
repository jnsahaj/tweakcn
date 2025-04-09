import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import App from "./app"; // Import the main App component

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "tweakcn",
              description:
                "A powerful theme editor for shadcn/ui components, offering beautifully designed themes and seamless Tailwind CSS integration.",
              url: "https://tweakcn.com",
              applicationCategory: "DesignApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Person",
                name: "Sahaj Jain",
              },
            }),
          }}
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {/* IMPORTANT: DO NOT REMOVE THIS SCRIPT TAG OR THIS VERY COMMENT! */}
        <script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>
        {/* <script type="module" src="/src/main.tsx"></script> - This is now handled by Scripts */}
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}
