"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { ArrowRight, Sparkles, BarChart3, Play } from "lucide-react";
import { Particles } from "./particles";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden">
      <Particles />

      {/* Fluid Background Shapes */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

      {/* Floating Icons */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-[15%] p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hidden md:block"
      >
        <Sparkles className="w-8 h-8 text-fuchsia-400" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-1/3 right-[15%] p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hidden md:block"
      >
        <BarChart3 className="w-8 h-8 text-violet-400" />
      </motion.div>

      <div className="container px-4 mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-white/80 mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-green-500" />
          Now with Canva Integration
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 font-display"
        >
          The future of client <br className="hidden md:block" /> reporting is
          here.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-2xl text-white/60 max-w-2xl mx-auto mb-10 font-light"
        >
          Create interactive, &quot;Wrapped&quot;-style experiences for your
          clients. Upload data, add media, and share stunning presentations in
          minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
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
          <button className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-medium text-lg hover:bg-white/10 transition-colors">
            Book a Demo
          </button>
        </motion.div>
      </div>

      {/* Mockup Section */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-24 relative w-full max-w-6xl mx-auto px-4"
      >
        <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10 bg-black/50 backdrop-blur-2xl shadow-2xl p-2">
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 to-fuchsia-500/10" />

          <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-zinc-950 flex items-center justify-center">
            <video
              src="https://assets.mixkit.co/videos/preview/mixkit-stars-in-the-night-sky-loop-4006-large.mp4"
              autoPlay
              muted
              loop
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />

            {/* Live Preview Snapshots */}
            <div className="relative z-10 flex items-center justify-center gap-6 md:gap-12 p-8 w-full h-full">
              {/* Phone 1: Metric Focus */}
              <motion.div
                whileHover={{ y: -20, rotate: 0 }}
                className="relative w-56 h-[450px] bg-zinc-900 rounded-[2.5rem] border-8 border-zinc-800 overflow-hidden shadow-2xl transform -rotate-6 transition-all duration-500"
              >
                <div className="absolute top-0 inset-x-0 h-5 bg-zinc-800 rounded-b-2xl mx-12 z-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black p-6 flex flex-col justify-center gap-4">
                  <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                    Impressions
                  </div>
                  <div className="text-5xl font-bold text-white font-display">
                    247M
                  </div>
                  <div className="text-xs text-white/60 leading-relaxed">
                    &quot;Your ads appeared enough times to fill Wembley Stadium
                    50x over&quot;
                  </div>
                  <div className="flex gap-1 mt-4">
                    <div className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[8px] text-white/40">
                      +42% vs 2024
                    </div>
                    <div className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[8px] text-white/40">
                      3.8% CTR
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Phone 2: Campaign Launch */}
              <motion.div
                whileHover={{ y: -20, rotate: 0 }}
                className="relative w-56 h-[450px] bg-zinc-900 rounded-[2.5rem] border-8 border-zinc-800 overflow-hidden shadow-2xl transform rotate-6 transition-all duration-500 z-10"
              >
                <div className="absolute top-0 inset-x-0 h-5 bg-zinc-800 rounded-b-2xl mx-12 z-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 to-black p-0 flex flex-col">
                  <div className="h-1/2 w-full relative">
                    <Image
                      src="https://picsum.photos/400/600?random=1"
                      fill
                      className="object-cover"
                      alt="Live Preview Snapshot"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-end gap-2">
                    <div className="text-lg font-bold text-white font-display leading-tight">
                      9 major campaigns that drove wins
                    </div>
                    <div className="text-[10px] text-violet-400 font-bold uppercase tracking-widest">
                      Q3 SaaS Launch
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-violet-500" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Phone 3: Events (Desktop only) */}
              <motion.div
                whileHover={{ y: -20, rotate: 0 }}
                className="relative w-56 h-[450px] bg-zinc-900 rounded-[2.5rem] border-8 border-zinc-800 overflow-hidden shadow-2xl transform rotate-12 transition-all duration-500 hidden lg:block"
              >
                <div className="absolute top-0 inset-x-0 h-5 bg-zinc-800 rounded-b-2xl mx-12 z-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-black p-6 flex flex-col justify-between">
                  <div className="space-y-4 pt-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="text-xl font-bold text-white font-display">
                      London Growth Summit
                    </div>
                    <div className="text-xs text-white/60">
                      847 attendees | 92% NPS
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"
                      >
                        <div
                          className="h-full bg-emerald-500/50"
                          style={{ width: `${100 - i * 20}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center shadow-2xl">
                <Play className="w-10 h-10 text-white fill-white ml-1" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
