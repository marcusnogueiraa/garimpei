import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';

const loginRequired = ref(false); 

export function useAuthGuard() {
  const authStore = useAuthStore();

  const requireLogin = (callback: () => void) => { 
    if (!authStore.getUser()) {
      loginRequired.value = true;
      return;
    }
    callback(); 
  };

  return { loginRequired, requireLogin };
}
