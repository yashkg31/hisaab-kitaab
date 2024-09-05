import React, { ReactNode } from 'react'

function layout({children} : {children : ReactNode}) {
  return (
    <div className='relative flex h-screen w-full flex-col justify-center
     items-center'>
        {children}
    </div>
  )
}

export default layout