import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductView from '../views/ProductView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import SearchView from '@/views/SearchView.vue'
import CartView from '@/views/CartView.vue'
import FavoritesView from '@/views/favoritesView.vue'
import SellView from '@/views/SellView.vue'
import MyProductsView from '@/views/MyProductsView.vue'
import EditProductView from '@/views/EditProductView.vue'
import StoreDashboardView from '@/views/StoreDashboardView.vue'
import PaymentView from '@/views/PaymentView.vue'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
  },
  {
    path: '/product',
    name: 'product',
    component: ProductView
  },
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartView
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: FavoritesView
  },
  {
    path: '/sell-product',
    name: 'sell-product',
    component: SellView
  },
  {
    path: '/my-products', 
    name: 'my-products',
    component: MyProductsView
  },
  {
    path: '/edit-product',
    name: 'edit-product',
    component: EditProductView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: StoreDashboardView
  },
  {
    path: '/payment',
    name: 'payment',
    component: PaymentView
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
