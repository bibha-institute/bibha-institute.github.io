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
    title: "BIBHA Institute | Bangladesh Institute for Brain Health and Analytics",
    description: "BIBHA Institute advances brain health and aging through Bangladesh-centered, globally connected computational human-data research.",
    openGraph: {
      title: "BIBHA Institute",
      description: "Bangladesh-centered research on brain health and aging in whole-person context.",
      type: "website",
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "BIBHA Institute — Bangladesh Institute for Brain Health and Analytics" }],
    },
    twitter: { card: "summary_large_image", title: "BIBHA Institute", description: "Bangladesh Institute for Brain Health and Analytics.", images: ["/og.jpg"] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
