import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AntDesign, Octicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import { useAuth } from '@/hooks/useAuth';
import { useSignUpStore } from '@/store/useSignUpStore';

const Success = () => {
  const { user, completeSetup } = useAuth();
  const fullName = useSignUpStore((state) => state.formData.fullName);
  const resetForm = useSignUpStore((state) => state.resetForm);

  const rawName = user?.full_name || fullName || '';
  const firstName = rawName.trim() ? rawName.trim().split(' ')[0] : 'there';

  const handleContinue = () => {
    router.replace('/(setup)/step2');
  };

  const handleSkip = () => {
    resetForm();
    completeSetup();
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView className="bg-bg h-full">
      <View className="items-center mt-8 mx-4 flex-1 justify-between pb-8">

        {/* Header */}
        <View className="w-full flex-row justify-center items-center relative">
          <TouchableOpacity
            className="bg-white p-2 rounded-full absolute left-0 shadow-sm"
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <AntDesign name="close" size={16} color="#1A1A1A" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold uppercase tracking-widest text-slate-700">
            Success
          </Text>
        </View>

        {/* Hero Section */}
        <View className="items-center w-full px-2">
          <View className="w-64 h-64 my-8 items-center justify-center bg-primary-light rounded-full">
            <Octicons name="check-circle" size={100} color="#FF8C69" />
          </View>

          <Text className="font-semibold text-3xl text-center text-slate-800">
            Account Created!
          </Text>

          <Text className="font-light text-base text-center my-4 mx-4 text-slate-500 leading-6">
            Nice work, {firstName}! Your email is verified and you are signed in. Let's finish your
            profile so teammates know what you build.
          </Text>
        </View>

        {/* Action Button */}
        <CustomButton
          width="90%"
          height={50}
          borderColor="#FF8C69"
          bgColor="#FF8C69"
          title="Continue"
          titleColor="#fff"
          handelPress={handleContinue}
        />

      </View>
    </SafeAreaView>
  );
};

export default Success;
