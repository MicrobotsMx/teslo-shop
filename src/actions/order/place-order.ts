'use server';

import { auth } from '@/auth.config';
import type{ Address, Size } from '@/interfaces';
import prisma from '@/lib/prisma';


interface ProductToOrder {
    productId: string;
    quantity: number;
    size: Size;
}


export const placeOrder = async( productIds: ProductToOrder[], address: Address) => {


    const session = await auth();
    const userId = session?.user.id;

    if( !userId ){
        return {
            ok: false,
            message: 'No hay session de usuario'
        }
    }

    //Obtener info de los productos que esta comprando el usuario
    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds.map( p => p.productId )
            }
        }
    });
    
    // Calcular los montos // Encabezado

    const itemsInOrder = productIds.reduce( (count, prod ) => count + prod.quantity ,0)

    // Re calcular el total, taxes desde el servidor para que no sea manipulado desde el frontend

    const { subTotal, tax, total } = productIds.reduce( (totals, item ) => {

        const productQuantity = item.quantity;
        const product = products.find(product => product.id === item.productId)

        if( !product ) throw new Error(`${ item.productId } no existe - 500`);

        const subTotal = product.price * productQuantity;

        totals.subTotal += subTotal;
        totals.tax += subTotal * 0.15;
        totals.total += subTotal * 1.15;

        return totals;

    }, { subTotal: 0, tax: 0, total: 0 })

   try {
        
        

        // Crear la transaccion de base de datos

        const prismaTx = await prisma.$transaction( async(tx) => {

            // actualizar el stock de los productos

            const updatedProductsPromises = products.map( async(product) => {
                
                // Acumular los valores de productos 
                const productQuantity = productIds.filter(
                    p => p.productId === product.id
                ).reduce( (vacumulado, item ) => item.quantity + vacumulado, 0);


                // Si alguien quiere manipular la cantidad desde el lado del cliente que le arorje ese mensaje
                if( productQuantity === 0 ){
                    throw new Error(`${ product.id}, no tiene cantidad definida`)
                }

                // Actualizar la cantidad de productos en la base de datos
                return tx.product.update({
                    where: {
                        id: product.id,
                    },
                    data: {
                        inStock: {
                            decrement: productQuantity
                        }
                    }
                })
            });

            const updatedProducts = await Promise.all( updatedProductsPromises );

            // Verificar valores negativos en la existencia, (No hay stock)
            updatedProducts.forEach( product => {
                if ( product.inStock < 0 ) {
                    throw new Error( `${product.title} no tiene inventario suficiente`);
                }
            })

            // crear la orden - encabezado - detalles 

            const order = await tx.order.create({
                data: {
                    userId: userId,
                    itemsInOrder: itemsInOrder,
                    subTotal: subTotal,
                    tax: tax,
                    total: total,

                    OrderItem: {
                        createMany: {
                            data: productIds.map( p => ({
                                quantity: p.quantity,
                                size: p.size,
                                productId: p.productId,
                                price: products.find( product => product.id === p.productId)?.price ?? 0
                            }))
                        }
                    }
                }
            })


            // crear la direccion de la orden

            const { country, ...restAddress} = address; 
            const orderAddress = await tx.orderAddress.create({
                data: {
                    ...restAddress,
                    countryId: country,
                    orderId: order.id
                }
            })

            return {
                updatedProducts: updatedProducts,
                order: order,
                orderAddress: orderAddress,
            };


        });

      return {
        ok: true,
        order: prismaTx.order,
        prismaTx: prismaTx
      }
        
   } catch (error: any) {
      
      return {
        ok: false,
        message: error.message,
      };
   }
}