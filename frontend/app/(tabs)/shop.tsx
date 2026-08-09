import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { CATEGORIES } from "@/constants";
import type { Product } from "@/constants/types";
import { dummyProducts } from "@/assets/assets";

export default function Shop() {
    const router = useRouter();
    const { category } = useLocalSearchParams<{ category?: string }>();
    const [selected, setSelected] = useState<string | undefined>(category);
    const [products] = useState<Product[]>(dummyProducts as unknown as Product[]);

    useEffect(() => setSelected(category), [category]);

    const filtered = useMemo(
        () => (selected ? products.filter((p) => p.category === selected) : products),
        [selected, products]
    );

    return (
        <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
            <Header title="Shop" />
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={[{ id: 0, name: "All" }, ...CATEGORIES]}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => setSelected(item.name === "All" ? undefined : item.name)}
                        className={`px-4 py-1.5 rounded-full ${
                            (item.name === "All" && !selected) || selected === item.name
                                ? "bg-primary"
                                : "bg-surface"
                        }`}
                    >
                        <Text
                            className={`text-xs ${
                                (item.name === "All" && !selected) || selected === item.name
                                    ? "text-white"
                                    : "text-secondary"
                            }`}
                        >
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                )}
            />
            <FlatList
                data={filtered}
                keyExtractor={(item) => item._id}
                numColumns={2}
                contentContainerStyle={{ padding: 12, gap: 12 }}
                columnWrapperStyle={{ gap: 12 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => router.push(`/product/${item._id}`)}
                        className="flex-1 bg-surface rounded-lg p-2"
                    >
                        <Image
                            source={{ uri: item.images[0] }}
                            className="w-full h-32 rounded-md mb-2 bg-border"
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
        </SafeAreaView>
    );
}
