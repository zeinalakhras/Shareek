import { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressBar from '@/components/ProgressBar';
import SimpleProgressBar from '@/components/SimpleProgressBar';
import CustomButton from '@/components/CustomButton';


const Create = () => {

  const router = useRouter();
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Frontend']);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customTagName, setCustomTagName] = useState('');

  const handleAddCustomTag = () => {
    if (customTagName.trim() === '') {
      setIsAddingCustom(false);
      return;
    }
    const newTagId = customTagName.trim();
    if (!tagsList.some(t => t.id.toLowerCase() === newTagId.toLowerCase())) {
      const newTag = {
        id: newTagId,
        label: newTagId,
        icon: 'star-outline',
        iconType: 'Ionicons'
      };
      setTagsList([...tagsList, newTag]);
    }

    if (!selectedTags.includes(newTagId)) {
      setSelectedTags([...selectedTags, newTagId]);
    }
    setCustomTagName('');
    setIsAddingCustom(false);
  };

  const toggleTag = (tagId: string) => {
    const coreTags = ['Frontend', 'Backend', 'UI/UX', 'Mobile'];
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagId));
      if (!coreTags.includes(tagId)) {
        setTagsList(tagsList.filter((t) => t.id !== tagId));
      }
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const [tagsList, setTagsList] = useState([
    { id: 'Frontend', label: 'Frontend', icon: 'code-slash', iconType: 'Ionicons' },
    { id: 'Backend', label: 'Backend', icon: 'database', iconType: 'FontAwesome5' },
    { id: 'UI/UX', label: 'UI/UX', icon: 'color-palette-outline', iconType: 'Ionicons' },
    { id: 'Mobile', label: 'Mobile', icon: 'phone-portrait-outline', iconType: 'Ionicons' },
  ]);

  return (
    <SafeAreaView className="flex-1 bg-bg">
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 py-4">
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/home')}
          className="p-2 bg-white rounded-full shadow-sm border border-gray-50"
        >
          <Feather name="arrow-left" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-text-title">Create Project</Text>
        <View className="w-10" />
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ProgressBar */}
        <SimpleProgressBar stepNumber={1} stepCount={3} />

        {/* Main Titles */}
        <Text className="text-2xl font-extrabold text-text-title leading-8 mb-1.5">Let's start with the basics.</Text>
        <Text className="text-base text-[#A38F85] mb-7">Tell us a bit about your idea.</Text>

        {/* Project Name Input Field */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-text-title mb-2.5">Project Name</Text>
          <TextInput
            className="bg-white rounded-3xl px-5 py-4 text-base text-text-title border border-[#FFF1EC] shadow-sm"
            placeholder="e.g., AI Study Buddy"
            placeholderTextColor="#C5B7B1"
            value={projectName}
            onChangeText={setProjectName}
          />
        </View>

        {/* Project Description Input Field */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-text-title mb-2.5">Project Description</Text>
          <TextInput
            className="bg-white rounded-2xl px-5 py-4 text-base text-text-title border border-[#FFF1EC] shadow-sm h-[120px]"
            placeholder="Briefly describe what you want to build..."
            placeholderTextColor="#C5B7B1"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={projectDescription}
            onChangeText={setProjectDescription}
          />
        </View>

        {/* Required Specializations Section */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-base font-bold text-text-title">Who do you need?</Text>
          <TouchableOpacity onPress={() => { setIsAddingCustom(true) }}>
            <Text className="text-sm font-semibold text-primary-full">Add Custom +</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row flex-wrap gap-2.5 mb-10 items-center">
          {tagsList.map((tag) => {
            const isSelected = selectedTags.includes(tag.id);
            return (
              <TouchableOpacity
                key={tag.id}
                className={`flex-row items-center rounded-full px-3.5 py-2.5 border ${isSelected ? 'bg-primary-full border-primary-full' : 'bg-white border-[#EFEAE6]'
                  }`}
                onPress={() => toggleTag(tag.id)}
              >
                {tag.iconType === 'Ionicons' ? (
                  <Ionicons
                    name={tag.icon as any}
                    size={16}
                    color={isSelected ? '#FFF' : '#A38F85'}
                    className="mr-1.5"
                  />
                ) : (
                  <FontAwesome5
                    name={tag.icon}
                    size={14}
                    color={isSelected ? '#FFF' : '#A38F85'}
                    className="mr-1.5"
                  />
                )}
                <Text className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-[#A38F85]'}`}>
                  {tag.label}
                </Text>
              </TouchableOpacity>
            );
          })}
          {!isAddingCustom ? (
            <TouchableOpacity
              onPress={() => setIsAddingCustom(true)}
              className="w-[38px] h-[38px] rounded-full bg-white justify-center items-center border border-[#EFEAE6]"
            >
              <Ionicons name="add" size={20} color="#A38F85" />
            </TouchableOpacity>
          ) : (
            <View className="flex-row justify-between items-center px-2 bg-white border border-[#EFEAE6] rounded-full h-[42px]" style={{ width: 120 }}>
              <TextInput
                className="text-sm font-semibold text-text-title"
                placeholder="Custom..."
                placeholderTextColor="#C5B7B1"
                value={customTagName}
                onChangeText={setCustomTagName}
                autoFocus
                onSubmitEditing={handleAddCustomTag}
              />
              <TouchableOpacity
                onPress={handleAddCustomTag}
                className="bg-primary-full rounded-full w-8 h-8 justify-center items-center"
              >
                <Ionicons name="checkmark" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Next Step Button */}
        <CustomButton width="100%" borderColor='#FF8C65' height={50} bgColor='#FF8C65' title='Next Step' titleColor='#fff'
          handelPress={() => {
            router.push({
              pathname: '/create/create-step2',
              params: { selectedRoles: selectedTags.join(',') }
            });
          }} />

      </ScrollView>
    </SafeAreaView>
  );


}


export default Create;
