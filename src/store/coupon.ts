import { defineStore } from "pinia";
import { ref } from "vue";

export interface Coupon {
  code: string;
  whoUsedId: number[];
  seller: string;
  discount: number; 
  expiryDate: Date
}

export const useCouponStore = defineStore("coupon", () => {
    const coupons = ref<Coupon[]>([
        {
          code: "DESCONTO10",
          whoUsedId: [],
          seller: "Loja Oficial XYZ",
          discount: 10,
          expiryDate: new Date("2025-12-31"), 
        },
        {
          code: "BLACKFRIDAY",
          whoUsedId: [],
          seller: "Loja Oficial XYZ",
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
      
    
        return { valid: true, discount: coupon.discount };
      };

      const useCoupon = (code: string, userId: number) => {
        const coupon = coupons.value.find((c) => c.code === code);
        if (coupon) {
          coupon.whoUsedId.push(userId);
        }
      };

  return { coupons, validateCoupon, useCoupon };
});
