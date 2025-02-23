<template>
    <div class="vh-100 d-flex flex-column position-relative">
        <HeaderComponent />
        <main class="h-100 p-4 animate-spawn">    
            <div class="d-flex mt-4">
                <aside class="filters">
                    <h4>Filtros</h4>
                    <div>
                        <label>Categoria</label>
                        <select v-model="selectedCategory" class="form-control">
                            <option value="">Todas</option>
                            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
                        </select>
                    </div>
                    <div>
                        <label>Preço</label>
                        <input type="range" v-model="maxPrice" min="0" max="1000" step="10" class="form-control" />
                        <span>Até R$ {{ maxPrice }}</span>
                    </div>
                    <div>
                        <label>Ordenar por</label>
                        <select v-model="sortBy" class="form-control">
                            <option value="relevance">Relevância</option>
                            <option value="price_low">Menor Preço</option>
                            <option value="price_high">Maior Preço</option>
                        </select>
                    </div>
                </aside>     
                <section class="search-results">
                    <p>Exibindo resultados para "{{ search }}"...</p>

                    <div v-if="filteredProducts.length === 0" class="text-center">
                        <p class="text-muted">Nenhum produto encontrado.</p>
                    </div>
                  
                      <div class="row mt-4">
                        <productCard 
                          v-for="(item, index) in filteredProducts" 
                          :seller="item.seller" 
                            :key="index" 
                            :id="item.id"
                            :nome="item.name" 
                            :preco="item.price" 
                            :imagem1="item.image1?.url ? `http://localhost:1337${item.image1.url}` : ''"
                            :imagem2="item.image2?.url ? `http://localhost:1337${item.image2.url}` : ''"
                            :categoria="item.tags"
                            :descricao="item.description"
                          class="col-md-3 mt-2"
                        />
                      </div>
                </section>
            </div>
        </main>
        <FooterComponent />
    </div>
</template>

<script lang="ts">
import FooterComponent from '@/components/footer/footerComponent.vue';
import HeaderComponent from '@/components/header/headerComponent.vue';
import productCard from '@/components/card/productCard.vue';
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSearchStore } from '@/store/search';  
import { useProductStore } from '@/store/products';

export default defineComponent({
    components: {
        HeaderComponent,
        FooterComponent,
        productCard
    },
    setup() {
        const searchStore = useSearchStore();
        const productStore = useProductStore();
        const route = useRoute();
        const router = useRouter();
        const search = ref((route.query.q as string) || searchStore.query);
        const selectedCategory = ref('');
        const maxPrice = ref(1000);
        const sortBy = ref('relevance');
        const categories = ref(['Vestidos', 'Camisetas', 'Calças', 'Jaquetas', 'Bolsas', 'Óculos', 'Tênis']);
        

        onMounted(async () => {
            await productStore.fetchProducts();
            if (typeof route.query.q === 'string') {
                searchStore.setSearchQuery(route.query.q);
                search.value = route.query.q;
            }
        });


        watch(() => route.query.q, (newQuery) => {
            if (typeof newQuery === 'string') {
                searchStore.setSearchQuery(newQuery);
                search.value = newQuery;
            }
        });

        const filteredProducts = computed(() => {
            if (!search.value) return productStore.products;
            return productStore.products.filter((product) =>
                product.name.toLowerCase().includes(search.value.toLowerCase())
            );
        });

        return { search,filteredProducts , selectedCategory, maxPrice, sortBy, categories };
    },
    
});
</script>

<style scoped>
.filters {
    width: 250px;
    padding: 20px;
    background: #4a4238;
    color: #fff;
    border-radius: 8px;
    margin-right: 20px;
}

.filters label {
    font-weight: bold;
    margin-top: 10px;
    display: block;
}

.filters .form-control {
    margin-bottom: 15px;
    width: 100%;
}

.filters input[type="range"] {
    width: 100%;
    height: 8px;
    background: #ddd;
    border-radius: 5px;
    outline: none;
    transition: 0.3s;
    cursor: pointer;
    appearance: none;
}

.filters input[type="range"]::-webkit-slider-runnable-track {
    background: #6c9a8b;
    height: 8px;
    border-radius: 5px;
}

.filters input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    background: #ffcc00;
    border-radius: 50%;
    margin-top: -5px;
    cursor: pointer;
}

.filters span {
    display: block;
    text-align: center;
    font-size: 14px;
    margin-top: 5px;
}

.search-results {
    flex-grow: 1;
}

.animate-spawn{
    animation: spawn .2s forwards;
  }
  
  @keyframes spawn {
      from{
        opacity: 0;
        transform: translateY(-8px);
      }
  }
</style>