"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Particles } from "./particles";
import Link from "next/link";

export function Cta() {
  return (
    <section className="py-32 relative overflow-hidden">
      <Particles />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-violet-900/20" />
      <div className="container px-4 mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-[3rem] p-12 md:p-20 relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-fuchsia-500/20 blur-[100px] pointer-events-none" />

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 relative z-10 font-display">
            Ready to wrap up your project?
          </h2>
          <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto relative z-10">
            Join hundreds of agencies creating unforgettable experiences for
            their clients. Start building your first story today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link
              href="/make"
              className="group relative px-8 py-4 bg-white text-black rounded-full font-medium text-lg overflow-hidden transition-transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-fuchsia-400 opacity-0 group-hover:opacity-20 transition-opacity" />
              <span className="flex items-center gap-2">
                Start Building Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <button className="px-8 py-4 bg-transparent text-white border border-white/20 rounded-full font-medium text-lg hover:bg-white/5 transition-colors">
              Contact Sales
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
