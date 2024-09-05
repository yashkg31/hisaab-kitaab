import { BookOpenCheck } from 'lucide-react'
import React from 'react'

function Logo() {
  return (
    <a href='/' className='flex items-center gap-2'>
        <BookOpenCheck className='stroke h-11 w-11 stroke-amber-500 stroke-[1.5]' />
        <p className=' bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent'>
            Hisaab-Kitaab
        </p>
    </a>
  )
}

export function LogoCropped() {
  return (
    <a href='/' className='flex items-center gap-2'>
        <BookOpenCheck className='stroke h-11 w-11 stroke-amber-500 stroke-[1.5]' />
        {/* <p className=' bg-gradient-to-r from-amber-600 to-red-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent'>
            Hisaab-Kitaab
        </p> */}
    </a>
  )
}

export default Logo