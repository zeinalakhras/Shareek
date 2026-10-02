import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Switch, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton';

export default function SettingsScreen() {
    const router = useRouter();

    const [projectMatches, setProjectMatches] = useState(true);
    const [messageAlerts, setMessageAlerts] = useState(true);
    const [appUpdates, setAppUpdates] = useState(false);

    const [profileVisibility, setProfileVisibility] = useState(true);
    const [universityStatus, setUniversityStatus] = useState(true);
    const [hideAbout, setHideAbout] = useState(false);
    const [hidePhone, setHidePhone] = useState(true);
    const [hideLocation, setHideLocation] = useState(true);
    const [hideEmail, setHideEmail] = useState(false);

    const renderSwitchRow = (title: string, subTitle: string, value: boolean, onValueChange: (val: boolean) => void) => (
        <View className="flex-row items-center justify-between py-3">
            <View className="flex-1 pr-4">
                <Text className="text-sm font-semibold text-text-title">{title}</Text>
                <Text className="text-xs text-[#7A7A7A] mt-0.5">{subTitle}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: '#9A9594', true: '#FF8C69' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#D1D5DB"
                style={Platform.OS === 'ios' ? { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] } : {}}
            />
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#FAF6F4]">
            {/* Header */}
            <View className="flex-row items-center px-6 py-4 border-b border-gray-100/50">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="p-2 -ml-2 rounded-full"
                >
                    <Feather name="arrow-left" size={24} color="#2D3748" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-[#2D3748] ml-2">Settings</Text>
            </View>

            {/* Content */}
            <ScrollView
                className="flex-1 px-5"
                showsVerticalScrollIndicator={false}>
                {/* Profile Section */}
                <View className="items-center my-6">
                    <View className="relative">
                        <Image
                            source={require('../../assets/images/profile.png')}
                            className="w-24 h-24 rounded-full border-2 border-primary-full shadow-sm"
                        />
                        <TouchableOpacity className="absolute bottom-0 right-0 bg-primary-full p-2 rounded-full border-2 border-white shadow-md">
                            <Feather name="edit-2" size={14} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-xl font-bold text-text-title mt-3">Zein Al Akhras</Text>
                    <Text className="text-xs text-[#7A7A7A] mt-1">zein.zein.al.akhras@gmail.com</Text>
                </View>

                {/* Account Settings Section */}
                <View className="bg-white rounded-3xl p-4 mb-4 shadow-sm border border-gray-100/30">
                    <View className="flex-row items-center mb-2">
                        <Feather name="user" size={16} color="#FF8C69" />
                        <Text className="text-xs font-bold text-primary-full uppercase tracking-wider ml-2">Account Settings</Text>
                    </View>

                    <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-50">
                        <Text className="text-sm font-semibold text-text-title">Edit profile</Text>
                        <Feather name="chevron-right" size={16} color="#A38F85" />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-50">
                        <Text className="text-sm font-semibold text-text-title">Change email</Text>
                        <Feather name="chevron-right" size={16} color="#A38F85" />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center justify-between py-3">
                        <Text className="text-sm font-semibold text-text-title">Change password</Text>
                        <Feather name="chevron-right" size={16} color="#A38F85" />
                    </TouchableOpacity>
                </View>

                {/* Notifications Section */}
                <View className="bg-white rounded-3xl p-4 mb-4 shadow-sm border border-gray-100/30">
                    <View className="flex-row items-center mb-2">
                        <Feather name="bell" size={16} color="#FF8C69" />
                        <Text className="text-xs font-bold text-primary-full uppercase tracking-wider ml-2">Notifications</Text>
                    </View>
                    {renderSwitchRow("New project matches", "Get notified when projects fit your skills", projectMatches, setProjectMatches)}
                    <View className="h-[1px] bg-gray-50" />
                    {renderSwitchRow("Message alerts", "Instant notification for new chats", messageAlerts, setMessageAlerts)}
                    <View className="h-[1px] bg-gray-50" />
                    {renderSwitchRow("Application updates", "Stay informed about your active requests", appUpdates, setAppUpdates)}
                </View>

                {/* Privacy Section */}
                <View className="bg-white rounded-3xl p-4 mb-4 shadow-sm border border-gray-100/30">
                    <View className="flex-row items-center mb-2">
                        <Feather name="lock" size={16} color="#FF8C69" />
                        <Text className="text-xs font-bold text-primary-full uppercase tracking-wider ml-2">Privacy</Text>
                    </View>
                    {renderSwitchRow("Profile visibility", "Allow others to find your profile", profileVisibility, setProfileVisibility)}
                    <View className="h-[1px] bg-gray-50" />
                    {renderSwitchRow("University verification status", "Show your verified student badge", universityStatus, setUniversityStatus)}
                    <View className="h-[1px] bg-gray-50" />
                    {renderSwitchRow("Hide About section", "", hideAbout, setHideAbout)}
                    <View className="h-[1px] bg-gray-50" />
                    {renderSwitchRow("Hide Phone number", "", hidePhone, setHidePhone)}
                    <View className="h-[1px] bg-gray-50" />
                    {renderSwitchRow("Hide Location", "", hideLocation, setHideLocation)}
                    <View className="h-[1px] bg-gray-50" />
                    {renderSwitchRow("Hide Email", "", hideEmail, setHideEmail)}
                </View>

                {/* About Section */}
                <View className="bg-white rounded-3xl p-4 mb-6 shadow-sm border border-gray-100/30">
                    <View className="flex-row items-center mb-2">
                        <Feather name="info" size={16} color="#FF8C69" />
                        <Text className="text-xs font-bold text-primary-full uppercase tracking-wider ml-2">About</Text>
                    </View>

                    <View className="flex-row items-center justify-between py-3 border-b border-gray-50">
                        <Text className="text-sm font-semibold text-text-title">Version info</Text>
                        <Text className="text-sm font-bold text-[#D4AF37]">1.0.0 (Stable)</Text>
                    </View>

                    <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-50">
                        <Text className="text-sm font-semibold text-text-title">Terms of service</Text>
                        <Feather name="external-link" size={14} color="#A38F85" />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center justify-between py-3">
                        <Text className="text-sm font-semibold text-text-title">Privacy policy</Text>
                        <Feather name="external-link" size={14} color="#A38F85" />
                    </TouchableOpacity>
                </View>

                {/* LogOut & Delete Account */}
                <View className="gap-3 pb-12">
                    {/* Log Out Button*/}
                    <TouchableOpacity className="w-full py-4 bg-transparent border border-[#4A5568] rounded-2xl flex-row justify-center items-center">
                        <Text className="text-base font-bold text-[#4A5568] mr-2">Log Out</Text>
                        <Feather name="log-out" size={18} color="#4A5568" />
                    </TouchableOpacity>

                    {/* Delete Account Button */}
                    <CustomButton width='100%' borderColor='#dc2626' height={50} bgColor='#fef2f2' title="Delete Account" titleColor='#dc2626' handelPress={() => { }} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}