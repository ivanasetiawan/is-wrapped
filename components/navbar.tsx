"use client";

import { motion } from "motion/react";
import Link from "next/link";

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md border-b border-white/10 bg-black/50"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-100 to-white text-center">
          <span className="text-2xl">🧑🏻‍💻</span>
        </div>
        <span className="font-bold text-xl tracking-tighter">iswrapped</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
        <Link href="#features" className="hover:text-white transition-colors">
          Features
        </Link>
        <Link href="#demo" className="hover:text-white transition-colors">
          Demo
        </Link>
        <Link href="#pricing" className="hover:text-white transition-colors">
          Pricing
        </Link>
      </div>
      <div>
        <Link
          href="/make"
          className="px-4 py-2 rounded-full bg-white text-black font-medium text-sm hover:bg-white/90 transition-colors"
        >
          Get Started
        </Link>
      </div>
    </motion.nav>
  );
}
