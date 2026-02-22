"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$49",
    description: "Perfect for small agencies just getting started.",
    features: ["Up to 10 clients", "Basic templates", "Standard analytics", "Email support"],
  },
  {
    name: "Pro",
    price: "$99",
    popular: true,
    description: "Everything you need to scale your client reporting.",
    features: ["Up to 50 clients", "Premium templates", "Custom branding", "Canva integration", "Priority support"],
  },
  {
    name: "Enterprise",
    price: "$249",
    description: "Advanced features for large-scale operations.",
    features: ["Unlimited clients", "Custom API access", "CapCut integration", "White-label domain", "Dedicated success manager"],
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-32 relative bg-white text-black">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-display">
            We&apos;ve got a plan that&apos;s perfect for you
          </h2>
          <p className="text-xl text-black/60">
            Simple, transparent pricing that grows with your agency.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative p-8 rounded-3xl border ${plan.popular ? 'border-black bg-zinc-50 shadow-xl' : 'border-black/10 bg-white'} flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute -top-4 right-8 px-3 py-1 bg-black text-white text-xs font-bold rounded-full uppercase tracking-wider">
                  Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-bold tracking-tighter">{plan.price}</span>
                  <span className="text-black/50 text-sm">per user<br/>per month</span>
                </div>
                <p className="text-black/60 text-sm h-10">{plan.description}</p>
              </div>
              
              <button className={`w-full py-3 rounded-xl font-medium mb-8 transition-colors ${plan.popular ? 'bg-black text-white hover:bg-black/90' : 'bg-black text-white hover:bg-black/90'}`}>
                Get started
              </button>

              <div className="flex-1">
                <p className="text-xs font-bold text-black/80 mb-4 uppercase tracking-wider">Features</p>
                <p className="text-sm text-black/60 mb-4">Everything in our {index === 0 ? 'free' : plans[index-1].name} plan plus....</p>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm text-black/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
