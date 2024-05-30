'use client'

import { QuantitySelector, SizeSelector } from '@/components'
import type { CartProduct, Product, Size } from '@/interfaces'
import { useCartStore } from '@/store';
import { useState } from 'react';



interface Props {
    product: Product;
}

export const AddToCart = ({product}:Props) => {

    const addProductToCart = useCartStore(state => state.addProductToCart)
 
    const [Size, setSize] = useState<Size|undefined>();
    const [Quantity, setQuantity] = useState<number>(1);
    const [Posted, setPosted] = useState(false);

    const addToCart = () => {
        setPosted(true);

        if( !Size ) return;
        
        const cartProduct: CartProduct = {
            id: product.id,
            slug: product.slug,
            title: product.title,
            price: product.price,
            quantity: Quantity,
            size: Size,
            image: product.images[0],

        }
        addProductToCart(cartProduct)
        //resetear valores despues de agregar producto al carrito
        setPosted(false);
        setQuantity(1);
        setSize(undefined);
    }
 
    return (
    <>
        {
            Posted && !Size && (
                <span className='mt-2 text-red-500 fade-in'>Debe seleccionar una talla</span>
            )
        }

        {/* Selector de tallas */}
        <SizeSelector
            selectedSize={Size}
            availableSizes={product.sizes}
            onSizeChanged={setSize}
        />
        {/* Selector de cantidad */}
        <QuantitySelector 
            quantity={Quantity} 
            onQuantityChanged={setQuantity}    
        />
        {/* Button */}
        <button onClick={addToCart} className='btn-primary my-5'>Agregar al carrito</button>
    </>
  )
}
