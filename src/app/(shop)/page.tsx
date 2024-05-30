export const revalidate = 60;


import { getPaginatedProductsWithImages } from '@/actions/product/product-pagination';
import { Breadcrumbs, Pagination, ProductGrid } from "@/components";
import { redirect } from "next/navigation";

interface Props {
  searchParams: {
    page?: string;
  }
}

export default async function Home({ searchParams }: Props) {

  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({ page });

  // validacion en caso de que el usuario escriba en la url un numero fuera de la paginacion que lo regrese a la 1
  if(products.length === 0){
    redirect('/?page=1');
  }

  return (
    <>
      <Breadcrumbs title="Tienda" subtitle="Todos los productos" className="mb-2"/>

      <ProductGrid products={products}/>

      <Pagination totalPages={ totalPages }/>
    </>
  );
}
