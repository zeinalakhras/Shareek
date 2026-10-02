import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, KeyboardTypeOptions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AntDesign, Feather } from '@expo/vector-icons'
import { Shadow } from 'react-native-shadow-2'
import { useRef, useState } from 'react';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker'

interface InputFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    clearable?: boolean;
    multiline?: boolean;
    keyboardType?: KeyboardTypeOptions;
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
    keyboardType
}) => (
    <View className="mb-3">
        <Text className="text-base font-semibold text-black mb-1">{label}</Text>
        <View className="flex-row items-center bg-white rounded-xl px-4 border border-gray-100 shadow-sm min-h-[48px]">
            <TextInput
                value={value}
                onChangeText={onChangeText}
                multiline={multiline}
                keyboardType={keyboardType}
                className="flex-1 text-gray-700 py-2 text-sm"
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

const DropdownField: React.FC<DropdownFieldProps> = ({ label, selectedValue, onValueChange }) => (
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
                <Picker.Item label="Al-Baath University (Homs)" value="Al-Baath University" />
                <Picker.Item label="Aleppo University" value="Aleppo University" />
                <Picker.Item label="Damascus University" value="Damascus University" />
                <Picker.Item label="Syrian Virtual University (SVU)" value="SVU" />
                <Picker.Item label="Tishreen University (Latakia)" value="Tishreen University" />
                <Picker.Item label="Cairo University" value="Cairo University" />
                <Picker.Item label="Harvard University" value="Harvard University" />
                <Picker.Item label="Massachusetts Institute of Technology (MIT)" value="MIT" />
                <Picker.Item label="Oxford University" value="Oxford University" />
                <Picker.Item label="Stanford University" value="Stanford University" />
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

const editProfile = () => {

    const [fullName, setFullName] = useState<string>('Nasser kamali');
    const [bio, setBio] = useState<string>('CS Junior at Cairo University. Passionate about UI/UX and React Native. Building things for the future🚀');
    const [phone, setPhone] = useState<string>('+963 930 000 000');
    const [location, setLocation] = useState<string>('Homs, Syria');

    const [projectDuration, setProjectDuration] = useState<string>('Long-term');
    const [collaborationStyle, setCollaborationStyle] = useState<string>('Remote');
    const [timeCommitment, setTimeCommitment] = useState<string>('Full-time');

    const [university, setUniversity] = useState<string>('Damascus University');

    const [major, setMajor] = useState<string>('IT-engineering');
    const [academicYear, setAcademicYear] = useState<string>('Third year');

    const [skills, setSkills] = useState<string[]>(['UI/UX', 'React Native']);
    const availableSkills: string[] = ['JavaScript', 'TypeScript', 'Python', 'Node.js', 'Git', 'Tailwind CSS' , 'Java' , 'UI/UX' , 'Next.js' , ''];

    const pickerRef = useRef<Picker<string>>(null);

    const handleSelectSkill = (itemValue: string) => {
        if (itemValue && !skills.includes(itemValue)) {
            setSkills([...skills, itemValue]);
        }
    };

    return (
        <SafeAreaView className='flex-1'>
            {/* Header */}
            <View className="flex-row justify-between items-center px-5 py-3">
                <TouchableOpacity className="p-2.5 bg-white rounded-full shadow-sm border border-gray-50" onPress={() => { router.back() }}>
                    <Feather name="arrow-left" size={20} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity className="p-2.5 bg-white rounded-full shadow-sm border border-gray-50">
                    <Feather name="check" size={20} color="#000" />
                </TouchableOpacity>
            </View>
            {/* Scroll View */}
            <ScrollView>
                <View>
                    {/* Photo & Name Section */}
                    <View className='items-center p-8 pb-4' style={{ gap: 15 }}>
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
                    {/* Input Fields Section */}
                    <View className="px-5 space-y-4">
                        <InputField label="Full name" value={fullName} onChangeText={setFullName} clearable />
                        <InputField label="Bio" value={bio} onChangeText={setBio} clearable multiline />
                        <InputField label="Phone number" value={phone} onChangeText={setPhone} clearable keyboardType="phone-pad" />
                        <InputField label="Location" value={location} onChangeText={setLocation} clearable />
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
                            {skills.map((skill, index) => (
                                <View key={index} className="flex-row items-center bg-[#FFE0D8] px-3 py-1.5 rounded-full">
                                    <Text className="text-[#FF8A65] font-medium text-sm mr-1">{skill}</Text>
                                    <TouchableOpacity onPress={() => setSkills(skills.filter(s => s !== skill))}>
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
                                    <Picker.Item key={skill} label={skill} value={skill} />
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
                        <DropdownField label="University" selectedValue={university} onValueChange={(itemValue) => setUniversity(itemValue)} />
                        <EditableField label="Major / Field of study" value={major} onChangeText={setMajor} />
                        <EditableField label="Current academic year" value={academicYear} onChangeText={setAcademicYear} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default editProfile