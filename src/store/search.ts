import { defineStore } from 'pinia';

export const useSearchStore = defineStore('search', {
  state: () => ({
    query: '', 
  }),
  actions: {
    setSearchQuery(query: string) {
      this.query = query;
    }
  }
});
