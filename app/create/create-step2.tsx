import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Text, View, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import SimpleProgressBar from '@/components/SimpleProgressBar';
import CustomButton from '@/components/CustomButton';
import { getRoles } from '@/api/role/roleApi';
import { getSkills } from '@/api/skill/skillApi';
import { addRoleRequirement, createProjectRole } from '@/api/project/ProjectRole';
import type { Role } from '@/api/role/types';
import type { Skill } from '@/api/skill/types';
import { useAuthStore } from '@/store/useAuthStore';
import { getApiErrorMessage } from '@/utils/apiError';

interface RoleSkill {
    skillId: string;
    name: string;
    isRequired: boolean;
}

interface RoleCard {
    key: string;
    roleId: string;
    title: string;
    icon: string;
    iconType: 'Ionicons' | 'FontAwesome5';
    requiredCount: number;
    skills: RoleSkill[];
    description: string;
    isBeginnerFriendly: boolean;
}

const pickIcon = (roleName: string): { icon: string; iconType: 'Ionicons' | 'FontAwesome5' } => {
    const nameLower = roleName.toLowerCase();
    if (nameLower.includes('front')) return { icon: 'code-slash', iconType: 'Ionicons' };
    if (nameLower.includes('back')) return { icon: 'database', iconType: 'FontAwesome5' };
    if (nameLower.includes('ux') || nameLower.includes('design')) return { icon: 'pencil', iconType: 'Ionicons' };
    if (nameLower.includes('mobil')) return { icon: 'phone-portrait-outline', iconType: 'Ionicons' };
    return { icon: 'star-outline', iconType: 'Ionicons' };
};

const CreateStep2 = () => {
    const router = useRouter();
    const { projectId, selectedRoles } = useLocalSearchParams<{ projectId: string; selectedRoles: string }>();
    const accessToken = useAuthStore((state) => state.accessToken);

    const [roleCards, setRoleCards] = useState<RoleCard[]>([]);

    const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
    const [isFetchingSkills, setIsFetchingSkills] = useState(true);
    const [skillsError, setSkillsError] = useState<string | null>(null);

    const [showRolePicker, setShowRolePicker] = useState(false);
    const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
    const [isFetchingRoles, setIsFetchingRoles] = useState(false);
    const [rolesError, setRolesError] = useState<string | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showAllSkills, setShowAllSkills] = useState(false);

    const nextKey = useRef(0);

    const makeCard = useCallback((roleId: string, title: string): RoleCard => ({
        key: `role_${nextKey.current++}`,
        roleId,
        title,
        ...pickIcon(title),
        requiredCount: 1,
        skills: [],
        description: '',
        isBeginnerFriendly: false,
    }), []);

    useEffect(() => {
        if (!selectedRoles) return;

        try {
            const parsed: { id: string; name: string }[] = JSON.parse(selectedRoles);
            setRoleCards(parsed.map((role) => makeCard(role.id, role.name)));
        } catch {
        }
    }, [selectedRoles, makeCard]);

    useEffect(() => {
        if (!projectId) {
            Alert.alert('Project missing', 'Start the flow again from the first step.');
            router.replace('/create/create-step1');
        }
    }, [projectId, router]);

    const fetchSkills = useCallback(async () => {
        setIsFetchingSkills(true);
        setSkillsError(null);

        try {
            const response = await getSkills();
            setAvailableSkills(response.data ?? []);
        } catch (error) {
            setSkillsError(getApiErrorMessage(error, 'Could not load skills. Please try again.'));
        } finally {
            setIsFetchingSkills(false);
        }
    }, []);

    useEffect(() => {
        fetchSkills();
    }, [fetchSkills]);

    const fetchRoleOptions = useCallback(async () => {
        setIsFetchingRoles(true);
        setRolesError(null);

        try {
            const response = await getRoles();
            setAvailableRoles(response.data ?? []);
        } catch (error) {
            setRolesError(getApiErrorMessage(error, 'Could not load roles. Please try again.'));
        } finally {
            setIsFetchingRoles(false);
        }
    }, []);

    const handleOpenRolePicker = () => {
        if (showRolePicker) {
            setShowRolePicker(false);
            return;
        }

        setShowRolePicker(true);
        if (availableRoles.length === 0 && !isFetchingRoles) {
            fetchRoleOptions();
        }
    };


    const handleDeleteRole = (key: string) => {
        setRoleCards((cards) => cards.filter((card) => card.key !== key));
    };

    const bumpRequiredCount = (key: string, delta: number) => {
        setRoleCards((cards) =>
            cards.map((card) =>
                card.key === key
                    ? { ...card, requiredCount: Math.min(10, Math.max(1, card.requiredCount + delta)) }
                    : card
            )
        );
    };

    const updateDescription = (key: string, text: string) => {
        setRoleCards((cards) => cards.map((card) => card.key === key ? { ...card, description: text } : card));
    };

    const toggleBeginnerFriendly = (key: string) => {
        setRoleCards((cards) => cards.map((card) => card.key === key ? { ...card, isBeginnerFriendly: !card.isBeginnerFriendly } : card));
    };

    const toggleSkill = (key: string, skill: Skill) => {
        setRoleCards((cards) => cards.map((card) => {
            if (card.key !== key) return card;

            const exists = card.skills.some((selected) => selected.skillId === skill.id);
            return {
                ...card,
                skills: exists
                    ? card.skills.filter((selected) => selected.skillId !== skill.id)
                    : [...card.skills, { skillId: skill.id, name: skill.name, isRequired: true }],
            };
        }));
    };

    const toggleSkillRequired = (key: string, skillId: string) => {
        setRoleCards((cards) => cards.map((card) =>
            card.key === key
                ? {
                    ...card,
                    skills: card.skills.map((skill) =>
                        skill.skillId === skillId ? { ...skill, isRequired: !skill.isRequired } : skill
                    ),
                }
                : card
        ));
    };

    const removeSkill = (key: string, skillId: string) => {
        setRoleCards((cards) => cards.map((card) =>
            card.key === key
                ? { ...card, skills: card.skills.filter((skill) => skill.skillId !== skillId) }
                : card
        ));
    };

    const handlePickRole = (role: Role) => {
        setRoleCards((cards) => [...cards, makeCard(role.id, role.name)]);
        setShowRolePicker(false);
    };

    const handleSubmit = async () => {
        if (roleCards.length === 0) {
            Alert.alert('Add a role', 'Define at least one role before continuing.');
            return;
        }

        if (!projectId || !accessToken) {
            Alert.alert('Session expired', 'Your session has expired. Please sign in again to continue.');
            return;
        }

        setIsSubmitting(true);

        try {
            for (const card of roleCards) {
                const created = await createProjectRole(projectId, accessToken, {
                    roleId: card.roleId,
                    requiredCount: card.requiredCount,
                    description: card.description.trim(),
                });

                await Promise.all(card.skills.map((skill) =>
                    addRoleRequirement(projectId, created.data.roleId, accessToken, {
                        skillId: skill.skillId,
                        isRequired: skill.isRequired,
                        minProficiencyLevel: 1,
                    })
                ));
            }

            router.push({ pathname: '/create/create-step3', params: { projectId } });
        } catch (error) {
            Alert.alert('Could not save roles', getApiErrorMessage(error, 'Something went wrong while saving the roles. Please try again.'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const displayedSkills = showAllSkills ? availableSkills : availableSkills.slice(0, 5);

    return (
        <SafeAreaView className="flex-1 bg-bg">
            {/* Header */}
            <View className="flex-row justify-between items-center px-5 py-4">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="p-2 bg-white rounded-full shadow-sm border border-gray-50"
                >
                    <Feather name="arrow-left" size={22} color="#1A1A1A" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-text-title">Define Roles</Text>
                <View className="w-10" />
            </View>

            {/* Content */}
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* ProgressBar */}
                <SimpleProgressBar stepNumber={2} stepCount={3} />

                {/* Main Titles */}
                <Text className="text-2xl font-extrabold text-text-title leading-8 mb-1.5">Configure Roles</Text>
                <Text className="text-base text-[#A38F85] mb-7">Detail the requirements for the team members you're looking for.</Text>

                {/* Empty state */}
                {roleCards.length === 0 && (
                    <View className="bg-white rounded-3xl p-5 mb-5 items-center shadow-sm">
                        <Ionicons name="people-outline" size={28} color="#FF8C69" />
                        <Text className="text-sm text-[#A38F85] mt-2 text-center">
                            No roles yet. Tap "Add Another Role" to define who you need.
                        </Text>
                    </View>
                )}

                {/* Display Cards */}
                {roleCards.map((role, index) => (
                    <View
                        key={role.key}
                        className={`bg-white rounded-3xl p-5 mb-5 shadow-sm ${index === 0 ? 'border-l-4 border-primary-full' : ''}`}
                    >
                        {/* Header */}
                        <View className="flex-row justify-between items-start mb-4">
                            <View className="flex-row items-center flex-1">
                                <View className="w-10 h-10 rounded-full bg-primary-mid justify-center items-center mr-3">
                                    {role.iconType === 'Ionicons' ? (
                                        <Ionicons name={role.icon as any} size={18} color="#FF8C69" />
                                    ) : (
                                        <FontAwesome5 name={role.icon} size={16} color="#FF8C69" />
                                    )}
                                </View>
                                <View className="flex-1">
                                    <Text className="text-base font-bold text-text-title">{role.title}</Text>
                                    {index === 0 && (
                                        <Text className="text-xs font-bold text-primary-full mt-0.5">Primary Role</Text>
                                    )}
                                </View>
                            </View>

                            <TouchableOpacity className="p-1" onPress={() => handleDeleteRole(role.key)}>
                                <Ionicons name="trash-outline" size={18} color="#A38F85" />
                            </TouchableOpacity>
                        </View>


                        {/* Required Roles */}
                        <View className="flex-row justify-between items-center mb-4">
                            <View className="flex-1 mr-3">
                                <Text className="text-base font-bold text-text-title">Required Roles</Text>
                                <Text className="text-xs text-[#A38F85] mt-0.5">How many people do you need (1–10)?</Text>
                            </View>
                            <View className="flex-row items-center bg-inputbg rounded-full px-1.5 py-1">
                                <TouchableOpacity
                                    className="w-8 h-8 rounded-full bg-white justify-center items-center"
                                    onPress={() => bumpRequiredCount(role.key, -1)}
                                    disabled={role.requiredCount <= 1}
                                >
                                    <Ionicons name="remove" size={18} color={role.requiredCount <= 1 ? '#C5B7B1' : '#FF8C69'} />
                                </TouchableOpacity>
                                <Text className="w-8 text-center text-base font-bold text-text-title">{role.requiredCount}</Text>
                                <TouchableOpacity
                                    className="w-8 h-8 rounded-full bg-white justify-center items-center"
                                    onPress={() => bumpRequiredCount(role.key, 1)}
                                    disabled={role.requiredCount >= 10}
                                >
                                    <Ionicons name="add" size={18} color={role.requiredCount >= 10 ? '#C5B7B1' : '#FF8C69'} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Skills Needed */}
                        <Text className="text-base font-bold text-text-title mb-1">Skills Needed</Text>

                        {/* Selected skills */}
                        {role.skills.length > 0 && (
                            <View className="flex-row flex-wrap gap-2 mb-3">
                                {role.skills.map((skill) => (
                                    <View key={skill.skillId} className="flex-row items-center bg-primary-light border border-primary-mid rounded-full">
                                        <TouchableOpacity
                                            className="flex-row items-center px-3 py-1.5"
                                            onPress={() => toggleSkillRequired(role.key, skill.skillId)}
                                        >
                                            <Text className={`text-xs font-semibold ${skill.isRequired ? 'text-primary-full' : 'text-secondry-text'}`}>
                                                {skill.name} · {skill.isRequired ? 'Required' : 'Optional'}
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="pr-2.5" onPress={() => removeSkill(role.key, skill.skillId)}>
                                            <Ionicons name="close" size={14} color="#FF8C69" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        )}


                        {/* Available skills — fetched from the backend */}
                        <Text className="text-xs font-bold text-[#A38F85] uppercase mb-2">Add a skill (tap to select)</Text>
                        {isFetchingSkills ? (
                            <ActivityIndicator size="small" color="#FF8C69" className="mb-5" />
                        ) : skillsError ? (
                            <View className="flex-row items-center mb-5">
                                <Text className="text-secondry-red text-xs mr-3 flex-1">{skillsError}</Text>
                                <TouchableOpacity onPress={fetchSkills} className="bg-primary-light border border-primary-mid px-3 py-1.5 rounded-full">
                                    <Text className="text-primary-full font-semibold text-xs">Retry</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View className="flex-row flex-wrap gap-2 mb-5">
                                {displayedSkills
                                    .filter((skill) => !role.skills.some((selected) => selected.skillId === skill.id))
                                    .map((skill) => (
                                        <TouchableOpacity
                                            key={skill.id}
                                            className="px-3 py-1.5 rounded-full bg-white border border-[#EFEAE6]"
                                            onPress={() => toggleSkill(role.key, skill)}
                                        >
                                            <Text className="text-xs font-semibold text-[#A38F85]">+ {skill.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                {availableSkills.length > 5 && (
                                    <TouchableOpacity
                                        onPress={() => setShowAllSkills(!showAllSkills)}
                                        className="self-start rounded-full px-3.5 py-2.5 border bg-primary-full border-primary-full"
                                    >
                                        <Text className="text-white font-bold text-sm">
                                            {showAllSkills ? 'show less' : `show more (${availableSkills.length - 5})`}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                {availableSkills.length === 0 && (
                                    <Text className="text-text-placeholder text-sm">No skills available right now.</Text>
                                )}
                            </View>
                        )}


                        {/* Role Description */}
                        <Text className="text-base font-bold text-text-title mb-3">Role Description</Text>
                        <TextInput
                            className="bg-inputbg rounded-2xl px-4 py-3 text-sm text-text-title h-20"
                            placeholder={index === 0 ? "Describe the responsibilities and what you are looking for in a candidate..." : "Describe the responsibilities..."}
                            placeholderTextColor="#C5B7B1"
                            multiline
                            textAlignVertical="top"
                            value={role.description}
                            onChangeText={(text) => updateDescription(role.key, text)}
                        />

                        {/* Beginner Friendly */}
                        <View className="flex-row justify-between items-center mt-5 pt-3 border-t border-[#F2ECE9]">
                            <View>
                                <Text className="text-base font-bold text-text-title">Beginner Friendly</Text>
                                <Text className="text-xs text-[#A38F85] mt-0.5">Is this role suitable for juniors?</Text>
                            </View>
                            <Switch
                                trackColor={{ false: '#EFEAE6', true: '#FF8C69' }}
                                thumbColor={'#FFFFFF'}
                                ios_backgroundColor="#EFEAE6"
                                onValueChange={() => toggleBeginnerFriendly(role.key)}
                                value={role.isBeginnerFriendly}
                            />
                        </View>
                    </View>
                ))}

                {/* Add Another Role Button */}
                <TouchableOpacity
                    className="border border-dashed border-primary-full rounded-3xl py-4 flex-row justify-center items-center bg-primary-light mb-5"
                    onPress={handleOpenRolePicker}
                >
                    <Ionicons name="add-circle-outline" size={20} color="#FF8C69" className="mr-2" />
                    <Text className="text-primary-full font-bold text-sm">{showRolePicker ? 'Close Role List' : 'Add Another Role'}</Text>
                </TouchableOpacity>

                {/* Role Picker — fetched roles */}
                {showRolePicker && (
                    <View className="bg-white rounded-3xl p-4 mb-5 shadow-sm border border-[#EFEAE6]">
                        <Text className="text-base font-bold text-text-title mb-3">Select a role</Text>
                        {isFetchingRoles ? (
                            <ActivityIndicator size="small" color="#FF8C69" />
                        ) : rolesError ? (
                            <View className="flex-row items-center">
                                <Text className="text-secondry-red text-xs mr-3 flex-1">{rolesError}</Text>
                                <TouchableOpacity onPress={fetchRoleOptions} className="bg-primary-light border border-primary-mid px-3 py-1.5 rounded-full">
                                    <Text className="text-primary-full font-semibold text-xs">Retry</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View className="flex-row flex-wrap gap-2">
                                {availableRoles.length === 0 && (
                                    <Text className="text-text-placeholder text-sm">No roles available right now.</Text>
                                )}
                                {availableRoles.map((role) => (
                                    <TouchableOpacity
                                        key={role.id}
                                        className="px-3.5 py-2.5 rounded-full border border-primary-mid bg-primary-light"
                                        onPress={() => handlePickRole(role)}
                                    >
                                        <Text className="text-sm font-semibold text-primary-full">{role.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                )}

                {/* Next Step Button */}
                <CustomButton width="100%" borderColor='#FF8C65' height={50} bgColor='#FF8C65' title='Next Step' titleColor='#fff'
                    isLoading={isSubmitting}
                    handelPress={handleSubmit} />

            </ScrollView>
        </SafeAreaView>
    );

}


export default CreateStep2;

