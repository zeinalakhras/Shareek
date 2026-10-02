import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, FlatList, } from 'react-native';
import { Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';
import { getMockUserProfileResponse, mockAllProjectsResponse } from '../../../MockData/projectsMock2';
import ProjectCard from '@/components/ProjectCard';

const SKILL_DOT_COLORS = ['#FF8C69', '#38BDF8', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'];

export default function UserProfileScreen() {

    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const user = useMemo(() => {
        const response = getMockUserProfileResponse(id as string);
        return response.data;
    }, [id]);

    const completedProjects = user.completed_projects.flatMap(projectId => {
        const project = mockAllProjectsResponse.data.items.find(p => p.id === projectId);
        return project ? [project] : [];
    });

    return (
        <SafeAreaView className="flex-1 bg-bg">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: 10 }}
            >
                {/* Back Button */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="p-2 bg-white rounded-full shadow-sm border border-gray-50 absolute top-4 left-4 z-10"
                >
                    <Feather name="arrow-left" size={20} color="#1A1A1A" />
                </TouchableOpacity>

                {/* Photo && Name Section */}
                <View className='items-center p-8' style={{ gap: 15 }}>
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
                        {user.is_student && (
                            <View className="bg-primary-light border border-primary-mid items-center px-4 py-1 rounded-full mt-2">
                                <Text className="text-primary-full font-medium text-xs">
                                    {user.university?.name || 'University Student'}
                                </Text>
                            </View>
                        )}

                        <Text className="text-gray-500 text-center text-xs mt-2 font-medium tracking-wide">
                            ID: {user.id}
                        </Text>
                    </View>
                </View>

                {/* User Stats Overview */}
                <View className="flex-row justify-around bg-white rounded-2xl p-4 mb-6 shadow-sm border border-primary-mid">
                    <View className="items-center">
                        <Text className="text-xs font-medium text-primary-full">Stars</Text>
                        <Text className="text-lg font-bold text-text-title">{user.stats.stars_received}</Text>
                    </View>
                    <View className="w-[1px] h-full bg-slate-100" />
                    <View className="items-center">
                        <Text className="text-xs font-medium text-primary-full">Projects</Text>
                        <Text className="text-lg font-bold text-text-title">{user.stats.projects_count}</Text>
                    </View>
                    <View className="w-[1px] h-full bg-slate-100" />
                    <View className="items-center">
                        <Text className="text-xs font-medium text-primary-full">Collabs</Text>
                        <Text className="text-lg font-bold text-text-title">{user.stats.collaborations_count}</Text>
                    </View>
                </View>

                {/* Bio Section */}
                <View className="mb-6">
                    <Text className="text-base font-bold text-text-title mb-2">Bio</Text>
                    <Text className="text-sm text-gray-600 leading-6">{user.bio}</Text>
                </View>

                {/* Skills Section */}
                {user.skills && user.skills.length > 0 && (
                    <View className="mb-6">
                        <Text className="text-base font-bold text-text-title tracking-wider mb-3">
                            Skills
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                            {user.skills.map((skill, index) => (
                                <View
                                    key={skill.id || index}
                                    className="flex-row items-center bg-white px-4 py-2.5 rounded-full mr-2.5 border border-slate-100 shadow-sm"
                                >
                                    <View
                                        style={{ backgroundColor: SKILL_DOT_COLORS[index % SKILL_DOT_COLORS.length] }}
                                        className="w-2.5 h-2.5 rounded-full mr-2"
                                    />
                                    <Text className="text-xs font-bold text-text-title">{skill.name}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* External Links Section */}
                <View className="mb-6">
                    <Text className="text-base font-bold text-text-title mb-3">Links & Profiles</Text>
                    <View className="gap-3">

                        {/* GitHub */}
                        {user.github_url && (
                            <TouchableOpacity
                                className="flex-1 bg-white rounded-2xl p-2 flex-row items-center shadow-sm border border-slate-100"
                            >
                                <View className="w-9 h-9 rounded-xl justify-center items-center mr-2">
                                    <Feather name="code" size={18} color="#FF8C69" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs font-semibold text-slate-500 mt-0.5" numberOfLines={1}>{user.github_url}</Text>
                                </View>
                                <Feather name="external-link" size={18} color="#FF8C69" />
                            </TouchableOpacity>
                        )}

                        {/* Portfolio */}
                        {user.website_url && (
                            <TouchableOpacity
                                className="flex-1 bg-white rounded-2xl p-2 flex-row items-center shadow-sm border border-slate-100"
                            >
                                <View className="w-9 h-9 rounded-xl justify-center items-center mr-2">
                                    <Feather name="globe" size={18} color="#FF8C69" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs font-semibold text-slate-500 mt-0.5" numberOfLines={1}>{user.website_url}</Text>
                                </View>
                                <Feather name="external-link" size={18} color="#FF8C69" />
                            </TouchableOpacity>
                        )}

                        {/* LinkedIn */}
                        {user.linkedin_url && (
                            <TouchableOpacity
                                className="flex-1 bg-white rounded-2xl p-2 flex-row items-center shadow-sm border border-slate-100"
                            >
                                <View className="w-9 h-9 rounded-xl justify-center items-center mr-2">
                                    <FontAwesome5 name="linkedin" size={18} color="#FF8C69" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs font-semibold text-slate-500 mt-0.5" numberOfLines={1}>{user.linkedin_url}</Text>
                                </View>
                                <Feather name="external-link" size={18} color="#FF8C69" />
                            </TouchableOpacity>
                        )}

                    </View>
                </View>

                {/* Contact Section */}
                <View className="mb-6">
                    <TouchableOpacity
                        onPress={() => { router.push(`/users/${id}/about`) }}
                        className="flex-row items-center justify-between bg-primary-full/20 border border-primary-full rounded-3xl px-5 py-4 active:opacity-90">
                        <View className="flex-row items-center">
                            <Feather name="info" size={20} color="#FF8C69" />
                            <Text className="text-primary-full font-bold text-base ml-3">About me</Text>
                        </View>
                        <Feather name="arrow-right" size={20} color="#FF8C69" />
                    </TouchableOpacity>
                </View>

                {/* Completed Projects */}
                {completedProjects.length > 0 && (
                    <View className="mb-6">
                        <Text className="text-base font-bold text-text-title mb-3">Completed Projects</Text>
                        <View>
                            {completedProjects.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </View>
                    </View>
                )}
                {completedProjects.length === 0 && (
                    <View className="items-center justify-center py-10 px-4 bg-gray-50 rounded-2xl border border-dashed border-primary-full mb-6">
                        <Ionicons name="folder-open-outline" size={48} color="#FF8C69" />
                        <Text className="text-slate-500 font-bold text-center mt-3">
                           {user.full_name} doesn't have any completed projects yet.
                        </Text>
                    </View>
                )}

                {/* Action Buttons */}
                <View className="space-y-3">
                    <TouchableOpacity
                        onPress={() => Alert.alert('Message', `Send message to ${user.full_name}`)}
                        className="w-full bg-primary-full py-3.5 rounded-full flex-row items-center justify-center shadow-sm mb-3 active:opacity-90"
                    >
                        <Text className="text-base font-bold text-white mr-2">send message</Text>
                        <Ionicons name="paper-plane" size={18} color="#FFF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => Alert.alert('Block User', `Are you sure you want to block ${user.full_name}?`)}
                        className="w-full bg-secondry-red/30 border border-secondry-red py-3.5 rounded-full flex-row items-center justify-center shadow-sm active:opacity-90"
                    >
                        <Text className="text-base font-bold text-secondry-red mr-2">Block User</Text>
                        <Ionicons name="ban-outline" size={18} color="#FF5C55" />
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

