import "./globals.css";
import Navbar from "./components/navbar";

export const metadata = {
  title: "My App",
  description: "A Next.js application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <div class="pt-8 ">
          <main className="flex-grow px-4 pb-8">{children}</main>
        </div>
      </body>
    </html >
  );
}
