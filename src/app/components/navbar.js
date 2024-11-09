"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white text-gray-800 p-4 shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Brand Section */}
        <div className="flex items-center space-x-2">
          {/* Logo */}
          <Image
            src="/randyfit.png" // Replace with the path to your logo
            alt="RandyFit Logo"
            width={40}
            height={40}
          />
          {/* Brand Text */}
          <div className="flex flex-col justify-center">
            <span className="text-lg font-bold leading-none">Randy</span>
            <span className="text-lg font-bold leading-none">Fit</span>
          </div>
        </div>

        {/* Menu Button for Mobile */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden block text-gray-800 hover:text-gray-600 focus:outline-none"
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
          className={`flex flex-col md:flex-row md:space-x-6 absolute md:static bg-white w-full md:w-auto left-0 top-16 md:top-0 transition-all duration-300 ease-in ${isMenuOpen ? "block" : "hidden md:flex"
            }`}
        >
          <li className="border-b md:border-none">
            <Link
              href="/"
              className="block px-4 py-2 md:py-0 hover:text-gray-600 transition"
              onClick={() => setIsMenuOpen(false)} // Close menu on click
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/add-client"
              className="block px-4 py-2 md:py-0 hover:text-gray-600 transition"
              onClick={() => setIsMenuOpen(false)} // Close menu on click
            >
              Add Client
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
