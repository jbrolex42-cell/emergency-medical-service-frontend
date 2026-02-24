import React from "react"
import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Brand */}
        <div className="text-xl font-bold text-ems-accent">
          EMS System
        </div>

        {/* Quick Links */}
        <div className="flex gap-6 text-gray-400">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/subscription" className="hover:text-white transition">Plans</Link>
          <Link to="/contact" className="hover:text-white transition">Contact</Link>
        </div>

        {/* WhatsApp */}
        <div>
          <a 
            href="https://wa.me/254757751980"
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium transition"
          >
            Chat on WhatsApp
          </a>
        </div>
         {/* Instagram */}
        <div>
          <a 
            href="https://www.instagram.com/irolex0?igsh=MTZ6NmlwamNidmE0NQ=="
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full font-medium transition"
          >
            Instagram
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ROLEX.O.O.          
        ALL RIGHTS RESERVED
      </div>
    </footer>
  );
}