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
  Alert,
  ActivityIndicator
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressBar from '@/components/ProgressBar';
import { Entypo, Ionicons } from '@expo/vector-icons';
import CustomButton from '@/components/CustomButton';
import { router, useLocalSearchParams } from 'expo-router';
import { useSignUpStore } from '@/store/useSignUpStore';
import { useAuthStore } from '@/store/useAuthStore';
import { getUniversities } from '@/api/university/universityApi';
import { updateEducation } from '@/api/user/userApi';
import type { University } from '@/api/university/types';
import type { UpdateEducationRequest } from '@/api/user/types';
import { getApiErrorMessage } from '@/utils/apiError';

interface SelectModalProps<T> {
  visible: boolean;
  data: T[];
  title: string;
  keyExtractor: (item: T) => string;
  renderLabel: (item: T) => string;
  onClose: () => void;
  onSelect: (item: T) => void;
  isLoading?: boolean;
  emptyLabel?: string;
}

const SelectModal = <T,>({
  visible,
  data,
  title,
  keyExtractor,
  renderLabel,
  onClose,
  onSelect,
  isLoading,
  emptyLabel
}: SelectModalProps<T>) => (
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
            {isLoading ? (
              <ActivityIndicator size="small" color="#FF8C69" className="my-6" />
            ) : data.length === 0 ? (
              <Text className="text-text-placeholder text-center py-6">
                {emptyLabel ?? 'Nothing to choose from yet.'}
              </Text>
            ) : (
              <FlatList
                data={data}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    className="py-4 border-b border-gray-100 active:bg-gray-50" 
                    onPress={() => {
                      onSelect(item);
                      onClose();
                    }}
                  >
                    <Text className="text-lg text-slate-700">{renderLabel(item)}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);

interface StudyYearOption {
  label: string;
  value: number;
}

const studyYears: StudyYearOption[] = [
  { label: 'First Year', value: 1 },
  { label: 'Second Year', value: 2 },
  { label: 'Third Year', value: 3 },
  { label: 'Fourth Year', value: 4 },
  { label: 'Fifth Year+', value: 5 },
];

const studyYearLabel = (value: number | null): string =>
  studyYears.find((option) => option.value === value)?.label ?? '';

const SignUpStep3 = () => {

  const previousParams = useLocalSearchParams();
  const updateFormData = useSignUpStore((state) => state.updateFormData);
  const formData = useSignUpStore((state) => state.formData);
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const accessToken = useAuthStore((state) => state.accessToken);
  const userId = user?.id ?? profile?.id;

  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedUniversityId, setSelectedUniversityId] = useState<string>('');
  const [major, setMajor] = useState<string>('');
  const [studyYear, setStudyYear] = useState<number | null>(null);
  const [isStudent, setIsStudent] = useState<boolean>(
    () => formData.isStudent ?? true
  );

  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [showUniModal, setShowUniModal] = useState<boolean>(false);
  const [showYearModal, setShowYearModal] = useState<boolean>(false);

  const fetchUniversities = useCallback(async () => {
    setIsFetching(true);
    setLoadError(null);

    try {
      const response = await getUniversities();
      setUniversities(response.data ?? []);
    } catch (error) {
      setLoadError(getApiErrorMessage(error, 'Could not load universities. Please try again.'));
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  const selectedUniversity = universities.find(
    (university) => university.id === selectedUniversityId
  );
  const selectedYearLabel = studyYearLabel(studyYear);

  const handleContinue = async () => {

    if (isStudent && !selectedUniversityId) {
      Alert.alert('Missing Field', 'Please select your university.');
      return;
    }
    if (isStudent && !major.trim()) {
      Alert.alert('Missing Field', 'Please enter your major or field of study.');
      return;
    }
    if (isStudent && studyYear === null) {
      Alert.alert('Missing Field', 'Please select your year of study.');
      return;
    }

    if (!userId || !accessToken) {
      Alert.alert('Session expired', 'Your session has expired. Please sign in again to continue.');
      return;
    }

    const payload: UpdateEducationRequest = { is_student: isStudent };

    if (isStudent) {
      payload.university_id = selectedUniversityId;
      payload.major = major.trim();
      payload.study_year = studyYear ?? undefined;
    }

    setIsSubmitting(true);

    try {
      
      await updateEducation(userId, payload, accessToken);

      updateFormData({
        university: selectedUniversity?.name,
        major: major.trim(),
        academicYear: selectedYearLabel,
        isStudent,
      });

      router.push({
        pathname: '/(setup)/step4',
        params: {
          ...previousParams,
          university: selectedUniversity?.name ?? '',
          major: major.trim(),
          year: selectedYearLabel,
          isStudent: isStudent.toString(),
        },
      });
    } catch (error) {
      Alert.alert('Could not save your studies', getApiErrorMessage(error, 'Something went wrong while saving your studies. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
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
                disabled={!isStudent}
                className={`flex-row items-center bg-inputbg rounded-2xl p-4 ${isStudent ? '' : 'opacity-50'}`}
              >
                <Ionicons name="school-outline" size={24} color="#FF8C69" />
                <Text 
                  className={`flex-1 ml-3 text-base ${selectedUniversity ? 'text-slate-800 font-medium' : 'text-text-placeholder'}`}
                  numberOfLines={1}
                >
                  {selectedUniversity?.name ?? 'Select your university'}
                </Text>
                <Entypo name="chevron-small-down" size={24} color="#1e293b" />
              </TouchableOpacity>

              {/* Fetch failure is recoverable — offer a retry rather than stranding the step */}
              {loadError && (
                <View className="flex-row items-center justify-between mt-3">
                  <Text className="text-secondry-red text-xs flex-1 mr-3">{loadError}</Text>
                  <TouchableOpacity
                    onPress={fetchUniversities}
                    className="bg-primary-light border border-primary-mid px-3 py-1.5 rounded-full"
                  >
                    <Text className="text-primary-full font-semibold text-xs">Retry</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Education fields only apply to students — dimmed when the toggle is off,
                    since they would not be sent. */}
            <View className={`w-full bg-white rounded-2xl p-5 mb-4 shadow-sm ${isStudent ? '' : 'opacity-50'}`}>
              <View className="mb-5">
                <Text className="text-text-title text-base font-semibold mb-2">Major / Field of Study</Text>
                <TextInput 
                  placeholder="e.g., Computer Engineering"
                  placeholderTextColor="#94A0B8"
                  value={major}
                  onChangeText={setMajor}
                  editable={isStudent}
                  className="bg-inputbg rounded-2xl p-4 text-base text-slate-800"
                />
              </View>

              <View>
                <Text className="text-text-title text-base font-semibold mb-2">Current Year of Study</Text>
                <TouchableOpacity 
                  activeOpacity={0.7}
                  disabled={!isStudent}
                  onPress={() => setShowYearModal(true)}
                  className="flex-row items-center bg-inputbg rounded-2xl p-4"
                >
                  <Text className={`flex-1 text-base ${studyYear !== null ? 'text-slate-800 font-medium' : 'text-text-placeholder'}`}>
                    {selectedYearLabel || 'Select your year'}
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
              isLoading={isSubmitting}
              disable={isFetching || Boolean(loadError)}
              handelPress={handleContinue}
            />

          </View>
        </ScrollView>

        <SelectModal<University> 
          visible={showUniModal} 
          title="Select University"
          data={universities} 
          keyExtractor={(item) => item.id}
          renderLabel={(item) => (item.country ? `${item.name} · ${item.country}` : item.name)}
          isLoading={isFetching}
          emptyLabel="No universities available right now."
          onClose={() => setShowUniModal(false)} 
          onSelect={(item) => setSelectedUniversityId(item.id)} 
        />

        <SelectModal<StudyYearOption> 
          visible={showYearModal} 
          title="Select Year of Study"
          data={studyYears} 
          keyExtractor={(item) => String(item.value)}
          renderLabel={(item) => item.label}
          onClose={() => setShowYearModal(false)} 
          onSelect={(item) => setStudyYear(item.value)} 
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpStep3;