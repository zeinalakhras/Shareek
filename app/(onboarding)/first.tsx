import React from 'react';
import { View, Text, Image, Pressable, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingFirst() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-bg px-6 justify-between py-12">
      
      <View className="flex-1 justify-center items-center">
        <Image 
          source={require('../../assets/images/programing.png')} 
          className="w-52 h-52 mb-8"
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-gray-900 text-center">
          Find your perfect <Text className='text-primary-full'>partner</Text> for your tech project
        </Text>
        <Text className="text-gray-500 text-center mt-4 px-4 leading-6">
          Connect with talented developers and students to build amazing hackathon projects or startup MVPs together.
        </Text>
      </View>

      <View className="flex-row justify-center gap-2 space-x-2 mb-5">
        <View className="w-3 h-3 rounded-full bg-primary-full" /> 
        <View className="w-3 h-3 rounded-full bg-gray-300" />
        <View className="w-3 h-3 rounded-full bg-gray-300" />
      </View>

      <View className="flex-row justify-center items-center w-full">
        <TouchableOpacity 
          onPress={() => router.push('/(onboarding)/second')} 
          className="bg-primary-mid px-20 py-4 rounded-2xl border-2 border-primary-full"
        >
          <Text className="text-black font-bold text-lg"> Next </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}
