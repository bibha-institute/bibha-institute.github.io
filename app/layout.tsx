import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const base = host ? `${protocol}://${host}` : "http://localhost:3000";
  return {
    metadataBase: new URL(base),
    title: "BAIRE Research Commons | Research without borders",
    description: "A proposed Bangladesh-centered global research network connecting emerging scientists, mentors, institutions, and the diaspora through focused four-month projects.",
    openGraph: {
      title: "BAIRE Research Commons",
      description: "Research talent is everywhere. Opportunity should be too.",
      type: "website",
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "BAIRE Research Commons — Bangladesh to the world" }],
    },
    twitter: { card: "summary_large_image", title: "BAIRE Research Commons", description: "Research talent is everywhere. Opportunity should be too.", images: ["/og.jpg"] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
