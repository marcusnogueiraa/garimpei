import { defineStore } from 'pinia';
import { Produto } from '../types/interfaces';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: JSON.parse(localStorage.getItem('cart') || '[]') as Produto[],
  }),
  actions: {
    addCartItem(item: Produto) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (item.seller.username == user.username){
       alert("Você não pode comprar seu próprio item!");
       return;
      }
      
      if (!this.cart.some(cartItem => cartItem.id === item.id)) {
        this.cart.push(item);
        localStorage.setItem('cart', JSON.stringify(this.cart));
      }
    },
    removeCartItem(id: number) {
      this.cart = this.cart.filter(item => item.id !== id);
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },
    clearCart() {
      this.cart = [];
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },
  },
});