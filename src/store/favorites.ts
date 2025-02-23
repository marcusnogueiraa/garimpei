import { defineStore } from 'pinia';
import { Produto } from '@/types/interfaces';

export const useFavoriteStore = defineStore('favorites', {
  state: () => ({
    favorites: [] as Produto[],
  }),
  actions: {
    addFavorite(item: Produto) {
      if (!this.favorites.some(fav => fav.id === item.id)) {
        this.favorites.push(item);
      }
    },
    removeFavorite(id: number) {
      this.favorites = this.favorites.filter(item => item.id !== id);
    },
    clearFavorites() {
      this.favorites = [];
    },
  },
});
