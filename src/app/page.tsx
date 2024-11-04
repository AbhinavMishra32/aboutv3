import Particles from '@/components/ui/particles'
import { VelocityScroll } from '@/components/ui/scroll-based-velocity'
import React from 'react'

const Home = () => {
  return (
    <>
      <div className='relative flex items-center justify-center h-screen w-screen'>
        <div className='z-10 w-[400px] h-[400px] border-4 border-neutral-900 rounded-3xl bg-neutral-300 backdrop-blur-sm overflow-hidden shadow-inner' style={{ boxShadow: 'inset 0 10px 60px rgba(0, 0, 0, 1)' }}>
          <div className={`flex flex-col justify-center items-center w-full h-full font-black font-['sixtyFourConv']`}>
            <VelocityScroll text='In Development' className='text-3xl text-neutral-800' />
            <VelocityScroll text='In Development' className='text-3xl text-neutral-800' />
            <VelocityScroll text='In Development' className='text-3xl text-neutral-800' />
            <VelocityScroll text='In Development' className='text-3xl text-neutral-800' />
            <VelocityScroll text='In Development' className='text-3xl text-neutral-800' />
            <VelocityScroll text='In Development' className='text-3xl text-neutral-800' />
          </div>
        </div>
        <Particles className='absolute top-0 left-0 -z-10 w-screen h-screen' />
      </div>
    </>
  )
}

export default Home