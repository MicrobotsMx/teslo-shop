import { redirect } from 'next/navigation';
import { Title } from '@/components';
import { ProductForm } from './ui/ProductForm';
import { getProductBySlug } from '@/actions/product/get-product-by-slug';
import { getCategories } from '@/actions/categories/get-categories';

interface Props {
    params: {
        slug: string
    }
}

export default async function ProductPage({ params }: Props) {
    
    const { slug } = params;

    const [ product, categories] = await Promise.all([
        getProductBySlug(slug),
        getCategories()
    ])





    // TODO: New product
    if (!product && slug !== 'new') {
        redirect('/admin/products');
    }

    const title = (slug === 'new' ) ? 'Nuevo producto' : 'Editar producto';

   return (
      <>
           <Title title={title} />
           <ProductForm product={product ?? {} } categories={categories} />
      </>
   )
}