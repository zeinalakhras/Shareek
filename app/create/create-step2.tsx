import { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import SimpleProgressBar from '@/components/SimpleProgressBar';
import CustomButton from '@/components/CustomButton';

interface RoleData {
    id: string;
    title: string;
    isPrimary: boolean;
    icon: string;
    iconType: 'Ionicons' | 'FontAwesome5';
    skills: string[];
    description: string;
    isBeginnerFriendly: boolean;
}


const CreateStep2 = () => {
    const router = useRouter();
    const { selectedRoles } = useLocalSearchParams<{ selectedRoles: string }>();
    const [roles, setRoles] = useState<RoleData[]>([]);
    const [skillInputs, setSkillInputs] = useState<{ [key: string]: string }>({});



    useEffect(() => {
        if (selectedRoles) {
            const rolesArray = selectedRoles.split(',');
            const initialRoles: RoleData[] = rolesArray.map((roleName, index) => {

                let icon = 'star-outline';
                let iconType: 'Ionicons' | 'FontAwesome5' = 'Ionicons';

                const nameLower = roleName.toLowerCase();
                if (nameLower.includes('front')) {
                    icon = 'code-slash';
                } else if (nameLower.includes('back')) {
                    icon = 'database';
                    iconType = 'FontAwesome5';
                } else if (nameLower.includes('ux') || nameLower.includes('design')) {
                    icon = 'pencil';
                } else if (nameLower.includes('mobil')) {
                    icon = 'phone-portrait-outline';
                }

                return {
                    id: String(index + 1),
                    title: roleName,
                    isPrimary: index === 0,
                    icon: icon,
                    iconType: iconType,
                    skills: [],
                    description: '',
                    isBeginnerFriendly: false,
                };
            });
            setRoles(initialRoles);
        }
    }, [selectedRoles]);

    const updateDescription = (id: string, text: string) => {
        setRoles(roles.map(role => role.id === id ? { ...role, description: text } : role));
    };

    const toggleBeginnerFriendly = (id: string) => {
        setRoles(roles.map(role => role.id === id ? { ...role, isBeginnerFriendly: !role.isBeginnerFriendly } : role));
    };

    const handleAddSkill = (roleId: string) => {
        const currentInput = skillInputs[roleId]?.trim();
        if (!currentInput) return;

        setRoles(roles.map(role => {
            if (role.id === roleId && !role.skills.includes(currentInput)) {
                return { ...role, skills: [...role.skills, currentInput] };
            }
            return role;
        }));

        setSkillInputs({ ...skillInputs, [roleId]: '' });
    };

    const handleRemoveSkill = (roleId: string, skillToRemove: string) => {
        setRoles(roles.map(role => {
            if (role.id === roleId) {
                return { ...role, skills: role.skills.filter(s => s !== skillToRemove) };
            }
            return role;
        }));
    };

    const handleDeleteRole = (roleId: string) => {
        setRoles(roles.filter(role => role.id !== roleId));
    };

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

                {/* Display Cards */}
                {roles.map((role) => (
                    <View
                        key={role.id}
                        className={`bg-white rounded-3xl p-5 mb-5 shadow-sm ${role.isPrimary ? 'border-l-4 border-primary-full' : ''}`}
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
                                    {role.isPrimary && (
                                        <Text className="text-xs font-bold text-primary-full mt-0.5">Primary Role</Text>
                                    )}
                                </View>
                            </View>

                            <TouchableOpacity className="p-1" onPress={() => handleDeleteRole(role.id)}>
                                <Ionicons name="trash-outline" size={18} color="#A38F85" />
                            </TouchableOpacity>
                        </View>

                        {/* Skills Needed */}
                        <Text className="text-base font-bold text-text-title mb-1">Skills Needed</Text>
                        <View className="flex-row flex-wrap gap-2 mb-2">
                            {role.skills.map((skill) => (
                                <TouchableOpacity
                                    key={skill}
                                    onPress={() => handleRemoveSkill(role.id, skill)}
                                    className="flex-row items-center bg-primary-light border border-primary-mid rounded-full px-3 py-1.5"
                                >
                                    <Text className="text-xs font-semibold text-primary-full mr-1.5">{skill}</Text>
                                    <Ionicons name="close" size={12} color="#FF8C69" />
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Add Skill */}
                        <View className="flex-row items-center bg-inputbg rounded-2xl px-4 py-1.5 mb-5">
                            <TextInput
                                className="flex-1 text-sm text-text-title p-0 h-10"
                                placeholder="Add a skill (e.g. Next.js)..."
                                placeholderTextColor="#C5B7B1"
                                value={skillInputs[role.id] || ''}
                                onChangeText={(text) => setSkillInputs({ ...skillInputs, [role.id]: text })}
                                onSubmitEditing={() => handleAddSkill(role.id)}
                            />
                            <TouchableOpacity onPress={() => handleAddSkill(role.id)}>
                                <Text className="text-xs font-bold text-primary-full px-2">ADD</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Role Description */}
                        <Text className="text-base font-bold text-text-title mb-3">Role Description</Text>
                        <TextInput
                            className="bg-inputbg rounded-2xl px-4 py-3 text-sm text-text-title h-20"
                            placeholder={role.isPrimary ? "Describe the responsibilities and what you are looking for in a candidate..." : "Describe the responsibilities..."}
                            placeholderTextColor="#C5B7B1"
                            multiline
                            textAlignVertical="top"
                            value={role.description}
                            onChangeText={(text) => updateDescription(role.id, text)}
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
                                onValueChange={() => toggleBeginnerFriendly(role.id)}
                                value={role.isBeginnerFriendly}
                            />
                        </View>
                    </View>
                ))}

                {/* Add Another Role Button */}
                <TouchableOpacity className="border border-dashed border-primary-full rounded-3xl py-4 flex-row justify-center items-center bg-primary-light mb-5">
                    <Ionicons name="add-circle-outline" size={20} color="#FF8C69" className="mr-2" />
                    <Text className="text-primary-full font-bold text-sm">Add Another Role</Text>
                </TouchableOpacity>

                {/* Next Step Button */}
                <CustomButton width="100%" borderColor='#FF8C65' height={50} bgColor='#FF8C65' title='Next Step' titleColor='#fff' handelPress={() => {router.push('/create/create-step3')}} />

            </ScrollView>
        </SafeAreaView>
    );

}

export default CreateStep2;
