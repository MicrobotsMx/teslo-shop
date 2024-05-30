import { getOrderById } from '@/actions/order/get-order-by-id';
import { OrderStatus, PaypalButton, Title } from '@/components';

import { currencyFormat } from '@/utils';
import Image from 'next/image';
import { redirect } from 'next/navigation';

interface Props {
	params: {
		id: string;
	};
}

export default async function OrderIdPage({ params }: Props) {
	const { id } = params;

	const { ok, order } = await getOrderById(id);

	if (!ok) {
		redirect('/');
	}

	const address = order!.OrderAddress;

	return (
		<div className='flex justify-center items-center mb-72 px-10 sm:px-0'>
			<div className='flex flex-col w-[1000px]'>
				<Title title={`Orden #${id.split('-').at(-1)}`} />

				<div className='grid grid-cols-1 sm:grid-cols-2 gap-10'>
					{/* Carrito */}
					<div className='flex flex-col mt-5'>
						<OrderStatus isPaid={order?.isPaid ?? false} />

						{/* Items de carrito */}

						{order!.OrderItem.map((item) => (
							<div
								key={item.product.slug + '-' + item.size}
								className='flex mb-5'
							>
								<Image
									src={`/products/${item.product.ProductImage[0].url}`}
									style={{ width: '100px', height: '100px' }}
									width={100}
									height={100}
									priority={true}
									alt={item.product.title}
									className='mr-5'
								/>
								<div>
									<p>{item.product.title}</p>
									<p>
										{currencyFormat(item.price)} x {item.quantity}
									</p>
									<p className='font-bold'>
										Subtotal: {currencyFormat(item.price * item.quantity)}
									</p>
								</div>
							</div>
						))}
					</div>
					{/* Checkout */}
					<div className='bg-white rounded-xl shadow-xl p-7'>
						<h2 className='text-2xl font-bold mb-2'>Direccion de entrega</h2>
						<div className='mb-5'>
							<p className='text-xl'>
								{address!.firstName} {address!.lastName}
							</p>
							<p>{address!.address}</p>
							<p>{address!.address2}</p>
							<p>{address!.postalCode}</p>
							<p>
								{address!.city}, {address!.countryId}
							</p>
							<p>{address!.phone}</p>
						</div>
						<hr />

						<h2 className='text-2xl mt-5 mb-2'>Resumen de Orden</h2>
						<div className='grid grid-cols-2'>
							<span>No. Productos</span>
							<span className='text-right'>
								{order?.itemsInOrder === 1
									? '1 item'
									: `${order?.itemsInOrder} items`}
							</span>
							<span>Subtotal</span>
							<span className='text-right'>
								{currencyFormat(order!.subTotal)}
							</span>
							<span>Impuestos (15%)</span>
							<span className='text-right'>{currencyFormat(order!.tax)}</span>
							<span className='mt-5 text-2xl'>Total</span>
							<span className='mt-5 text-2xl text-right'>
								{currencyFormat(order!.total)}
							</span>
						</div>

						<div className='mt-5 mb-2 w-full z-0'>
							{order?.isPaid ? (
								<OrderStatus isPaid={order?.isPaid ?? false} />
							) : (
								<PaypalButton amount={order!.total} orderId={order!.id} />
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}