  export enum ProductCategory {
    ROUPAS = "roupas",
    CALCADOS = "calçados",
    LIVROS = "livros"
  }

  export interface Produto {
    id: number;
    documentId: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    slug: string;
    wasSold: boolean;
    tags: ProductCategory; 
    createdAt: string;  
    updatedAt: string;
    publishedAt: string;
    image1: string
    image2?: string
  }


  export interface Coupon{
    code: string;
    whoUsed: number[]
    seller: string;
    maxUse: number;
  }

  export interface Compra {
    seller: string;
    buyer: string;
    produto: Produto;
  }