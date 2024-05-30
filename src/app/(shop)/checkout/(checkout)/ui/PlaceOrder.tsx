'use client';

import { useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import clsx from 'clsx';

import { placeOrder } from '@/actions/order/place-order';
import { useAddressStore, useCartStore } from '@/store';
import { currencyFormat} from '@/utils';
import Link from 'next/link';


export const PlaceOrder = () => {

    const router = useRouter();
    const [loaded, setLoaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false)


    const address = useAddressStore(state => state.address);
    const { itemsInCart, subTotal, taxes, total} = useCartStore( state => state.getSummaryInformation());

    const cart = useCartStore( state => state.cart);
    const clearCart = useCartStore( state => state.clearCart );

    useEffect(() => {
      setLoaded(true);
      
    }, [itemsInCart])


    const onPlaceOrder = async() => {
        setIsPlacingOrder(true);

        const productsToOrder = cart.map( product => ({
            productId: product.id,
            quantity: product.quantity,
            size: product.size,
        }))
        console.log({address})
        

        // Server Action 
        const resp = await placeOrder(productsToOrder, address);
        if ( !resp.ok ){
            setIsPlacingOrder(false);
            setErrorMessage(resp.message);
            return;
        }

        //* Orden creada correctamente - limpiar formulario y redireccionar al usuario
        clearCart();
        router.replace('/orders/' + resp.order?.id );

    }

    if(!loaded){
        return <p>Cargando...</p>
    }
    


	return (
		<div className='bg-white rounded-xl shadow-xl p-7'>
			<h2 className='text-2xl font-bold mb-2'>Direccion de entrega</h2>
			<div className='mb-5'>
				<p className='text-xl'>{address.firstName} {address.lastName}</p>
				<p>{address.address}</p>
				<p>{address.address2}</p>
				<p>{address.postalCode}</p>
				<p>{address.city}, {address.country}</p>
				<p>{address.phone}</p>
			</div>
			<hr />

			<h2 className='text-2xl mt-5 mb-2'>Resumen de Orden</h2>
			<div className='grid grid-cols-2'>
                <span>No. Productos</span>
                <span className="text-right">{itemsInCart === 1 ? '1 item' : `${itemsInCart} items`}</span>
                <span>Subtotal</span>
                <span className="text-right">{ currencyFormat(subTotal) }</span>
                <span>Impuestos (15%)</span>
                <span className="text-right">{currencyFormat(taxes)}</span>
                <span className="mt-5 text-2xl">Total</span>
                <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
			</div>

			<div className='mt-5 mb-2 w-full'>

                <p className='text-red-500 mb-2'>{ errorMessage }</p> 

				<button onClick={onPlaceOrder} className={clsx({
                    'btn-primary': !isPlacingOrder,
                    'btn-disabled': isPlacingOrder
                })}>
					Confirmar orden
				</button>
				<p className='mt-5'>
					<span className='text-xs'>
						Al hacer clic en <i>Colocar orden</i>, aceptas nuestros{' '}
						<Link href={'#'} className='underline'>
							terminos y condiciones
						</Link>{' '}
						y <Link href={'#'}>politicas de privacidad</Link>
					</span>
				</p>
			</div>
		</div>
	);
};
