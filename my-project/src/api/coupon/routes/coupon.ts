"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/coupons",
      handler: "coupon.find",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/coupons",
      handler: "coupon.create",
      config: {
        auth: false,
      },
    },
    {
      method: "DELETE",
      path: "/coupons/:id",
      handler: "coupon.delete",
      config: {
        auth: false,
      },
    },
  ],
};
