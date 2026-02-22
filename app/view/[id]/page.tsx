"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Play, Pause, Share2 } from "lucide-react";
import { useParams } from "next/navigation";

// This page simulates viewing a shared wrapped.
// In a real app, it would fetch data from a DB using the ID.

export default function ViewPage() {
  const params = useParams();
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      const saved = localStorage.getItem("wrapped_data");
      if (saved) {
        setSlides(JSON.parse(saved));
      } else {
        // Fallback demo data
        setSlides([
          {
            id: "1",
            title: "Your Year in Review",
            description: "You've been busy! Here's a look at your agency's performance.",
            value: "1.2M Views",
            metrics: [{ label: "+20% growth", value: "" }],
            duration: 5,
            elements: []
          }
        ]);
      }
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading || isPaused || slides.length === 0) return;

    const currentSlide = slides[currentSlideIndex];
    const duration = (currentSlide?.duration || 6) * 1000;
    const interval = 50;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (currentSlideIndex < slides.length - 1) {
            setCurrentSlideIndex(currentSlideIndex + 1);
            return 0;
          } else {
            // Loop or stop
            setCurrentSlideIndex(0);
            return 0;
          }
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isLoading, isPaused, currentSlideIndex, slides]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex flex-col">
      {/* Progress Bar */}
      <div className="absolute top-0 inset-x-0 h-1 flex gap-1 px-4 py-4 z-50">
        {slides.map((_, idx) => (
          <div key={idx} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
            {idx < currentSlideIndex && <div className="h-full bg-white" />}
            {idx === currentSlideIndex && (
              <motion.div 
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.05 }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Slide Content */}
      <div 
        className="flex-1 flex items-center justify-center p-8"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlideIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="relative bg-zinc-950 rounded-[3rem] overflow-hidden shadow-2xl border border-white/5"
            style={{ 
              aspectRatio: `${currentSlide.width || 1080} / ${currentSlide.height || 1920}`,
              height: '100%',
              maxHeight: '100%',
              maxWidth: '100%',
              background: currentSlide.background?.type === 'image' 
                ? `url(${currentSlide.background.value}) center/cover` 
                : currentSlide.background?.value || '#000'
            }}
          >
            {/* Elements */}
            <AnimatePresence>
              {currentSlide.elements?.sort((a: any, b: any) => (a.zIndex || 0) - (b.zIndex || 0)).map((el: any) => {
                const getAnimProps = () => {
                  switch (el.animationIn) {
                    case 'fade': return { initial: { opacity: 0 }, animate: { opacity: el.opacity ?? 1 } };
                    case 'slideLeft': return { initial: { opacity: 0, x: el.x - 50 }, animate: { opacity: el.opacity ?? 1, x: el.x } };
                    case 'slideRight': return { initial: { opacity: 0, x: el.x + 50 }, animate: { opacity: el.opacity ?? 1, x: el.x } };
                    case 'scaleUp': return { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: el.opacity ?? 1, scale: 1 } };
                    default: return { initial: { opacity: el.opacity ?? 1 }, animate: { opacity: el.opacity ?? 1 } };
                  }
                };

                const getExitProps = () => {
                  switch (el.animationOut) {
                    case 'fade': return { opacity: 0 };
                    case 'scaleDown': return { opacity: 0, scale: 0.8 };
                    default: return { opacity: 0 };
                  }
                };

                const anim = getAnimProps();

                return (
                  <motion.div 
                    key={el.id}
                    initial={anim.initial}
                    animate={anim.animate}
                    exit={getExitProps()}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{ 
                      x: el.x, 
                      y: el.y, 
                      width: el.width, 
                      height: el.height, 
                      zIndex: el.zIndex,
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      filter: el.filter,
                      opacity: el.opacity ?? 1,
                      color: el.color || '#ffffff',
                      backgroundColor: el.backgroundColor || 'transparent',
                      padding: `${el.padding || 0}px`,
                      borderRadius: `${el.borderRadius || 0}px`,
                      boxShadow: el.boxShadow || 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: el.type === 'metric' ? 'center' : 'flex-start',
                      fontSize: el.type === 'title' ? '4rem' : el.type === 'value' ? '3rem' : '1.25rem',
                      fontWeight: el.type === 'description' ? 'normal' : 'bold',
                      lineHeight: 1.2,
                      overflow: 'hidden'
                    }}
                  >
                    {el.type === 'image' && (
                      <div className="w-full h-full relative rounded-2xl overflow-hidden">
                        <Image 
                          src={el.content} 
                          fill 
                          className="object-cover" 
                          alt="" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    {el.type === 'video' && <video src={el.content} autoPlay muted loop className="w-full h-full object-cover rounded-2xl" />}
                    {el.type === 'shape' && <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: el.content }} />}
                    {el.type === 'text' && (
                      <div 
                        className="w-full h-full text-2xl font-bold whitespace-pre-wrap"
                        style={{ backdropFilter: el.backdropBlur ? `blur(${el.backdropBlur}px)` : 'none' }}
                      >
                        {el.content}
                      </div>
                    )}
                    {el.type === 'title' && (
                      <div 
                        className="w-full h-full text-6xl font-bold tracking-tighter font-display"
                        style={{ backdropFilter: el.backdropBlur ? `blur(${el.backdropBlur}px)` : 'none' }}
                      >
                        {el.content}
                      </div>
                    )}
                    {el.type === 'description' && (
                      <div 
                        className="w-full h-full text-xl opacity-60 whitespace-pre-wrap"
                        style={{ backdropFilter: el.backdropBlur ? `blur(${el.backdropBlur}px)` : 'none' }}
                      >
                        {el.content}
                      </div>
                    )}
                    {el.type === 'value' && (
                      <div 
                        className="w-full h-full border border-white/10 p-6 rounded-2xl transition-all flex flex-col justify-center"
                        style={{ 
                          color: el.color || '#10b981',
                          backgroundColor: el.backgroundColor || 'rgba(255,255,255,0.05)',
                          padding: `${el.padding || 24}px`,
                          borderRadius: `${el.borderRadius || 16}px`,
                          boxShadow: el.boxShadow || 'none',
                          backdropFilter: el.backdropBlur ? `blur(${el.backdropBlur}px)` : 'none'
                        }}
                      >
                        <div className="text-[10px] opacity-40 uppercase tracking-widest mb-1">Key Metric</div>
                        <div className="text-4xl font-bold" style={{ color: 'inherit' }}>{el.content}</div>
                      </div>
                    )}
                    {el.type === 'metric' && (
                      <div 
                        className="w-full h-full px-4 py-2 border border-white/10 rounded-xl text-sm flex items-center justify-center transition-all"
                        style={{ 
                          color: el.color || '#ffffff99',
                          backgroundColor: el.backgroundColor || 'rgba(255,255,255,0.05)',
                          padding: `${el.padding || 8}px`,
                          borderRadius: `${el.borderRadius || 12}px`,
                          boxShadow: el.boxShadow || 'none',
                          backdropFilter: el.backdropBlur ? `blur(${el.backdropBlur}px)` : 'none'
                        }}
                      >
                        {el.content}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="fixed bottom-12 inset-x-0 flex items-center justify-center gap-6 z-50">
        <button 
          onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
          className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 transition-colors"
        >
          {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
        </button>
        <button 
          onClick={() => {
            if (currentSlideIndex < slides.length - 1) {
              setCurrentSlideIndex(currentSlideIndex + 1);
              setProgress(0);
            } else {
              setCurrentSlideIndex(0);
              setProgress(0);
            }
          }}
          className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
