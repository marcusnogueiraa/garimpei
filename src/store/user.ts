import { defineStore } from 'pinia';

interface User {
  name: string;
  cart: object[]; 
  favoriteItems: object[]; 
}

export const useUserStore = defineStore('user', {
  state: (): User => ({
    name: 'MauMau',
    cart: [],
    favoriteItems: []
  }),
  actions: {  
    setUser(newName: string) { 
      this.name = newName;
    },
    addCart(item: object) { 
      this.cart.push(item);
    }
  }
});
