"use client";

import { motion } from "motion/react";
import { UploadCloud, MousePointerClick, Palette, Video } from "lucide-react";

const features = [
  {
    icon: <UploadCloud className="w-6 h-6" />,
    title: "Seamless Data Upload",
    description: "Connect your CRM, upload CSVs, or drop in media. We automatically generate stunning slides based on your data."
  },
  {
    icon: <MousePointerClick className="w-6 h-6" />,
    title: "Interactive Elements",
    description: "Add clickable links, polls, and CTAs directly into your stories to drive client engagement."
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: "Client Customization",
    description: "Allow clients to tweak colors, text, and layouts using our Canva-like editor before they share."
  },
  {
    icon: <Video className="w-6 h-6" />,
    title: "Video Integrations",
    description: "Edit and embed videos seamlessly with our CapCut and Canva API integrations."
  }
];

export function Features() {
  return (
    <section id="features" className="py-32 relative">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-display">
            Everything you need to wrap up the year.
          </h2>
          <p className="text-xl text-white/60">
            Powerful tools designed specifically for agencies to create memorable, data-driven stories.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
