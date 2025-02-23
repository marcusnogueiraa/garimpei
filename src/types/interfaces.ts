export interface Produto {
  id: string;
  nome: string;
  preco: number;
  imagem1: string;
  imagem2?: string;
  categoria: string[];
  seller: number; 
  descricao: string;
}
export interface Coupon{
  code: string;
  whoUsed: number[]
  seller: string;
  maxUse: Number;
}

export interface Compra {
  seller: string;
  buyer: string;
  produto: Produto;
}