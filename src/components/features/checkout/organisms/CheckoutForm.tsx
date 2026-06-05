"use client";

import React from "react";
import { useCheckout } from "@/hooks/useCheckout";
import { CheckoutCustomerInfo } from "./CheckoutCustomerInfo";
import { CheckoutShippingMethod } from "./CheckoutShippingMethod";
import { CheckoutDeliveryDetails } from "./CheckoutDeliveryDetails";
import { CheckoutSummary } from "./CheckoutSummary";
import { PublicLocationNode } from "@/services/public/locationService";

export const CheckoutForm = ({ locationTree }: { locationTree: PublicLocationNode[] }) => {
  const {
    cart,
    cartTotal,
    customerInfo,
    deliveryMethod,
    setDeliveryMethod,
    checkoutData,
    setCheckoutData,
    errors,
    setErrors,
    isSubmitting,
    handleCheckout,
  } = useCheckout();

  if (cart.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT COLUMN - FORM */}
      <div className="lg:col-span-2 space-y-8">
        <CheckoutCustomerInfo customerInfo={customerInfo} />
        
        <CheckoutShippingMethod 
          deliveryMethod={deliveryMethod} 
          setDeliveryMethod={setDeliveryMethod} 
        />
        
        <CheckoutDeliveryDetails 
          deliveryMethod={deliveryMethod}
          checkoutData={checkoutData}
          setCheckoutData={setCheckoutData}
          errors={errors}
          setErrors={setErrors}
          locationTree={locationTree}
        />
      </div>

      {/* RIGHT COLUMN - SUMMARY */}
      <div className="lg:col-span-1">
        <CheckoutSummary 
          cart={cart}
          cartTotal={cartTotal}
          deliveryMethod={deliveryMethod}
          shippingCost={checkoutData.shippingCost}
          isSubmitting={isSubmitting}
          handleCheckout={handleCheckout}
        />
      </div>
    </div>
  );
};
