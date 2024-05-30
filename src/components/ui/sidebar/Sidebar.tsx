'use client'

import { IoCloseOutline, IoLogInOutline, IoLogOutOutline, IoPeopleOutline, IoPersonOutline, IoSearchOutline, IoShirtOutline, IoTicketOutline } from "react-icons/io5"
import { SidebarLink } from "./SidebarLink"
import { useUIStore } from "@/store"
import clsx from "clsx"
import { useSession } from 'next-auth/react'
import { LogoutLink } from './LogoutLink'


export const Sidebar = () => {

    const isSideMenuOpen = useUIStore( state => state.isSideMenuOpen );
    const closeMenu = useUIStore( state => state.closeSideMneu );

    const {data: session} = useSession();
    const isAuthenticated = !!session?.user;

  return (
    <div>
        {/* Background Bar */}
        {
            isSideMenuOpen && (
                <>
                    <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30 backdrop-filter backdrop-blur-sm" />
                    <div onClick={closeMenu} className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm" />
                </>
            )
        }

        {/* Sidebar Menu */}
        <nav className={
            clsx(
                "fixed p-5 right-0 top-0 w-full sm:w-[400px] h-screen bg-white z-50 shadow-2xl transform transition-all duration-300",
                {
                    "translate-x-full": !isSideMenuOpen 
                }
            )
        }>
            <IoCloseOutline size={30} className="absolute top-5 right-5 cursor-pointer" onClick={closeMenu}/>

            <div className="relative mt-14">
                <IoSearchOutline size={20} className="absolute top-2 left-2"/>
                <input type="text" placeholder="Buscar..." className="w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-lg border-gray-200 focus:outline-none focus:border-blue-800"/>

                
                {
                    isAuthenticated && (
                        <>
                            <SidebarLink href={'/profile'} icon={<IoPersonOutline size={ 30 } />} name={ 'Perfil' } />
                            <SidebarLink href={'/orders'} icon={<IoTicketOutline size={ 30 } />} name={ 'Ordenes' } />
                            <LogoutLink href={'/'} icon={<IoLogOutOutline size={30} />} name={ 'Salir' } />
                        </>

                    )
                }
               
                {
                    !isAuthenticated && (
                        <SidebarLink href={'/auth/login'} icon={<IoLogInOutline size={ 30 } />} name={ 'Ingresar' } />
                    )
                }
                <div className='w-full h-px bg-gray-200 my-10' />

                { isAuthenticated && session.user.role === 'admin' && (
                    <>
                        <SidebarLink href={'/admin/products'} icon={<IoShirtOutline size={ 30 } />} name={ 'Productos' } />
                        <SidebarLink href={'/admin/orders'} icon={<IoTicketOutline size={ 30 } />} name={ 'Ordenes' } />
                        <SidebarLink href={'/admin/users'} icon={<IoPeopleOutline size={ 30 } />} name={ 'Usuarios' } />
                    </>
                )}
               
            </div>
        </nav>
    </div>
  )
}
