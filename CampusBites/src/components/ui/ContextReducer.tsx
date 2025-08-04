"use client";

import React, { createContext, useContext, useReducer } from "react";

// Type for individual item in cart
type CartItem = {
  id: string;
  name: string;
  price: number;
  img?: string;
  qty: number;
  customization?: string;
};

// Define the cart state as an array of items
type CartState = CartItem[];

// Define possible actions
type Action =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; id: string }
  | { type: "UPDATE_QTY"; id: string; qty: number }
  | { type: "CLEAR" };

// Reducer function
const reducer = (state: CartState, action: Action): CartState => {
  switch (action.type) {
    case "ADD": {
      const existingItem = state.find((item) => item.id === action.item.id);
      if (existingItem) {
        return state.map((item) =>
          item.id === action.item.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...state, { ...action.item, qty: 1 }];
    }

    case "REMOVE": {
      return state
        .map((item) =>
          item.id === action.id
            ? { ...item, qty: item.qty - 1 }
            : item
        )
        .filter((item) => item.qty > 0);
    }

    case "UPDATE_QTY": {
      return state.map((item) =>
        item.id === action.id
          ? { ...item, qty: action.qty }
          : item
      );
    }

    case "CLEAR":
      return [];

    default:
      return state;
  }
};

// Create Contexts
const CartContext = createContext<CartState>([]);
const DispatchCartContext = createContext<React.Dispatch<Action>>(() => null);

// Provider component
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, []);
  return (
    <CartContext.Provider value={state}>
      <DispatchCartContext.Provider value={dispatch}>
        {children}
      </DispatchCartContext.Provider>
    </CartContext.Provider>
  );
};

// Custom hooks
export const useCart = () => useContext(CartContext);
export const useDispatchCart = () => useContext(DispatchCartContext);
