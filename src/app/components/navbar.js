"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/add-client", label: "Add Client" },
  ];

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        {/* Logo and Brand Section */}
        <div className="flex items-center space-x-2">
          <Image
            src="/randyfit.png"
            alt="RandyFit Logo"
            width={40}
            height={40}
          />
          <div className="flex flex-col justify-center">
            <span className="text-xl font-bold leading-none">Randy</span>
            <span className="text-xl font-bold leading-none">Fit</span>
          </div>
        </div>

        {/* Menu Button for Mobile */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden block text-white hover:text-gray-300 focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Navigation Links */}
        <ul
          className={`flex flex-col md:flex-row md:space-x-6 absolute md:static bg-gray-900 md:bg-transparent w-full md:w-auto left-0 top-16 md:top-0 transition-all duration-300 ease-in z-50 ${isMenuOpen ? "block" : "hidden md:flex"
            }`}
        >
          {navLinks.map((link) => (
            <li
              key={link.href}
              className={`${router.pathname === link.href
                ? "text-blue-300 font-semibold underline"
                : ""
                }`}
            >
              <Link
                href={link.href}
                className="block px-4 py-2 md:py-0 hover:text-blue-400 transition"
                onClick={() => setIsMenuOpen(false)} // Close menu on click
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
