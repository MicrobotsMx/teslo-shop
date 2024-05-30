'use client'

import { useCartStore } from '@/store';
import { currencyFormat } from '@/utils';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';


export const OrderSummary = () => {

    const router = useRouter();

    const [loaded, setLoaded] = useState(false);
    const { itemsInCart, subTotal, taxes, total} = useCartStore( state => state.getSummaryInformation());

    useEffect(() => {
        setLoaded(true);
    }, [])
    

    useEffect(() => {
      if(itemsInCart === 0 ){
        router.replace('/empty')
      }
    }, [itemsInCart, loaded, router])
    

    if(!loaded){
        return <p>Loading...</p>
    }


  return (
    <>
       <div className="grid grid-cols-2">
          <span>No. Productos</span>
          <span className="text-right">{itemsInCart === 1 ? '1 item' : `${itemsInCart} items`}</span>
          <span>Subtotal</span>
          <span className="text-right">{ currencyFormat(subTotal) }</span>
          <span>Impuestos (15%)</span>
          <span className="text-right">{currencyFormat(taxes)}</span>
          <span className="mt-5 text-2xl">Total</span>
          <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
        </div>
    </>
  )
}
