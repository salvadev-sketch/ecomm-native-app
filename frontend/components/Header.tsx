import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";

interface HeaderProps {
    title: string;
    showBack?: boolean;
}

export default function Header({ title, showBack = false }: HeaderProps) {
    const router = useRouter();

    return (
        <View className="flex-row items-center px-4 py-3 border-b border-border bg-background">
            {showBack && (
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <Ionicons name="chevron-back" size={22} color={COLORS.primary} />
                </TouchableOpacity>
            )}
            <Text className="text-base font-medium text-primary" numberOfLines={1}>
                {title}
            </Text>
        </View>
    );
}
