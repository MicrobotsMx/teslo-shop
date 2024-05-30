'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const changeRole = async (userId: string, role: string) => {
    
    const session = await auth();

    if( session?.user.role !== 'admin' ){
        return {
            ok: false,
            message: 'Debes ser admin para acceder a esta pantalla'
        }
    }

    try {
        const newRole = role === 'admin' ? 'admin' : 'user';
        const user = await prisma.user.update({
           where: {
              id: userId
           },
           data: {
               role: newRole
           }
        })
       
       revalidatePath('/admin/users');

       return {
           ok: true,
           user: user
       }
        
   } catch (error) {
      console.log(error)
       return {
           ok: false,
           message: 'No se pudo actualizar el Role'
      };
   }
}