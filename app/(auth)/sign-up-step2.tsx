import React, { useState } from 'react'
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard, 
  Alert 
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ProgressBar from '@/components/ProgressBar'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import CustomButton from '@/components/CustomButton'
import { router, useLocalSearchParams } from 'expo-router'

const SignUpStep2 = () => {

  // Retrieve params passed from Step 1
  const params = useLocalSearchParams()

  const [bio, setBio] = useState<string>('')
  const [selectedRole, setSelectedRole] = useState<string>('Frontend Developer')
  const [otherRole, setOtherRole] = useState<string>('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [searchSkill, setSearchSkill] = useState<string>('')

  const roles = [
    'Frontend Developer', 
    'Backend Developer', 
    'Fullstack Developer',
    'UI/UX Designer', 
    'Mobile Developer', 
    'Project Manager', 
    'Other'
  ]

  const suggestedSkills = [
    'React', 'Figma', 'Python', 'UI/UX Design',
    'Growth Hacking', 'Node.js', 'React Native', 'Tailwind CSS'
  ]

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill))
    } else {
      setSelectedSkills([...selectedSkills, skill])
    }
  }

  const handleAddCustomSkill = () => {
    const trimmedSkill = searchSkill.trim()
    if (!trimmedSkill) return

    if (!selectedSkills.includes(trimmedSkill)) {
      setSelectedSkills([...selectedSkills, trimmedSkill])
    }
    setSearchSkill('')
  }

  const handleContinue = () => {
    // 1. Validate Bio
    if (!bio.trim()) {
      Alert.alert('Validation Error', 'Please write a short bio about yourself.')
      return
    }

    // 2. Validate Other Role if selected
    if (selectedRole === 'Other' && !otherRole.trim()) {
      Alert.alert('Validation Error', 'Please specify your role.')
      return
    }

    // 3. Validate Skills Selection
    if (selectedSkills.length === 0) {
      Alert.alert('Validation Error', 'Please select or add at least one skill.')
      return
    }

    const finalRole = selectedRole === 'Other' ? otherRole.trim() : selectedRole

    // Navigate to step 3 with accumulated parameters
    router.push({
      pathname: '/(auth)/sign-up-step3',
      params: {
        ...params,
        bio: bio.trim(),
        role: finalRole,
        skills: JSON.stringify(selectedSkills)
      }
    })
  }

  return (
    <SafeAreaView className="bg-bg flex-1">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={{ paddingBottom: 40, paddingTop: 15 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="px-6 items-center">
              <ProgressBar stepNumber={2} stepCount={5} />

              <Text className='text-4xl font-bold text-center mb-3 text-slate-900'>
                Tell us about{'\n'}yourself
              </Text>
              <Text className="text-[#7a7a7a] text-lg text-center mb-6">
                Share your bio and skills to get better project recommendations.
              </Text>

              {/* Bio Section */}
              <View className="w-full p-5 bg-white rounded-3xl mb-6 shadow-sm border border-gray-100">
                <View className="flex-row items-center mb-3">
                  <MaterialCommunityIcons name="account-outline" size={20} color="#FF8C69" />
                  <Text className="ml-2 font-bold text-lg text-gray-800">Short Bio</Text>
                </View>
                <TextInput
                  multiline
                  numberOfLines={4}
                  placeholder="Tell us about your background, goals, and what you're looking for..."
                  placeholderTextColor="#94A0B8"
                  className="bg-gray-50 p-4 rounded-2xl text-left h-32 text-gray-800 border border-gray-200"
                  style={{ textAlignVertical: 'top' }}
                  onChangeText={setBio}
                  value={bio}
                  maxLength={500}
                />
                <Text className="text-right text-gray-400 text-xs mt-2">
                  {bio.length}/500 characters
                </Text>
              </View>

              {/* Primary Role Section */}
              <View className="w-full p-5 bg-white rounded-3xl mb-6 shadow-sm border border-gray-100">
                <View className="flex-row items-center mb-2">
                  <MaterialCommunityIcons name="briefcase-outline" size={20} color="#FF8C69" />
                  <Text className="ml-2 font-bold text-lg text-gray-800">Primary Role</Text>
                </View>
                <Text className="text-gray-500 mb-4 text-sm">
                  Select the role that best describes you
                </Text>

                <View className="flex-row flex-wrap gap-2">
                  {roles.map((role) => {
                    const isSelected = selectedRole === role
                    return (
                      <TouchableOpacity
                        key={role}
                        onPress={() => setSelectedRole(role)}
                        activeOpacity={0.7}
                        className={`px-4 py-2.5 rounded-full border ${
                          isSelected 
                            ? 'bg-primary-full border-primary-full' 
                            : 'bg-primary-light border-primary-mid'
                        }`}
                      >
                        <View className="flex-row items-center">
                          <Text className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-primary-full'}`}>
                            {role}
                          </Text>
                          {isSelected && (
                            <Ionicons name="checkmark-circle" size={16} color="white" style={{ marginLeft: 6 }} />
                          )}
                        </View>
                      </TouchableOpacity>
                    )
                  })}
                </View>

                {/* Custom Role Input if 'Other' is selected */}
                {selectedRole === 'Other' && (
                  <View className="mt-4">
                    <TextInput
                      placeholder="Specify your role (e.g. Data Analyst)"
                      placeholderTextColor="#94A0B8"
                      value={otherRole}
                      onChangeText={setOtherRole}
                      className="bg-gray-50 p-3.5 rounded-2xl text-left text-gray-800 border border-gray-200"
                    />
                  </View>
                )}
              </View>

              {/* Skills & Expertise Section */}
              <View className="w-full p-5 bg-white rounded-3xl mb-8 shadow-sm border border-gray-100">
                <View className="flex-row items-center mb-4">
                  <MaterialCommunityIcons name="target" size={20} color="#FF8C69" />
                  <Text className="ml-2 font-bold text-lg text-gray-800">Skills & Expertise</Text>
                </View>
                
                {/* Search & Add Custom Skill */}
                <View className="flex-row items-center bg-gray-50 px-4 py-2.5 rounded-2xl mb-4 border border-gray-200">
                  <Ionicons name="search-outline" size={20} color="#94A0B8" />
                  <TextInput 
                    placeholder="Search or add skills (e.g. Docker)" 
                    placeholderTextColor="#94A0B8" 
                    className="ml-2 flex-1 text-gray-800"
                    value={searchSkill}
                    onChangeText={setSearchSkill}
                    onSubmitEditing={handleAddCustomSkill}
                  />
                  {searchSkill.trim().length > 0 && (
                    <TouchableOpacity onPress={handleAddCustomSkill} className="bg-primary-full px-3 py-1 rounded-lg">
                      <Text className="text-white text-xs font-bold">Add</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Selected & Suggested Skills */}
                <Text className="text-gray-500 font-bold text-xs uppercase mb-3">
                  Suggested Skills (Tap to toggle)
                </Text>

                <View className="flex-row flex-wrap gap-2">
                  {/* Render any custom skills added that aren't in suggested list */}
                  {selectedSkills
                    .filter(s => !suggestedSkills.includes(s))
                    .map((skill) => (
                      <TouchableOpacity 
                        key={skill}
                        className="px-4 py-2 rounded-full bg-primary-full flex-row items-center gap-1"
                        onPress={() => toggleSkill(skill)}
                        activeOpacity={0.7}
                      >
                        <Text className="text-white text-sm font-medium">{skill}</Text>
                        <Ionicons name="close-circle" size={16} color="white" />
                      </TouchableOpacity>
                    ))}

                  {/* Render suggested skills */}
                  {suggestedSkills.map((skill) => {
                    const isSelected = selectedSkills.includes(skill)
                    return (
                      <TouchableOpacity 
                        key={skill}
                        className={`px-4 py-2 rounded-full border ${
                          isSelected 
                            ? 'bg-primary-full border-primary-full' 
                            : 'bg-primary-light border-primary-mid'
                        }`}
                        onPress={() => toggleSkill(skill)}
                        activeOpacity={0.7}
                      >
                        <Text className={`text-sm ${isSelected ? 'text-white font-semibold' : 'text-primary-full font-medium'}`}>
                          {skill}
                        </Text>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </View>

              <CustomButton 
                width="100%" 
                borderColor='#FF8C69' 
                height={50} 
                bgColor='#FF8C69' 
                title='Continue' 
                titleColor='#fff' 
                handelPress={handleContinue} 
              />

              <Text className='text-center mt-3 text-gray-400 text-xs px-6'>
                You can always update this later in your profile settings.
              </Text> 
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default SignUpStep2