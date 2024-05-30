'use client'

import Link from "next/link"
import { titleFont } from "@/config/fonts"
import { IoCartOutline, IoSearchOutline } from "react-icons/io5"
import { useCartStore, useUIStore } from "@/store"
import { useState, useEffect } from 'react'


export const TopMenu = () => {

    const openSideMenu = useUIStore( state => state.openSideMenu);
    const totalItemsInCart = useCartStore( state => state.getTotalItems());

    const [loaded, setLoaded ] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, [])
    

  return (
    <nav className="flex p-2 justify-between items-center w-full">
        {/* Logo */}
        <div>
            <Link href="/" >
                <span className={`${titleFont.className} antialiased font-bold`}>Teslo</span>
                <span> | Shop</span>
            </Link>
        </div>
        {/* Center Menu */}
        <div className="gap-2 hidden sm:block">
            <Link className="p-2 rounded-md transition-all hover:bg-gray-100" href="/gender/men">Hombres</Link>
            <Link className="p-2 rounded-md transition-all hover:bg-gray-100" href="/gender/women">Mujeres</Link>
            <Link className="p-2 rounded-md transition-all hover:bg-gray-100" href="/gender/kid">Niños</Link>
        </div>

        {/* Search, Cart, Menu */}
        <div className="flex items-center gap-2">
            <Link href="/search">
                <IoSearchOutline className="w-5 h-5"/>
            </Link>
            <Link href={((totalItemsInCart === 0 ) && loaded) ? '/empty' : '/cart'}>
                <div className="relative">
                    {
                        (loaded && totalItemsInCart > 0 ) && (
                            <span className="fade-in absolute flex h-4 w-4 -mt-2 -right-2">
                                <span className="animate-ping p-2 absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75 align-middle items-center justify-center"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500 text-[0.55rem] font-semibold justify-center items-center text-white">{totalItemsInCart}</span>
                            </span>
                        )
                    }
                    
                    <IoCartOutline className="w-5 h-5"/>
                </div>
            </Link>
            <button className="p-2 rounded-md transition-all hover:bg-gray-100" onClick={openSideMenu}>Menu</button>
        </div>

    </nav>
  )
}
