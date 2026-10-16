import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth'


interface InfoCardProps {
    iconName: keyof typeof Ionicons.glyphMap;
    title: string;
    value: string | number;
}

const InfoCard: React.FC<InfoCardProps> = ({ iconName, title, value }) => {
    return (
        <View className="bg-white flex-row items-center p-3 rounded-2xl mb-3">
            <View className="bg-[#FFF0EA] p-2.5 rounded-full mr-3">
                <Ionicons name={iconName} size={18} color="#FF7F50" />
            </View>
            <View className="flex-1">
                <Text className="text-[10px] text-text-title font-bold capitalize">
                    {title}
                </Text>
                <Text className="text-xs font-light text-gray-500 mt-0.5">
                    {value}
                </Text>
            </View>
        </View>
    );
};

export const WORK_PREFERENCES = ['Remote', 'On-site', 'Hybrid'];
export const PROJECT_PREFERENCES = ['Long-term', 'Short-term'];
export const STUDY_YEARS = ['First year', 'Second year', 'Third year', 'Fourth year', 'Fifth year', 'Sixth year', 'Seventh year'];

export const pickOption = (value: string | null | undefined, options: string[], fallback: string): string =>
    options.find((option) => option.toLowerCase() === value?.toLowerCase()) ?? fallback;

export const commitmentFromHours = (hours: number | null | undefined): string =>
    hours == null ? 'Full-time' : hours <= 10 ? '5-10 hours' : hours <= 20 ? '10-20 hours' : 'Full-time';

export const formatJoinedDate = (iso: string | null | undefined): string => {
    if (!iso) return 'Not available';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return 'Not available';
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

interface PreferenceCardProps {
    label: string;
    value: string;
}

const PreferenceCard: React.FC<PreferenceCardProps> = ({ label, value }) => {
    return (
        <View className="bg-white p-4 rounded-2xl shadow-sm mb-3">
            <Text className="text-xs font-bold text-[#333] mb-2">{label}</Text>
            <View className="bg-[#EAEAEA] py-2 rounded-xl items-center">
                <Text className="text-xs font-semibold text-[#444]">{value}</Text>
            </View>
        </View>
    );
};

const additionalInfo = () => {

    const { profile } = useAuth();

    const membership = profile?.is_student
        ? (profile.university?.name || 'University Student')
        : (profile?.major || 'Member');

    const userDetails: InfoCardProps[] = [
        { iconName: 'call-outline', title: 'phone number', value: profile?.phone || 'Not added yet' },
        { iconName: 'mail-outline', title: 'E-mail', value: profile?.email || 'Not available' },
        { iconName: 'calendar-outline', title: 'Joined Date', value: formatJoinedDate(profile?.stats?.member_since) },
        { iconName: 'school-outline', title: 'University', value: profile?.university?.name || 'Not specified' },
    ];

    const workPreferences = [
        { label: 'Time commitment', value: commitmentFromHours(profile?.available_hours_per_week) },
        { label: 'Collaboration Style', value: pickOption(profile?.work_preference, WORK_PREFERENCES, 'Remote') },
        { label: 'Project Duration', value: pickOption(profile?.project_preference, PROJECT_PREFERENCES, 'Long-term') },
    ];

    const studyYearLabel = profile?.study_year != null
        ? (STUDY_YEARS[profile.study_year - 1] ?? String(profile.study_year))
        : 'Not specified';

    const academicPath = [
        { label: 'University', value: profile?.university?.name || 'Not specified' },
        { label: 'Major / Field of study', value: profile?.major || 'Not specified' },
        { label: 'Current academic year', value: studyYearLabel },
    ];


    return (
        <SafeAreaView className='bg-bg'>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/*Back Button*/}
                <View className="flex-row justify-start mt-4 mx-6">
                    <TouchableOpacity
                        className="w-10 h-10 p-2 bg-white rounded-full items-center justify-center"
                        onPress={() => { router.back() }}
                    >
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                </View>
                {/*photo && name section*/}
                <View className='items-center' style={{ gap: 15 }}>
                    {/* Plain circle — same style as the profile page. */}
                    <View className='w-32 h-32 rounded-full overflow-hidden border-2 border-primary-full'>
                        <Image
                            source={
                                profile?.profile_image
                                    ? { uri: profile.profile_image }
                                    : require('../../assets/images/profile.png')
                            }
                            className='w-full h-full'
                            resizeMode='cover'
                        />
                    </View>
                    <View>
                        <Text className='font-semibold text-2xl text-center'>{profile?.full_name || 'Your profile'}</Text>
                        <View className="bg-primary-light border border-primary-mid items-center px-4 py-1 rounded-full mt-2">
                            <Text className="text-primary-full font-medium text-xs">{membership}</Text>
                        </View>
                        <Text className="text-gray-500 text-center text-xs mt-2 font-medium tracking-wide">ID: {profile?.id ?? '—'}</Text>
                    </View>
                </View>
                {/*Personal Info*/}
                <View className="px-6 mt-6">
                    {userDetails.map((item, index) => (
                        <InfoCard
                            key={index}
                            iconName={item.iconName}
                            title={item.title}
                            value={item.value}
                        />
                    ))}
                    {/*Work Preferences*/}
                    <Text className="text-sm font-bold text-center text-[#1E1E1E] mt-6 mb-3">
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
                    {/*Academic Path*/}
                    <Text className="text-sm font-bold text-center text-[#1E1E1E] mt-6 mb-3">
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
    )
}

export default additionalInfo