import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, Switch, Image } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { ProjectDraft } from '@/types/project';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { AddRoleModal, RoleData } from '../AddRoleModal';

interface DraftProjectViewProps {
    project: ProjectDraft;
    onBack?: () => void;
}

export default function DraftProjectView({ project, onBack }: DraftProjectViewProps) {

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [draft, setDraft] = useState<ProjectDraft | undefined>(project);
    const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);

    const [formData, setFormData] = useState({
        name: project?.name || '',
        description: project?.description || '',
        work_type: project?.work_type || 'remote',
        duration: project?.duration || '',
        image_url: project?.image_url || '',
        roles: project?.open_roles || [],
        is_university_project: project?.is_university_project || false,
    });

    const handleSaveChanges = () => {
        if (!formData.name.trim()) {
            Alert.alert("Error", "Project name cannot be empty.");
            return;
        }

        setDraft((prev) => prev ? { ...prev, ...formData } : prev);
        setIsEditing(false);
        Alert.alert("Saved", "Draft updated successfully!");
    };

    const handleCancelEdit = () => {
        setFormData({
            name: draft?.name || '',
            description: draft?.description || '',
            work_type: draft?.work_type || 'remote',
            duration: draft?.duration || '',
            is_university_project: draft?.is_university_project || false,
            image_url: draft?.image_url || '',
            roles: draft?.open_roles || [],
        });
        setIsEditing(false);
    };

    const handlePublish = () => {
        Alert.alert(
            "Publish Project",
            "Are you sure you want to publish this project now?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Publish",
                    onPress: () => {
                        // Logic to convert DRAFT -> RECRUITING
                        if (onBack) onBack();
                    }
                }
            ]
        );
    };

    const handleEdit = () => {
        setIsEditing(true)
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Draft",
            "This action cannot be undone. Are you sure you want to delete this draft?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        // Logic to remove draft
                        if (onBack) onBack();
                    }
                }
            ]
        );
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert("Permission Required", "Need media library access to pick an image.");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1], // square cutting
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0].uri) {
            setFormData(prev => ({ ...prev, image_url: result.assets[0].uri }));
        }
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, image_url: '' }));
    };

    const handleAddRole = (newRole: any) => {
        setFormData(prev => ({
            ...prev,
            roles: [...(prev.roles || []), newRole]
        }));
        setIsRoleModalVisible(false);
    };

    const handleRemoveRole = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            roles: prev.roles.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleSaveRole = (newRole: RoleData) => {
        console.log('Role saved:', newRole);
    };

    return (
        <SafeAreaView className="flex-1 bg-bg">

            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
                <TouchableOpacity onPress={onBack} className="p-2 -ml-2 rounded-full">
                    <Feather name="arrow-left" size={24} color="#1A1A1A" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-text-title">Draft Preview</Text>
                <TouchableOpacity onPress={handleDelete} className="p-2 -mr-2 rounded-full">
                    <Feather name="trash-2" size={20} color="#FF5C55" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>

                {isEditing ? (
                    <View className="gap-y-4">

                        <View className="items-center mb-6">
                            <View className="relative">
                                <View className="w-28 h-28 bg-primary-light items-center justify-center rounded-full overflow-hidden border-2 border-gray-100">
                                    {formData.image_url ? (
                                        <Image
                                            source={{ uri: formData.image_url }}
                                            className="w-full h-full"
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <Ionicons name="laptop-outline" size={48} color="#FF8C69" />
                                    )}
                                </View>

                                <TouchableOpacity
                                    onPress={pickImage}
                                    className="bg-primary-full absolute -bottom-1 -right-1 p-2.5 rounded-full shadow-md border-2 border-white"
                                    activeOpacity={0.8}
                                >
                                    <Feather name="camera" size={14} color="#FFFFFF" />
                                </TouchableOpacity>

                                {Boolean(formData.image_url) && (
                                    <TouchableOpacity
                                        onPress={removeImage}
                                        className="bg-red-500 absolute -bottom-1 -left-1 p-2.5 rounded-full shadow-md border-2 border-white"
                                        activeOpacity={0.8}
                                    >
                                        <Feather name="trash-2" size={14} color="#FFFFFF" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        <View>
                            <Text className="text-sm font-bold text-text-title mb-1">Project Name</Text>
                            <TextInput
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                                placeholder="Project title..."
                                className="bg-white border border-slate-100 rounded-xl p-3 text-gray-800 font-bold text-base"
                            />
                        </View>

                        <View>
                            <Text className="text-sm font-bold text-text-title mb-1">Description</Text>
                            <TextInput
                                value={formData.description}
                                onChangeText={(text) => setFormData({ ...formData, description: text })}
                                placeholder="Describe your project..."
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                className="bg-white border border-slate-100 rounded-xl p-3 text-gray-800 text-sm min-h-[100px]"
                            />
                        </View>

                        <View>
                            <Text className="text-sm font-bold text-text-title mb-1">Duration</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {['1 Month', '3 Months', '6 Months', '1 Year+'].map((option) => {
                                    const isSelected = formData.duration === option;
                                    return (
                                        <TouchableOpacity
                                            key={option}
                                            onPress={() => setFormData({ ...formData, duration: option })}
                                            className={`flex-1 py-2.5 rounded-xl border items-center justify-center ${isSelected
                                                    ? 'bg-primary-full border-primary-full'
                                                    : 'bg-white border-slate-200'
                                                }`}
                                            activeOpacity={0.7}
                                        >
                                            <Text className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-600'
                                                }`}>
                                                {option}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <View>
                            <Text className="text-sm font-bold text-text-title mb-1">Work Type</Text>
                            <View className="flex-row gap-2">
                                {[
                                    { label: 'Remote', value: 'remote' },
                                    { label: 'On-site', value: 'on_site' },
                                    { label: 'Hybrid', value: 'hybrid' },
                                ].map((type) => {
                                    const isSelected = formData.work_type === type.value;
                                    return (
                                        <TouchableOpacity
                                            key={type.value}
                                            onPress={() => setFormData({ ...formData, work_type: type.value })}
                                            className={`flex-1 py-2.5 rounded-xl border items-center justify-center ${isSelected
                                                    ? 'bg-primary-full border-primary-full'
                                                    : 'bg-white border-slate-200'
                                                }`}
                                            activeOpacity={0.7}
                                        >
                                            <Text className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-600'
                                                }`}>
                                                {type.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <View className="flex-row items-center justify-between bg-white p-3 rounded-xl border border-slate-100">
                            <Text className="text-sm font-bold text-text-title">University Project</Text>
                            <Switch
                                value={formData.is_university_project}
                                onValueChange={(val) => setFormData({ ...formData, is_university_project: val })}
                                trackColor={{ false: "#E2E8F0", true: "#FF8C69" }}
                                thumbColor={formData.is_university_project ? '#FFFFFF' : '#9CA3AF'}
                            />
                        </View>

                        <View className="mt-2 mb-8">

                            <View className="flex-row items-center justify-between mb-2">
                                <Text className="text-sm font-bold text-text-title">Required Roles</Text>
                                <TouchableOpacity
                                    onPress={() => setIsRoleModalVisible(true)}
                                    className="flex-row items-center gap-1 bg-primary-light px-3 py-1.5 rounded-full"
                                    activeOpacity={0.7}
                                >
                                    <Feather name="plus" size={16} color="#FF8C69" />
                                    <Text className="text-primary-full font-bold text-xs">Add Role</Text>
                                </TouchableOpacity>
                            </View>

                            {formData.roles && formData.roles.length > 0 ? (
                                <View className="gap-y-2">
                                    {formData.roles.map((role: any, index: number) => (

                                        <View
                                            key={index}
                                            className="bg-white p-4 rounded-2xl mb-3 shadow-sm border border-gray-100"
                                            style={{ borderLeftWidth: 5, borderLeftColor: "#FF8C69" }}
                                        >
                                            <View className="flex-row items-start justify-between mb-3">
                                                <View className="flex-1 pr-2">
                                                    <Text className="text-base font-bold text-[#1E3A47]">{role.title}</Text>
                                                    <Text className="text-xs text-gray-400 mt-0.5">{project.work_type} • Open Role</Text>
                                                </View>
                                                <TouchableOpacity
                                                    onPress={() => handleRemoveRole(index)}
                                                    className="p-1.5 bg-red-50 rounded-lg"
                                                >
                                                    <Feather name="trash-2" size={16} color="#FF5C55" />
                                                </TouchableOpacity>
                                            </View>
                                            {role.description && (
                                                <View className="p-3 rounded-xl border border-gray-200 mb-3">
                                                    <Text className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-1">
                                                        Role Description
                                                    </Text>
                                                    <Text className="text-xs text-gray-400 leading-relaxed">
                                                        {role.description}
                                                    </Text>
                                                </View>
                                            )}
                                            {role.requirements && (
                                                <View className="p-3 rounded-xl border border-gray-200">
                                                    <Text className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-1">
                                                        Role Requirements
                                                    </Text>
                                                    <Text className="text-xs text-gray-400 leading-relaxed">
                                                        {Array.isArray(role.requirements) ? role.requirements.join('.\n') : role.requirements}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <View className="bg-white border border-dashed border-gray-200 p-4 rounded-xl items-center">
                                    <Text className="text-xs text-gray-400 font-medium">No roles added yet.</Text>
                                </View>
                            )}
                        </View>

                    </View>
                ) : (
                    <>
                        {/* Project Header */}
                        <View className="items-center mb-4">
                            <View className="w-24 h-24 bg-primary-light items-center justify-center mb-3 rounded-full">
                                <Ionicons name="laptop-outline" size={40} color="#FF8C69" />
                            </View>
                            <Text className="text-2xl text-center font-bold text-text-title">{project.name}</Text>
                        </View>

                        {/* Draft Warning Banner */}
                        <View className="flex-row items-center bg-primary-light border border-primary-mid rounded-xl p-3 mb-6">
                            <Ionicons name="information-circle-outline" size={20} color="#FF8C69" />
                            <Text className="text-text-title text-xs font-medium ml-2 flex-1">
                                This project is saved as a draft. It is not published or visible to anyone else.
                            </Text>
                        </View>

                        {/* Project Metadata Badges */}
                        <View className="flex-row flex-wrap gap-2 mb-6">
                            {project.work_type && (
                                <View className="bg-slate-100 px-3 py-1.5 rounded-lg">
                                    <Text className="text-slate-700 text-xs font-semibold capitalize">{project.work_type}</Text>
                                </View>
                            )}
                            {project.duration && (
                                <View className="bg-slate-100 px-3 py-1.5 rounded-lg">
                                    <Text className="text-slate-700 text-xs font-semibold capitalize">{project.duration} Duration</Text>
                                </View>
                            )}
                            {project.is_university_project && (
                                <View className="bg-slate-100 px-3 py-1.5 rounded-lg">
                                    <Text className="text-slate-700 text-xs font-semibold">University Project</Text>
                                </View>
                            )}
                        </View>

                        {/* Project Overview */}
                        <Text className="text-lg font-bold text-text-title mb-3">Project Overview</Text>
                        <View className="bg-white rounded-3xl p-5 mb-6 shadow-sm border border-slate-50">
                            <View className="flex-row justify-between items-start mb-2">
                                <Text className="flex-1 text-sm text-gray-700 leading-6 mr-2">
                                    {project.description}
                                </Text>
                            </View>

                            {/* Tags */}
                            <View className="flex-row flex-wrap items-center gap-2 mt-4">
                                {(project.tags || ['React Native', 'Expo', 'node.js']).map((tag, idx) => (
                                    <View key={idx} className="bg-slate-100 px-3 py-1.5 rounded-xl">
                                        <Text className="text-xs text-slate-600 font-medium">{tag}</Text>
                                    </View>
                                ))}
                                {project.tags?.length == 0 && ['No Tags Yet'].map((tag, idx) => (
                                    <View key={idx} className="bg-slate-100 px-3 py-1.5 rounded-xl">
                                        <Text className="text-xs text-slate-600 font-medium">{tag}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Open Roles */}
                        <View className="mt-6 mb-8">
                            <View className="flex-row items-center justify-between mb-3">
                                <Text className="text-lg font-bold text-text-title">Needed Roles</Text>
                                <View className="bg-primary-light px-3 py-1 rounded-full">
                                    <Text className="text-primary-full text-xs font-bold">{project.open_roles?.length ?? 0} Openings</Text>
                                </View>
                            </View>
                            {project?.open_roles?.map((role, index) => (
                                <View
                                    key={index}
                                    className="bg-white p-4 rounded-2xl mb-3 shadow-sm border border-gray-100"
                                    style={{ borderLeftWidth: 5, borderLeftColor: "#FF8C69" }}
                                >
                                    <View className="flex-row items-start justify-between mb-3">
                                        <View className="flex-1 pr-2">
                                            <Text className="text-base font-bold text-[#1E3A47]">{role.title}</Text>
                                            <Text className="text-xs text-gray-400 mt-0.5">{project.work_type} • Open Role</Text>
                                        </View>
                                    </View>
                                    {role.description && (
                                        <View className="p-3 rounded-xl border border-gray-200 mb-3">
                                            <Text className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-1">
                                                Role Description
                                            </Text>
                                            <Text className="text-xs text-gray-400 leading-relaxed">
                                                {role.description}
                                            </Text>
                                        </View>
                                    )}
                                    {role.requirements && (
                                        <View className="p-3 rounded-xl border border-gray-200">
                                            <Text className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-1">
                                                Role Requirements
                                            </Text>
                                            <Text className="text-xs text-gray-400 leading-relaxed">
                                                {Array.isArray(role.requirements) ? role.requirements.join('.\n') : role.requirements}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            ))}
                            {project.open_roles?.length == 0 && (
                                <View className="bg-white border border-dashed border-gray-200 p-4 rounded-xl items-center">
                                    <Text className="text-xs text-gray-400 font-medium">No roles added yet.</Text>
                                </View>
                            )}
                        </View>
                    </>
                )}

            </ScrollView>

            {/* Action Buttons */}
            <View className="p-4 border-t border-gray-100 flex-row gap-3">
                {isEditing ? (
                    <>
                        <TouchableOpacity
                            onPress={handleCancelEdit}
                            className="flex-1 bg-gray-200 py-3.5 rounded-xl items-center justify-center"
                        >
                            <Text className="text-gray-700 font-bold text-sm">Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleSaveChanges}
                            className="flex-1 bg-primary-full py-3.5 rounded-xl items-center justify-center"
                        >
                            <Text className="text-white font-bold text-sm">Save Changes</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TouchableOpacity
                            onPress={handleEdit}
                            className="flex-1 bg-gray-200 py-3.5 rounded-xl items-center justify-center"
                        >
                            <Text className="text-gray-700 font-bold text-sm">Edit Draft</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handlePublish}
                            className="flex-1 bg-primary-full py-3.5 rounded-xl items-center justify-center"
                        >
                            <Text className="text-white font-bold text-sm">Publish</Text>
                        </TouchableOpacity>
                    </>
                )}

            </View>

            <AddRoleModal
                visible={isRoleModalVisible}
                onClose={() => setIsRoleModalVisible(false)}
                onSave={handleSaveRole}
            />

        </SafeAreaView>
    );
}

