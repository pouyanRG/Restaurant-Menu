import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
