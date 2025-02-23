export interface Produto {
  id: string;
  nome: string;
  preco: number;
  imagem1: string;
  imagem2?: string;
  categoria: string[];
  seller: string;
  descricao: string
}

  export interface Compra {
    seller: string;
    buyer: string;
    produto: Produto;
  }