import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator, Linking } from 'react-native';
import { Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isAxiosError } from 'axios';
import { getUser, getUserProjects } from '@/api/user/userApi';
import { blockUser } from '@/api/moderation/moderationApi';
import { useAuthStore } from '@/store/useAuthStore';
import { getApiErrorMessage } from '@/utils/apiError';
import type { CurrentUser } from '@/api/auth/types';
import type { ProjectSummary } from '@/api/project/types';
import ProjectCard from '@/components/ProjectCard';

const CURRENT_STATUSES = ['RECRUITING', 'PREPARATION', 'IN_PROGRESS'];

const SKILL_DOT_COLORS = ['#FF8C69', '#38BDF8', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'];

export default function UserProfileScreen() {

    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const accessToken = useAuthStore((state) => state.accessToken);

    const [user, setUser] = useState<CurrentUser | null>(null);
    const [projects, setProjects] = useState<ProjectSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [isBlocking, setIsBlocking] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    useFocusEffect(
        useCallback(() => {
            let cancelled = false;

            const load = async () => {
                if (!accessToken || !id) {
                    setIsLoading(false);
                    return;
                }

                setIsLoading(true);
                setLoadError(null);
                setNotFound(false);

                try {
                    // Profile + this user's memberships in one round trip.
                    const [profileResponse, projectsResponse] = await Promise.all([
                        getUser(String(id), accessToken),
                        getUserProjects(String(id), accessToken),
                    ]);

                    if (cancelled) return;

                    setUser(profileResponse.data ?? null);
                    setProjects(projectsResponse.data ?? []);
                } catch (error) {
                    if (cancelled) return;
                    if (isAxiosError(error) && error.response?.status === 404) {
                        setNotFound(true);
                        setUser(null);
                    } else {
                        setLoadError(getApiErrorMessage(error, 'Could not load this profile.'));
                    }
                } finally {
                    if (!cancelled) setIsLoading(false);
                }
            };

            load();

            return () => {
                cancelled = true;
            };
        }, [accessToken, id, reloadKey])
    );

    // Split the membership list the same way the profile page splits "mine".
    const currentProjects = useMemo(
        () => projects.filter((project) => CURRENT_STATUSES.includes(String(project.status).toUpperCase())),
        [projects]
    );
    const completedProjects = useMemo(
        () => projects.filter((project) => String(project.status).toUpperCase() === 'COMPLETED'),
        [projects]
    );

    /** Opens the profile links in the browser instead of copying them. */
    const openLink = async (url: string) => {
        const formatted = url.startsWith('http') ? url : `https://${url}`;
        const canOpen = await Linking.canOpenURL(formatted).catch(() => false);

        if (canOpen) {
            await Linking.openURL(formatted).catch(() => {
                Alert.alert('Cannot open link', formatted);
            });
        } else {
            Alert.alert('Cannot open link', formatted);
        }
    };

    const handleBlock = () => {
        if (!user) return;

        Alert.alert(
            'Block User',
            `Are you sure you want to block ${user.full_name || 'this user'}? You will stop seeing each other's projects.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Block',
                    style: 'destructive',
                    onPress: async () => {
                        if (!accessToken || isBlocking) return;

                        setIsBlocking(true);
                        try {
                            await blockUser(String(id), {}, accessToken);
                            Alert.alert('User blocked', `${user.full_name || 'This user'} has been blocked.`);
                            router.back();
                        } catch (error) {
                            Alert.alert('Could not block', getApiErrorMessage(error, 'The user was not blocked.'));
                        } finally {
                            setIsBlocking(false);
                        }
                    },
                },
            ]
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-bg justify-center items-center">
                <ActivityIndicator size="large" color="#FF8C69" />
            </SafeAreaView>
        );
    }

    if (loadError || notFound || !user) {
        return (
            <SafeAreaView className="flex-1 bg-bg justify-center items-center p-6">
                <Feather name="alert-circle" size={48} color="#A0AEC0" />
                <Text className="text-text-title font-bold text-lg mt-3 text-center">
                    {loadError ? 'Could not load this profile' : 'User not found'}
                </Text>
                {loadError && (
                    <Text className="text-slate-400 text-xs mt-2 text-center px-6">{loadError}</Text>
                )}
                <TouchableOpacity
                    onPress={() => {
                        if (loadError) {
                            setReloadKey((key) => key + 1);
                        } else {
                            router.back();
                        }
                    }}
                    className="mt-4 bg-primary-full px-6 py-2.5 rounded-full"
                >
                    <Text className="text-white font-bold text-xs">
                        {loadError ? 'Try Again' : 'Go Back'}
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

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
                    {/* Plain circle — matches the sidebar and the viewer's own profile */}
                    <View className='w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-2 border-primary-full'>
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

                    <View className="items-center">
                        {/* Orange check marks the account as verified to anyone viewing it */}
                        <View className="flex-row items-center justify-center gap-1.5">
                            <Text className='font-semibold text-2xl text-center text-text-title'>
                                {user.full_name}
                            </Text>
                            {user.is_verified && (
                                <Ionicons name="checkmark-circle" size={20} color="#FF8C69" />
                            )}
                        </View>

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
                        {/* Telegram handle is set by an admin in the DB, so it is display-only */}
                        {user.telegram_username ? (
                            <View className="flex-row items-center justify-center gap-1 mt-1">
                                <Ionicons name="paper-plane-outline" size={12} color="#94A3B8" />
                                <Text className="text-gray-500 text-center text-xs font-medium tracking-wide">
                                    {user.telegram_username}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                </View>

                {/* User Stats Overview */}
                <View className="flex-row justify-around bg-white rounded-2xl p-4 mb-6 shadow-sm border border-primary-mid">
                    <View className="items-center">
                        <Text className="text-xs font-medium text-primary-full">Stars</Text>
                        <Text className="text-lg font-bold text-text-title">{user.stats?.stars_received ?? 0}</Text>
                    </View>
                    <View className="w-[1px] h-full bg-slate-100" />
                    <View className="items-center">
                        <Text className="text-xs font-medium text-primary-full">Projects</Text>
                        <Text className="text-lg font-bold text-text-title">{user.stats?.projects_created ?? 0}</Text>
                    </View>
                    <View className="w-[1px] h-full bg-slate-100" />
                    <View className="items-center">
                        <Text className="text-xs font-medium text-primary-full">Collabs</Text>
                        <Text className="text-lg font-bold text-text-title">{user.stats?.projects_joined ?? 0}</Text>
                    </View>
                </View>

                {/* Bio Section */}
                <View className="mb-6">
                    <Text className="text-base font-bold text-text-title mb-2">Bio</Text>
                    <Text className="text-sm text-gray-600 leading-6">
                        {user.bio || "This user hasn't written a bio yet."}
                    </Text>
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
                                activeOpacity={0.7}
                                onPress={() => openLink(user.github_url!)}
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
                        {user.portfolio_url && (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => openLink(user.portfolio_url!)}
                                className="flex-1 bg-white rounded-2xl p-2 flex-row items-center shadow-sm border border-slate-100"
                            >
                                <View className="w-9 h-9 rounded-xl justify-center items-center mr-2">
                                    <Feather name="globe" size={18} color="#FF8C69" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs font-semibold text-slate-500 mt-0.5" numberOfLines={1}>{user.portfolio_url}</Text>
                                </View>
                                <Feather name="external-link" size={18} color="#FF8C69" />
                            </TouchableOpacity>
                        )}

                        {/* LinkedIn */}
                        {user.linkedin_url && (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => openLink(user.linkedin_url!)}
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

                {/* Current Projects */}
                <View className="mb-6">
                    <View className="flex-row items-center gap-2 mb-3">
                        <Text className="text-lg font-bold text-text-title">
                            Current Projects
                        </Text>
                    </View>

                    {isLoading ? (
                        <ActivityIndicator size="small" color="#FF8C69" className="my-4" />
                    ) : currentProjects.length > 0 ? (
                        currentProjects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))
                    ) : (
                        <Text className="text-sm text-slate-400 bg-gray-50 rounded-2xl px-4 py-5 text-center border border-dashed border-slate-200">
                            No current projects yet.
                        </Text>
                    )}
                </View>

                {/* Completed Projects */}
                <View className="mb-6">
                    <View className="flex-row items-center gap-2 mb-3">
                        <Text className="text-lg font-bold text-text-title">
                            Completed Projects
                        </Text>
                    </View>

                    {isLoading ? (
                        <ActivityIndicator size="small" color="#FF8C69" className="my-4" />
                    ) : completedProjects.length > 0 ? (
                        completedProjects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))
                    ) : (
                        <Text className="text-sm text-slate-400 bg-gray-50 rounded-2xl px-4 py-5 text-center border border-dashed border-slate-200">
                            No completed projects yet.
                        </Text>
                    )}
                </View>

                {/* Action Buttons */}
                <View className="space-y-3">
                    <TouchableOpacity
                        onPress={() => Alert.alert('Message', `This feature is currently disabled.`)}
                        className="w-full bg-primary-full py-3.5 rounded-full flex-row items-center justify-center shadow-sm mb-3 active:opacity-90"
                    >
                        <Text className="text-base font-bold text-white mr-2">send message</Text>
                        <Ionicons name="paper-plane" size={18} color="#FFF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleBlock}
                        disabled={isBlocking}
                        className="w-full bg-secondry-red/30 border border-secondry-red py-3.5 rounded-full flex-row items-center justify-center shadow-sm active:opacity-90"
                    >
                        <Text className="text-base font-bold text-secondry-red mr-2">
                            {isBlocking ? 'Blocking…' : 'Block User'}
                        </Text>
                        <Ionicons name="ban-outline" size={18} color="#FF5C55" />
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

