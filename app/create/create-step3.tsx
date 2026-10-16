import { useEffect, useState } from 'react';
import { Alert, Image, Text, View, TouchableOpacity, ScrollView, Switch, Modal, Pressable, FlatList } from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons, Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import SimpleProgressBar from '@/components/SimpleProgressBar';
import CustomButton from '@/components/CustomButton';
import { updateProject, uploadProjectAvatar } from '@/api/project/projectApi';
import { useAuthStore } from '@/store/useAuthStore';
import { getApiErrorMessage } from '@/utils/apiError';

const CreateStep3 = () => {

    const router = useRouter();
    const { projectId } = useLocalSearchParams<{ projectId: string }>();
    const accessToken = useAuthStore((state) => state.accessToken);

    const [visibility, setVisibility] = useState<boolean>(true);
    const [selectedTimes, setSelectedTimes] = useState<string[]>(['Evenings', 'Weekends']);
    const availableTimes = ['Weekdays', 'Evenings', 'Weekends', 'Flexible'];
    const [isUniversityProject, setIsUniversityProject] = useState(false);

    const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        if (!projectId) {
            Alert.alert('Project missing', 'Start the flow again from the first step.');
            router.replace('/create/create-step1');
        }
    }, [projectId, router]);

    const toggleTimeSelection = (time: string) => {
        if (selectedTimes.includes(time)) {
            setSelectedTimes(selectedTimes.filter((t) => t !== time));
        } else {
            setSelectedTimes([...selectedTimes, time]);
        }
    };

    const handlePickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission Denied', 'Permission to access gallery is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0].uri) {
            setImage(result.assets[0]);
        }
    };

    const handleLaunchProject = async () => {
        if (!projectId || !accessToken) {
            Alert.alert('Session expired', 'Your session has expired. Please sign in again to continue.');
            return;
        }

        setIsSubmitting(true);

        try {
            await updateProject(projectId, accessToken, {
                visibility: visibility ? 'public' : 'private',
            });

            if (image?.uri) {
                const file = {
                    uri: image.uri,
                    name: image.fileName ?? 'project.jpg',
                    type: image.mimeType ?? 'image/jpeg',
                } as unknown as File;

                await uploadProjectAvatar(projectId, accessToken, file);
            }

            router.push('/create/success');
        } catch (error) {
            Alert.alert('Could not launch project', getApiErrorMessage(error, 'Something went wrong while launching your project.'));
        } finally {
            setIsSubmitting(false);
        }
    };


    const DURATION_OPTIONS = [
        { id: '1', label: 'Less than a week' },
        { id: '2', label: '1 - 2 weeks' },
        { id: '3', label: '1 month' },
        { id: '4', label: '2 - 3 months' },
        { id: '5', label: 'More than 3 months' },
    ];

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
                    <TouchableOpacity
                        onPress={() => setIsModalVisible(true)}
                        className="flex-row justify-between items-center bg-inputbg border border-[#EFEAE6] rounded-2xl px-4 py-3">
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
                <TouchableOpacity
                    onPress={handlePickImage}
                    className="bg-white rounded-3xl p-4 flex-row justify-between items-center mb-10 shadow-sm border border-transparent active:border-[#EFEAE6]"
                >
                    <View className="flex-row items-center flex-1">
                        <View className="w-10 h-10 rounded-full bg-[#F2ECE9] justify-center items-center mr-3 overflow-hidden">
                            {image?.uri ? (
                                <Image source={{ uri: image.uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                            ) : (
                                <MaterialIcons name="photo-library" size={18} color="#A38F85" />
                            )}
                        </View>
                        <Text className="text-base font-bold text-secondry-text">
                            {image ? 'Change project picture' : 'Attach a picture of the project'}
                        </Text>
                    </View>
                    <Ionicons name={image ? 'checkmark-circle' : 'add'} size={20} color={image ? '#FF8C69' : '#A38F85'} />
                </TouchableOpacity>

                {/* Launch Project Button */}
                <CustomButton width="100%" borderColor='#FF8C65' height={50} bgColor='#FF8C65' title='Launch Project' titleColor='#fff'
                    isLoading={isSubmitting}
                    handelPress={() => { handleLaunchProject() }} />

            </ScrollView>

            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsModalVisible(false)}
                statusBarTranslucent={true}
            >
                <Pressable
                    className="flex-1 bg-black/50 justify-end"
                    onPress={() => setIsModalVisible(false)}
                >
                    <View className="bg-white rounded-t-3xl p-5 max-h-[50%]">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-bold text-text-title">Select Expected Duration</Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                <Ionicons name="close" size={22} color="#A38F85" />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={DURATION_OPTIONS}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => {
                                const isSelected = selectedDuration === item.label;
                                return (
                                    <TouchableOpacity
                                        className={`py-3.5 px-4 rounded-xl mb-2 flex-row justify-between items-center ${isSelected ? 'bg-primary-full/10' : 'bg-white'
                                            }`}
                                        onPress={() => {
                                            setSelectedDuration(item.label);
                                            setIsModalVisible(false); // إغلاق القائمة بعد الاختيار
                                        }}
                                    >
                                        <Text className={`text-sm font-semibold ${isSelected ? 'text-primary-full' : 'text-text-title'}`}>
                                            {item.label}
                                        </Text>
                                        {isSelected && (
                                            <Ionicons name="checkmark" size={18} color="#FF8C69" />
                                        )}
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                </Pressable>
            </Modal>

        </SafeAreaView>
    );

}


export default CreateStep3;

