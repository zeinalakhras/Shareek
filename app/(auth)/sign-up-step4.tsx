import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressBar from '@/components/ProgressBar';
import CustomButton from '@/components/CustomButton';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface StyleOption {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
}

const timeCommitmentOptions: string[] = [
    "5-10 hours/week",
    "10-20 hours/week",
    "Full-time"
];

const collaborationStyleOptions: StyleOption[] = [
    { label: "Remote", icon: "cloud-outline" },
    { label: "In-person", icon: "location-outline" },
    { label: "Hybrid", icon: "people-outline" }
];

const projectDurationOptions: string[] = [
    "Short-term",
    "Long-term"
];

const SignUpStep4 = () => {

    const previousParams = useLocalSearchParams();

    const [selectedTimeCommitment, setSelectedTimeCommitment] = useState<string>('');
    const [selectedCollaborationStyle, setSelectedCollaborationStyle] = useState<string>('');
    const [selectedProjectDuration, setSelectedProjectDuration] = useState<string>('');

    const handleContinue = () => {
        if (!selectedTimeCommitment) {
            Alert.alert('Missing Selection', 'Please select your preferred time commitment.');
            return;
        }
        if (!selectedCollaborationStyle) {
            Alert.alert('Missing Selection', 'Please select your preferred collaboration style.');
            return;
        }
        if (!selectedProjectDuration) {
            Alert.alert('Missing Selection', 'Please select your preferred project duration.');
            return;
        }

        router.push({
            pathname: '/(auth)/sign-up-step5',
            params: {
                ...previousParams,
                timeCommitment: selectedTimeCommitment,
                collaborationStyle: selectedCollaborationStyle,
                projectDuration: selectedProjectDuration,
            },
        });
    };

    return (
        <SafeAreaView className='bg-bg h-full'>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, marginTop: 15 }}>
                <View className='px-6 items-center'>
                    <ProgressBar stepCount={5} stepNumber={4} />

                    <Text className='text-3xl font-bold text-center mb-3 text-slate-900'>
                        Tell us about your project preferences
                    </Text>
                    <Text className='text-[#7a7a7a] text-base text-center mb-6'>
                        Help us match you with the right opportunities.
                    </Text>

                    <View className='w-full mb-6'>

                        {/* Time Commitment */}
                        <View className='mt-2 gap-2'>
                            <Text className='text-sm text-text-title font-bold uppercase tracking-wide mb-1'>
                                Time Commitment
                            </Text>
                            {timeCommitmentOptions.map((opt) => {
                                const isSelected = selectedTimeCommitment === opt;
                                return (
                                    <TouchableOpacity
                                        key={opt}
                                        activeOpacity={0.8}
                                        onPress={() => setSelectedTimeCommitment(opt)}
                                        className={`flex-row items-center justify-between p-4 rounded-2xl bg-white border ${isSelected ? 'border-primary-full' : 'border-transparent'
                                            }`}
                                    >
                                        <Text className={`text-base font-medium ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                                            {opt}
                                        </Text>
                                        <View
                                            className={`w-6 h-6 rounded-full items-center justify-center ${isSelected ? 'border-8 bg-white border-primary-full' : 'border-2 border-slate-300'
                                                }`}
                                        />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* Collaboration Style */}
                        <View className='mt-6 gap-2'>
                            <Text className='text-sm text-text-title font-bold uppercase tracking-wider mb-1'>
                                Collaboration Style
                            </Text>
                            <View className='flex-row justify-between gap-2'>
                                {collaborationStyleOptions.map((opt) => {
                                    const isSelected = selectedCollaborationStyle === opt.label;
                                    return (
                                        <TouchableOpacity
                                            key={opt.label}
                                            activeOpacity={0.8}
                                            onPress={() => setSelectedCollaborationStyle(opt.label)}
                                            className={`flex-1 items-center justify-center gap-2 rounded-2xl p-4 bg-white border ${isSelected ? 'border-primary-full bg-orange-50/20' : 'border-transparent'
                                                }`}
                                        >
                                            <Ionicons
                                                name={opt.icon}
                                                size={24}
                                                color={isSelected ? "#FF8C69" : "#64748b"}
                                            />
                                            <Text className={`text-sm font-semibold ${isSelected ? 'text-primary-full' : 'text-slate-700'}`}>
                                                {opt.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        {/* Project Duration */}
                        <View className='mt-6 gap-2'>
                            <Text className='text-sm text-text-title font-bold uppercase tracking-wider mb-1'>
                                Project Duration
                            </Text>
                            <View className='flex-row justify-between gap-3'>
                                {projectDurationOptions.map((opt) => {
                                    const isSelected = selectedProjectDuration === opt;
                                    return (
                                        <TouchableOpacity
                                            key={opt}
                                            activeOpacity={0.8}
                                            onPress={() => setSelectedProjectDuration(opt)}
                                            className={`flex-1 flex-row justify-center items-center gap-3 rounded-2xl p-4 bg-white border ${isSelected ? 'border-primary-full' : 'border-transparent'
                                                }`}
                                        >
                                            <View
                                                className="w-5 h-5 rounded-full"
                                                style={isSelected ? { borderWidth: 6, borderColor: '#FF8C69' } : { borderWidth: 2, borderColor: '#808080' }}
                                            />
                                            <Text className={`text-base font-medium ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
                                                {opt}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                    </View>

                    <CustomButton
                        width='100%'
                        height={52}
                        borderColor='#FF8C69'
                        bgColor='#FF8C69'
                        title='Continue'
                        titleColor='#fff'
                        handelPress={handleContinue}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignUpStep4;