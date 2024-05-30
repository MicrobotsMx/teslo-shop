'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store';
import Image from 'next/image';
import { currencyFormat } from '../../../../../utils/currencyFormat';
import { redirect } from 'next/navigation';


export const ProductsInCart = () => {
   

    const [loaded, setLoaded] = useState(false);

    const productsInCart = useCartStore( state => state.cart);

    useEffect(() => {
      setLoaded(true);
      if ( productsInCart.length === 0) {
        redirect('/');
      }
    },[productsInCart]);
    


    if(!loaded) {
        return <p>Loading...</p>
    }

  return (
    <>
        {
          productsInCart.map( product => (
            <div key={`${product.slug}-${product.size}`} className="flex mb-5">
                <Image src={`/products/${ product.image}`} style={{width:'100px', height:'100px'}} width={100} height={100} priority={true} alt={product.title} className="mr-5"/>
                <div>
                    {product.size} - {product.title} ({product.quantity})
                  <p className='font-bold'>{currencyFormat(product.price * product.quantity)}</p>
                 
                </div>
            </div>
          ))
        }
    </>
  )
}
