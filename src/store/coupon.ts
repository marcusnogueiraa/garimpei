import { defineStore } from "pinia";
import { ref } from "vue";

export interface Coupon {
  code: string;
  whoUsed: number[];
  seller: string;
  maxUse: number;
  discount: number; 
  expiryDate: Date
}

export const useCouponStore = defineStore("coupon", () => {
    const coupons = ref<Coupon[]>([
        {
          code: "DESCONTO10",
          whoUsed: [],
          seller: "Loja Oficial XYZ",
          maxUse: 50,
          discount: 10,
          expiryDate: new Date("2025-12-31"), 
        },
        {
          code: "BLACKFRIDAY",
          whoUsed: [],
          seller: "Loja Oficial XYZ",
          maxUse: 100,
          discount: 20,
          expiryDate: new Date("2023-11-30"), 
        },
      ]);

      const validateCoupon = (code: string, userId: number) => {
        const coupon = coupons.value.find((c) => c.code === code);
        if (!coupon) return { valid: false, message: "Cupom inválido!" };
      

        if (new Date() > coupon.expiryDate) {
          return { valid: false, message: "Este cupom expirou!" };
        }
      
        if (coupon.whoUsed.includes(userId)) {
          return { valid: false, message: "Você já usou este cupom!" };
        }
      
        if (coupon.whoUsed.length >= coupon.maxUse) {
          return { valid: false, message: "Este cupom atingiu o limite de uso!" };
        }
      
        return { valid: true, discount: coupon.discount };
      };

      const useCoupon = (code: string, userId: number) => {
        const coupon = coupons.value.find((c) => c.code === code);
        if (coupon) {
          coupon.whoUsed.push(userId);
        }
      };

  return { coupons, validateCoupon, useCoupon };
});
