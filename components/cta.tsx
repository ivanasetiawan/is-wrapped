"use client";

import { motion } from "motion/react";

export function Cta() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-violet-900/20" />
      <div className="container px-4 mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-[3rem] p-12 md:p-20 backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-fuchsia-500/20 blur-[100px] pointer-events-none" />
          
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 relative z-10 font-display">
            Ready to wrap up your year?
          </h2>
          <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto relative z-10">
            Join hundreds of agencies creating unforgettable experiences for their clients. Start building your first story today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <button className="px-8 py-4 bg-white text-black rounded-full font-medium text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              Start Building Free
            </button>
            <button className="px-8 py-4 bg-transparent text-white border border-white/20 rounded-full font-medium text-lg hover:bg-white/5 transition-colors">
              Contact Sales
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
