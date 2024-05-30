export const generatePaginationNumbers = (currentPage: number, totalPages: number) => {


    // Si el total de paginas es menor a 7 vamos a quitar los puntos
    if(totalPages <= 7) {
        return Array.from({length: totalPages}, (_, i) => i +1 );
    }

    // Si son mas de 7 paginas agregar puntos suspensivos
    if(currentPage <= 3) {
        return [1,2,3,'...', totalPages -1, totalPages];
    }

    // si la pagina actual esta dentro de las ultimas 3 paginas mostrar las primeras 2

    if(currentPage >= totalPages - 2 ) {
        return [1,2, '...', totalPages - 2, totalPages - 1, totalPages];
    }

    // Si la pagina actual esta en otro lugar (en medio)

    return[
        1,
        '...',
        currentPage -1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages

    ];
}