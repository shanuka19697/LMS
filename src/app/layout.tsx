import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LMS - Modern Learning Platform",
    template: "%s | LMS - Modern Learning Platform",
  },
  description: "Unlock your potential with our creative learning management system. Access high-quality courses, track your progress, and achieve your learning goals.",
  keywords: ["Learning Management System", "Online Courses", "Education", "E-learning", "LMS", "Student Portal"],
  authors: [{ name: "LMS Team" }],
  creator: "DD_developer Team",
  publisher: "DD_developer Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dd-lms.vercel.app/",
    title: "LMS - Modern Learning Platform",
    description: "Unlock your potential with our creative learning management system.",
    siteName: "LMS Platform",
    images: [
      {
        url: "/images/hero.png", // Using an existing image from public/images
        width: 1200,
        height: 630,
        alt: "LMS Platform Hero Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LMS - Modern Learning Platform",
    description: "Unlock your potential with our creative learning management system.",
    images: ["/images/hero.png"],
    creator: "@dd_developer",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/images/hero.png", // Ideally should be an apple touch icon, using hero for now as placeholder or apple-touch-icon.png if available
  },
  metadataBase: new URL("https://dd-lms.vercel.app/"),
};

import { ToastProvider } from "@/components/ui/ToastProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${plusJakarta.variable} font-sans antialiased`} suppressHydrationWarning={true}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
