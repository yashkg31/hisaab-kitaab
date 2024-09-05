'use client'

import React, { useState } from 'react'
import Logo, { LogoCropped } from './Logo'
import {ModeToggle} from './ThemeButton'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from './ui/button'
import { UserButton } from '@clerk/nextjs'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet'
import { Menu } from 'lucide-react'

function Navbar() {
  return (
    <>
        <DesktopNavbar/>
        <MobileNavbar />
    </>
  )
}

const items = [
    {label: "Dashboard", link: "/"},
    {label: "Transaction", link: "/transactions"},
    {label: "Manage", link: "/manage"}
]

function DesktopNavbar(){
    return(
        <div className='hidden border-separate border-b bg-background md:block'>
            <nav className=' container flex items-center justify-between px-5'>
                <div className='flex h-[60px] min-h-[60px] items-center mt-1 gap-x-4'>
                    <Logo/>
                    <div className='flex h-full'>
                        {items.map(item => (
                            <NavItems
                                key= {item.label}
                                link={item.link}
                                label={item.label}
                            ></NavItems>
                        ))}
                    </div>
                </div>
                <div className='flex items-center gap-3'>
                    <ModeToggle />
                    <UserButton afterSignOutUrl='/sign-in' />
                </div>
            </nav>
        </div>
    )
}

function MobileNavbar(){
    const [isOpen , setIsOpen] = useState(false);

    return (
        <div className='block border-separate border-b bg-background md:hidden'>
            <nav className='container flex items-center justify-between px-2'>
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant={'ghost'} size={'icon'}>
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className=' w-[300px] sm:w-[480px]' side={"left"}>
                        <Logo />
                        <div className='flex flex-col gap-1 pt-3'>
                        {items.map(item => (
                            <NavItems
                                key= {item.label}
                                link={item.link}
                                label={item.label}
                                clickCallback = {() => setIsOpen(prev => !prev)}
                            ></NavItems>
                        ))}
                        </div>
                    </SheetContent>
                </Sheet>
                <div className=' pt-3 h-[70px] min-h-[50px] mr-auto block sm:hidden'>
                    <LogoCropped />
                </div>
                <div className=' pt-3 h-[70px] min-h-[50px] mr-auto hidden sm:block'>
                    <Logo />
                </div>

                <div className='flex items-center gap-x-3 mr-3'>
                    <ModeToggle />
                    <UserButton afterSignOutUrl='/sign-in' />
                </div>
            </nav>

        </div>
    )
}

function NavItems({link , label, clickCallback} : {link: string; label: string; clickCallback?: () => void}){
    const pathName = usePathname()
    const isActive = pathName === link

    return (
        <div className='relative flex items-center'>
            <Link href={link} className={cn(
                buttonVariants({
                    variant: "ghost"
                }),
                "w-full justify-start text-base text-muted-foreground hover:text-foreground",
                isActive && "text-foreground"
            )} onClick={() => {
                if(clickCallback) clickCallback();
            }}>{label}</Link>

            {isActive && (
                <div className='absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-orange-500 md:block'></div>
            )}
        </div>
    )
}

export default Navbar