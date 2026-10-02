import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import ProjectCard from '@/components/ProjectCard';
import { MOCK_DRAFTS } from '@/MockData/projectsMock2';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DraftsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-bg">

            {/* Header */}
            <View className="flex-row items-center px-6 py-4 border-b border-gray-100/50">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="p-2 -ml-2 rounded-full"
                >
                    <Feather name="arrow-left" size={24} color="#2D3748" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-[#2D3748] ml-2">My Drafts</Text>
            </View>

            <FlatList
                data={MOCK_DRAFTS}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={
                    <View className="items-center justify-center py-16 px-4">
                        <Ionicons name="document-text-outline" size={56} color="#9CA3AF" />
                        <Text className="text-gray-800 font-bold text-base mt-3">No saved drafts.</Text>
                        <Text className="text-gray-500 text-xs text-center mt-1">When you start creating a project and save it as a draft, you will find it here to complete later.</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View className="relative mb-3">
                        <ProjectCard
                            project={item}
                        />
                    </View>
                )}
            />
        </SafeAreaView>
    );
}
