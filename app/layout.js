import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

export const metadata = {
  title: "Open18Source",
  description: "For developers willing to do their first open-source contribution",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Load fonts from Fontshare CDN */}
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
