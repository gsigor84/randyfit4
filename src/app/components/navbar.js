import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-white text-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Brand Section */}
        <div className="flex items-center space-x-2">
          {/* Logo */}
          <Image
            src="/randyfit.png" // Replace with the path to your logo
            alt="RandyFit Logo"
            width={40} // Adjust width as needed
            height={40} // Adjust height as needed
          />
          {/* Brand Text */}
          <div className="flex flex-col justify-center">
            <span className="text-lg font-bold leading-none">Randy</span>
            <span className="text-lg font-bold leading-none">Fit</span>
          </div>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-6">
          <li>
            <Link href="/" className="hover:text-gray-600 transition">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-gray-600 transition">
              About
            </Link>
          </li>
          <li>
            <Link href="/clients" className="hover:text-gray-600 transition">
              Clients
            </Link>
          </li>
          <li>
            <Link href="/add-client" className="hover:text-gray-600 transition">
              Add Client
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
