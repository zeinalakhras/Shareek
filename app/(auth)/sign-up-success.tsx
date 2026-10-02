import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AntDesign, Octicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import { useAuthStore } from '@/store/useAuthStore';
import { useSignUpStore } from '@/store/useSignUpStore';
import { useLocalSearchParams } from 'expo-router';

const SignUpSuccess = () => {
  const user = useAuthStore((state) => state.user);
  const { formData, resetForm } = useSignUpStore();
  const { fullName } = useLocalSearchParams<{ fullName?: string }>();

  const rawName = fullName || user?.full_name || '';
  const firstName = rawName.trim() ? rawName.trim().split(' ')[0] : 'User';


  const handleFinish = () => {
    resetForm();
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView className="bg-bg h-full">
      <View className="items-center mt-8 mx-4 flex-1 justify-between pb-8">
        
        {/* Header */}
        <View className="w-full flex-row justify-center items-center relative">
          <TouchableOpacity 
            className="bg-white p-2 rounded-full absolute left-0 shadow-sm"
            onPress={handleFinish}
            activeOpacity={0.7}
          >
            <AntDesign name="close" size={18} color="black" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold uppercase tracking-widest text-slate-700">
            Success
          </Text>
        </View>

        {/* Hero Section */}
        <View className="items-center w-full px-2">
          <View className="w-64 h-64 my-8 items-center justify-center bg-primary-light rounded-full">
            <Octicons name="rocket" size={100} color="#FF8C69" />
          </View>

          <Text className="font-semibold text-3xl text-center text-slate-800" numberOfLines={1}>
            You're all set, <Text className="text-primary-full">{firstName}!</Text>
          </Text>
          
          <Text className="font-light text-base text-center my-4 mx-4 text-slate-500 leading-6">
            Your profile is ready. Now let's find some amazing teammates and build something great together.
          </Text>
        </View>

        {/* Action Button */}
        <CustomButton 
          width="90%" 
          height={50} 
          borderColor="#FF8C69" 
          bgColor="#FF8C69" 
          title="Explore Projects" 
          titleColor="#fff" 
          handelPress={handleFinish}
        />

      </View>
    </SafeAreaView>
  );
};

export default SignUpSuccess;