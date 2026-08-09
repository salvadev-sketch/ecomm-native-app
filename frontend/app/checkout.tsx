import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { COLORS } from "@/constants";
import { useCart } from "@/context/CartContext";
import { api } from "@/config/api";
import { auth } from "@/config/firebaseConfig";
import Toast from "react-native-toast-message";

const SHIPPING_COST = 2.0;
const TAX_RATE = 0; // matches the tutorial's $0.00 tax on the sample order

export default function Checkout() {
    const router = useRouter();
    const { items, subtotal, clearCart } = useCart();
    const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");
    const [placing, setPlacing] = useState(false);

    const tax = subtotal * TAX_RATE;
    const total = subtotal + SHIPPING_COST + tax;

    const handlePlaceOrder = async () => {
        const user = auth.currentUser;
        if (!user) {
            Toast.show({ type: "error", text1: "Please sign in first" });
            router.push("/auth/sign-in");
            return;
        }

        setPlacing(true);
        try {
            const token = await user.getIdToken();
            const orderItems = items.map((i) => ({
                product: i.product._id,
                name: i.product.name,
                image: i.product.images[0],
                size: i.size,
                quantity: i.quantity,
                price: i.product.price,
            }));

            // NOTE: shippingAddress is a placeholder here until the address-picker
            // (Stage 4 follow-up) is wired in from /addresses.
            const order = await api.post(
                "/api/orders",
                {
                    items: orderItems,
                    shippingAddress: { type: "Home", street: "", city: "", state: "", zipCode: "", country: "" },
                    paymentMethod,
                    subtotal,
                    shippingCost: SHIPPING_COST,
                    tax,
                },
                token
            );

            clearCart();
            router.replace(`/orders/${order._id}`);
        } catch (err) {
            Toast.show({ type: "error", text1: "Could not place order" });
        } finally {
            setPlacing(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
            <Header title="Checkout" showBack />
            <ScrollView className="flex-1 p-4">
                <Text className="text-xs text-secondary mb-1">Shipping address</Text>
                <TouchableOpacity
                    onPress={() => router.push("/addresses")}
                    className="bg-surface rounded-lg p-3 mb-4"
                >
                    <Text className="text-sm text-primary">Add address</Text>
                </TouchableOpacity>

                <Text className="text-xs text-secondary mb-1">Payment method</Text>
                <TouchableOpacity
                    onPress={() => setPaymentMethod("cod")}
                    className={`rounded-lg p-3 mb-2 flex-row justify-between items-center ${
                        paymentMethod === "cod" ? "border border-primary" : "border border-border"
                    }`}
                >
                    <View>
                        <Text className="text-sm text-primary">Cash on Delivery</Text>
                        <Text className="text-xs text-secondary">Pay when you receive the order</Text>
                    </View>
                    {paymentMethod === "cod" && (
                        <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setPaymentMethod("card")}
                    className={`rounded-lg p-3 mb-4 flex-row justify-between items-center ${
                        paymentMethod === "card" ? "border border-primary" : "border border-border"
                    }`}
                >
                    <View>
                        <Text className="text-sm text-primary">Pay with Card</Text>
                        <Text className="text-xs text-secondary">Credit or Debit card</Text>
                    </View>
                    {paymentMethod === "card" && (
                        <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
                    )}
                </TouchableOpacity>

                <View className="border-t border-border pt-3">
                    <View className="flex-row justify-between mb-1">
                        <Text className="text-xs text-secondary">Subtotal</Text>
                        <Text className="text-xs text-primary">${subtotal.toFixed(2)}</Text>
                    </View>
                    <View className="flex-row justify-between mb-1">
                        <Text className="text-xs text-secondary">Shipping</Text>
                        <Text className="text-xs text-primary">${SHIPPING_COST.toFixed(2)}</Text>
                    </View>
                    <View className="flex-row justify-between mb-3">
                        <Text className="text-xs text-secondary">Tax</Text>
                        <Text className="text-xs text-primary">${tax.toFixed(2)}</Text>
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="text-sm font-medium text-primary">Total</Text>
                        <Text className="text-sm font-medium text-primary">${total.toFixed(2)}</Text>
                    </View>
                </View>
            </ScrollView>

            <View className="p-4 border-t border-border">
                <TouchableOpacity
                    onPress={handlePlaceOrder}
                    disabled={placing}
                    className="bg-primary rounded-full py-3 items-center"
                >
                    {placing ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text className="text-white text-sm font-medium">Place order</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
