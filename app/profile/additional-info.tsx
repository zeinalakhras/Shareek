import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Shadow } from 'react-native-shadow-2'
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';


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

const userDetails: InfoCardProps[] = [
    { iconName: 'call-outline', title: 'phone number', value: '+963 930000000' },
    { iconName: 'mail-outline', title: 'E-mail', value: 'greenInd@gamil.com' },
    { iconName: 'location-outline', title: 'Location', value: 'Homs , syria' },
    { iconName: 'calendar-outline', title: 'Joined Date', value: '2 FEB 2026' },
    { iconName: 'school-outline', title: 'University', value: 'Homs' },
];

interface UserProfileData {
    timeCommitment: string;
    collaborationStyle: string;
    projectDuration: string;
    university: string;
    major: string;
    academicYear: string;
}

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

    const [userData, setUserData] = useState<UserProfileData>({
        timeCommitment: 'Full-time',
        collaborationStyle: 'Remote',
        projectDuration: 'Long-term',
        university: 'Damascus University',
        major: 'IT-engineering',
        academicYear: 'third year',
    });

    const workPreferences = [
        { label: 'Time commitment', value: userData.timeCommitment },
        { label: 'Collaboration Style', value: userData.collaborationStyle },
        { label: 'Project Duration', value: userData.projectDuration },
    ];

    const academicPath = [
        { label: 'University', value: userData.university },
        { label: 'Major / Field of study', value: userData.major },
        { label: 'Current academic year', value: userData.academicYear },
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
                    <Shadow
                        style={{ borderRadius: 64 }}
                        distance={10}
                        startColor={'#FF8C69'}
                        endColor={'rgba(255,140,105, 0.1)'}
                        offset={[0, 0]}
                    >
                        <View className='w-32 h-32 rounded-full overflow-hidden'>
                            <Image
                                source={require('../../assets/images/profile.png')}
                                className='w-full h-full'
                                resizeMode='cover'
                            />
                        </View>
                    </Shadow>
                    <View>
                        <Text className='font-semibold text-2xl text-center'>Nasser kamali</Text>
                        <View className="bg-primary-light border border-primary-mid items-center px-4 py-1 rounded-full mt-2">
                            <Text className="text-primary-full font-medium text-xs">University Student</Text>
                        </View>
                        <Text className="text-gray-500 text-center text-xs mt-2 font-medium tracking-wide">ID: 1299001</Text>
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