import { Button } from '@/components/ui/button';
import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'
import { TransactionDialog } from './_components/TransactionDialog';
import Overview from './_components/Overview';
import History from './_components/History';

async function page() {
  const user = await currentUser();
  if(!user){
    redirect("/sign-in")
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId : user.id
    },
  })

  if(!userSettings) redirect("/wizard")

  return (
    <div className=' h-full bg-background'>
      <div className='border-b bg-card'>
        <div className='container flex flex-wrap items-center justify-between gap-6 py-5'>
          <p className=' text-3xl font-bold'>
            Hello, {user.firstName}!
          </p>
          
          <div className='flex items-center gap-4'>
            <TransactionDialog type={"income"} trigger={
              <Button variant={'outline'} className='h-9 border-[#28ff61] bg-[#165126] text-white'>
                New Income (+)
              </Button>
            } />
            <TransactionDialog type={"expense"} trigger={
              <Button variant={'outline'} className='h-9 border-[#ff4a4a] bg-[#671b1b] text-white'>
                New Expense (-)
              </Button>
            } />
            
          </div>
        </div>
      </div>
      <Overview userSettings={userSettings} />
      <History userSettings={userSettings} />
    </div>
  )
}

export default page