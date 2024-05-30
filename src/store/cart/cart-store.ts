import type { CartProduct } from '@/interfaces';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
	cart: CartProduct[];

    getTotalItems:() => number;
    getSummaryInformation: () => {
        subTotal: number;
        taxes: number;
        total: number;
        itemsInCart: number;
    };

	addProductToCart: (product: CartProduct) => void;
    updateProductQuantity: (product: CartProduct, quantity: number) => void;
    removeProduct: (product: CartProduct ) => void;

    clearCart: () => void;
}

export const useCartStore = create<State>()(
	persist(
		(set, get) => ({
			cart: [],


            getTotalItems: () => {

                const { cart } = get();
                //contar los elementos en quantity para determinar el total de items en el carrito de compras
                return cart.reduce( (total, item) => total + item.quantity, 0 )
            },

            getSummaryInformation: () => {
                const { cart } = get();
                const subTotal = cart.reduce( (subTotal, product) => (product.quantity * product.price) + subTotal , 0);

                const taxes = subTotal * 0.15;
                const total = subTotal + taxes;

                const itemsInCart = cart.reduce( (total, item) => total + item.quantity, 0 );

                return {
                    subTotal, taxes, total, itemsInCart
                }

            },

			addProductToCart: (product: CartProduct) => {
				const { cart } = get();
				//1. revisar si el producto existe en el carrito con la talla seleccionada
				const productInCart = cart.some(
					(item) => item.id === product.id && item.size === product.size
				);

				if (!productInCart) {
					set({ cart: [...cart, product] });
					return;
				}

				//2. si el producto existe por talla hay que incrementarlo
				const updatedCartProduct = cart.map((item) => {
					if (item.id === product.id && item.size === product.size) {
						return { ...item, quantity: item.quantity + product.quantity };
					}
					return item;
				});

				set({ cart: updatedCartProduct });
			},

            updateProductQuantity: (product: CartProduct, quantity: number) => {
                const { cart } = get();

                const updatedCartProducts = cart.map( item => {
                    if( item.id === product.id && item.size === product.size ) {
                        return {...item, quantity: quantity };
                    }

                    return item;
                })

                set({cart: updatedCartProducts });
            },

            removeProduct: (product: CartProduct ) => {
                const { cart } = get();
                const updatedCartProducts = cart.filter(
                    (item) => item.id !== product.id || item.size !== product.size
                );

                set({ cart: updatedCartProducts });
            },

            clearCart: () => {
                set({ cart: [] });

            },

		}),

		{
			name: 'shopping-cart',
		}
	)
);
