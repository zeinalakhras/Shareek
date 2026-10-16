import { Alert, View, Text, ScrollView, TouchableOpacity, Image, TextInput, KeyboardTypeOptions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AntDesign, Feather } from '@expo/vector-icons'
import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker'
import CustomButton from '@/components/CustomButton'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/useAuthStore'
import { getSkills } from '@/api/skill/skillApi'
import { getRoles } from '@/api/role/roleApi'
import { getUniversities } from '@/api/university/universityApi'
import { syncRoles, syncSkills, updateEducation, updatePreferences, updateUser } from '@/api/user/userApi'
import type { UpdateEducationRequest, UpdatePreferencesRequest, UpdateUserRequest } from '@/api/user/types'
import type { Skill } from '@/api/skill/types'
import type { Role } from '@/api/role/types'
import type { University } from '@/api/university/types'
import { getApiErrorMessage } from '@/utils/apiError'

interface InputFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    clearable?: boolean;
    multiline?: boolean;
    keyboardType?: KeyboardTypeOptions;
    editable?: boolean;
}

interface SelectionCardProps {
    title: string;
    children: React.ReactNode;
}

interface RadioOptionProps {
    label: string;
    selected: boolean;
    onSelect: () => void;
}

interface DropdownFieldProps {
    label: string;
    items: { label: string; value: string }[];
    selectedValue: string;
    onValueChange: (itemValue: string) => void;
}

interface EditableFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
}


const InputField: React.FC<InputFieldProps> = ({
    label,
    value,
    onChangeText,
    clearable,
    multiline,
    keyboardType,
    editable = true
}) => (
    <View className="mb-3">
        <Text className="text-base font-semibold text-black mb-1">{label}</Text>
        <View className={`flex-row items-center rounded-xl px-4 border border-gray-100 shadow-sm min-h-[48px] ${editable ? 'bg-white' : 'bg-gray-50'}`}>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                editable={editable}
                multiline={multiline}
                keyboardType={keyboardType}
                className={`flex-1 py-2 text-sm ${editable ? 'text-gray-700' : 'text-gray-400'}`}
                style={{ textAlignVertical: multiline ? 'top' : 'center' }}
            />
            {clearable && value.length > 0 && (
                <TouchableOpacity onPress={() => onChangeText('')} className="p-0.5 bg-black rounded-full ml-2">
                    <Feather name="x" size={12} color="#fff" />
                </TouchableOpacity>
            )}
        </View>
    </View>
);

const SelectionCard: React.FC<SelectionCardProps> = ({ title, children }) => (
    <View className="bg-white rounded-xl p-4 mb-3 border border-gray-100 shadow-sm">
        <Text className="text-sm text-gray-400 font-medium mb-2">{title}</Text>
        <View className="space-y-1">{children}</View>
    </View>
);

const RadioOption: React.FC<RadioOptionProps> = ({ label, selected, onSelect }) => (
    <TouchableOpacity onPress={onSelect} className={`flex-row justify-between items-center py-2.5 px-3 rounded-lg ${selected ? 'bg-[#EFEFEF]' : 'bg-transparent'}`}>
        <Text className="text-black text-sm font-medium">{label}</Text>
        <View className={`w-5 h-5 rounded-full border-2 justify-center items-center ${selected ? 'border-[#555] bg-[#555]' : 'border-gray-300'}`}>
            {selected && <Feather name="check" size={12} color="#fff" />}
        </View>
    </TouchableOpacity>
);

const DropdownField: React.FC<DropdownFieldProps> = ({ label, items, selectedValue, onValueChange }) => (
    <View className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-3">
        <Text className="text-sm text-gray-400 font-medium mb-2">{label}</Text>

        <View className="bg-[#EFEFEF] rounded-lg overflow-hidden h-12 justify-center px-1">
            <Picker
                selectedValue={selectedValue}
                onValueChange={onValueChange}
                dropdownIconColor="#000"
                mode="dropdown"
                style={{
                    color: '#000',
                    backgroundColor: 'transparent',
                }}
            >
                {items.map((item) => (
                    <Picker.Item key={item.value} label={item.label} value={item.value} />
                ))}
            </Picker>
        </View>
    </View>
);

const EditableField: React.FC<EditableFieldProps> = ({ label, value, onChangeText }) => (
    <View className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-3">
        <Text className="text-sm text-gray-400 font-medium mb-2">{label}</Text>
        <View className="flex-row justify-between items-center bg-[#EFEFEF] px-3 py-1 rounded-lg min-h-[48px]">
            <TextInput
                value={value}
                onChangeText={onChangeText}
                className="flex-1 text-black text-sm py-2"
                placeholder={`Enter ${label}...`}
                placeholderTextColor="#9CA3AF"
            />
            <View className="ml-2 pr-1">
                <Feather name="edit-2" size={14} color="#6B7280" />
            </View>
        </View>
    </View>
);

const WORK_PREFERENCES = ['Remote', 'On-site', 'Hybrid'];
const PROJECT_PREFERENCES = ['Long-term', 'Short-term'];

const pickOption = (value: string | null | undefined, options: string[], fallback: string): string =>
    options.find((option) => option.toLowerCase() === value?.toLowerCase()) ?? fallback;

const commitmentFromHours = (hours: number | null | undefined): string | null =>
    hours == null ? null : hours <= 10 ? '5-10 hours' : hours <= 20 ? '10-20 hours' : 'Full-time';

const HOURS_FROM_COMMITMENT: Record<string, number> = {
    '5-10 hours': 10,
    '10-20 hours': 20,
    'Full-time': 40,
};

interface Baseline {
    fullName: string;
    bio: string;
    phone: string;
    githubUrl: string;
    linkedinUrl: string;
    portfolioUrl: string;
    projectDuration: string;
    collaborationStyle: string;
    timeCommitment: string;
    universityId: string;
    major: string;
    academicYear: string;
    skillIds: string;
    roleIds: string;
}

const EMPTY_BASELINE: Baseline = {
    fullName: '',
    bio: '',
    phone: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    projectDuration: 'Long-term',
    collaborationStyle: 'Remote',
    timeCommitment: 'Full-time',
    universityId: '',
    major: '',
    academicYear: '',
    skillIds: '',
    roleIds: '',
};

const editProfile = () => {

    const { profile, refreshProfile } = useAuth();
    const accessToken = useAuthStore((state) => state.accessToken);
    const userId = profile?.id;
    const membership = profile?.is_student
        ? (profile.university?.name || 'University Student')
        : (profile?.major || 'Member');

    // Personal information — PATCH /users/{id}
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState(''); // display only — the API exposes no email update
    const [bio, setBio] = useState('');
    const [phone, setPhone] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [portfolioUrl, setPortfolioUrl] = useState('');

    const [projectDuration, setProjectDuration] = useState('Long-term');
    const [collaborationStyle, setCollaborationStyle] = useState('Remote');
    const [timeCommitment, setTimeCommitment] = useState('Full-time');

    const [universityId, setUniversityId] = useState('');
    const [major, setMajor] = useState('');
    const [academicYear, setAcademicYear] = useState('');

    const [skills, setSkills] = useState<Skill[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
    const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
    const [universities, setUniversities] = useState<University[]>([]);

    const [isSaving, setIsSaving] = useState(false);

    const pickerRef = useRef<Picker<string>>(null);
    const rolePickerRef = useRef<Picker<string>>(null);
    const hasPrefilled = useRef(false);
    const baseline = useRef<Baseline>(EMPTY_BASELINE);

    useEffect(() => {
        (async () => {
            const [skillsRes, rolesRes, universitiesRes] = await Promise.all([
                getSkills().catch(() => null),
                getRoles().catch(() => null),
                getUniversities().catch(() => null),
            ]);

            setAvailableSkills(skillsRes?.data ?? []);
            setAvailableRoles(rolesRes?.data ?? []);
            setUniversities(universitiesRes?.data ?? []);
        })();
    }, []);

    useEffect(() => {
        if (!profile || hasPrefilled.current) return;
        hasPrefilled.current = true;

        const nextProjectDuration = pickOption(profile.project_preference, PROJECT_PREFERENCES, 'Long-term');
        const nextCollaborationStyle = pickOption(profile.work_preference, WORK_PREFERENCES, 'Remote');
        const nextTimeCommitment = commitmentFromHours(profile.available_hours_per_week) ?? 'Full-time';
        const nextUniversityId = profile.university?.id ?? '';
        const nextMajor = profile.major ?? '';
        const nextAcademicYear = profile.study_year != null ? String(profile.study_year) : '';

        setFullName(profile.full_name ?? '');
        setEmail(profile.email ?? '');
        setBio(profile.bio ?? '');
        setPhone(profile.phone ?? '');
        setGithubUrl(profile.github_url ?? '');
        setLinkedinUrl(profile.linkedin_url ?? '');
        setPortfolioUrl(profile.portfolio_url ?? '');
        setProjectDuration(nextProjectDuration);
        setCollaborationStyle(nextCollaborationStyle);
        setTimeCommitment(nextTimeCommitment);
        setUniversityId(nextUniversityId);
        setMajor(nextMajor);
        setAcademicYear(nextAcademicYear);
        setSkills(profile.skills ?? []);
        setRoles(profile.roles ?? []);

        baseline.current = {
            fullName: profile.full_name ?? '',
            bio: profile.bio ?? '',
            phone: profile.phone ?? '',
            githubUrl: profile.github_url ?? '',
            linkedinUrl: profile.linkedin_url ?? '',
            portfolioUrl: profile.portfolio_url ?? '',
            projectDuration: nextProjectDuration,
            collaborationStyle: nextCollaborationStyle,
            timeCommitment: nextTimeCommitment,
            universityId: nextUniversityId,
            major: nextMajor,
            academicYear: nextAcademicYear,
            skillIds: (profile.skills ?? []).map((skill) => skill.id).sort().join(','),
            roleIds: (profile.roles ?? []).map((role) => role.id).sort().join(','),
        };
    }, [profile]);

    const handleSelectSkill = (skillId: string) => {
        const skill = availableSkills.find((candidate) => candidate.id === skillId);
        if (!skill) return;

        setSkills((current) =>
            current.some((entry) => entry.id === skill.id) ? current : [...current, skill]
        );
    };

    const handleSelectRole = (roleId: string) => {
        const role = availableRoles.find((candidate) => candidate.id === roleId);
        if (!role) return;

        setRoles((current) =>
            current.some((entry) => entry.id === role.id) ? current : [...current, role]
        );
    };

    const handleSave = async () => {
        if (!accessToken || !userId) {
            Alert.alert('Session expired', 'Your session has expired. Please sign in again to continue.');
            return;
        }

        const trimmedName = fullName.trim();
        if (trimmedName.length < 2) {
            Alert.alert('Name too short', 'Full name must be between 2 and 100 characters.');
            return;
        }

        const yearText = academicYear.trim();
        const studyYear = yearText === '' ? null : Number(yearText);
        if (yearText !== '' && (studyYear == null || !Number.isInteger(studyYear) || studyYear < 1 || studyYear > 7)) {
            Alert.alert('Academic year', 'Current academic year must be a whole number between 1 and 7.');
            return;
        }

        const base = baseline.current;
        const requests: Promise<unknown>[] = [];
        const userBody: UpdateUserRequest = {};
        if (trimmedName !== base.fullName) userBody.full_name = trimmedName;
        if (bio.trim() !== base.bio) userBody.bio = bio.trim();
        if (phone.trim() !== base.phone) userBody.phone = phone.trim();
        if (githubUrl.trim() !== base.githubUrl) userBody.github_url = githubUrl.trim();
        if (linkedinUrl.trim() !== base.linkedinUrl) userBody.linkedin_url = linkedinUrl.trim();
        if (portfolioUrl.trim() !== base.portfolioUrl) userBody.portfolio_url = portfolioUrl.trim();
        if (Object.keys(userBody).length > 0) {
            requests.push(updateUser(userId, userBody, accessToken));
        }

        const skillIds = skills.map((skill) => skill.id).sort().join(',');
        if (skillIds !== base.skillIds) {
            requests.push(syncSkills(userId, { skill_ids: skills.map((skill) => skill.id) }, accessToken));
        }

        const roleIds = roles.map((role) => role.id).sort().join(',');
        if (roleIds !== base.roleIds) {
            requests.push(syncRoles(userId, { role_ids: roles.map((role) => role.id) }, accessToken));
        }

        if (
            projectDuration !== base.projectDuration ||
            collaborationStyle !== base.collaborationStyle ||
            timeCommitment !== base.timeCommitment
        ) {
            const preferencesBody: UpdatePreferencesRequest = {
                project_preference: projectDuration,
                work_preference: collaborationStyle,
                available_hours_per_week: HOURS_FROM_COMMITMENT[timeCommitment],
            };
            requests.push(updatePreferences(userId, preferencesBody, accessToken));
        }
                const educationBody: UpdateEducationRequest = {};
        if (universityId && universityId !== base.universityId) educationBody.university_id = universityId;
        if (major.trim() !== base.major) educationBody.major = major.trim();
        if (studyYear !== null && String(studyYear) !== base.academicYear) educationBody.study_year = studyYear;
        if (Object.keys(educationBody).length > 0) {
            requests.push(updateEducation(userId, educationBody, accessToken));
        }

        if (requests.length === 0) {
            Alert.alert('No changes', 'There is nothing new to save yet.');
            return;
        }

        setIsSaving(true);
        try {
            await Promise.all(requests);

            hasPrefilled.current = false;
            await refreshProfile().catch(() => {
            });
            Alert.alert('Profile updated', 'Your changes have been saved.');
        } catch (error) {
            Alert.alert('Could not save', getApiErrorMessage(error, 'Something went wrong while saving your profile.'));
        } finally {
            setIsSaving(false);
        }
    };

    const currentUniversity = profile?.university ?? null;
    const universityItems = [
        { label: 'Not specified', value: '' },
        ...(currentUniversity && !universities.some((entry) => entry.id === currentUniversity.id)
            ? [{ label: currentUniversity.name, value: currentUniversity.id }]
            : []),
        ...universities.map((entry) => ({ label: entry.name, value: entry.id })),
    ];

    return (
        <SafeAreaView className='flex-1'>
            {/* Header */}
            <View className="flex-row justify-between items-center px-5 py-3">
                <TouchableOpacity className="p-2.5 bg-white rounded-full shadow-sm border border-gray-50" onPress={() => { router.back() }}>
                    <Feather name="arrow-left" size={20} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity className="p-2.5 bg-white rounded-full shadow-sm border border-gray-50" onPress={handleSave} disabled={isSaving}>
                    <Feather name="check" size={20} color="#000" />
                </TouchableOpacity>
            </View>
            {/* Scroll View */}
            <ScrollView>
                <View>
                    {/* Photo & Name Section */}
                    <View className='items-center p-8 pb-4' style={{ gap: 15 }}>
                        {/* Plain circle */}
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
                            <Text className='font-semibold text-2xl text-center'>{fullName || 'Your profile'}</Text>
                            <View className="bg-primary-light border border-primary-mid items-center px-4 py-1 rounded-full mt-2">
                                <Text className="text-primary-full font-medium text-xs">{membership}</Text>
                            </View>
                            <Text className="text-gray-500 text-center text-xs mt-2 font-medium tracking-wide">ID: {profile?.id ?? '—'}</Text>
                        </View>
                    </View>
                    {/* Input Fields Section */}
                    <View className="px-5 space-y-4">
                        <InputField label="Full name" value={fullName} onChangeText={setFullName} clearable />
                        <InputField label="Email" value={email} onChangeText={() => { }} editable={false} />
                        <InputField label="Bio" value={bio} onChangeText={setBio} clearable multiline />
                        <InputField label="Phone number" value={phone} onChangeText={setPhone} clearable keyboardType="phone-pad" />
                        <InputField label="GitHub URL" value={githubUrl} onChangeText={setGithubUrl} clearable keyboardType="url" />
                        <InputField label="LinkedIn URL" value={linkedinUrl} onChangeText={setLinkedinUrl} clearable keyboardType="url" />
                        <InputField label="Portfolio URL" value={portfolioUrl} onChangeText={setPortfolioUrl} clearable keyboardType="url" />
                    </View>
                    {/* Skills Section */}
                    <View className="px-5 mt-6">
                        <View className="flex-row justify-between items-center mb-3">
                            <Text className="text-lg font-bold text-black">Skills</Text>
                            <TouchableOpacity
                                className="flex-row items-center"
                                onPress={() => pickerRef.current?.focus()}
                            >
                                <AntDesign name="plus" size={16} color="#FF8A65" className="mr-1" />
                                <Text className="text-[#FF8A65] font-bold text-base">Add skill</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row flex-wrap gap-2">
                            {skills.length === 0 && (
                                <Text className="text-gray-400 text-sm">No skills selected yet.</Text>
                            )}
                            {skills.map((skill) => (
                                <View key={skill.id} className="flex-row items-center bg-[#FFE0D8] px-3 py-1.5 rounded-full">
                                    <Text className="text-[#FF8A65] font-medium text-sm mr-1">{skill.name}</Text>
                                    <TouchableOpacity onPress={() => setSkills(skills.filter((entry) => entry.id !== skill.id))}>
                                        <AntDesign name="close-circle" size={15} color="#FF8A65" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>

                        <View style={{ position: 'absolute', opacity: 0, height: 0, width: 0 }}>
                            <Picker
                                ref={pickerRef}
                                mode="dialog"
                                selectedValue=""
                                onValueChange={(itemValue) => handleSelectSkill(itemValue)}
                            >
                                {availableSkills.map((skill) => (
                                    <Picker.Item key={skill.id} label={skill.name} value={skill.id} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    {/* Roles Section */}
                    <View className="px-5 mt-6">
                        <View className="flex-row justify-between items-center mb-3">
                            <Text className="text-lg font-bold text-black">Roles</Text>
                            <TouchableOpacity
                                className="flex-row items-center"
                                onPress={() => rolePickerRef.current?.focus()}
                            >
                                <AntDesign name="plus" size={16} color="#FF8A65" className="mr-1" />
                                <Text className="text-[#FF8A65] font-bold text-base">Add role</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row flex-wrap gap-2">
                            {roles.length === 0 && (
                                <Text className="text-gray-400 text-sm">No roles selected yet.</Text>
                            )}
                            {roles.map((role) => (
                                <View key={role.id} className="flex-row items-center bg-[#FFE0D8] px-3 py-1.5 rounded-full">
                                    <Text className="text-[#FF8A65] font-medium text-sm mr-1">{role.name}</Text>
                                    <TouchableOpacity onPress={() => setRoles(roles.filter((entry) => entry.id !== role.id))}>
                                        <AntDesign name="close-circle" size={15} color="#FF8A65" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>

                        <View style={{ position: 'absolute', opacity: 0, height: 0, width: 0 }}>
                            <Picker
                                ref={rolePickerRef}
                                mode="dialog"
                                selectedValue=""
                                onValueChange={(itemValue) => handleSelectRole(itemValue)}
                            >
                                {availableRoles.map((role) => (
                                    <Picker.Item key={role.id} label={role.name} value={role.id} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    {/* Work Preferences Section */}
                    <View className="px-5 mt-6">
                        <Text className="text-lg font-bold text-black mb-3">Work Preferences</Text>
                        <SelectionCard title="Project Duration">
                            <RadioOption label="Long-term" selected={projectDuration === 'Long-term'} onSelect={() => setProjectDuration('Long-term')} />
                            <RadioOption label="Short-term" selected={projectDuration === 'Short-term'} onSelect={() => setProjectDuration('Short-term')} />
                        </SelectionCard>
                        <SelectionCard title="Collaboration Style">
                            <RadioOption label="Remote" selected={collaborationStyle === 'Remote'} onSelect={() => setCollaborationStyle('Remote')} />
                            <RadioOption label="On-site" selected={collaborationStyle === 'On-site'} onSelect={() => setCollaborationStyle('On-site')} />
                            <RadioOption label="Hybrid" selected={collaborationStyle === 'Hybrid'} onSelect={() => setCollaborationStyle('Hybrid')} />
                        </SelectionCard>
                        <SelectionCard title="Time commitment">
                            <RadioOption label="Full-time" selected={timeCommitment === 'Full-time'} onSelect={() => setTimeCommitment('Full-time')} />
                            <RadioOption label="5-10 hours\ week" selected={timeCommitment === '5-10 hours'} onSelect={() => setTimeCommitment('5-10 hours')} />
                            <RadioOption label="10-20 hours\ week" selected={timeCommitment === '10-20 hours'} onSelect={() => setTimeCommitment('10-20 hours')} />
                        </SelectionCard>
                    </View>
                    {/* Academic Path Section */}
                    <View className="px-5 mt-6 space-y-3">
                        <Text className="text-lg font-bold text-black mb-1">Academic Path</Text>
                        <DropdownField label="University" items={universityItems} selectedValue={universityId} onValueChange={(itemValue) => setUniversityId(itemValue)} />
                        <EditableField label="Major / Field of study" value={major} onChangeText={setMajor} />
                        <EditableField label="Current academic year (1-7)" value={academicYear} onChangeText={setAcademicYear} />
                    </View>
                    {/* Save */}
                    <View className="px-5 mt-6 mb-8">
                        <CustomButton
                            width="100%"
                            borderColor="#FF8C65"
                            height={50}
                            bgColor="#FF8C65"
                            title="Save Changes"
                            titleColor="#fff"
                            isLoading={isSaving}
                            handelPress={handleSave}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default editProfile