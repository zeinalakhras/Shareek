import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Ionicons, AntDesign, Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SuccessScreen() {
    const router = useRouter();

    const handleGoHome = () => {
        router.replace('/(tabs)/home');
    };

    return (
        <SafeAreaView className="flex-1 bg-bg px-6 pt-6 pb-12 justify-between items-center">

            <TouchableOpacity
                onPress={handleGoHome}
                className="absolute top-14 right-6 p-2 bg-white rounded-full shadow-sm"
            >
                <AntDesign name="close" size={20} color="#1A1A1A" />
            </TouchableOpacity>
            <View className="items-center w-full flex-1 justify-center mt-12">
                <Text className="text-3xl font-bold text-text-title text-center mb-10">
                    Your project is <Text className="text-primary-full">live!</Text>
                </Text>
                <View className="w-56 h-56 rounded-full bg-primary-mid justify-center items-center mb-10">
                    <Octicons name="rocket" size={100} color="#FF8C69" />
                </View>
                <Text className="text-sm font-medium text-primary-full text-center px-4 leading-5">
                    EcoTracker is now visible to the community. Time to find your dream team!
                </Text>
                <Text className="text-sm text-secondry-text text-center px-6 mt-2 leading-5">
                    A group has been created for this project under your management.
                </Text>
            </View>
            <View className="w-full gap-3">
                <TouchableOpacity
                    className="w-full py-4 rounded-full flex-row justify-center items-center shadow-md shadow-[#FF8C69]/20"
                    style={{ backgroundColor: '#FF8C69' }}
                    activeOpacity={0.8}
                >
                    <Ionicons name="person-add-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
                    <Text className="text-white text-base font-bold">Invite Teammates</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleGoHome}
                    className="w-full bg-white py-4 rounded-full flex-row justify-center items-center border border-gray-200 shadow-sm"
                    activeOpacity={0.8}
                >
                    <Text className="text-text-title text-base font-bold">View My Project</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
}