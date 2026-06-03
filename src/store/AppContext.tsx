"use client";

import type React from "react";
import { createContext, useContext, useReducer, useState, useEffect } from "react";

export interface VariantDetail {
  name: string;
  groupName: string;
  price: number;
  priceType?: string;
}

export interface CartItem {
  id: string;
  cartItemId: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  variantsText: string | null;
  category?: string;
  variantDetails?: VariantDetail[];
  notes?: string;
}

export interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: Omit<CartItem, "qty"> }
  | { type: "UPDATE_QTY"; payload: { cartItemId: string; qty: number } }
  | { type: "REMOVE_ITEM"; payload: { cartItemId: string } }
  | { type: "CLEAR_CART" };

export interface CustomerInfo {
  name: string;
  phone: string;
}

export interface AppContextType {
  cart: CartItem[];
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  toast: { message: string } | null;
  setToast: (toast: { message: string } | null) => void;
  addToCart: (product: Omit<CartItem, "qty">) => void;
  dispatch: React.Dispatch<CartAction>;
  customerInfo: CustomerInfo;
  setCustomerInfo: (info: CustomerInfo) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.items.find(
        (i) => i.cartItemId === action.payload.cartItemId,
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.cartItemId === action.payload.cartItemId
              ? { ...i, qty: i.qty + 1 }
              : i,
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, qty: 1 }],
      };
    }
    case "UPDATE_QTY":
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.cartItemId === action.payload.cartItemId
              ? { ...i, qty: action.payload.qty }
              : i,
          )
          .filter((i) => i.qty > 0),
      };
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (i) => i.cartItemId !== action.payload.cartItemId,
        ),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartState, dispatch] = useReducer(cartReducer, { items: [] });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string } | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({ name: "", phone: "" });

  // Load from localStorage if available (optional, but good for UX)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedInfo = localStorage.getItem("florist_customer_info");
      if (savedInfo) {
        try {
          setCustomerInfo(JSON.parse(savedInfo));
        } catch (e) {
          // ignore
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && (customerInfo.name || customerInfo.phone)) {
      localStorage.setItem("florist_customer_info", JSON.stringify(customerInfo));
    }
  }, [customerInfo]);

  const addToCart = (product: Omit<CartItem, "qty">) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
    setToast({ message: `${product.name} ditambahkan ke keranjang.` });
    setTimeout(() => setToast(null), 3000);
  };

  const cartTotal = cartState.items.reduce(
    (acc, i) => acc + i.price * i.qty,
    0,
  );

  return (
    <AppContext.Provider
      value={{
        cart: cartState.items,
        cartTotal,
        dispatch,
        isCartOpen,
        setIsCartOpen,
        toast,
        setToast,
        addToCart,
        customerInfo,
        setCustomerInfo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
