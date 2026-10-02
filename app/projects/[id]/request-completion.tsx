import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RequestCompletionScreen() {
    const router = useRouter();

    const [githubUrl, setGithubUrl] = useState('');
    const [demoUrl, setDemoUrl] = useState('');
    const [completionNotes, setCompletionNotes] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        if (!completionNotes.trim()) {
            Alert.alert('Required Field', 'Please provide a brief summary of the final deliverables.');
            return;
        }

        if (!isConfirmed) {
            Alert.alert('Confirmation Required', 'Please confirm that all tasks and deliverables are finalized.');
            return;
        }

        setIsSubmitting(true);

        // Simulate API Call
        setTimeout(() => {
            setIsSubmitting(false);
            Alert.alert(
                'Success 🎉',
                'Your completion request has been submitted successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back(),
                    },
                ]
            );
        }, 1200);
    };

    return (
        <SafeAreaView className="flex-1 bg-bg">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Header */}
                <View className="p-4 px-4 flex-row items-center justify-between">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-white items-center justify-center"
                    >
                        <Ionicons name="arrow-back" size={20} color="black" />
                    </TouchableOpacity>
                    <Text className="text-lg font-bold text-gray-900">Request Completion</Text>
                    <View className="w-10" />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                >
                    {/* Info Banner */}
                    <View className="bg-primary-light border border-primary-full rounded-2xl p-4 mb-6 flex-row items-start">
                        <View className="w-8 h-8 bg-primary-mid items-center justify-center rounded-full mr-2">
                            <Ionicons name="checkmark-done" size={18} color="#FF8C69" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-sm font-bold text-orange-950 mb-1">
                                Finalizing Your Project
                            </Text>
                            <Text className="text-xs leading-5">
                                Submitting this request will notify all team members and update the project status to Completed upon approval.
                            </Text>
                        </View>
                    </View>

                    {/* Deliverables Form */}
                    <View className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
                        <Text className="text-base font-bold text-gray-900 mb-4">
                            Project Deliverables
                        </Text>

                        {/* GitHub / Repository Link */}
                        <View className='mb-4'>
                            <Text className="text-xs font-semibold text-gray-700 mb-1.5">
                                Source Code Repository (GitHub / GitLab)
                            </Text>
                            <View className="flex-row items-center bg-gray-50 rounded-xl px-3 border border-gray-200">
                                <Ionicons name="logo-github" size={18} color="#6B7280" />
                                <TextInput
                                    value={githubUrl}
                                    onChangeText={setGithubUrl}
                                    placeholder="https://github.com/username/project"
                                    placeholderTextColor="#9CA3AF"
                                    className="flex-1 py-3 px-2 text-sm text-gray-800"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        {/* Live Demo / Website Link */}
                        <View className='mb-4'>
                            <Text className="text-xs font-semibold text-gray-700 mb-1.5">
                                Live Demo / Product URL (Optional)
                            </Text>
                            <View className="flex-row items-center bg-gray-50 rounded-xl px-3 border border-gray-200">
                                <Ionicons name="globe-outline" size={18} color="#6B7280" />
                                <TextInput
                                    value={demoUrl}
                                    onChangeText={setDemoUrl}
                                    placeholder="https://myproject.com"
                                    placeholderTextColor="#9CA3AF"
                                    className="flex-1 py-3 px-2 text-sm text-gray-800"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        {/* Completion Notes / Summary */}
                        <View className='mb-4'>
                            <Text className="text-xs font-semibold text-gray-700 mb-1.5">
                                Final Summary & Key Achievements 
                            </Text>
                            <TextInput
                                value={completionNotes}
                                onChangeText={setCompletionNotes}
                                placeholder="Describe what was accomplished, major features completed, and any notes for reviewers or team members..."
                                placeholderTextColor="#9CA3AF"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-sm text-gray-800 min-h-[110px]"
                            />
                        </View>

                        {/* Confirmation Checkbox */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setIsConfirmed(!isConfirmed)}
                            className="flex-row items-center gap-2 pt-2"
                        >
                            <View
                                className="w-5 h-5 rounded border items-center justify-center"
                                style={{
                                    backgroundColor: isConfirmed ? '#FF8C69' : '#FFFFFF',
                                    borderColor: isConfirmed ? '#FF8C69' : '#D1D5DB',
                                }}
                            >
                                {isConfirmed && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                            </View>
                            <Text className="text-xs text-gray-600 flex-1 leading-4">
                                I confirm that all core milestones are completed and team contributions have been verified.
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Action Button */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                        className="mt-6 py-4 rounded-2xl items-center justify-center"
                        style={isConfirmed && completionNotes.trim() ? { backgroundColor: '#FF8C69' } : { backgroundColor: 'rgba(255,140,105, 0.1)', borderWidth: 1, borderColor: '#FF8C69' }}
                    >
                        <Text className="text-white font-bold text-base" style={isConfirmed && completionNotes.trim() ? { color: "#fff" } : { color: "#FF8C69" }}>
                            {isSubmitting ? 'Submitting Request...' : 'Submit Completion Request'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}