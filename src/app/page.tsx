import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation'
import DotPattern from '@/components/ui/dot-pattern'
import Particles from '@/components/ui/particles'
import { VelocityScroll } from '@/components/ui/scroll-based-velocity'
import { cn } from '@/lib/utils'
import React from 'react'

const Home = () => {
  return (
    <>
      <div className='relative flex items-center justify-center h-screen w-screen overflow-hidden bg-neutral-300'>
        <div className='fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-10px)] h-[calc(100vh-10px)] bg-black rounded-2xl shadow-md p-4 overflow-hidden' style={{ boxShadow: '0px 0px 10px 6px rgba(0,0,0, 0.3)' }}>
          <DotPattern className={cn(
            "opacity-50 md:[mask-image:radial-gradient(500px_circle_at_center,white,transparent)] [mask-image:radial-gradient(340px_circle_at_center,white,transparent)]",
          )} />
        </div>
        <div className='w-[500px] h-[260px] rounded-3xl bg-neutral-600/10 backdrop-blur-sm z-10 text-white'>
          <div>
            <Particles className='opacity-20' />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home