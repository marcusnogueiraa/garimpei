import { defineStore } from 'pinia';
import { Produto } from '../types/interfaces';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: [] as Produto[],
  }),
  actions: {
    addCartItem(item: Produto) {
      if (!this.cart.some(cartItem => cartItem.nome === item.nome)) {
        this.cart.push(item);
      }
    },
    removeCartItem(id: string) {
      this.cart = this.cart.filter(item => item.id !== id);
    },
    clearCart() {
      this.cart = [];
    },
  },
});
