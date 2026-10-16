import React from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsOfServiceScreen() {
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
                <Text className="text-xl font-bold text-[#2D3748] ml-2">Terms of Service</Text>
            </View>

            {/* Content */}
            <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
                <Text className="text-xs text-secondry-text mb-4">Last updated: October 2026</Text>

                <Text className="text-base font-bold text-text-title mb-2">1. Acceptance of Terms</Text>
                <Text className="text-sm text-secondry-text leading-relaxed mb-4">
                    Welcome to Shareek. By accessing or using our mobile application, you agree to be bound by these Terms of Service. If you do not agree to all these terms, please do not use our application or services.
                </Text>

                <Text className="text-base font-bold text-text-title mb-2">2. User Accounts</Text>
                <Text className="text-sm text-secondry-text leading-relaxed mb-4">
                    When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.
                </Text>

                <Text className="text-base font-bold text-text-title mb-2">3. Intellectual Property</Text>
                <Text className="text-sm text-secondry-text leading-relaxed mb-4">
                    The Service and its original content, features, and functionality are and will remain the exclusive property of Shareek and its licensors. The service is protected by copyright, trademark, and other laws.
                </Text>

                <Text className="text-base font-bold text-text-title mb-2">4. User Conduct</Text>
                <Text className="text-sm text-secondry-text leading-relaxed mb-4">
                    You agree not to use the app to post or transmit any material that is defamatory, harmful, abusive, harassing, or violates the rights of any third party. We reserve the right to suspend or terminate accounts that violate these rules.
                </Text>

                <Text className="text-base font-bold text-text-title mb-2">5. Limitation of Liability</Text>
                <Text className="text-sm text-secondry-text leading-relaxed mb-4">
                    In no event shall Shareek, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
                </Text>

                <Text className="text-base font-bold text-text-title mb-2">6. Changes to Terms</Text>
                <Text className="text-sm text-secondry-text leading-relaxed mb-4">
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide notice prior to any new terms taking effect.
                </Text>

                <Text className="text-base font-bold text-text-title mb-2">7. Contact Us</Text>
                <Text className="text-sm text-secondry-text leading-relaxed mb-8">
                    If you have any questions about these Terms, please contact us through the support section within the Shareek application.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}