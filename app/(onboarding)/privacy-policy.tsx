import React from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyPolicyScreen() {
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
        <Text className="text-xl font-bold text-[#2D3748] ml-2">Privacy Policy</Text>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
        <Text className="text-xs text-secondry-text mb-4">Last updated: October 2026</Text>

        <Text className="text-base font-bold text-text-title mb-2">1. Introduction</Text>
        <Text className="text-sm text-secondry-text leading-relaxed mb-4">
          Welcome to Shareek. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our application and tell you about your privacy rights.
        </Text>

        <Text className="text-base font-bold text-text-title mb-2">2. Information We Collect</Text>
        <Text className="text-sm text-secondry-text leading-relaxed mb-4">
          We may collect, use, store and transfer different kinds of personal data about you which we have grouped together: Identity Data (such as name and username), Contact Data (such as email address), and Technical Data (such as device information).
        </Text>

        <Text className="text-base font-bold text-text-title mb-2">3. How We Use Your Data</Text>
        <Text className="text-sm text-secondry-text leading-relaxed mb-4">
          We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to provide and maintain our service, manage your account, and improve user experience on Shareek.
        </Text>

        <Text className="text-base font-bold text-text-title mb-2">4. Data Security</Text>
        <Text className="text-sm text-secondry-text leading-relaxed mb-4">
          We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way.
        </Text>

        <Text className="text-base font-bold text-text-title mb-2">5. Data Retention</Text>
        <Text className="text-sm text-secondry-text leading-relaxed mb-4">
          We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
        </Text>

        <Text className="text-base font-bold text-text-title mb-2">6. Contact Us</Text>
        <Text className="text-sm text-secondry-text leading-relaxed mb-8">
          If you have any questions about this Privacy Policy, please contact us through the support section within the Shareek application.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}