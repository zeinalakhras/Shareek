import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router';

const ProjectCard = ({ project }: any) => {
    const date = new Date(project.created_at);

    const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });

    const renderProjectStatus = () => {
        switch (project.status) {
            case "completed":
                return (
                    <View className='flex-row gap-2 items-center'>
                        <Text style={{ color: '#9CA3AF' }}>{project.stars_count}</Text>
                        <AntDesign name="star" size={20} color="#FF8C69" />
                    </View>
                );
            case "active":
                return <Text style={{ color: '#9CA3AF' }}>incomplete</Text>;
            case "blocked":
                return <Text style={{ color: '#ff0000' }}>Blocked</Text>;
            case "insufficientPartners":
                return <Text style={{ color: '#9CA3AF' }}>insufficient partners</Text>;
            case "draft":
                return <Text style={{ color: '#9CA3AF' }}>Draft</Text>;
            default:
                return null;
        }
    };

    const renderProjectIconStatus = () => {
        switch (project.status) {
            case "RECRUITING":
                return <Ionicons name="person-add-outline" size={22} color="#53687E" />;
            case "PREPARATION":
                return <Ionicons name="construct-outline" size={22} color="#53687E" />;
            case "IN_PROGRESS":
                return <Ionicons name="play-circle-outline" size={24} color="#53687E" />;
            case "completed":
                return <Ionicons name="cloud-done" size={24} color="#3EC973" />;
            case "blocked":
                return <MaterialIcons name="block" size={24} color="#EF4444" />;
            case "draft":
                return <Ionicons name="document-text-outline" size={24} color="#9CA3AF" />;
            default:
                return null;
        }
    };

    return (
        <View className='w-[90%] mx-auto bg-white mb-5 p-5 rounded-2xl'>
            <View className='flex-row justify-between mb-4'>
                <View className='flex-1' style={{ gap: 15 }}>
                    <Text className='text-xl font-bold'>{project.name}</Text>
                    <View className='flex-row gap-2 items-center'>
                        <Ionicons name="calendar-clear-outline" size={20} color="#9CA3AF" />
                        <Text style={{ color: '#9CA3AF' }}>Applied {formattedDate}</Text>
                    </View>
                </View>
                <View style={{ width: 35, height: 35, borderRadius: 8, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' }}>
                    {renderProjectIconStatus()}
                </View>
            </View>
            <View>
                <View className='w-[100%]' style={{ height: 3, backgroundColor: '#F0F0F0' }} />
                <View className='flex-row justify-between mt-4'>
                    <TouchableOpacity
                        className='flex-row gap-1'
                        onPress={() => {
                            router.push({
                                pathname: '/projects/[id]',
                                params: { id: project.id },
                            })
                        }
                        }
                    >
                        <Text className='text-primary-full'>View Details</Text>
                        <Ionicons name="arrow-forward" size={20} color="#FF8C69" />
                    </TouchableOpacity>
                    {renderProjectStatus()}
                </View>
            </View>
        </View>
    )
}

export default ProjectCard

