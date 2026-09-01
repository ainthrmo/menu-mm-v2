import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono, Noto_Sans_Myanmar } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

const getBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NODE_ENV === "production") {
    return "https://getmossqr.com";
  }
  return process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
};

const siteUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MOSSQR — Digital QR Menus for Restaurants & Cafés",
    template: "%s | MOSSQR",
  },
  description:
    "Create a beautiful digital QR menu for your restaurant or café. Let guests browse your menu instantly from their phones — no app required.",
  alternates: {
    canonical: "https://getmossqr.com",
  },
  openGraph: {
    title: "MOSSQR — Digital QR Menus for Restaurants & Cafés",
    description:
      "Create a beautiful digital QR menu for your restaurant or café. Let guests browse your menu instantly from their phones — no app required.",
    url: "https://getmossqr.com",
    siteName: "MOSSQR",
    locale: "en_US",
    alternateLocale: ["my_MM"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MOSSQR — Digital QR Menus for Restaurants & Cafés",
    description:
      "Create a beautiful digital QR menu for your restaurant or café. Let guests browse your menu instantly from their phones — no app required.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://getmossqr.com/#website",
      "url": "https://getmossqr.com",
      "name": "MOSSQR",
      "description": "Digital QR Menus for Restaurants & Cafés",
      "inLanguage": ["en", "my"],
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://getmossqr.com/#software",
      "name": "MOSSQR",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All modern web browsers",
      "description":
        "Create a beautiful digital QR menu for your restaurant or café. Let guests browse your menu instantly from their phones — no app required.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "MMK",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://getmossqr.com/#organization",
      "name": "MOSSQR",
      "url": "https://getmossqr.com",
      "logo": "https://getmossqr.com/moss_logo.jpg",
    },
  ],
};

const inter = Inter({
  variable: "--font-inter",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  display: "swap",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  display: "swap",
  subsets: ["latin"],
  weight: ["500"],
});

const notoSansMyanmar = Noto_Sans_Myanmar({
  variable: "--font-noto-sans-myanmar",
  display: "swap",
  subsets: ["myanmar"],
  weight: ["400", "600"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${notoSansMyanmar.variable} font-sans antialiased`}
      >
        <LanguageProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ToastProvider>
              {children}
            </ToastProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}