"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Users, TrendingUp, Eye, Calendar, Zap, Palette, Target, Award, Phone } from "lucide-react";
import { ModeToggle } from "@/components/theme-button";

interface BentoItem {
  id: string;
  title: string;
  subtitle?: string;
  value?: string;
  change?: string;
  description?: string;
  content: React.ReactNode;
  className: string;
  isExpanded?: boolean;
}

const bentoItems: BentoItem[] = [
  {
    id: "1",
    title: "About Me",
    content: (
      <div className="h-full relative overflow-hidden bg-gradient-to-br from-pink-200 to-purple-200">
        <div className="absolute inset-0 flex flex-col justify-center items-center p-4 md:p-6">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-black rounded-2xl md:rounded-3xl mb-3 md:mb-4 flex items-center justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-700 rounded-xl md:rounded-2xl"></div>
          </div>
          <h3 className="text-sm md:text-lg lg:text-xl font-bold text-gray-800 text-center">Full Stack Developer</h3>
          <p className="text-xs md:text-sm text-gray-600 mt-1 md:mt-2 text-center px-2">Passionate about creating amazing user experiences</p>
        </div>
      </div>
    ),
    className: "col-span-1 row-span-2"
  },
  {
    id: "2",
    title: "Project Views",
    subtitle: "last year",
    value: "4,875",
    content: (
      <div className="h-full bg-emerald-500 p-3 md:p-4 lg:p-6 flex flex-col justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 md:w-5 md:h-5 text-white" />
          <span className="text-white/80 text-xs md:text-sm">Project Views</span>
        </div>
        <div>
          <div className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1">4,875</div>
          <div className="text-white/80 text-xs md:text-sm">last year</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-white/30 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    ),
    className: "col-span-1 row-span-1"
  },
  {
    id: "3",
    title: "New Users",
    value: "57K",
    change: "+10%",
    content: (
      <div className="h-full bg-gray-700 p-3 md:p-4 lg:p-6 flex flex-col justify-between">
        <div>
          <div className="text-white/60 text-xs md:text-sm mb-1">New Users</div>
          <div className="text-xl md:text-2xl lg:text-3xl font-bold text-white">57K</div>
        </div>
        <div className="text-green-400 text-xs md:text-sm font-medium">+10%</div>
      </div>
    ),
    className: "col-span-1 row-span-1"
  },
  {
    id: "4",
    title: "Team",
    content: (
      <div className="h-full bg-gradient-to-br from-yellow-200 to-yellow-300 p-3 md:p-4 lg:p-6 relative">
        <div className="bg-black text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium mb-3 md:mb-4 inline-block">
          Team of passionate designers and developers
        </div>
        <div className="flex -space-x-1.5 md:-space-x-2 mb-3 md:mb-4">
          <div className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-gray-400 rounded-full border-2 border-white"></div>
          <div className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-gray-500 rounded-full border-2 border-white"></div>
          <div className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-gray-600 rounded-full border-2 border-white"></div>
          <div className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-gray-300 rounded-full border-2 border-white"></div>
          <div className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-gray-800 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
            +2
          </div>
        </div>
        <div>
          <div className="text-black/60 text-xs md:text-sm">Daily</div>
          <div className="text-black font-bold text-sm md:text-base">New clients</div>
          <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mt-1 md:mt-2">54</div>
          <div className="text-green-600 text-xs md:text-sm font-medium">+40%</div>
        </div>
        <div className="absolute top-3 right-3 md:top-4 md:right-4">
          <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-black/20 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 bg-black rounded-sm"></div>
          </div>
        </div>
      </div>
    ),
    className: "col-span-2 row-span-2"
  },
  {
    id: "5",
    title: "Revenue Analytics",
    content: (
      <div className="h-full bg-gradient-to-br from-purple-200 to-blue-200 p-3 md:p-4 lg:p-6 flex flex-col">
        <div className="bg-purple-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl text-sm md:text-lg font-bold mb-3 md:mb-4 inline-block">
          Complete Revenue This Year
        </div>
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-900">4.93%</div>
          <div className="flex items-center gap-1 text-purple-600">
            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-purple-600 flex items-center justify-center">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-600 rounded-full"></div>
            </div>
            <span className="text-xs md:text-sm">-2.3%</span>
          </div>
        </div>
        <div className="flex-1 relative">
          <svg className="w-full h-full" viewBox="0 0 300 80">
            <path
              d="M0,60 Q50,30 100,45 T200,35 T300,25"
              stroke="#8b5cf6"
              strokeWidth="2"
              fill="none"
              className="drop-shadow-sm"
            />
            <path
              d="M0,60 Q50,30 100,45 T200,35 T300,25 L300,80 L0,80 Z"
              fill="url(#gradient)"
              opacity="0.3"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1"/>
              </linearGradient>
            </defs>
            <circle cx="150" cy="40" r="3" fill="#8b5cf6" />
          </svg>
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs">
            2h 12m
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-2">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
          <span>Aug</span>
          <span>Sep</span>
        </div>
      </div>
    ),
    className: "col-span-2 row-span-1"
  },
  {
    id: "6",
    title: "Skills & Tools",
    content: (
      <div className="h-full bg-gradient-to-br from-purple-600 to-purple-800 p-3 md:p-4 lg:p-6">
        <div className="text-white/80 text-xs md:text-sm mb-1 md:mb-2">Digital Agency</div>
        <h3 className="text-white text-sm md:text-lg lg:text-xl font-bold mb-4 md:mb-6">Smart Digital Agency For Your Business</h3>
        <div className="flex -space-x-2 md:-space-x-3 mb-4 md:mb-6">
          <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-white/20 rounded-full"></div>
          <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-white/30 rounded-full"></div>
          <div className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-white rounded-full mt-1 md:mt-1.5 lg:mt-2 flex items-center justify-center">
            <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 text-purple-600" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-white/20 rounded-lg"></div>
        </div>
      </div>
    ),
    className: "col-span-1 row-span-2"
  },
  {
    id: "7",
    title: "Typography",
    content: (
      <div className="h-full bg-yellow-300 p-3 md:p-4 lg:p-6">
        <div>
          <div className="text-black font-bold text-sm md:text-lg lg:text-xl mb-2 md:mb-4">Font</div>
          <div className="text-black/60 text-xs md:text-sm mb-2 md:mb-4">Sk- Modernist</div>
          <div className="flex gap-1.5 md:gap-2 mb-2 md:mb-4">
            <div className="w-6 h-4 md:w-7 md:h-5 lg:w-8 lg:h-6 bg-gray-800 rounded"></div>
            <div className="w-6 h-4 md:w-7 md:h-5 lg:w-8 lg:h-6 bg-gray-400 rounded"></div>
            <div className="w-6 h-4 md:w-7 md:h-5 lg:w-8 lg:h-6 bg-pink-300 rounded"></div>
            <div className="w-6 h-4 md:w-7 md:h-5 lg:w-8 lg:h-6 bg-pink-200 rounded"></div>
          </div>
        </div>
      </div>
    ),
    className: "col-span-1 row-span-1"
  },
  {
    id: "8",
    title: "Design Philosophy",
    content: (
      <div className="h-full bg-gradient-to-br from-teal-400 to-teal-600 p-3 md:p-4 lg:p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-white text-sm md:text-lg lg:text-xl font-bold mb-1 md:mb-2">We Build Future of Design Industry</h3>
          <p className="text-white/80 text-xs md:text-sm">Crafting Meaningful UX/UI Design</p>
        </div>
        <div className="flex justify-end">
          <div className="relative">
            <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 border-2 border-white/30 rounded-full flex items-center justify-center">
              <div className="w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 border-2 border-white/50 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 border-2 border-white rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-teal-500 rounded-full"></div>
            </div>
            <div className="absolute top-2 -left-0.5 md:top-3 md:-left-1 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-teal-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    ),
    className: "col-span-1 row-span-1"
  },
  {
    id: "9",
    title: "Brand",
    content: (
      <div className="h-full bg-gradient-to-br from-pink-200 to-pink-300 p-3 md:p-4 lg:p-6 flex flex-col items-center justify-center">
        <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-white rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-4">
          <div className="relative">
            <div className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 border-2 border-gray-800 rounded-full"></div>
            <div className="absolute top-0.5 left-0.5 md:top-1 md:left-1 w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 border-2 border-gray-800 rounded-full"></div>
            <div className="absolute top-1 left-1 md:top-1.5 md:left-1.5 lg:top-2 lg:left-2 w-3 h-3 md:w-4 md:h-4 border-2 border-gray-800 rounded-full"></div>
          </div>
        </div>
        <h3 className="text-black font-bold text-sm md:text-lg lg:text-xl">CUBO</h3>
      </div>
    ),
    className: "col-span-1 row-span-1"
  }
];

export function GlowingEffectDemo() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getItemScale = (itemId: string) => {
    if (expandedId === itemId) return 1.02;
    if (expandedId && expandedId !== itemId) return 0.95;
    if (hoveredId === itemId) return 1.03;
    return 1;
  };

  const getItemOpacity = (itemId: string) => {
    if (expandedId === itemId) return 1;
    if (expandedId && expandedId !== itemId) return 0.7;
    return 1;
  };

  const getGridClasses = (item: BentoItem) => {
    let classes = item.className;
    
    if (expandedId === item.id) {
      // When expanded, take more space but don't completely dominate
      classes = "col-span-1 md:col-span-2 row-span-2";
    } else if (expandedId && expandedId !== item.id) {
      // When another item is expanded, shrink but maintain aspect ratio
      classes = "col-span-1 row-span-1";
    }
    
    return classes;
  };

  return (
    <div className="min-h-screen bg-black p-3 md:p-4 lg:p-6">
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 max-w-7xl mx-auto"
        style={{
          gridAutoRows: "minmax(160px, auto)"
        }}
        layout
        transition={{
          layout: {
            type: "spring",
            stiffness: 300,
            damping: 30
          }
        }}
      >
        {bentoItems.map((item) => (
          <motion.div
            key={item.id}
            className={`${getGridClasses(item)} relative cursor-pointer overflow-hidden rounded-3xl`}
            layout
            layoutId={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: getItemOpacity(item.id),
              scale: getItemScale(item.id)
            }}
            transition={{
              layout: {
                type: "spring",
                stiffness: 400,
                damping: 30,
                mass: 0.8
              },
              opacity: {
                duration: 0.3,
                ease: "easeInOut"
              },
              scale: {
                type: "spring",
                stiffness: 500,
                damping: 25,
                mass: 0.5
              }
            }}
            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            onHoverStart={() => setHoveredId(item.id)}
            onHoverEnd={() => setHoveredId(null)}
            whileHover={{
              y: -2,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 15
              }
            }}
            whileTap={{
              scale: 0.98,
              transition: {
                type: "spring",
                stiffness: 600,
                damping: 20
              }
            }}
          >
            {/* Main content */}
            <div className="h-full w-full relative">
              {item.content}
            </div>

            {/* Hover overlay */}
            <motion.div 
              className="absolute inset-0 bg-white/5 rounded-3xl"
              initial={{ opacity: 0 }}
              animate={{
                opacity: hoveredId === item.id ? 1 : 0
              }}
              transition={{ duration: 0.2 }}
            />

            {/* Expanded content overlay */}
            <motion.div
              className="absolute inset-0 bg-black/20 rounded-3xl flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{
                opacity: expandedId === item.id ? 1 : 0
              }}
              transition={{
                duration: 0.3,
                delay: expandedId === item.id ? 0.1 : 0
              }}
            >
              {expandedId === item.id && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                  className="text-white text-center p-6"
                >
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-white/80">
                    Expanded view with more details about {item.title.toLowerCase()}. 
                    This could contain additional information, links, or interactive elements.
                  </p>
                  <div className="mt-4 flex gap-2 justify-center">
                    <div className="px-4 py-2 bg-white/20 rounded-full text-sm">Learn More</div>
                    <div className="px-4 py-2 bg-white/20 rounded-full text-sm">View Details</div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Subtle border */}
            <div className="absolute inset-0 rounded-3xl border border-white/10"></div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-50">
        {/* <ModeToggle /> */}
      </div>
    </div>
  );
}

export default GlowingEffectDemo;
