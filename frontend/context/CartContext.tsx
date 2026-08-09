import React, { createContext, useContext, useState, useMemo } from "react";
import type { CartItem, Product } from "@/constants/types";

type CartContextType = {
    items: CartItem[];
    addToCart: (product: Product, size: string, quantity?: number) => void;
    removeFromCart: (productId: string, size: string) => void;
    updateQuantity: (productId: string, size: string, quantity: number) => void;
    clearCart: () => void;
    subtotal: number;
    itemCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = (product: Product, size: string, quantity = 1) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.product._id === product._id && i.size === size);
            if (existing) {
                return prev.map((i) =>
                    i.product._id === product._id && i.size === size
                        ? { ...i, quantity: i.quantity + quantity }
                        : i
                );
            }
            return [...prev, { product, size, quantity }];
        });
    };

    const removeFromCart = (productId: string, size: string) => {
        setItems((prev) => prev.filter((i) => !(i.product._id === productId && i.size === size)));
    };

    const updateQuantity = (productId: string, size: string, quantity: number) => {
        if (quantity < 1) return removeFromCart(productId, size);
        setItems((prev) =>
            prev.map((i) =>
                i.product._id === productId && i.size === size ? { ...i, quantity } : i
            )
        );
    };

    const clearCart = () => setItems([]);

    const subtotal = useMemo(
        () => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
        [items]
    );
    const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

    return (
        <CartContext.Provider
            value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, itemCount }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within a CartProvider");
    return ctx;
}
