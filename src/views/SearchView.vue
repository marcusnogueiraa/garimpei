<template>
    <div class="vh-100 d-flex flex-column">
        <HeaderComponent />
        <main class="flex-grow-1 p-4 animate-spawn">    
            <div class="d-flex mt-4">
                <aside class="filters">
                    <h4>Filtros</h4>
                    <div>
                        <label>Categoria</label>
                        <select v-model="selectedCategory" class="form-control" @change="updateSearchResults">
                            <option value="">Todas</option>
                            <option v-for="category in categories" :key="category" :value="category">
                                {{ category }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label>Preço</label>
                        <input type="range" v-model="maxPrice" min="0" max="1000" step="10" class="form-control" @input="updateSearchResults" />
                        <span>Até R$ {{ maxPrice }}</span>
                    </div>
                    <div>
                        <label>Ordenar por</label>
                        <select v-model="sortBy" class="form-control" @change="updateSearchResults">
                            <option value="relevance">Relevância</option>
                            <option value="price_low">Menor Preço</option>
                            <option value="price_high">Maior Preço</option>
                        </select>
                    </div>
                </aside>     

                <section class="search-results">
                    <p v-if="search">Exibindo resultados para "{{ search }}"...</p>

                    <div v-if="filteredProducts.length === 0" class="text-center">
                        <p class="text-muted">Nenhum produto encontrado.</p>
                    </div>
                  
                    <div class="row mt-4">
                        <ProductCard 
                            v-for="(item, index) in sortedProducts" 
                            :key="index" 
                            :id="item.id"
                            :name="item.name" 
                            :price="item.price" 
                            :image1="formatImage(item.image1)"
                            :tags="item.tags"
                            :description="item.description"
                            :seller="item.seller"
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
import ProductCard from '@/components/card/productCard.vue';
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSearchStore } from '@/store/search';  
import { useProductStore } from '@/store/products';

export default defineComponent({
    components: {
        HeaderComponent,
        FooterComponent,
        ProductCard
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
            let products = productStore.products;

            if (search.value) {
                products = products.filter(product =>
                    product.name.toLowerCase().includes(search.value.toLowerCase())
                );
            }

            if (selectedCategory.value) {
                products = products.filter(product => product.category === selectedCategory.value);
            }

            products = products.filter(product => product.price <= maxPrice.value);

            return products;
        });

        const sortedProducts = computed(() => {
            if (sortBy.value === 'price_low') {
                return [...filteredProducts.value].sort((a, b) => a.price - b.price);
            }
            if (sortBy.value === 'price_high') {
                return [...filteredProducts.value].sort((a, b) => b.price - a.price);
            }
            return filteredProducts.value;
        });

        const updateSearchResults = () => {
            router.push({ path: '/search', query: { q: search.value } });
        };

        const formatImage = (image: string | { url?: string } | null): string => {
            if (!image) return ''; 
            if (typeof image === 'string') return image; 
            if (typeof image === 'object' && image.url) return `http://localhost:1337${image.url}`; 
            return ''; 
        };

        return { 
            search,
            filteredProducts,
            sortedProducts,
            updateSearchResults,
            formatImage, 
            selectedCategory, 
            maxPrice, 
            sortBy, 
            categories 
        };
    },
});
</script>

<style scoped>

.vh-100 {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

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

.animate-spawn {
    animation: spawn .2s forwards;
}
  
@keyframes spawn {
    from {
        opacity: 0;
        transform: translateY(-8px);
    }
}
</style>
