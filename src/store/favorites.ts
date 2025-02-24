import { defineStore } from 'pinia';
import { Produto } from '../types/interfaces';

export const useFavoriteStore = defineStore('favorite', {
  state: () => ({
    favorites: JSON.parse(localStorage.getItem('favorites') || '[]') as Produto[],
  }),
  actions: {
    addFavorite(item: Produto) {
      if (!this.favorites.some(favoriteItem => favoriteItem.id === item.id)) {
        this.favorites.push(item);
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
      }
    },
    removeFavorite(id: number) {
      this.favorites = this.favorites.filter(item => item.id !== id);
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    },
    clearFavorites() {
      this.favorites = [];
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    },
  },
});