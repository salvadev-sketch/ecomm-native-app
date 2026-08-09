import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View, ActivityIndicator, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, CATEGORIES } from "@/constants";
import type { Product } from "@/constants/types";
import { dummyProducts } from "@/assets/assets";

export default function Home() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        setProducts(dummyProducts as any[]);
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const grouped = CATEGORIES.reduce((acc, cat) => {
        acc[cat.name] = products.filter((p) => p.category === cat.name);
        return acc;
    }, {} as Record<string, Product[]>);

    return (
        <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
            <View className="flex-row items-center justify-between px-4 py-3">
                <Text className="text-xl font-semibold text-primary">forever</Text>
                <TouchableOpacity onPress={() => router.push("/cart")}>
                    <Ionicons name="bag-outline" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="mx-4 mb-5 rounded-xl bg-accent px-4 py-5">
                        <Text className="text-white text-xs mb-1">Limited time</Text>
                        <Text className="text-white text-lg font-semibold">20% off new arrivals</Text>
                    </View>

                    <Text className="px-4 mb-2 text-sm text-secondary">Categories</Text>
                    <View className="flex-row justify-between px-4 mb-6">
                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                onPress={() => router.push(`/shop?category=${cat.name}`)}
                                className="items-center"
                            >
                                <View className="w-9 h-9 rounded-full bg-surface items-center justify-center mb-1">
                                    <Ionicons name={cat.icon as any} size={18} color={COLORS.secondary} />
                                </View>
                                <Text className="text-xs text-secondary">{cat.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {CATEGORIES.map((cat) => {
                        const items = grouped[cat.name];
                        if (!items || items.length === 0) return null;
                        return (
                            <View key={cat.id} className="mb-6">
                                <View className="flex-row items-center justify-between px-4 mb-2">
                                    <Text className="text-sm font-medium text-primary">{cat.name}</Text>
                                    <TouchableOpacity onPress={() => router.push(`/shop?category=${cat.name}`)}>
                                        <Text className="text-xs text-secondary">See all</Text>
                                    </TouchableOpacity>
                                </View>
                                <FlatList
                                    data={items}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item) => item._id}
                                    contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => router.push(`/product/${item._id}`)}
                                            className="w-32 bg-surface rounded-lg p-2"
                                        >
                                            <Image
                                                source={{ uri: item.images[0] }}
                                                className="w-full h-24 rounded-md mb-2 bg-border"
                                                resizeMode="cover"
                                            />
                                            <Text numberOfLines={1} className="text-xs text-primary">
                                                {item.name}
                                            </Text>
                                            <Text className="text-xs font-medium text-primary mt-0.5">
                                                ${item.price.toFixed(2)}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        );
                    })}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
