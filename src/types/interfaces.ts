export interface Produto {
  id: string;
  nome: string;
  preco: number;
  imagem1: string;
  imagem2?: string;
  categoria: string[];
  seller: string;
  avaliacoes?: Avaliacao[]; 
  descricao: string
}

  export interface Cupom {
    codigo: string;
    dataExpiracao: string;
    limiteUso: number;
    maxUso: number;
    seller: string;
  }
  
  export interface Compra {
    seller: string;
    buyer: string;
    produto: Produto;
  }
  
  export interface Avaliacao {
    buyer: string;
    produto: Produto;
    nota: number; // 1-5
    comentario: string;
  }
  