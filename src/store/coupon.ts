import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/api/axios";

export interface Coupon {
  id: number;
  code: string;
  whoUsedId: number[];
  sellerUsername: string;
  discount: number;
  expiryDate: Date;
}

export const useCouponStore = defineStore("coupon", () => {
  const validateCoupon = async (code: string, userId: number, sellerUsername: string) => {
    try {
      const response = await api.get(
        `/coupons?filters[code][$eq]=${code}&filters[sellerUsername][$eq]=${sellerUsername}`
      );

      console.log("API response:", response.data);

      const couponData = response.data.data[0];

      if (!couponData) {
        return { valid: false, message: "Invalid coupon!" };
      }

      const coupon: Coupon = {
        id: couponData.id,
        code: couponData.code,
        whoUsedId: couponData.whoUsedId || [],
        sellerUsername: couponData.sellerUsername,
        discount: couponData.discount,
        expiryDate: new Date(couponData.expiryDate),
      };

      if (new Date() > coupon.expiryDate) {
        return { valid: false, message: "This coupon has expired!" };
      }

      if (coupon.whoUsedId.includes(userId)) {
        return { valid: false, message: "You have already used this coupon!" };
      }

      return { valid: true, discount: coupon.discount, couponId: coupon.id };
    } catch (error) {
      console.error("Error validating coupon:", error);
      return { valid: false, message: "Error validating coupon." };
    }
  };

  const useCoupon = async (couponCode: string, userId: number) => {
    try {
      const response = await api.get(
        `/coupons?filters[code][$eq]=${couponCode}`
      );
      console.log("API response for useCoupon:", response.data);

      const couponData = response.data.data[0];

      if (!couponData) {
        console.error("Coupon not found.");
        return { success: false, message: "Coupon not found." };
      }

      const couponId = couponData.id;
      const updatedWhoUsed = [...(couponData.whoUsedId || []), userId];

      await api.put(`/coupons/${couponId}`, {
        data: { whoUsedId: updatedWhoUsed },
      });

      return { success: true };
    } catch (error) {
      console.error("Error updating coupon:", error);
      return { success: false, message: "Error marking coupon as used." };
    }
  };


  return { validateCoupon, useCoupon };
});
