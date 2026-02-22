import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { Demo } from "@/components/demo";
import { Pricing } from "@/components/pricing";
import { Cta } from "@/components/cta";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/30">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Demo />
        <Pricing />
        <Cta />
      </main>
    </div>
  );
}
