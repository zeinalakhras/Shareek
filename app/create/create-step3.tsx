import { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import SimpleProgressBar from '@/components/SimpleProgressBar';
import CustomButton from '@/components/CustomButton';

const CreateStep3 = () => {

    const router = useRouter();
    const [visibility, setVisibility] = useState<boolean>(true);
    const [selectedTimes, setSelectedTimes] = useState<string[]>(['Evenings', 'Weekends']);
    const availableTimes = ['Weekdays', 'Evenings', 'Weekends', 'Flexible'];
    const [isUniversityProject, setIsUniversityProject] = useState(false);

    const toggleTimeSelection = (time: string) => {
        if (selectedTimes.includes(time)) {
            setSelectedTimes(selectedTimes.filter((t) => t !== time));
        } else {
            setSelectedTimes([...selectedTimes, time]);
        }
    };

    const handleLaunchProject = () => {
        router.push('/create/success')
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
                <Text className="text-lg font-bold text-text-title">Project Settings</Text>
                <View className="w-10" />
            </View>

            {/* Content */}
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* ProgressBar */}
                <SimpleProgressBar stepNumber={3} stepCount={3} />

                {/* Project Visibility */}
                <View className="bg-white rounded-3xl p-5 mb-5 shadow-sm">
                    <View className="flex-row items-start mb-4">
                        <View className="w-10 h-10 rounded-full bg-primary-light justify-center items-center mr-3">
                            <Ionicons name="eye-outline" size={18} color="#FF8C69" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-bold text-text-title">Project Visibility</Text>
                            <Text className="text-xs text-secondry-text mt-0.5 leading-4">Who can see this project? Control access for sensitive work.</Text>
                        </View>
                    </View>
                    <View className="bg-inputbg p-1 rounded-full flex-row">
                        <TouchableOpacity
                            onPress={() => setVisibility(true)}
                            className="flex-1 flex-row justify-center items-center py-2.5 rounded-full"
                            style={visibility ? { backgroundColor: '#FFFFFF', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 } : {}}
                        >
                            <Ionicons name="earth" size={16} color={visibility ? '#FF8C69' : '#A38F85'} className="mr-1.5" />
                            <Text className={`text-sm font-bold ${visibility ? 'text-primary-full' : 'text-secondry-text'}`}>Public</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setVisibility(false)}
                            className="flex-1 flex-row justify-center items-center py-2.5 rounded-full"
                            style={!visibility ? { backgroundColor: '#FFFFFF', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 } : {}}
                        >
                            <Ionicons name="lock-closed" size={16} color={!visibility ? '#FF8C69' : '#A38F85'} className="mr-1.5" />
                            <Text className={`text-sm font-bold ${!visibility ? 'text-primary-full' : 'text-secondry-text'}`}>Private</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Logistics */}
                <View className="bg-white rounded-3xl p-5 mb-5 shadow-sm">
                    <View className="flex-row items-start mb-4">
                        <View className="w-10 h-10 rounded-full bg-primary-light justify-center items-center mr-3">
                            <Ionicons name="time-outline" size={18} color="#FF8C69" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-bold text-text-title">Logistics</Text>
                            <Text className="text-xs text-secondry-text mt-0.5 leading-4">When and how long will you work on this?</Text>
                        </View>
                    </View>

                    {/* Preferred Collaboration Time */}
                    <Text className="text-base font-bold text-text-title mb-2.5">Preferred Collaboration Time</Text>
                    <View className="flex-row flex-wrap gap-2 mb-5">
                        {availableTimes.map((time) => {
                            const isSelected = selectedTimes.includes(time);
                            return (
                                <TouchableOpacity
                                    key={time}
                                    onPress={() => toggleTimeSelection(time)}
                                    className={`px-4 py-2 rounded-full border ${isSelected ? 'bg-primary-full border-primary-full' : 'bg-[#white] border-[#EFEAE6]'}`}
                                >
                                    <Text className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-secondry-text'}`}>
                                        {time}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Expected Duration Dropdown */}
                    <Text className="text-base font-bold text-text-title mb-2">Expected Duration</Text>
                    <TouchableOpacity className="flex-row justify-between items-center bg-inputbg border border-[#EFEAE6] rounded-2xl px-4 py-3">
                        <Text className="text-sm text-secondry-text">Select duration...</Text>
                        <Ionicons name="chevron-down" size={18} color="#A38F85" />
                    </TouchableOpacity>
                </View>

                {/* University Project Switch */}
                <View className="bg-white rounded-3xl p-4 flex-row justify-between items-center mb-5 shadow-sm">
                    <View className="flex-row items-center flex-1 pr-4">
                        <View className="w-10 h-10 rounded-full bg-primary-light justify-center items-center mr-3">
                            <FontAwesome5 name="graduation-cap" size={16} color="#FF8C69" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-bold text-text-title">University Project</Text>
                            <Text className="text-xs text-secondry-text mt-0.5">Is this for a class?</Text>
                        </View>
                    </View>
                    <Switch
                        trackColor={{ false: '#EFEAE6', true: '#FF8C69' }}
                        thumbColor={'#FFFFFF'}
                        ios_backgroundColor="#EFEAE6"
                        onValueChange={setIsUniversityProject}
                        value={isUniversityProject}
                    />
                </View>

                {/* Attach Picture */}
                <TouchableOpacity className="bg-white rounded-3xl p-4 flex-row justify-between items-center mb-10 shadow-sm border border-transparent active:border-[#EFEAE6]">
                    <View className="flex-row items-center">
                        <View className="w-10 h-10 rounded-full bg-[#F2ECE9] justify-center items-center mr-3">
                            <MaterialIcons name="photo-library" size={18} color="#A38F85" />
                        </View>
                        <Text className="text-base font-bold text-secondry-text">Attach a picture of the project</Text>
                    </View>
                    <Ionicons name="add" size={20} color="#A38F85" />
                </TouchableOpacity>

                {/* Launch Project Button */}
                <CustomButton width="100%" borderColor='#FF8C65' height={50} bgColor='#FF8C65' title='Launch Project' titleColor='#fff' handelPress={() => { handleLaunchProject() }} />


            </ScrollView>
        </SafeAreaView>
    );

}

export default CreateStep3;