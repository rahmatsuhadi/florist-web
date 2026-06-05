import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/store/AppContext";
import { createOrder } from "@/services/public/checkoutService";

export const useCheckout = () => {
  const { cart, cartTotal, dispatch, setToast, customerInfo } = useAppContext();
  const router = useRouter();

  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [checkoutData, setCheckoutData] = useState({
    address: "",
    latitude: "",
    longitude: "",
    scheduledDate: "",
    scheduledTime: "",
    locationId: undefined as number | undefined,
    shippingCost: 0,
    isLocationComplete: false,
  });

  const [errors, setErrors] = useState({
    address: "",
    location: "",
    locationSelect: "",
    scheduledDate: "",
    scheduledTime: "",
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      router.push("/");
    }
  }, [cart, router]);

  const handleCheckout = async () => {
    const newErrors = {
      address: deliveryMethod === "delivery" && !checkoutData.address.trim() ? "Alamat wajib diisi." : "",
      location: deliveryMethod === "delivery" && (!checkoutData.latitude || !checkoutData.longitude) ? "Titik lokasi peta wajib ditentukan." : "",
      locationSelect: deliveryMethod === "delivery" && !checkoutData.isLocationComplete ? "Pilih wilayah pengiriman hingga level terdalam (terakhir)." : "",
      scheduledDate: !checkoutData.scheduledDate ? "Tanggal wajib dipilih." : "",
      scheduledTime: !checkoutData.scheduledTime ? "Jam wajib dipilih." : "",
    };

    setErrors(newErrors);

    if (newErrors.address || newErrors.location || newErrors.locationSelect || newErrors.scheduledDate || newErrors.scheduledTime) {
      setToast({ message: "Mohon lengkapi semua data formulir." });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    if (!customerInfo.name || !customerInfo.phone) {
      setToast({ message: "Data profil tidak lengkap, harap kembali ke keranjang." });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItemsData = cart.map((item) => ({
        productId: Number(item.id),
        productName: item.name,
        productImage: item.image,
        productPrice: item.price.toString(),
        productCategory: item.category || "General",
        quantity: item.qty,
        variantDetails: item.variantDetails || [],
        notes: item.notes,
      }));

      // Total kalkulasi termasuk ongkir jika ada
      const finalTotalAmount = cartTotal + (deliveryMethod === "delivery" ? checkoutData.shippingCost : 0);

      const res = await createOrder({
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerAddress: deliveryMethod === "delivery" ? checkoutData.address : "",
        customerLatitude: deliveryMethod === "delivery" && checkoutData.latitude ? checkoutData.latitude : undefined,
        customerLongitude: deliveryMethod === "delivery" && checkoutData.longitude ? checkoutData.longitude : undefined,
        locationId: deliveryMethod === "delivery" ? checkoutData.locationId : undefined,
        shippingCost: deliveryMethod === "delivery" ? checkoutData.shippingCost.toString() : undefined,
        deliveryMethod,
        scheduledDate: checkoutData.scheduledDate,
        scheduledTime: checkoutData.scheduledTime,
        totalAmount: finalTotalAmount.toString(),
        items: orderItemsData,
      });

      if (!res.success) {
        setToast({ message: "Gagal memproses pesanan, silakan coba lagi." });
        setTimeout(() => setToast(null), 3000);
        setIsSubmitting(false);
        return;
      }

      dispatch({ type: 'CLEAR_CART' });
      
      router.push(`/orders/${res.orderId}`);
    } catch (error) {
      console.error(error);
      setToast({ message: "Terjadi kesalahan sistem." });
      setTimeout(() => setToast(null), 3000);
      setIsSubmitting(false);
    }
  };

  return {
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
  };
};
