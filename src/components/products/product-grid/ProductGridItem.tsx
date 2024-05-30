'use client'

import { Product } from "@/interfaces"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Props {
  product: Product;
}


export const ProductGridItem = ({product}:Props) => {

  const [displayImage, setDisplayImage] = useState(product.images[0]);


  // const shuffle = (images:any) => {
  //   let displayImage = product.images.length;
  
  //   // While there remain elements to shuffle...
  //   while (displayImage != 0) {
  
  //     // Pick a remaining element...
  //     let shuffle = Math.floor(Math.random() * displayImage);
  //     displayImage--;
  
  //     // And swap it with the current element.
  //     [images[displayImage], images[shuffle]] = [
  //       images[shuffle], images[displayImage]];
  //   }
  // }

  // // Used like so
  // let image = product.images.length;
  // shuffle(image);
  // console.log(image);


  return (
    <div className="rounded-md overflow-hidden fade-in">
      <Link href={`/product/${product.slug}`}>
        <Image 
          src={`/products/${ displayImage }`} 
          alt={ product.title }
          className="w-full object-cover rounded"
          width={500}
          height={500}
          priority={true}
          onMouseEnter={ () => setDisplayImage( product.images[1] )}
          onMouseLeave={ () => setDisplayImage( product.images[0] )}
        />
      </Link>
      <div className="p-4 flex flex-col">
        <Link className="hover:text-blue-800" href={`/product/${product.slug}`}>
          {
            product.title
          }
        </Link>
        <span className="font-bold">${product.price}</span>
      </div>
    </div>
  )
}



