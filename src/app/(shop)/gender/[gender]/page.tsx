export const revalidate = 60;


import { getPaginatedProductsWithImages } from '@/actions/product/product-pagination';
import { Breadcrumbs, Pagination, ProductGrid } from "@/components";
import { Gender } from "@prisma/client";
import { redirect } from "next/navigation";



interface Props {
  params: {
      gender: string;
  },
  searchParams: {
      page?: string;
  }
}

export default async function GenderIdPage({ params, searchParams }: Props) {

  const { gender } = params;

  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({ page, gender: gender as Gender });

  // validacion en caso de que el usuario escriba en la url un numero fuera de la paginacion que lo regrese a la 1
  if(products.length === 0){
    redirect(`/gender/${gender}/?page=1`);
  }
 
  
  const labels: Record<string, string>  = {
    'men': 'Hombres',
    'women': 'Mujeres',
    'kid': 'Niños',
    'unisex': 'Todos',
  }


  //  if( id === 'kids' ){
  //   notFound();
  // }

return (
  <>
    <Breadcrumbs title={`Articulos para ${labels[gender]}`} subtitle="Todos los productos" className="mb-2"/>

    <ProductGrid products={products} />

    <Pagination totalPages={totalPages} />
  </>
);
}