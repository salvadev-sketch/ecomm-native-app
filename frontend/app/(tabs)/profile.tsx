import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { onAuthStateChanged, signOut, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import { COLORS, PROFILE_MENU } from "@/constants";

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setChecking(false);
        });
        return unsub;
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
    };

    if (checking) return <SafeAreaView className="flex-1 bg-background" edges={["top"]} />;

    if (!user) {
        return (
            <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
                <Text className="text-center text-base font-medium text-primary py-3">Profile</Text>
                <View className="flex-1 items-center px-8 pt-16">
                    <View className="w-20 h-20 rounded-full bg-surface items-center justify-center mb-4">
                        <Ionicons name="person-outline" size={36} color={COLORS.secondary} />
                    </View>
                    <Text className="text-base font-medium text-primary mb-1">Guest User</Text>
                    <Text className="text-xs text-secondary text-center mb-6">
                        Log in to view your profile, orders, and addresses.
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push("/auth/sign-in")}
                        className="bg-primary rounded-full px-8 py-3"
                    >
                        <Text className="text-white text-sm font-medium">Login / Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
            <Text className="text-center text-base font-medium text-primary py-3">Profile</Text>
            <View className="items-center py-4">
                {user.photoURL ? (
                    <Image source={{ uri: user.photoURL }} className="w-16 h-16 rounded-full mb-2" />
                ) : (
                    <View className="w-16 h-16 rounded-full bg-surface items-center justify-center mb-2">
                        <Ionicons name="person-outline" size={28} color={COLORS.secondary} />
                    </View>
                )}
                <Text className="text-sm font-medium text-primary">{user.displayName ?? "User"}</Text>
                <Text className="text-xs text-secondary mb-2">{user.email}</Text>
            </View>

            <View className="px-4">
                {PROFILE_MENU.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => router.push(item.route as any)}
                        className="flex-row items-center justify-between py-3 border-b border-border"
                    >
                        <View className="flex-row items-center gap-3">
                            <Ionicons name={item.icon as any} size={18} color={COLORS.primary} />
                            <Text className="text-sm text-primary">{item.title}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={COLORS.secondary} />
                    </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={handleLogout} className="py-4">
                    <Text className="text-sm text-accent">Log out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
