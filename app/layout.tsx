import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://swiftconvert.io"),
  title: {
    default: "SwiftConvert — Free Online File Converter | Image, PDF & More",
    template: "%s | SwiftConvert",
  },
  description:
    "Convert images to WebP, JPG, PDF and more — 100% free, no limits, no watermarks. Fast, private, browser-based conversion. JPG, PNG, HEIC, PDF merge, compress & more.",
  keywords: [
    "free file converter",
    "image to webp",
    "jpg to pdf",
    "heic to jpg",
    "webp to jpg",
    "pdf merge",
    "pdf compress",
    "image converter online",
    "convert png to webp",
    "online image converter free",
    "no watermark converter",
    "swiftconvert",
  ],
  authors: [{ name: "SwiftConvert" }],
  creator: "SwiftConvert",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "SwiftConvert",
    title: "SwiftConvert — Free Online File Converter",
    description: "Convert images, PDFs & more. Free, fast, no limits, no watermarks.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "SwiftConvert" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SwiftConvert — Free Online File Converter",
    description: "Convert images, PDFs & more. Free, fast, no limits.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#00D084",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,700,600&f[]=satoshi@300,400,500,700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "SwiftConvert",
              url: process.env.NEXT_PUBLIC_APP_URL || "https://swiftconvert.io",
              description: "Free online file converter — images, PDFs, and more.",
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "Web",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              featureList: [
                "Image to WebP conversion",
                "WebP to JPG/PNG conversion",
                "HEIC to JPG conversion",
                "Image to PDF conversion",
                "PDF merge",
                "PDF compress",
                "Bulk conversion",
                "No file size limit",
                "No watermarks",
              ],
            }),
          }}
        />
      </head>
      <body>
        {children}
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#1C2028",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#F0F2F5",
              fontFamily: "Satoshi, sans-serif",
            },
          }}
        />
      </body>
    </html>
  );
}
