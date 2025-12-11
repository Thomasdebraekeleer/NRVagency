import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import GoogleAnalytics from "@/app/GoogleAnalytics";
import Script from "next/script";

import "./globals.css";
import StoreProvider from "@/redux/storeProvider";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
gsap.registerPlugin(CustomEase);

const dM_Sans = DM_Sans({ subsets: ["latin-ext"] });
const satoshi = localFont({
  src: "../font/satoshi/Satoshi-Variable.woff2",
  style: "normal",
});

const helvetica = localFont({
  src: "../font/helvetica/HelveticaNowDisplay-Medium.woff2",
  style: "normal",
});

export const metadata: Metadata = {
  title: "NRV Agency",
  description:
    "NRV Agency - Creative agency specializing in branding, web design, and digital experiences.",
  icons: {
    icon: [
      { url: "/img/Project/Poject Sector One/LOGO NRV.webp", type: "image/webp" },
      { url: "/img/logo.png", type: "image/png" },
    ],
    shortcut: "/img/logo.png",
    apple: "/img/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no"
        ></meta>
        <link rel="icon" href="/img/logo.png" type="image/png" />
        <link rel="shortcut icon" href="/img/logo.png" type="image/png" />
        <GoogleAnalytics />
      </head>

      <body className={`${dM_Sans.className} ${helvetica.className} antialiased`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
      <Script src="https://cdn.jsdelivr.net/gh/vipulkumar-dev/gsap@2024/ScrambleTextPlugin.min.js" />
    </html>
  );
}
