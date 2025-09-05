import "./globals.css";

export const metadata = {
  title: "Open18Source",
  description: "Your app description",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Load fonts from Fontshare CDN */}
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
