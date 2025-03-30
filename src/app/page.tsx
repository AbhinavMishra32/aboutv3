'use client';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation'
import { Button } from '@/components/ui/button'
import DotPattern from '@/components/ui/dot-pattern'
import Particles from '@/components/ui/particles'
import Image from 'next/image'
import { VelocityScroll } from '@/components/ui/scroll-based-velocity'
import { cn } from '@/lib/utils'
import React, { useState } from 'react'

import { Instrument_Serif } from 'next/font/google'
import {Antic_Didone} from 'next/font/google'
import {Oranienbaum} from 'next/font/google'

const instrumentSerif = Instrument_Serif({ weight: '400', subsets: ['latin'] })
const anticDidone = Antic_Didone({ weight: '400', subsets: ['latin'] })
const oranienbaum = Oranienbaum({ weight: '400', subsets: ['latin'] })
 
const Home = () => {

  const [gradientHover, setGradientHover] = useState(false)
  
  return (
    <>
      <div className='relative flex items-center justify-center min-h-screen w-screen overflow-hidden bg-[#f6f6f6]'>
        <div className='sm:w-3/5 w-full h-full'>
        {/* Header */}
        <section>
        <div className='h-[140px] w-full py-8 border-2'>
          <div className='h-full w-full bg-gray-300 flex justify-between items-center'>
            <div className='w-full h-full bg-gray-300'>
            </div>
            {/* More options button */}
            <div className='h-full min-w-fit bg-gray-200 flex items-center justify-center'>
              <Button className='bg-white border-1 rounded-full w-[40px] h-[40px]'>
                {/* For now placeholder */}
                <span className='text-black text-2xl'>...</span>
              </Button>
            </div>
          </div>
        </div>
        </section>
        {/* Main text */}
        <section>
      <div className={`pb-4 max-w-3xl ${instrumentSerif.className}`}>
        <div className="space-y-1">
          {/* First line */}
          <div className="flex items-center gap-3">
            <h1 className="text-5xl text-gray-500">Hey,</h1>
            <h1 className="text-5xl text-black">I'm</h1>
            <div className="relative">
              <div className="h-12 w-16 rounded-xl" style={{
                boxShadow: "0 16px 16px -4px #00721114, 0 6px 6px -3px #0072110f, 0 4px 4px -2px #0072110f, 0 3px 3px -1.5px #0072110f, 0 2px 2px -1px #0072110f, 0 1px 1px -.5px #0072110f, 0 .5px .5px #00721114"
              }}>
                {/* <Image src="/profile.png" alt="Profile" width={64} height={64} className="object-cover" /> */}
              </div>
              <div className="absolute inset-0 rounded-3xl shadow-md"></div>
            </div>
            <h1 className="text-5xl text-black">Abhinav</h1>
          </div>

          {/* Second line */}
          <div className="flex items-center">
            <span className={`text-5xl`}>
              <span className="text-blue-400">a </span>
                <span className="hero-gradient" onMouseEnter={() => setGradientHover(true)} onMouseLeave={() => setGradientHover(false)}>
                Software Engineer
                </span>

                <style jsx>{`
                .hero-gradient {
                  background-image: linear-gradient(90deg, #5cabd6, #806fd9, #d963e1, #f06195, #f0a655, #e6e047, #91e77b, #61e8ba, #5cabd6 92.445%);
                  background-clip: text;
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-size: 200% 100%;
                  animation: hero-gradient-animation 10s linear infinite;
                  animation-duration: 8s;
                  transition: animation-duration 0.5s ease;
                }

                @keyframes hero-gradient-animation {
                  0% {
                  background-position: 0% 0%;
                  }
                  to {
                  background-position: -200% 0%;
                  }
                }
                `}</style>
              <style jsx>{`
              @keyframes hero-gradient-animation {
              0% {
              background-position: 0% 0%;
              }
              to {
              background-position: -200% 0%;
              }
              }
              `}</style>
            </span>
          </div>

          {/* Third line */}
          <div className="flex items-center gap-3">
            <span className="text-5xl text-gray-500">based in </span>
            <span className="text-5xl text-black">New Delhi,</span>
            <div className="relative">
              <div className="h-12 w-16 overflow-hidden rounded-3xl bg-gray-100">
                <div className="absolute inset-0 flex items-center justify-center flex-col p-2">
                </div>
              </div>
              <div className="absolute inset-0 rounded-3xl shadow-md"></div>
            </div>
            <span className="text-5xl text-black">India</span>
          </div>
        </div>
      </div>
      <div className={`${oranienbaum.className} text-2xl text-gray-800 mt-4`}>
        Hello! I'm a software engineer with a passion for building innovative solutions. I have a strong background in web development, and I'm always eager to learn new technologies and improve my skills. Let's connect and explore how we can work together!
      </div>
        </section>
        {/* Cards */}
        <section>
        <div className='h-[500px] w-full grid grid-cols-3 grid-rows-2 py-5 gap-5'>
          {/* Upper Row */}
          <div className='hover:scale-105 transition-transform duration-300 border-[3px] border-white col-span-1 row-span-1 bg-[#f4f4f4] rounded-3xl p-6 shadow-[0_7px_12px_rgba(0,0,0,0.05)] flex items-center justify-center text-white text-2xl font-bold ease-out'></div>
          <div className='hover:scale-105 transition-transform duration-300 border-[3px] border-white col-span-1 row-span-1 bg-[#f4f4f4] rounded-3xl p-6 shadow-[0_7px_12px_rgba(0,0,0,0.05)] flex items-center justify-center text-white text-2xl font-bold ease-out'></div>
          <div className='hover:scale-105 transition-transform duration-300 border-[3px] border-white col-span-1 row-span-1 bg-[#f4f4f4] rounded-3xl p-6 shadow-[0_7px_12px_rgba(0,0,0,0.05)] flex items-center justify-center text-white text-2xl font-bold ease-out'></div>
          {/* Lower Row */}
          <div className='border-[3px] border-white col-span-1 row-span-1 bg-[#f4f4f4] rounded-3xl p-6 shadow-[0_7px_12px_rgba(0,0,0,0.05)] flex items-center justify-center text-white text-2xl font-bold'></div>
          <div className='border-[3px] border-white col-span-2 row-span-1 bg-[#f4f4f4] rounded-3xl p-6 shadow-[0_7px_12px_rgba(0,0,0,0.05)] flex items-center justify-center text-white text-2xl font-bold'></div>
        </div>
        </section>
        </div>
      </div>
    </>
  )
}

export default Home