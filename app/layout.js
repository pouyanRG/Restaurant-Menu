import "./globals.css";
import { Roboto, Vazirmatn } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
  variable: "--font-roboto"
});

const vazir = Vazirmatn({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-vazir"
});

export const metadata = {
  title: "Food Delivery",
  description: "Mobile food delivery dashboard — Next.js + React"
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#e3f7a0"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${roboto.variable} ${vazir.variable}`}>
      <body>{children}</body>
    </html>
  );
}
