import "./globals.css";
import Navbar from "@/app/components/navbar"; // ✅ Use alias import
import Providers from "./providers"; // ✅ Import NextUI provider

export const metadata = {
  title: "My App",
  description: "A Next.js application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Providers>
          <Navbar />
          <main className="flex-grow">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
