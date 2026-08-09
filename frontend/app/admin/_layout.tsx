import { Tabs, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import { api } from "@/config/api";
import { COLORS } from "@/constants";
import type { User } from "@/constants/types";

export default function AdminLayout() {
    const router = useRouter();
    const [profile, setProfile] = useState<User | null>(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                setProfile(null);
                setChecking(false);
                return;
            }
            try {
                const token = await firebaseUser.getIdToken();
                const me = await api.get("/api/auth/me", token);
                setProfile(me);
            } catch {
                setProfile(null);
            } finally {
                setChecking(false);
            }
        });
        return unsub;
    }, []);

    useEffect(() => {
        if (!checking && (!profile || profile.role !== "admin")) {
            router.replace("/(tabs)");
        }
    }, [checking, profile]);

    if (checking) {
        return (
            <View className="flex-1 justify-center items-center bg-surface">
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!profile || profile.role !== "admin") return null;

    return (
        <Tabs
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#fff",
                },
                headerTintColor: COLORS.primary,
                headerTitleStyle: {
                    fontWeight: "bold",
                },
                headerShadowVisible: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: "gray",
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => router.replace("/(tabs)")}
                        className="mr-4 flex-row items-center"
                    >
                        <Ionicons name="log-out-outline" size={24} color={COLORS.primary} />
                        <Text className="ml-1 text-primary font-medium">Exit</Text>
                    </TouchableOpacity>
                ),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Dashboard",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="grid-outline" size={size} color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="products"
                options={{
                    title: "Products",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="cube-outline" size={size} color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="orders"
                options={{
                    title: "Orders",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="receipt-outline" size={size} color={color} />
                    )
                }}
            />
        </Tabs>
    );
}
