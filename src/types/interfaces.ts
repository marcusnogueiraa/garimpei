  export enum ProductCategory {
    ROUPAS = "roupas",
    CALCADOS = "calçados",
    LIVROS = "livros",
    FERRAMENTAS = "ferramentas",
    OUTROS = 'outros'
  }

  export interface Produto {
    id: number;
    documentId: string;
    name: string;
    description: string;
    price: number;
    wasSold: boolean;
    tags: ProductCategory; 
    seller?: any;
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