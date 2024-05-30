import React, { ReactElement } from "react";

import Link from "next/link"
import { useUIStore } from '@/store';
import { logout } from '@/actions/auth/logout';


interface Props {
  href: string;
  classCustom?: string;
  icon: ReactElement;
  name: string;
  onClick?:()=>void;
}

export const LogoutLink = ({ href, classCustom, icon, name, onClick }: Props) => {
  const closeMenu = useUIStore( state => state.closeSideMneu );
  const refresh = () => {
    window.location.replace('/');
    logout(); 
    closeMenu(); 
  }

  const defaultClasses = 'flex items-center mt-6 p-2 hover:bg-gray-200 rounded transition-all';

  return (

    <Link
      href={href}
      className={classCustom ? `${classCustom} ${defaultClasses}` : defaultClasses}
      onClick={() => refresh()}
    >
      { icon }
      <span className='ml-3 text-xl'>{name}</span>

    </Link>

  )

}