"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useDragControls } from "motion/react";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Video as VideoIcon,
  Type,
  Shapes,
  Share2,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Settings,
  Send,
  Sparkles,
  X,
  GripHorizontal,
  Save,
  Layers,
  ArrowUp,
  ArrowDown,
  Copy,
  Check,
  Palette,
  Wind,
  Move,
} from "lucide-react";
import { Reorder } from "motion/react";
import { v4 as uuidv4 } from "uuid";
import { GoogleGenAI } from "@google/genai";

// --- Types ---

interface SlideElement {
  id: string;
  type:
    | "image"
    | "video"
    | "shape"
    | "text"
    | "metric"
    | "title"
    | "description"
    | "value";
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  zIndex: number;
  filter?: string;
  opacity?: number;
  color?: string;
  backgroundColor?: string;
  padding?: number;
  borderRadius?: number;
  boxShadow?: string;
  backdropBlur?: number;
  animationIn?: "fade" | "slideLeft" | "slideRight" | "scaleUp" | "none";
  animationOut?: "fade" | "scaleDown" | "none";
}

interface Slide {
  id: string;
  background: {
    type: "color" | "gradient" | "image";
    value: string;
  };
  duration: number; // in seconds
  elements: SlideElement[];
  width?: number;
  height?: number;
}

// --- Constants ---

const INITIAL_ELEMENTS = (slideId: string): SlideElement[] => [
  {
    id: uuidv4(),
    type: "title",
    content: "Total Impressions",
    x: 50,
    y: 100,
    width: 600,
    height: 80,
    zIndex: 10,
    color: "#ffffff",
    animationIn: "fade",
  },
  {
    id: uuidv4(),
    type: "description",
    content: "Your ads appeared enough times to fill Wembley Stadium 50x over",
    x: 50,
    y: 180,
    width: 500,
    height: 60,
    zIndex: 9,
    color: "#ffffff",
    animationIn: "fade",
  },
  {
    id: uuidv4(),
    type: "value",
    content: "247M impressions",
    x: 50,
    y: 280,
    width: 350,
    height: 120,
    zIndex: 8,
    color: "#10b981",
    animationIn: "scaleUp",
  },
  {
    id: uuidv4(),
    type: "metric",
    content: "+42% vs 2024",
    x: 50,
    y: 420,
    width: 150,
    height: 50,
    zIndex: 7,
    color: "#ffffff",
    animationIn: "slideLeft",
  },
  {
    id: uuidv4(),
    type: "metric",
    content: "Avg CTR 3.8%",
    x: 210,
    y: 420,
    width: 150,
    height: 50,
    zIndex: 6,
    color: "#ffffff",
    animationIn: "slideLeft",
  },
  {
    id: uuidv4(),
    type: "metric",
    content: "42 markets reached",
    x: 370,
    y: 420,
    width: 180,
    height: 50,
    zIndex: 5,
    color: "#ffffff",
    animationIn: "slideLeft",
  },
];

const createNewSlide = (): Slide => {
  const id = uuidv4();
  return {
    id,
    background: {
      type: "gradient",
      value: "linear-gradient(to bottom right, #000000, #1a1a1a)",
    },
    duration: 6,
    elements: INITIAL_ELEMENTS(id),
  };
};

const FILTERS = [
  { name: "None", value: "none" },
  { name: "Cinematic", value: "contrast(1.2) saturate(0.8) brightness(1.1)" },
  { name: "Vintage", value: "sepia(0.5) contrast(0.9) brightness(0.9)" },
  { name: "Noir", value: "grayscale(1) contrast(1.2)" },
  { name: "Vibrant", value: "saturate(1.8) contrast(1.1)" },
  { name: "Dreamy", value: "brightness(1.1) blur(1px) saturate(1.2)" },
  { name: "Cool", value: "hue-rotate(180deg) saturate(0.8)" },
  { name: "Warm", value: "sepia(0.3) hue-rotate(-30deg) saturate(1.2)" },
  { name: "Invert", value: "invert(1)" },
];

const ABSTRACT_SHAPES = [
  {
    name: "Circle",
    svg: '<circle cx="50" cy="50" r="40" fill="currentColor" />',
  },
  {
    name: "Square",
    svg: '<rect x="10" y="10" width="80" height="80" fill="currentColor" />',
  },
  {
    name: "Triangle",
    svg: '<polygon points="50,10 90,90 10,90" fill="currentColor" />',
  },
  {
    name: "Line",
    svg: '<rect x="10" y="48" width="80" height="4" fill="currentColor" rx="2" />',
  },
  {
    name: "Dashed Line",
    svg: '<line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" stroke-width="4" stroke-dasharray="10,10" />',
  },
  {
    name: "Blob",
    svg: '<path d="M44.7,-76.4C58.1,-69.2,69.2,-58.1,76.4,-44.7C83.6,-31.3,86.9,-15.7,86.2,-0.4C85.5,14.9,80.8,29.8,72.2,42.5C63.6,55.2,51.1,65.7,37.1,72.3C23.1,78.9,7.6,81.6,-7.4,80.3C-22.4,79,-36.9,73.7,-49.6,65.1C-62.3,56.5,-73.2,44.6,-79.1,30.8C-85,17,-85.9,1.3,-82.9,-13.4C-79.9,-28.1,-73,-41.8,-62.7,-52.4C-52.4,-63,-38.7,-70.5,-24.8,-75.4C-10.9,-80.3,3.2,-82.6,17.4,-80.6C31.6,-78.6,44.7,-76.4,44.7,-76.4Z" transform="translate(50 50)" fill="currentColor" />',
  },
  {
    name: "Star",
    svg: '<path d="M50 10L61.8 34.1L88.2 37.9L69.1 56.5L73.6 82.7L50 70.3L26.4 82.7L30.9 56.5L11.8 37.9L38.2 34.1L50 10Z" fill="currentColor" />',
  },
  {
    name: "Ring",
    svg: '<path d="M50 10C27.9 10 10 27.9 10 50C10 72.1 27.9 90 50 90C72.1 90 90 72.1 90 50C90 27.9 72.1 10 50 10ZM50 80C33.4 80 20 66.6 20 50C20 33.4 33.4 20 50 20C66.6 20 80 33.4 80 50C80 66.6 66.6 80 50 80Z" fill="currentColor" />',
  },
  {
    name: "Wave",
    svg: '<path d="M0 50C20 30 30 70 50 50C70 30 80 70 100 50V60H0V50Z" fill="currentColor" />',
  },
  {
    name: "Hexagon",
    svg: '<polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="currentColor" />',
  },
  {
    name: "Diamond",
    svg: '<polygon points="50,10 90,50 50,90 10,50" fill="currentColor" />',
  },
  {
    name: "Heart",
    svg: '<path d="M50 85C50 85 10 55 10 30C10 15 25 10 35 20C40 25 50 35 50 35C50 35 60 25 65 20C75 10 90 15 90 30C90 55 50 85 50 85Z" fill="currentColor" />',
  },
  {
    name: "Arrow",
    svg: '<path d="M10 50H90M90 50L60 20M90 50L60 80" stroke="currentColor" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round" />',
  },
  {
    name: "Plus",
    svg: '<path d="M50 10V90M10 50H90" stroke="currentColor" stroke-width="8" fill="none" stroke-linecap="round" />',
  },
  {
    name: "Cross",
    svg: '<path d="M20 20L80 80M80 20L20 80" stroke="currentColor" stroke-width="8" fill="none" stroke-linecap="round" />',
  },
  {
    name: "Cloud",
    svg: '<path d="M25 70C15 70 10 60 10 50C10 35 25 30 30 30C35 15 55 10 70 20C85 30 90 50 80 65C75 75 60 80 50 80H25V70Z" fill="currentColor" />',
  },
  {
    name: "Moon",
    svg: '<path d="M80 70C60 85 30 75 20 50C15 30 25 10 45 5C30 15 30 45 50 60C65 70 85 65 95 55C90 65 85 70 80 70Z" fill="currentColor" />',
  },
  {
    name: "Sun",
    svg: '<circle cx="50" cy="50" r="20" fill="currentColor" /><path d="M50 10V25M50 75V90M10 50H25M75 50H90M22 22L33 33M67 67L78 78M22 78L33 67M67 33L78 22" stroke="currentColor" stroke-width="4" />',
  },
  {
    name: "Zigzag",
    svg: '<path d="M10 20L30 80L50 20L70 80L90 20" stroke="currentColor" stroke-width="4" fill="none" />',
  },
  {
    name: "Spiral",
    svg: '<path d="M50 50C50 50 55 45 55 40C55 30 40 25 30 35C20 45 25 65 45 70C65 75 85 55 80 30C75 5 40 0 15 20" stroke="currentColor" stroke-width="2" fill="none" />',
  },
  {
    name: "Leaf",
    svg: '<path d="M10 90C10 90 10 40 50 10C90 40 90 90 50 90C50 90 10 90 10 90Z" fill="currentColor" />',
  },
  {
    name: "Cylinder",
    svg: '<ellipse cx="50" cy="20" rx="30" ry="10" fill="currentColor" /><rect x="20" y="20" width="60" height="50" fill="currentColor" /><ellipse cx="50" cy="70" rx="30" ry="10" fill="currentColor" />',
  },
  {
    name: "Cone",
    svg: '<path d="M50 10L15 80C15 80 15 90 50 90C85 90 85 80 85 80L50 10Z" fill="currentColor" />',
  },
  {
    name: "Capsule",
    svg: '<rect x="20" y="30" width="60" height="40" rx="20" fill="currentColor" />',
  },
  {
    name: "Trapezoid",
    svg: '<polygon points="30,20 70,20 90,80 10,80" fill="currentColor" />',
  },
  {
    name: "Parallelogram",
    svg: '<polygon points="30,20 90,20 70,80 10,80" fill="currentColor" />',
  },
  {
    name: "Pentagon",
    svg: '<polygon points="50,10 90,40 75,85 25,85 10,40" fill="currentColor" />',
  },
  {
    name: "Octagon",
    svg: '<polygon points="35,10 65,10 90,35 90,65 65,90 35,90 10,65 10,35" fill="currentColor" />',
  },
  {
    name: "Shield",
    svg: '<path d="M10 20V50C10 75 50 90 50 90C50 90 90 75 90 50V20H10Z" fill="currentColor" />',
  },
  {
    name: "Burst",
    svg: '<path d="M50 10L55 35L80 30L65 50L90 65L65 70L70 95L50 80L30 95L35 70L10 65L35 50L20 30L45 35L50 10Z" fill="currentColor" />',
  },
  {
    name: "Gear",
    svg: '<path d="M50 35C41.7 35 35 41.7 35 50C35 58.3 41.7 65 50 65C58.3 65 65 58.3 65 50C65 41.7 58.3 35 50 35ZM50 10L55 20H45L50 10ZM90 50L80 55V45L90 50ZM50 90L45 80H55L50 90ZM10 50L20 45V55L10 50Z" fill="currentColor" />',
  },
  {
    name: "Tag",
    svg: '<path d="M10 50L40 10H90V90H40L10 50ZM30 50C30 55.5 25.5 60 20 60C14.5 60 10 55.5 10 50C10 44.5 14.5 40 20 40C25.5 40 30 44.5 30 50Z" fill="currentColor" />',
  },
  {
    name: "Bookmark",
    svg: '<path d="M20 10H80V90L50 70L20 90V10Z" fill="currentColor" />',
  },
  {
    name: "Ticket",
    svg: '<path d="M10 30C20 30 20 40 20 50C20 60 20 70 10 70V90H90V70C80 70 80 60 80 50C80 40 80 30 90 30V10H10V30Z" fill="currentColor" />',
  },
  {
    name: "Speech",
    svg: '<path d="M10 20H90V70H50L20 90V70H10V20Z" fill="currentColor" />',
  },
  {
    name: "Puzzle",
    svg: '<path d="M40 10C40 15 45 20 50 20C55 20 60 15 60 10H80V30C75 30 70 35 70 40C70 45 75 50 80 50V70H60C60 65 55 60 50 60C45 60 40 65 40 70H20V50C25 50 30 45 30 40C30 35 25 30 20 30V10H40Z" fill="currentColor" />',
  },
  {
    name: "Keyhole",
    svg: '<circle cx="50" cy="35" r="15" fill="currentColor" /><path d="M40 50L30 85H70L60 50H40Z" fill="currentColor" />',
  },
  {
    name: "Eye",
    svg: '<path d="M10 50C10 50 30 20 50 20C70 20 90 50 90 50C90 50 70 80 50 80C30 80 10 50 10 50ZM50 65C58.3 65 65 58.3 65 50C65 41.7 58.3 35 50 35C41.7 35 35 41.7 35 50C35 58.3 41.7 65 50 65Z" fill="currentColor" />',
  },
  {
    name: "Infinity",
    svg: '<path d="M30 35C15 35 15 65 30 65C40 65 45 55 50 50C55 45 60 35 70 35C85 35 85 65 70 65C60 65 55 55 50 50C45 45 40 35 30 35Z" stroke="currentColor" stroke-width="8" fill="none" />',
  },
  {
    name: "YinYang",
    svg: '<circle cx="50" cy="50" r="40" stroke="currentColor" stroke-width="2" fill="none" /><path d="M50 10C72.1 10 90 27.9 90 50C90 72.1 72.1 90 50 90C50 90 50 70 50 70C61 70 70 61 70 50C70 39 61 30 50 30C50 30 50 10 50 10Z" fill="currentColor" /><circle cx="50" cy="30" r="5" fill="currentColor" /><circle cx="50" cy="70" r="5" fill="white" />',
  },
  {
    name: "Atom",
    svg: '<circle cx="50" cy="50" r="8" fill="currentColor" /><ellipse cx="50" cy="50" rx="40" ry="15" stroke="currentColor" stroke-width="2" fill="none" /><ellipse cx="50" cy="50" rx="40" ry="15" stroke="currentColor" stroke-width="2" fill="none" transform="rotate(60 50 50)" /><ellipse cx="50" cy="50" rx="40" ry="15" stroke="currentColor" stroke-width="2" fill="none" transform="rotate(120 50 50)" />',
  },
  {
    name: "Flask",
    svg: '<path d="M40 10H60V30L85 80C85 80 90 90 50 90C10 90 15 80 15 80L40 30V10Z" fill="currentColor" />',
  },
  {
    name: "Bolt",
    svg: '<polygon points="60,10 20,55 45,55 40,90 80,45 55,45" fill="currentColor" />',
  },
  {
    name: "Umbrella",
    svg: '<path d="M50 10C25 10 10 30 10 50H90C90 30 75 10 50 10ZM50 50V80C50 85 45 90 40 90" stroke="currentColor" stroke-width="4" fill="none" />',
  },
  {
    name: "Anchor",
    svg: '<path d="M50 10V70M20 50C20 70 50 90 50 90C50 90 80 70 80 50M40 20H60" stroke="currentColor" stroke-width="4" fill="none" />',
  },
  {
    name: "Flag",
    svg: '<path d="M20 10V90M20 20H80L65 40L80 60H20" stroke="currentColor" stroke-width="4" fill="none" />',
  },
  {
    name: "Bell",
    svg: '<path d="M50 10C35 10 25 25 25 45V70H75V45C75 25 65 10 50 10ZM40 70C40 75 45 80 50 80C55 80 60 75 60 70" fill="currentColor" />',
  },
  {
    name: "Gift",
    svg: '<rect x="20" y="40" width="60" height="50" fill="currentColor" /><rect x="15" y="30" width="70" height="15" fill="currentColor" /><path d="M50 10C40 10 35 20 50 30C65 20 60 10 50 10Z" fill="currentColor" />',
  },
  {
    name: "Coffee",
    svg: '<path d="M20 30H70V70C70 85 20 85 20 70V30ZM70 40H85C85 55 70 55 70 40Z" stroke="currentColor" stroke-width="4" fill="none" />',
  },
];

// --- Components ---

export default function MakePage() {
  const [slides, setSlides] = useState<Slide[]>([createNewSlide()]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isShapesOpen, setIsShapesOpen] = useState(false);
  const [isBackgroundOpen, setIsBackgroundOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareId, setShareId] = useState("");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null,
  );
  const [maxZIndex, setMaxZIndex] = useState(20);

  const currentSlide = slides[currentSlideIndex];
  const selectedElement = currentSlide.elements.find(
    (el) => el.id === selectedElementId,
  );

  // --- Handlers ---

  const addSlide = () => {
    const newSlide = createNewSlide();
    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length);
  };

  const removeSlide = (index: number) => {
    if (slides.length === 1) return;
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    if (currentSlideIndex >= newSlides.length) {
      setCurrentSlideIndex(newSlides.length - 1);
    }
  };

  const updateSlide = (updates: Partial<Slide>) => {
    const newSlides = [...slides];
    newSlides[currentSlideIndex] = {
      ...newSlides[currentSlideIndex],
      ...updates,
    };
    setSlides(newSlides);
  };

  const addElement = (type: SlideElement["type"], content: string) => {
    const newZ = maxZIndex + 1;
    setMaxZIndex(newZ);
    const newElement: SlideElement = {
      id: uuidv4(),
      type,
      content,
      x: 100,
      y: 100,
      width: type === "text" ? 400 : 200,
      height: type === "text" ? 100 : 200,
      zIndex: newZ,
      color: type === "shape" ? "#8b5cf6" : "#ffffff",
      animationIn: "fade",
      animationOut: "none",
    };
    updateSlide({ elements: [...currentSlide.elements, newElement] });
    setSelectedElementId(newElement.id);
  };

  const updateElement = (elementId: string, updates: Partial<SlideElement>) => {
    const newElements = currentSlide.elements.map((el) =>
      el.id === elementId ? { ...el, ...updates } : el,
    );
    updateSlide({ elements: newElements });
  };

  const removeElement = (elementId: string) => {
    const newElements = currentSlide.elements.filter(
      (el) => el.id !== elementId,
    );
    updateSlide({ elements: newElements });
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      addElement(type, url);
    }
  };

  const bringToFront = (id: string) => {
    const newZ = maxZIndex + 1;
    setMaxZIndex(newZ);
    updateElement(id, { zIndex: newZ });
  };

  const sendToBack = (id: string) => {
    const minZ = Math.min(...currentSlide.elements.map((e) => e.zIndex), 0) - 1;
    updateElement(id, { zIndex: minZ });
  };

  // --- Playback Logic ---

  useEffect(() => {
    if (!isPreviewMode || isPaused) return;

    const duration = currentSlide.duration * 1000;
    const interval = 50; // ms
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentSlideIndex < slides.length - 1) {
            setCurrentSlideIndex(currentSlideIndex + 1);
            return 0;
          } else {
            setIsPreviewMode(false);
            return 0;
          }
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [
    isPreviewMode,
    isPaused,
    currentSlideIndex,
    currentSlide.duration,
    slides.length,
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        if (isPreviewMode) {
          if (currentSlideIndex < slides.length - 1) {
            setCurrentSlideIndex(currentSlideIndex + 1);
            setProgress(0);
          } else {
            setIsPreviewMode(false);
          }
        } else {
          setIsPreviewMode(true);
          setProgress(0);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPreviewMode, currentSlideIndex, slides.length]);

  // --- AI Assistant ---

  const askAi = async () => {
    if (!aiInput.trim()) return;
    const userMsg = aiInput;
    setAiMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setAiInput("");

    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
      });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `The user is designing a "Wrapped" style presentation slide. 
        Current slide elements: ${JSON.stringify(currentSlide.elements.map((e) => ({ type: e.type, content: e.content })))}.
        User request: ${userMsg}.
        
        If the user asks for a layout, suggest specific coordinates (x, y) and sizes (width, height) for elements.
        If the user asks for an SVG design, provide the raw SVG code within a code block.
        Keep the tone professional and creative.`,
      });

      setAiMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.text || "I'm not sure how to help with that.",
        },
      ]);
    } catch (error) {
      console.error(error);
      setAiMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error." },
      ]);
    }
  };

  const duplicateElement = (id: string) => {
    const el = currentSlide.elements.find((e) => e.id === id);
    if (!el) return;
    const newZ = maxZIndex + 1;
    setMaxZIndex(newZ);
    const newEl: SlideElement = {
      ...el,
      id: uuidv4(),
      x: el.x + 20,
      y: el.y + 20,
      zIndex: newZ,
    };
    updateSlide({ elements: [...currentSlide.elements, newEl] });
    setSelectedElementId(newEl.id);
  };

  const ColorPicker = ({
    value,
    onChange,
    label,
  }: {
    value: string;
    onChange: (val: string) => void;
    label: string;
  }) => {
    const [mode, setMode] = useState<"solid" | "gradient">("solid");

    return (
      <div className="space-y-3 p-4 bg-zinc-900 border border-white/10 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
            {label}
          </span>
          <div className="flex gap-1 p-0.5 bg-black/40 rounded-lg border border-white/5">
            <button
              onClick={() => setMode("solid")}
              className={`px-2 py-1 text-[9px] font-bold uppercase rounded-md transition-all ${mode === "solid" ? "bg-white text-black" : "text-white/40 hover:text-white"}`}
            >
              Solid
            </button>
            <button
              onClick={() => setMode("gradient")}
              className={`px-2 py-1 text-[9px] font-bold uppercase rounded-md transition-all ${mode === "gradient" ? "bg-white text-black" : "text-white/40 hover:text-white"}`}
            >
              Gradient
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {(mode === "solid"
            ? [
                "#ffffff",
                "#000000",
                "#ef4444",
                "#f97316",
                "#f59e0b",
                "#10b981",
                "#3b82f6",
                "#8b5cf6",
                "#ec4899",
              ]
            : [
                "linear-gradient(to bottom right, #8b5cf6, #ec4899)",
                "linear-gradient(to bottom right, #3b82f6, #10b981)",
                "linear-gradient(to bottom right, #f97316, #ef4444)",
                "linear-gradient(to bottom right, #000000, #1a1a1a)",
                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              ]
          ).map((c) => (
            <button
              key={c}
              onClick={() => onChange(c)}
              className={`w-6 h-6 rounded-full border border-white/10 transition-transform hover:scale-110 ${value === c ? "ring-2 ring-violet-500" : ""}`}
              style={{ background: c }}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-black/40 rounded-xl border border-white/5">
            <div
              className="w-4 h-4 rounded-full border border-white/10"
              style={{ background: value }}
            />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-[10px] font-mono text-white/80 w-full"
            />
          </div>
          <input
            type="color"
            value={value.startsWith("linear") ? "#8b5cf6" : value}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 bg-transparent border-none cursor-pointer p-0"
          />
        </div>
      </div>
    );
  };

  const loadDemo = () => {
    const demoSlides: Slide[] = [
      {
        id: uuidv4(),
        background: {
          type: "gradient",
          value: "linear-gradient(to bottom right, #000000, #1a1a1a)",
        },
        duration: 6,
        elements: [
          {
            id: uuidv4(),
            type: "title",
            content: "Metric Focus (Impressions)",
            x: 50,
            y: 50,
            width: 800,
            height: 100,
            zIndex: 10,
            color: "#ffffff",
            animationIn: "fade",
          },
          {
            id: uuidv4(),
            type: "value",
            content: "247M",
            x: 50,
            y: 150,
            width: 400,
            height: 150,
            zIndex: 9,
            color: "#10b981",
            animationIn: "scaleUp",
          },
          {
            id: uuidv4(),
            type: "description",
            content:
              '"Your ads appeared enough times to fill Wembley Stadium 50x over"',
            x: 50,
            y: 320,
            width: 600,
            height: 80,
            zIndex: 8,
            color: "#ffffff",
            animationIn: "fade",
          },
          {
            id: uuidv4(),
            type: "text",
            content: "Google Ads + Meta Ads combined",
            x: 50,
            y: 420,
            width: 300,
            height: 40,
            zIndex: 7,
            color: "#ffffff",
            animationIn: "fade",
          },
          {
            id: uuidv4(),
            type: "metric",
            content: "+42% vs 2024",
            x: 50,
            y: 500,
            width: 150,
            height: 50,
            zIndex: 6,
            color: "#ffffff",
            animationIn: "slideLeft",
          },
          {
            id: uuidv4(),
            type: "metric",
            content: "Avg CTR 3.8%",
            x: 210,
            y: 500,
            width: 150,
            height: 50,
            zIndex: 5,
            color: "#ffffff",
            animationIn: "slideLeft",
          },
          {
            id: uuidv4(),
            type: "metric",
            content: "42 markets reached",
            x: 370,
            y: 500,
            width: 180,
            height: 50,
            zIndex: 4,
            color: "#ffffff",
            animationIn: "slideLeft",
          },
        ],
      },
      {
        id: uuidv4(),
        background: {
          type: "gradient",
          value: "linear-gradient(to bottom right, #2e1065, #000000)",
        },
        duration: 6,
        elements: [
          {
            id: uuidv4(),
            type: "image",
            content: "https://picsum.photos/1920/1080?random=1",
            x: 400,
            y: 50,
            width: 500,
            height: 300,
            zIndex: 5,
            animationIn: "fade",
          },
          {
            id: uuidv4(),
            type: "title",
            content: "9 major campaigns that drove your biggest wins",
            x: 50,
            y: 50,
            width: 300,
            height: 200,
            zIndex: 10,
            color: "#ffffff",
            animationIn: "slideLeft",
          },
          {
            id: uuidv4(),
            type: "value",
            content: "Q3 SaaS Launch",
            x: 50,
            y: 380,
            width: 400,
            height: 100,
            zIndex: 9,
            color: "#8b5cf6",
            animationIn: "scaleUp",
          },
          {
            id: uuidv4(),
            type: "text",
            content: "1.8M visits | 12.4% CR | $2.1M pipeline",
            x: 50,
            y: 480,
            width: 500,
            height: 40,
            zIndex: 8,
            color: "#ffffff",
            animationIn: "fade",
          },
          {
            id: uuidv4(),
            type: "text",
            content: "TOTAL: 9 launches | $4.7M pipeline impact",
            x: 50,
            y: 540,
            width: 500,
            height: 40,
            zIndex: 7,
            color: "#ffffff",
            animationIn: "fade",
            backgroundColor: "#ffffff10",
            padding: 10,
            borderRadius: 8,
          },
        ],
      },
      {
        id: uuidv4(),
        background: {
          type: "gradient",
          value: "linear-gradient(to bottom right, #064e3b, #000000)",
        },
        duration: 6,
        elements: [
          {
            id: uuidv4(),
            type: "video",
            content:
              "https://assets.mixkit.co/videos/preview/mixkit-stars-in-the-night-sky-loop-4006-large.mp4",
            x: 50,
            y: 50,
            width: 400,
            height: 250,
            zIndex: 5,
            animationIn: "fade",
          },
          {
            id: uuidv4(),
            type: "title",
            content:
              "5 in-person events that built your strongest relationships",
            x: 500,
            y: 50,
            width: 400,
            height: 200,
            zIndex: 10,
            color: "#ffffff",
            animationIn: "slideRight",
          },
          {
            id: uuidv4(),
            type: "value",
            content: "London Growth Summit",
            x: 500,
            y: 280,
            width: 400,
            height: 100,
            zIndex: 9,
            color: "#10b981",
            animationIn: "scaleUp",
          },
          {
            id: uuidv4(),
            type: "text",
            content: "847 attendees | 92% NPS | 47 leads",
            x: 500,
            y: 380,
            width: 400,
            height: 40,
            zIndex: 8,
            color: "#ffffff",
            animationIn: "fade",
          },
          {
            id: uuidv4(),
            type: "text",
            content: "London (847) | NY (523) | Berlin (312) | etc.",
            x: 50,
            y: 500,
            width: 800,
            height: 60,
            zIndex: 7,
            color: "#ffffff",
            animationIn: "fade",
            backgroundColor: "#00000040",
            padding: 20,
            borderRadius: 12,
            boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
          },
        ],
      },
    ];
    setSlides(demoSlides);
    setCurrentSlideIndex(0);
  };

  const saveWrapped = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem("wrapped_data", JSON.stringify(slides));
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const id = uuidv4();
      setShareId(id);
      setIsShareModalOpen(true);
    } catch (error) {
      console.error(error);
      alert("Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  const reorderElements = (newElements: SlideElement[]) => {
    // Update z-indices based on new order
    const updated = newElements.map((el, idx) => ({
      ...el,
      zIndex: idx + 1,
    }));
    updateSlide({ elements: updated });
  };

  // --- Render ---

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/30 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/50 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-gray-100 to-white text-center">
              <span className="text-xl">🧑🏻‍💻</span>
            </div>
            <span className="font-bold text-xl tracking-tighter">
              iswrapped
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium"
          >
            {isPreviewMode ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isPreviewMode ? "Stop Preview" : "Live Preview"}
          </button>
          <button
            onClick={saveWrapped}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
            Share Wrapped
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar - Slide List */}
        {!isPreviewMode && (
          <aside className="w-64 border-r border-white/10 flex flex-col bg-zinc-950 hidden lg:flex">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">
                Slides
              </span>
              <button
                onClick={addSlide}
                className="p-1 hover:bg-white/5 rounded-md transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {slides.map((slide, idx) => {
                const titleEl = slide.elements.find(
                  (el) => el.type === "title",
                );
                return (
                  <div
                    key={slide.id}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`group relative p-3 rounded-xl border transition-all cursor-pointer ${currentSlideIndex === idx ? "border-violet-500 bg-violet-500/10" : "border-white/5 bg-white/5 hover:border-white/20"}`}
                  >
                    <div className="text-xs font-medium text-white/40 mb-1">
                      Slide {idx + 1}
                    </div>
                    <div className="text-sm font-semibold truncate">
                      {titleEl?.content || "Untitled Slide"}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSlide(idx);
                      }}
                      className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-500 rounded-md transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        {/* Main Editor Area */}
        <main className="flex-1 relative bg-zinc-900 overflow-hidden flex flex-col">
          {/* Progress Bar (Preview Mode) */}
          {isPreviewMode && (
            <div className="absolute top-0 inset-x-0 h-1 flex gap-1 px-4 py-4 z-50">
              {slides.map((_, idx) => (
                <div
                  key={idx}
                  className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden"
                >
                  {idx < currentSlideIndex && (
                    <div className="h-full bg-white" />
                  )}
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
          )}

          {/* Slide Canvas */}
          <div
            className={`flex-1 flex items-center justify-center p-4 md:p-8 transition-all overflow-hidden ${isPreviewMode ? "bg-black" : ""}`}
            onMouseDown={() => isPreviewMode && setIsPaused(true)}
            onMouseUp={() => isPreviewMode && setIsPaused(false)}
            onClick={() => setSelectedElementId(null)}
          >
            <div
              className="relative bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/5"
              style={{
                aspectRatio: `${currentSlide.width || 3000} / ${currentSlide.height || 1920}`,
                height: "100%",
                maxHeight: "100%",
                maxWidth: "100%",
                background:
                  currentSlide.background.type === "image"
                    ? `url(${currentSlide.background.value}) center/cover`
                    : currentSlide.background.value,
              }}
            >
              {/* Slide Content Overlay (Progress) */}
              {isPreviewMode && (
                <div className="absolute top-8 left-12 z-[100] text-emerald-400 font-medium text-sm">
                  Slide {currentSlideIndex + 1} / {slides.length} —
                </div>
              )}

              {/* Draggable Elements */}
              <AnimatePresence>
                {currentSlide.elements
                  .sort((a, b) => a.zIndex - b.zIndex)
                  .map((el) => {
                    const getAnimProps = () => {
                      if (!isPreviewMode)
                        return {
                          initial: false,
                          animate: {
                            opacity: el.opacity ?? 1,
                            x: el.x,
                            y: el.y,
                            scale: 1,
                          },
                        };
                      switch (el.animationIn) {
                        case "fade":
                          return {
                            initial: { opacity: 0 },
                            animate: { opacity: el.opacity ?? 1 },
                          };
                        case "slideLeft":
                          return {
                            initial: { opacity: 0, x: el.x - 50 },
                            animate: { opacity: el.opacity ?? 1, x: el.x },
                          };
                        case "slideRight":
                          return {
                            initial: { opacity: 0, x: el.x + 50 },
                            animate: { opacity: el.opacity ?? 1, x: el.x },
                          };
                        case "scaleUp":
                          return {
                            initial: { opacity: 0, scale: 0.8 },
                            animate: { opacity: el.opacity ?? 1, scale: 1 },
                          };
                        default:
                          return {
                            initial: { opacity: el.opacity ?? 1 },
                            animate: { opacity: el.opacity ?? 1 },
                          };
                      }
                    };

                    const getExitProps = () => {
                      if (!isPreviewMode) return { opacity: 0 };
                      switch (el.animationOut) {
                        case "fade":
                          return { opacity: 0 };
                        case "scaleDown":
                          return { opacity: 0, scale: 0.8 };
                        default:
                          return { opacity: 0 };
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
                        drag={!isPreviewMode}
                        dragMomentum={false}
                        dragElastic={0}
                        onDragStart={() => setSelectedElementId(el.id)}
                        onDragEnd={(_, info) => {
                          updateElement(el.id, {
                            x: el.x + info.offset.x,
                            y: el.y + info.offset.y,
                          });
                        }}
                        style={{
                          x: el.x,
                          y: el.y,
                          width: el.width,
                          height: el.height,
                          zIndex: el.zIndex,
                          position: "absolute",
                          left: 0,
                          top: 0,
                          filter: el.filter,
                          opacity: el.opacity ?? 1,
                          color: el.color,
                        }}
                        className={`group ${!isPreviewMode ? "cursor-move" : ""} ${selectedElementId === el.id ? "ring-2 ring-violet-500" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedElementId(el.id);
                        }}
                      >
                        {el.type === "image" && (
                          <div className="w-full h-full relative rounded-xl shadow-xl overflow-hidden pointer-events-none">
                            <Image
                              src={el.content}
                              fill
                              className="object-cover"
                              alt=""
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {el.type === "video" && (
                          <video
                            src={el.content}
                            autoPlay
                            muted
                            loop
                            className="w-full h-full object-cover rounded-xl shadow-xl pointer-events-none"
                          />
                        )}
                        {el.type === "shape" && (
                          <div
                            className="w-full h-full pointer-events-none"
                            style={{ color: el.color || "#8b5cf6" }}
                          >
                            <svg
                              viewBox="0 0 100 100"
                              className="w-full h-full"
                              fill="currentColor"
                              dangerouslySetInnerHTML={{ __html: el.content }}
                            />
                          </div>
                        )}
                        {el.type === "text" && (
                          <textarea
                            value={el.content}
                            onChange={(e) =>
                              updateElement(el.id, { content: e.target.value })
                            }
                            className="w-full h-full bg-transparent border-none focus:outline-none resize-none transition-all"
                            style={{
                              color: el.color || "#ffffff",
                              backgroundColor:
                                el.backgroundColor || "transparent",
                              padding: `${el.padding || 0}px`,
                              borderRadius: `${el.borderRadius || 0}px`,
                              boxShadow: el.boxShadow || "none",
                            }}
                          />
                        )}
                        {el.type === "title" && (
                          <input
                            type="text"
                            value={el.content}
                            onChange={(e) =>
                              updateElement(el.id, { content: e.target.value })
                            }
                            className="w-full h-full bg-transparent font-bold tracking-tighter border-none focus:outline-none font-display transition-all"
                            style={{
                              color: el.color || "#ffffff",
                              backgroundColor:
                                el.backgroundColor || "transparent",
                              padding: `${el.padding || 0}px`,
                              borderRadius: `${el.borderRadius || 0}px`,
                              boxShadow: el.boxShadow || "none",
                              backdropFilter: el.backdropBlur
                                ? `blur(${el.backdropBlur}px)`
                                : "none",
                              fontSize: "4rem",
                            }}
                          />
                        )}
                        {el.type === "description" && (
                          <textarea
                            value={el.content}
                            onChange={(e) =>
                              updateElement(el.id, { content: e.target.value })
                            }
                            className="w-full h-full bg-transparent border-none focus:outline-none resize-none transition-all"
                            style={{
                              color: el.color || "#ffffff99",
                              backgroundColor:
                                el.backgroundColor || "transparent",
                              padding: `${el.padding || 0}px`,
                              borderRadius: `${el.borderRadius || 0}px`,
                              boxShadow: el.boxShadow || "none",
                              backdropFilter: el.backdropBlur
                                ? `blur(${el.backdropBlur}px)`
                                : "none",
                              fontSize: "1.25rem",
                            }}
                          />
                        )}
                        {el.type === "value" && (
                          <div
                            className="w-full h-full border border-white/10 p-6 rounded-2xl transition-all flex flex-col justify-center"
                            style={{
                              color: el.color || "#10b981",
                              backgroundColor:
                                el.backgroundColor || "rgba(255,255,255,0.05)",
                              padding: `${el.padding || 24}px`,
                              borderRadius: `${el.borderRadius || 16}px`,
                              boxShadow: el.boxShadow || "none",
                              backdropFilter: el.backdropBlur
                                ? `blur(${el.backdropBlur}px)`
                                : "none",
                            }}
                          >
                            <div className="text-[10px] opacity-40 uppercase tracking-widest mb-1">
                              Key Metric
                            </div>
                            <input
                              type="text"
                              value={el.content}
                              onChange={(e) =>
                                updateElement(el.id, {
                                  content: e.target.value,
                                })
                              }
                              className="w-full bg-transparent text-4xl font-bold border-none focus:outline-none"
                              style={{ color: "inherit" }}
                            />
                          </div>
                        )}
                        {el.type === "metric" && (
                          <div
                            className="w-full h-full px-4 py-2 border border-white/10 rounded-xl text-sm flex items-center justify-center transition-all"
                            style={{
                              color: el.color || "#ffffff99",
                              backgroundColor:
                                el.backgroundColor || "rgba(255,255,255,0.05)",
                              padding: `${el.padding || 8}px`,
                              borderRadius: `${el.borderRadius || 12}px`,
                              boxShadow: el.boxShadow || "none",
                              backdropFilter: el.backdropBlur
                                ? `blur(${el.backdropBlur}px)`
                                : "none",
                            }}
                          >
                            <input
                              type="text"
                              value={el.content}
                              onChange={(e) =>
                                updateElement(el.id, {
                                  content: e.target.value,
                                })
                              }
                              className="w-full bg-transparent border-none focus:outline-none text-center"
                              style={{ color: "inherit" }}
                            />
                          </div>
                        )}

                        {!isPreviewMode && (
                          <div className="absolute -top-10 left-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 border border-white/10 p-1 rounded-lg shadow-xl z-50">
                            <button
                              onClick={() => bringToFront(el.id)}
                              className="p-1.5 hover:bg-white/5 rounded"
                              title="Bring to Front"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => sendToBack(el.id)}
                              className="p-1.5 hover:bg-white/5 rounded"
                              title="Send to Back"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeElement(el.id)}
                              className="p-1.5 hover:bg-red-500/20 text-red-500 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Controls (Editor Only) */}
          {!isPreviewMode && (
            <div className="h-20 border-t border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-center gap-8 px-8 z-40 relative">
              <div className="flex items-center gap-2">
                <label className="p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer text-white/60 hover:text-white">
                  <ImageIcon className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "image")}
                  />
                </label>
                <label className="p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer text-white/60 hover:text-white">
                  <VideoIcon className="w-5 h-5" />
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "video")}
                  />
                </label>
                <button
                  onClick={() => addElement("text", "New Text")}
                  className="p-3 hover:bg-white/5 rounded-xl transition-colors text-white/60 hover:text-white"
                >
                  <Type className="w-5 h-5" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setIsShapesOpen(!isShapesOpen)}
                    className={`p-3 rounded-xl transition-colors ${isShapesOpen ? "bg-violet-500 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
                  >
                    <Shapes className="w-5 h-5" />
                  </button>
                  {isShapesOpen && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 p-4 bg-zinc-900 border border-white/10 rounded-2xl flex flex-col gap-4 shadow-2xl z-50 min-w-[320px]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-white/40">
                          Shapes & Assets
                        </span>
                        <button
                          onClick={() =>
                            alert(
                              "Canva API Integration: In a production environment, this would open the Canva Button/SDK to select assets. Please configure your Canva Client ID in the environment.",
                            )
                          }
                          className="text-[10px] px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Import from Canva
                        </button>
                      </div>
                      <div className="flex gap-3 flex-wrap justify-center">
                        {ABSTRACT_SHAPES.map((shape) => (
                          <button
                            key={shape.name}
                            onClick={() => {
                              addElement("shape", shape.svg);
                              setIsShapesOpen(false);
                            }}
                            className="w-12 h-12 p-2 hover:bg-white/10 rounded-xl transition-all text-white/40 hover:text-white hover:scale-110 flex items-center justify-center"
                            title={shape.name}
                          >
                            <svg
                              viewBox="0 0 100 100"
                              className="w-full h-full"
                              fill="currentColor"
                              dangerouslySetInnerHTML={{ __html: shape.svg }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsBackgroundOpen(!isBackgroundOpen)}
                  className={`p-3 rounded-xl transition-colors ${isBackgroundOpen ? "bg-violet-500 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
                  title="Background Settings"
                >
                  <Palette className="w-5 h-5" />
                </button>
                {isBackgroundOpen && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 p-2 bg-zinc-950 border border-white/10 rounded-[2rem] shadow-2xl z-50 min-w-[340px]">
                    <ColorPicker
                      label="Canvas Background"
                      value={currentSlide.background.value}
                      onChange={(val) =>
                        updateSlide({
                          background: {
                            ...currentSlide.background,
                            value: val,
                            type: val.startsWith("linear")
                              ? "gradient"
                              : "color",
                          },
                        })
                      }
                    />
                  </div>
                )}
              </div>

              <button
                onClick={loadDemo}
                className="p-3 hover:bg-white/5 rounded-xl transition-colors text-white/60 hover:text-white"
                title="Load Demo Content"
              >
                <Sparkles className="w-5 h-5" />
              </button>
              <div className="h-8 w-px bg-white/10" />

              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                    Duration
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="3"
                      max="15"
                      value={currentSlide.duration}
                      onChange={(e) =>
                        updateSlide({ duration: parseInt(e.target.value) })
                      }
                      className="w-24 accent-violet-500"
                    />
                    <span className="text-xs font-mono">
                      {currentSlide.duration}s
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar - Properties & AI */}
        {!isPreviewMode && (
          <aside className="w-80 border-l border-white/10 flex flex-col bg-zinc-950 hidden xl:flex">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">
                Properties
              </span>
              <Settings className="w-4 h-4 text-white/40" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {selectedElement ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/40">
                      Element Settings
                    </span>
                    <button
                      onClick={() => setSelectedElementId(null)}
                      className="p-1 hover:bg-white/5 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {[
                    "image",
                    "video",
                    "shape",
                    "text",
                    "title",
                    "description",
                    "value",
                    "metric",
                  ].includes(selectedElement.type) && (
                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40">
                        <Wind className="w-3 h-3" />
                        Animations
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <label className="text-[10px] font-medium text-white/40">
                            In
                          </label>
                          <select
                            value={selectedElement.animationIn || "fade"}
                            onChange={(e) =>
                              updateElement(selectedElement.id, {
                                animationIn: e.target.value as any,
                              })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-1.5 text-xs"
                          >
                            <option value="none">None</option>
                            <option value="fade">Fade</option>
                            <option value="slideLeft">Slide Left</option>
                            <option value="slideRight">Slide Right</option>
                            <option value="scaleUp">Scale Up</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-medium text-white/40">
                            Out
                          </label>
                          <select
                            value={selectedElement.animationOut || "none"}
                            onChange={(e) =>
                              updateElement(selectedElement.id, {
                                animationOut: e.target.value as any,
                              })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-1.5 text-xs"
                          >
                            <option value="none">None</option>
                            <option value="fade">Fade</option>
                            <option value="scaleDown">Scale Down</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {["image", "video"].includes(selectedElement.type) && (
                    <div className="pt-4 border-t border-white/10 space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40">
                        <Palette className="w-3 h-3" />
                        Filters
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {FILTERS.map((f) => (
                          <button
                            key={f.name}
                            onClick={() =>
                              updateElement(selectedElement.id, {
                                filter: f.value,
                              })
                            }
                            className={`px-2 py-2 rounded-lg border text-[10px] transition-all ${selectedElement.filter === f.value ? "border-violet-500 bg-violet-500/10 text-white" : "border-white/5 bg-white/5 text-white/40 hover:border-white/10"}`}
                          >
                            {f.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {[
                    "shape",
                    "text",
                    "title",
                    "description",
                    "value",
                    "metric",
                  ].includes(selectedElement.type) && (
                    <div className="pt-4 border-t border-white/10 space-y-4">
                      <ColorPicker
                        label="Text Color"
                        value={selectedElement.color || "#ffffff"}
                        onChange={(val) =>
                          updateElement(selectedElement.id, { color: val })
                        }
                      />

                      <div className="space-y-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40">
                          <Settings className="w-3 h-3" />
                          Element Styling
                        </div>

                        <div className="space-y-3">
                          <ColorPicker
                            label="Background Color"
                            value={
                              selectedElement.backgroundColor || "transparent"
                            }
                            onChange={(val) =>
                              updateElement(selectedElement.id, {
                                backgroundColor: val,
                              })
                            }
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-medium text-white/40">
                                Padding
                              </label>
                              <input
                                type="number"
                                value={selectedElement.padding || 0}
                                onChange={(e) =>
                                  updateElement(selectedElement.id, {
                                    padding: parseInt(e.target.value),
                                  })
                                }
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-1.5 text-xs"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-medium text-white/40">
                                Corners
                              </label>
                              <input
                                type="number"
                                value={selectedElement.borderRadius || 0}
                                onChange={(e) =>
                                  updateElement(selectedElement.id, {
                                    borderRadius: parseInt(e.target.value),
                                  })
                                }
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-1.5 text-xs"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-medium text-white/40">
                                Shadow
                              </label>
                              <select
                                value={selectedElement.boxShadow || "none"}
                                onChange={(e) =>
                                  updateElement(selectedElement.id, {
                                    boxShadow: e.target.value,
                                  })
                                }
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-1.5 text-xs"
                              >
                                <option value="none">None</option>
                                <option value="0 4px 6px -1px rgb(0 0 0 / 0.1)">
                                  Small
                                </option>
                                <option value="0 10px 15px -3px rgb(0 0 0 / 0.1)">
                                  Medium
                                </option>
                                <option value="0 20px 25px -5px rgb(0 0 0 / 0.1)">
                                  Large
                                </option>
                                <option value="0 0 20px rgba(139, 92, 246, 0.5)">
                                  Glow
                                </option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-medium text-white/40">
                                Blur
                              </label>
                              <input
                                type="number"
                                value={selectedElement.backdropBlur || 0}
                                onChange={(e) =>
                                  updateElement(selectedElement.id, {
                                    backdropBlur: parseInt(e.target.value),
                                  })
                                }
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-1.5 text-xs"
                                placeholder="0"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40">
                        Width
                      </label>
                      <input
                        type="number"
                        value={selectedElement.width}
                        onChange={(e) =>
                          updateElement(selectedElement.id, {
                            width: parseInt(e.target.value),
                          })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40">
                        Height
                      </label>
                      <input
                        type="number"
                        value={selectedElement.height}
                        onChange={(e) =>
                          updateElement(selectedElement.id, {
                            height: parseInt(e.target.value),
                          })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40">
                        Slide Duration
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="3"
                          max="15"
                          value={currentSlide.duration}
                          onChange={(e) =>
                            updateSlide({ duration: parseInt(e.target.value) })
                          }
                          className="flex-1 accent-violet-500"
                        />
                        <span className="text-xs font-mono">
                          {currentSlide.duration}s
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40">
                        <Settings className="w-3 h-3" />
                        Canvas Settings
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-medium text-white/40">
                            Canvas Width
                          </label>
                          <input
                            type="number"
                            value={currentSlide.width || 3000}
                            onChange={(e) =>
                              updateSlide({ width: parseInt(e.target.value) })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-1.5 text-xs"
                            placeholder="1080"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-medium text-white/40">
                            Canvas Height
                          </label>
                          <input
                            type="number"
                            value={currentSlide.height || 1920}
                            onChange={(e) =>
                              updateSlide({ height: parseInt(e.target.value) })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-1.5 text-xs"
                            placeholder="1920"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Layers Panel */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/40">
                    Layers
                  </span>
                  <Layers className="w-4 h-4 text-white/40" />
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {currentSlide.elements.length === 0 && (
                    <div className="text-xs text-white/20 text-center py-4 italic">
                      No elements added yet
                    </div>
                  )}
                  <Reorder.Group
                    axis="y"
                    values={currentSlide.elements.sort(
                      (a, b) => b.zIndex - a.zIndex,
                    )}
                    onReorder={(newOrder) =>
                      reorderElements([...newOrder].reverse())
                    }
                    className="space-y-2"
                  >
                    {currentSlide.elements
                      .sort((a, b) => b.zIndex - a.zIndex)
                      .map((el) => (
                        <Reorder.Item
                          key={el.id}
                          value={el}
                          className={`group flex items-center gap-3 p-2 rounded-lg border transition-all cursor-pointer ${selectedElementId === el.id ? "border-violet-500 bg-violet-500/10" : "border-white/5 bg-white/5 hover:border-white/10"}`}
                          onClick={() => setSelectedElementId(el.id)}
                        >
                          <GripHorizontal className="w-3 h-3 text-white/20 group-hover:text-white/40" />
                          <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center shrink-0">
                            {el.type === "image" && (
                              <ImageIcon className="w-4 h-4" />
                            )}
                            {el.type === "video" && (
                              <VideoIcon className="w-4 h-4" />
                            )}
                            {el.type === "shape" && (
                              <Shapes className="w-4 h-4" />
                            )}
                            {el.type === "text" && <Type className="w-4 h-4" />}
                            {[
                              "title",
                              "description",
                              "value",
                              "metric",
                            ].includes(el.type) && (
                              <Type className="w-4 h-4 text-emerald-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium truncate">
                              {el.type === "text" ||
                              el.type === "title" ||
                              el.type === "description" ||
                              el.type === "value" ||
                              el.type === "metric"
                                ? el.content
                                : el.type.charAt(0).toUpperCase() +
                                  el.type.slice(1)}
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                duplicateElement(el.id);
                              }}
                              className="p-1 hover:bg-white/10 text-white/40 hover:text-white rounded"
                              title="Duplicate"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeElement(el.id);
                              }}
                              className="p-1 hover:bg-red-500/20 text-red-500 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </Reorder.Item>
                      ))}
                  </Reorder.Group>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => setIsAiOpen(!isAiOpen)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20 transition-all"
                >
                  <div className="flex items-center gap-2 font-medium">
                    <Sparkles className="w-4 h-4" />
                    AI Assistant
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${isAiOpen ? "rotate-90" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {isAiOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 space-y-4">
                        <div className="h-48 overflow-y-auto space-y-3 p-2 bg-black/30 rounded-lg border border-white/5">
                          {aiMessages.map((msg, i) => (
                            <div
                              key={i}
                              className={`text-xs p-2 rounded-lg ${msg.role === "user" ? "bg-white/5 ml-4" : "bg-violet-500/10 mr-4 text-violet-200"}`}
                            >
                              {msg.content}
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Ask AI for design tips..."
                            value={aiInput}
                            onChange={(e) => setAiInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && askAi()}
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-xs focus:outline-none focus:border-violet-500"
                          />
                          <button
                            onClick={askAi}
                            className="p-2 bg-violet-500 rounded-lg hover:bg-violet-600 transition-colors"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Preview Overlay Controls */}
      {isPreviewMode && (
        <div className="fixed bottom-8 inset-x-0 flex items-center justify-between px-12 z-50 pointer-events-none">
          <div className="flex items-center gap-4 pointer-events-auto">
            <button
              onClick={() =>
                setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))
              }
              className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 transition-colors"
            >
              {isPaused ? (
                <Play className="w-6 h-6" />
              ) : (
                <Pause className="w-6 h-6" />
              )}
            </button>
            <button
              onClick={() => {
                if (currentSlideIndex < slides.length - 1) {
                  setCurrentSlideIndex(currentSlideIndex + 1);
                  setProgress(0);
                } else {
                  setIsPreviewMode(false);
                }
              }}
              className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="text-white/40 text-sm font-medium flex items-center gap-4">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/20" />
              Spacebar to advance / pause
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live preview
            </span>
          </div>
        </div>
      )}
      {/* Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6">
                <Share2 className="w-8 h-8 text-emerald-400" />
              </div>

              <h3 className="text-2xl font-bold mb-2">Wrapped Ready!</h3>
              <p className="text-white/60 mb-8">
                Your presentation is live. Share this link with your client.
              </p>

              <div className="flex gap-2 p-2 bg-black/40 rounded-2xl border border-white/5 mb-8">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/view/${shareId}`}
                  className="flex-1 bg-transparent border-none focus:outline-none px-3 text-sm font-mono text-white/80"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/view/${shareId}`,
                    );
                    alert("Copied to clipboard!");
                  }}
                  className="px-4 py-2 bg-white text-black rounded-xl font-bold text-sm hover:bg-white/90 transition-colors flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>

              <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-2xl">
                <p className="text-xs text-violet-300 leading-relaxed">
                  <strong>Pro Tip:</strong> Free presentations are stored for 1
                  week. Upgrade to Pro for unlimited storage and custom domains.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
