"use client";

import { motion } from "motion/react";
import { Play } from "lucide-react";
import Image from "next/image";

export function Demo() {
  return (
    <section id="demo" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-zinc-950" />
      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6 font-display"
            >
              Gateway to <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                client delight.
              </span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-white/60 mb-8"
            >
              Watch how easy it is to transform raw analytics into a beautiful, interactive story that your clients will love to share.
            </motion.p>
            <motion.ul 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4 text-white/80"
            >
              {['Connect your data sources', 'Choose a premium template', 'Customize with your brand', 'Publish and share via link'].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500" />
                  {item}
                </li>
              ))}
            </motion.ul>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1 w-full"
          >
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 group bg-zinc-900">
              <video 
                src="https://assets.mixkit.co/videos/preview/mixkit-stars-in-the-night-sky-loop-4006-large.mp4" 
                autoPlay 
                muted 
                loop 
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform border border-white/20">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
              </div>
              
              {/* Floating UI Elements for Demo feel */}
              <div className="absolute top-4 left-4 p-3 bg-black/50 backdrop-blur-md rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Live Editor
              </div>
              <div className="absolute bottom-4 right-4 p-3 bg-black/50 backdrop-blur-md rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest text-violet-400">
                Preview Mode
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
