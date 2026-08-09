import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { COLORS } from "@/constants";
import type { Product } from "@/constants/types";
import { dummyProducts } from "@/assets/assets";
import { useCart } from "@/context/CartContext";
import Toast from "react-native-toast-message";

export default function ProductDetail() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const found = (dummyProducts as unknown as Product[]).find((p) => p._id === id);
        setProduct(found ?? null);
        if (found?.sizes?.length) setSelectedSize(found.sizes[0]);
        setLoading(false);
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        if (product.sizes?.length && !selectedSize) {
            Toast.show({ type: "error", text1: "Please select a size" });
            return;
        }
        addToCart(product, selectedSize ?? "One Size");
        Toast.show({ type: "success", text1: "Added to cart" });
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-background justify-center items-center" edges={["top"]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </SafeAreaView>
        );
    }

    if (!product) {
        return (
            <SafeAreaView className="flex-1 bg-background justify-center items-center" edges={["top"]}>
                <Text className="text-secondary">Product not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
            <Header title="" showBack />
            <ScrollView showsVerticalScrollIndicator={false}>
                <Image
                    source={{ uri: product.images[0] }}
                    className="w-full h-72 bg-surface"
                    resizeMode="cover"
                />
                <View className="p-4">
                    <Text className="text-lg font-semibold text-primary mb-1">{product.name}</Text>
                    <View className="flex-row items-center mb-2">
                        <Ionicons name="star" size={14} color="#FFB800" />
                        <Text className="text-xs text-secondary ml-1">
                            {product.ratings.average.toFixed(1)} ({product.ratings.count} reviews)
                        </Text>
                    </View>
                    <Text className="text-xl font-semibold text-primary mb-4">
                        ${product.price.toFixed(2)}
                    </Text>

                    {product.sizes && product.sizes.length > 0 && (
                        <>
                            <Text className="text-xs text-secondary mb-2">Size</Text>
                            <View className="flex-row gap-2 mb-4">
                                {product.sizes.map((size) => (
                                    <TouchableOpacity
                                        key={size}
                                        onPress={() => setSelectedSize(size)}
                                        className={`w-9 h-9 rounded-full items-center justify-center ${
                                            selectedSize === size ? "bg-primary" : "border border-border"
                                        }`}
                                    >
                                        <Text
                                            className={`text-xs ${
                                                selectedSize === size ? "text-white" : "text-primary"
                                            }`}
                                        >
                                            {size}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </>
                    )}

                    <Text className="text-xs text-secondary mb-1">Description</Text>
                    <Text className="text-sm text-primary leading-5">{product.description}</Text>
                </View>
            </ScrollView>

            <View className="p-4 border-t border-border">
                <TouchableOpacity
                    onPress={handleAddToCart}
                    className="bg-primary rounded-full py-3 items-center"
                >
                    <Text className="text-white text-sm font-medium">Add to cart</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
