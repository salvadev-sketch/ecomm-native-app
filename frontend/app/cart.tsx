import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { COLORS } from "@/constants";
import { useCart } from "@/context/CartContext";

export default function Cart() {
    const router = useRouter();
    const { items, updateQuantity, removeFromCart, subtotal } = useCart();

    if (items.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
                <Header title="Cart" showBack />
                <View className="flex-1 justify-center items-center px-8">
                    <Ionicons name="bag-outline" size={48} color={COLORS.secondary} />
                    <Text className="text-secondary text-sm mt-3 mb-6 text-center">
                        Your cart is empty
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push("/")}
                        className="bg-primary rounded-full px-6 py-3"
                    >
                        <Text className="text-white text-sm font-medium">Start shopping</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
            <Header title="Cart" showBack />
            <FlatList
                data={items}
                keyExtractor={(item) => `${item.product._id}-${item.size}`}
                contentContainerStyle={{ padding: 16, gap: 12 }}
                renderItem={({ item }) => (
                    <View className="flex-row gap-3 items-center border-b border-border pb-3">
                        <Image
                            source={{ uri: item.product.images[0] }}
                            className="w-14 h-14 rounded-md bg-surface"
                        />
                        <View className="flex-1">
                            <Text numberOfLines={1} className="text-sm text-primary">
                                {item.product.name}
                            </Text>
                            <Text className="text-xs text-secondary">Size {item.size}</Text>
                            <View className="flex-row items-center mt-1 gap-3">
                                <TouchableOpacity
                                    onPress={() =>
                                        updateQuantity(item.product._id, item.size, item.quantity - 1)
                                    }
                                    className="w-6 h-6 rounded-full border border-border items-center justify-center"
                                >
                                    <Ionicons name="remove" size={14} color={COLORS.primary} />
                                </TouchableOpacity>
                                <Text className="text-xs text-primary">{item.quantity}</Text>
                                <TouchableOpacity
                                    onPress={() =>
                                        updateQuantity(item.product._id, item.size, item.quantity + 1)
                                    }
                                    className="w-6 h-6 rounded-full border border-border items-center justify-center"
                                >
                                    <Ionicons name="add" size={14} color={COLORS.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="items-end">
                            <Text className="text-sm font-medium text-primary mb-2">
                                ${(item.product.price * item.quantity).toFixed(2)}
                            </Text>
                            <TouchableOpacity onPress={() => removeFromCart(item.product._id, item.size)}>
                                <Ionicons name="trash-outline" size={16} color={COLORS.error} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            <View className="p-4 border-t border-border">
                <View className="flex-row justify-between mb-3">
                    <Text className="text-sm font-medium text-primary">Total</Text>
                    <Text className="text-sm font-medium text-primary">${subtotal.toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => router.push("/checkout")}
                    className="bg-primary rounded-full py-3 items-center"
                >
                    <Text className="text-white text-sm font-medium">Checkout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
