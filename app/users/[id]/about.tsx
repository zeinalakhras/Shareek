import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { getMockUserProfileResponse } from '@/MockData/projectsMock2';
import * as Clipboard from 'expo-clipboard';


interface InfoCardProps {
    iconName: keyof typeof Ionicons.glyphMap;
    title: string;
    value?: string | number | null;
    onPress?: () => void;
    isExternal?: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({ iconName, title, value, onPress, isExternal }) => {
    const [copied, setCopied] = useState(false);

    if (!value) return null;

    const handlePress = async () => {
        if (isExternal) {
            await Clipboard.setStringAsync(value.toString());
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }

        if (onPress) {
            onPress();
        }
    };

    const isInteractive = Boolean(onPress || isExternal);

    const CardContent = (
        <View className="bg-white flex-row items-center p-3 rounded-2xl mb-3 border border-slate-100 shadow-sm">
            <View className="bg-primary-light p-2.5 mr-3 rounded-full">
                <Ionicons name={iconName} size={18} color="#FF8C69" />
            </View>
            <View className="flex-1">
                <Text className="text-xs text-text-title font-bold capitalize">
                    {title}
                </Text>
                <Text className="text-xs font-medium text-gray-500 mt-0.5" numberOfLines={1}>
                    {value}
                </Text>

            </View>
            {isExternal && (
                <Ionicons
                    name={copied ? "checkmark-circle" : "copy-outline"}
                    size={20}
                    color={copied ? "#10B981" : "#FF8C69"}
                />
            )}
        </View>
    );

    if (isInteractive) {
        return (
            <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
                {CardContent}
            </TouchableOpacity>
        );
    }

    return CardContent;
};

const PreferenceCard: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => {
    return (
        <View className="bg-white p-4 rounded-2xl shadow-sm mb-3 border border-slate-100">
            <Text className="text-xs font-bold text-[#333] mb-2">{label}</Text>
            <View className="bg-[#EAEAEA] py-2 rounded-xl items-center">
                <Text className="text-xs font-semibold text-[#444] capitalize">
                    {value || 'Not specified'}
                </Text>
            </View>
        </View>
    );
};

export default function UserAboutScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const response = getMockUserProfileResponse(id as string);
    const user = response?.data;

    const workPreferences = [
        {
            label: 'Time Commitment',
            value: user?.time_commitment
        },
        {
            label: 'Collaboration Style',
            value: user?.collaboration_style ? user.collaboration_style.replace('_', '-') : null
        },
        {
            label: 'Project Duration',
            value: user?.project_duration
        },
    ];

    const academicPath = [
        {
            label: 'University',
            value: user?.university?.name || (user?.is_student ? 'Not specified' : 'N/A')
        },
        {
            label: 'Major / Field of study',
            value: user?.major || 'Not specified'
        },
        {
            label: 'Current academic year',
            value: user?.is_student && user?.study_year ? `Year ${user.study_year}` : 'N/A'
        },
    ];


    return (
        <SafeAreaView className="flex-1 bg-bg">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40, paddingTop: 60 }}
            >

                {/* Back Button */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="p-2 bg-white rounded-full shadow-sm border border-gray-50 absolute top-4 left-4 z-10"
                >
                    <Feather name="arrow-left" size={20} color="#1A1A1A" />
                </TouchableOpacity>

                {/* Photo && Name Section */}
                <View className='items-center mb-6' style={{ gap: 15 }}>
                    <Shadow
                        style={{ borderRadius: 64 }}
                        distance={10}
                        startColor={'#FF8C69'}
                        endColor={'rgba(255,140,105, 0.1)'}
                        offset={[0, 0]}
                    >
                        <View className='w-32 h-32 rounded-full overflow-hidden bg-slate-100'>
                            <Image
                                source={
                                    user.profile_image
                                        ? { uri: user.profile_image }
                                        : require('../../../assets/images/profile.png')
                                }
                                className='w-full h-full'
                                resizeMode='cover'
                            />
                        </View>
                    </Shadow>

                    <View className="items-center">
                        <Text className='font-semibold text-2xl text-center text-text-title'>
                            {user.full_name}
                        </Text>

                        {/* University / Student Status */}
                        <View className="bg-primary-light border border-primary-mid items-center px-4 py-1 rounded-full mt-2">
                            <Text className="text-primary-full font-medium text-xs">
                                {user.is_student ? 'Student' : 'Professional'}
                            </Text>
                        </View>

                        <Text className="text-gray-500 text-center text-xs mt-2 font-medium tracking-wide">
                            ID: {user.id}
                        </Text>
                    </View>
                </View>

                {/* Details & Sections */}
                <View className="px-6">

                    {/* Contact & General Info */}
                    {(user?.phone_number || user?.email || user?.location || user?.created_at || user?.university?.name) && (
                        <>
                            <Text className="text-sm font-bold text-center text-text-title mt-4 mb-3">
                                General Info & Contact
                            </Text>

                            {user?.telegram_username && (
                                <InfoCard
                                    iconName="paper-plane-outline"
                                    title="Telegram"
                                    value={user.telegram_username}
                                    isExternal
                                />
                            )}

                            <InfoCard
                                iconName="mail-outline"
                                title="Email"
                                value={user?.email}
                                isExternal
                            />

                            <InfoCard
                                iconName="call-outline"
                                title="Phone Number"
                                value={user?.phone_number}
                                isExternal
                            />
                            
                            <InfoCard
                                iconName="location-outline"
                                title="Location"
                                value={user?.location}
                            />

                            <InfoCard
                                iconName="calendar-outline"
                                title="Joined Date"
                                value={
                                    user?.created_at
                                        ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                        : null
                                }
                            />

                            <InfoCard
                                iconName="school-outline"
                                title="University"
                                value={user?.university?.name}
                            />

                        </>
                    )}

                    {/* Work Preferences */}
                    <Text className="text-sm font-bold text-center text-text-title mt-6 mb-3">
                        Work Preferences
                    </Text>
                    <View>
                        {workPreferences.map((item, index) => (
                            <PreferenceCard
                                key={`work-${index}`}
                                label={item.label}
                                value={item.value}
                            />
                        ))}
                    </View>

                    {/* Academic Path */}
                    <Text className="text-sm font-bold text-center text-text-title mt-6 mb-3">
                        Academic Path
                    </Text>
                    <View className="mb-12">
                        {academicPath.map((item, index) => (
                            <PreferenceCard
                                key={`academic-${index}`}
                                label={item.label}
                                value={item.value}
                            />
                        ))}
                    </View>

                </View>

            </ScrollView>
        </SafeAreaView>
    );
}