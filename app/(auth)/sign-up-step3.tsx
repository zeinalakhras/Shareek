import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  FlatList, 
  TouchableWithoutFeedback, 
  TextInput, 
  Switch, 
  KeyboardAvoidingView, 
  Platform, 
  Alert 
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressBar from '@/components/ProgressBar';
import { Entypo, Ionicons } from '@expo/vector-icons';
import CustomButton from '@/components/CustomButton';
import { router, useLocalSearchParams } from 'expo-router';

interface SelectModalProps {
  visible: boolean;
  data: string[];
  title: string;
  onClose: () => void;
  onSelect: (item: string) => void;
}

const SelectModal: React.FC<SelectModalProps> = ({ visible, data, onClose, onSelect, title }) => (
  <Modal 
    visible={visible} 
    animationType="slide" 
    transparent={true} 
    onRequestClose={onClose}
    statusBarTranslucent={true}
  >
    <TouchableWithoutFeedback onPress={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <TouchableWithoutFeedback>
          <View className="bg-white rounded-t-[30px] p-6 max-h-[70%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-slate-800">{title}</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={28} color="#64748b" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={data}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  className="py-4 border-b border-gray-100 active:bg-gray-50" 
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <Text className="text-lg text-slate-700">{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);

const universities: string[] = [
  "Damascus University", 
  "University of Homs", 
  "Zayed University",
  "Khalifa University"
];

const years: string[] = [
  "First Year", 
  "Second Year", 
  "Third Year", 
  "Fourth Year", 
  "Fifth Year+", 
  "Graduate"
];

const SignUpStep3 = () => {

  const previousParams = useLocalSearchParams();

  const [university, setUniversity] = useState<string>('Select your university');
  const [major, setMajor] = useState<string>('');
  const [year, setYear] = useState<string>('Select your year');
  const [isStudent, setIsStudent] = useState<boolean>(true);

  const [showUniModal, setShowUniModal] = useState<boolean>(false);
  const [showYearModal, setShowYearModal] = useState<boolean>(false);

  const handleContinue = () => {
    if (university.includes('Select')) {
      Alert.alert('Missing Field', 'Please select your university.');
      return;
    }
    if (!major.trim()) {
      Alert.alert('Missing Field', 'Please enter your major or field of study.');
      return;
    }
    if (year.includes('Select')) {
      Alert.alert('Missing Field', 'Please select your year of study.');
      return;
    }

    router.push({
      pathname: '/(auth)/sign-up-step4',
      params: {
        ...previousParams,
        university,
        major: major.trim(),
        year,
        isStudent: isStudent.toString(),
      },
    });
  };

  return (
    <SafeAreaView className='bg-bg flex-1'>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ paddingBottom: 40, marginTop: 15 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className='px-6 items-center'>
            <ProgressBar stepCount={5} stepNumber={3} />
            <Text className='text-4xl font-bold text-center mb-3 text-slate-900'>Tell us about your studies</Text>
            <Text className='text-[#7a7a7a] text-lg text-center mb-6'>Connect with students from your university or similar fields of study.</Text>

            {/* University Selection */}
            <View className="w-full bg-white rounded-2xl p-5 mb-4 shadow-sm">
              <Text className="text-text-title text-base font-semibold mb-2">University / Institution</Text>
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => setShowUniModal(true)}
                className="flex-row items-center bg-inputbg rounded-2xl p-4"
              >
                <Ionicons name="school-outline" size={24} color="#FF8C69" />
                <Text 
                  className={`flex-1 ml-3 text-base ${university.includes('Select') ? 'text-text-placeholder' : 'text-slate-800 font-medium'}`}
                  numberOfLines={1}
                >
                  {university}
                </Text>
                <Entypo name="chevron-small-down" size={24} color="#1e293b" />
              </TouchableOpacity>
            </View>

            {/* Major & Year Selection */}
            <View className="w-full bg-white rounded-2xl p-5 mb-4 shadow-sm">
              <View className="mb-5">
                <Text className="text-text-title text-base font-semibold mb-2">Major / Field of Study</Text>
                <TextInput 
                  placeholder="e.g., Computer Engineering"
                  placeholderTextColor="#94A0B8"
                  value={major}
                  onChangeText={setMajor}
                  className="bg-inputbg rounded-2xl p-4 text-base text-slate-800"
                />
              </View>

              <View>
                <Text className="text-text-title text-base font-semibold mb-2">Current Year of Study</Text>
                <TouchableOpacity 
                  activeOpacity={0.7}
                  onPress={() => setShowYearModal(true)}
                  className="flex-row items-center bg-inputbg rounded-2xl p-4"
                >
                  <Text className={`flex-1 text-base ${year.includes('Select') ? 'text-text-placeholder' : 'text-slate-800 font-medium'}`}>
                    {year}
                  </Text>
                  <Entypo name="chevron-small-down" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Student Switch */}
            <View className="w-full bg-white rounded-2xl p-5 mb-8 flex-row items-center justify-between shadow-sm">
              <View className="flex-1 mr-4">
                <Text className="text-text-title text-base font-bold mb-1">I am currently a student</Text>
                <Text className="text-text-placeholder text-sm leading-5">This helps us badge your profile and prioritize university project matches.</Text>
              </View>
              <Switch
                trackColor={{ false: "#cbd5e1", true: "#ffbd9b" }}
                thumbColor={isStudent ? "#ff7e4e" : "#f4f3f4"}
                onValueChange={() => setIsStudent(!isStudent)}
                value={isStudent}
              />
            </View>

            <CustomButton 
              width='100%' 
              height={52} 
              borderColor='#FF8C69' 
              bgColor='#FF8C69' 
              title='Continue' 
              titleColor='#fff' 
              handelPress={handleContinue}
            />

          </View>
        </ScrollView>

        <SelectModal 
          visible={showUniModal} 
          title="Select University"
          data={universities} 
          onClose={() => setShowUniModal(false)} 
          onSelect={(val) => setUniversity(val)} 
        />

        <SelectModal 
          visible={showYearModal} 
          title="Select Year of Study"
          data={years} 
          onClose={() => setShowYearModal(false)} 
          onSelect={(val) => setYear(val)} 
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpStep3;