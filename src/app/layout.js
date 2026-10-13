import { Geist, Geist_Mono } from "next/font/google";
import ThemeScript from "@/components/theme/ThemeScript";
import ThemeSettings from "@/components/theme/ThemeSettings";
import { DEFAULT_ACCENT, DEFAULT_MODE } from "@/config/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Demo Support Tool",
    template: "%s | Demo Support Tool",
  },
  description: "Demo Support Tool",
  icons: {
    icon: "/icon.png?v=2",
    shortcut: "/icon.png?v=2",
    apple: "/icon.png?v=2",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme={DEFAULT_MODE}
      data-accent={DEFAULT_ACCENT}
      // The theme script updates these attributes before React loads.
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <ThemeSettings />
      </body>
    </html>
  );
}
