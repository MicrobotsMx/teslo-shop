'use client';

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { CreateOrderData, CreateOrderActions, OnApproveData, OnApproveActions } from '@paypal/paypal-js';
import { setTransactionId } from '@/actions/payments/set-transaction-id';
import { paypalCheckPayment } from '@/actions/payments/paypal-check-payment';

interface Props {
    orderId: string;
    amount: number;
}

export const PaypalButton = ({orderId, amount}: Props) => {

    const [{ isPending }] = usePayPalScriptReducer();

    const roundedAmount = ( Math.round(amount * 100)) / 100 ;

    if (isPending) { 
        return (
            <div className='animate-plus'>
                <div className='h-12 bg-gray-300 rounded mb-4' />
                <div className='h-12 bg-gray-300 rounded' />
            </div>
        )
    }

    const createOrder = async (
        data: CreateOrderData,
        actions: CreateOrderActions
    ): Promise<string> => {
        
        const transactionId = await actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    invoice_id: orderId,
                    amount: {
                        value: `${roundedAmount}`,
                        currency_code: 'USD',
                    }
                }
            ]
        });

        const { ok } = await setTransactionId(orderId, transactionId);
        if (!ok) {
            throw new Error('No se pudo actualizar la orden');
        }

        return transactionId;
    }

    const onApprove = async(data: OnApproveData, actions: OnApproveActions) => {
        const details = await actions.order?.capture();
        if (!details) return;

        await paypalCheckPayment( details.id );

    }


    return (
       <div className='relative z-0'>       
           <PayPalButtons
                createOrder={ createOrder}
                onApprove={ onApprove }
           />
       </div>
   )
}