import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
  Alert,
  ActivityIndicator
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ProgressBar from '@/components/ProgressBar'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import CustomButton from '@/components/CustomButton'
import { router, useLocalSearchParams } from 'expo-router'
import { useSignUpStore } from '@/store/useSignUpStore'
import { useAuthStore } from '@/store/useAuthStore'
import { getRoles } from '@/api/role/roleApi'
import { getSkills } from '@/api/skill/skillApi'
import { syncRoles, syncSkills, updateUser } from '@/api/user/userApi'
import type { Role } from '@/api/role/types'
import type { Skill } from '@/api/skill/types'
import { getApiErrorMessage } from '@/utils/apiError'

const SignUpStep2 = () => {

  const params = useLocalSearchParams()
  const updateFormData = useSignUpStore((state) => state.updateFormData)
  const user = useAuthStore((state) => state.user)
  const profile = useAuthStore((state) => state.profile)
  const accessToken = useAuthStore((state) => state.accessToken)
  const userId = user?.id ?? profile?.id

  const [bio, setBio] = useState<string>('')
  const [roles, setRoles] = useState<Role[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [selectedRoleId, setSelectedRoleId] = useState<string>('')
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([])
  const [searchSkill, setSearchSkill] = useState<string>('')

  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const [showAllRoles, setShowAllRoles] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);


  const fetchOptions = useCallback(async () => {
    setIsFetching(true)
    setLoadError(null)

    try {
      const [rolesResponse, skillsResponse] = await Promise.all([
        getRoles(),
        getSkills(),
      ])

      setRoles(rolesResponse.data ?? [])
      setSkills(skillsResponse.data ?? [])
    } catch (error) {
      setLoadError(getApiErrorMessage(error, 'Could not load roles and skills. Please try again.'))
    } finally {
      setIsFetching(false)
    }
  }, [])

  useEffect(() => {
    fetchOptions()
  }, [fetchOptions])

  const visibleSkills = useMemo(() => {
    const query = searchSkill.trim().toLowerCase()

    if (!query) return skills

    return skills.filter((skill) => skill.name.toLowerCase().includes(query))
  }, [skills, searchSkill])

  const toggleSkill = (skill: Skill) => {
    setSelectedSkills((current) =>
      current.some((selected) => selected.id === skill.id)
        ? current.filter((selected) => selected.id !== skill.id)
        : [...current, skill]
    )
  }

  const handleContinue = async () => {
    if (!bio.trim()) {
      Alert.alert('Validation Error', 'Please write a short bio about yourself.')
      return
    }

    if (!selectedRoleId) {
      Alert.alert('Validation Error', 'Please select your role.')
      return
    }

    if (selectedSkills.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one skill.')
      return
    }

    if (!userId || !accessToken) {
      Alert.alert('Session expired', 'Your session has expired. Please sign in again to continue.')
      return
    }

    setIsSubmitting(true)

    try {
      await Promise.all([
        updateUser(userId, { bio: bio.trim() }, accessToken),
        syncRoles(userId, { role_ids: [selectedRoleId] }, accessToken),
        syncSkills(userId, { skill_ids: selectedSkills.map((skill) => skill.id) }, accessToken),
      ])

      const finalRole = roles.find((role) => role.id === selectedRoleId)?.name ?? ''
      const finalSkills = selectedSkills.map((skill) => skill.name)

      updateFormData({ bio: bio.trim(), role: finalRole, skills: finalSkills })

      router.push({
        pathname: '/(setup)/step3',
        params: {
          ...params,
          bio: bio.trim(),
          role: finalRole,
          skills: JSON.stringify(finalSkills)
        }
      })
    } catch (error) {
      Alert.alert('Could not save your profile', getApiErrorMessage(error, 'Something went wrong while saving your profile. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayedSkills = showAllSkills ? skills : skills.slice(0, 5);
  const displayedRoles = showAllRoles ? roles : roles.slice(0, 5);


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

              <View className="flex-row w-full justify-center items-center mb-6">
                <Text className="text-primary-full font-bold">Step 2 of 5</Text>
              </View>
              <View className='w-full h-2 bg-[#dfdede] rounded-full mb-8'>
                <View style={{ width: `40%` }} className="h-full bg-primary-full rounded-full" />
              </View>

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

                {isFetching ? (
                  <ActivityIndicator size="small" color="#FF8C69" className="my-2" />
                ) : loadError ? (
                  <View className="w-full items-center py-2">
                    <Text className="text-secondry-red text-sm text-center mb-3">{loadError}</Text>
                    <TouchableOpacity
                      onPress={fetchOptions}
                      className="bg-primary-light border border-primary-mid px-4 py-2 rounded-full"
                    >
                      <Text className="text-primary-full font-semibold text-sm">Retry</Text>
                    </TouchableOpacity>
                  </View>
                ) : roles.length === 0 ? (
                  <Text className="text-text-placeholder text-sm">No roles available right now.</Text>
                ) : (
                  <View className="flex-row flex-wrap gap-2">
                    {displayedRoles.map((role) => {
                      const isSelected = selectedRoleId === role.id
                      return (
                        <TouchableOpacity
                          key={role.id}
                          onPress={() => setSelectedRoleId(role.id)}
                          activeOpacity={0.7}
                          className={`px-4 py-2.5 rounded-full border ${isSelected
                            ? 'bg-primary-full border-primary-full'
                            : 'bg-primary-light border-primary-mid'
                            }`}
                        >
                          <View className="flex-row items-center">
                            <Text className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-primary-full'}`}>
                              {role.name}
                            </Text>
                            {isSelected && (
                              <Ionicons name="checkmark-circle" size={16} color="white" style={{ marginLeft: 6 }} />
                            )}
                          </View>
                        </TouchableOpacity>
                      )
                    })}
                    {roles.length > 5 && (
                      <TouchableOpacity
                        onPress={() => setShowAllRoles(!showAllRoles)}
                        className="self-start rounded-full px-3.5 py-2.5 border bg-primary-full border-primary-full"
                      >
                        <Text className="text-white font-bold text-sm">
                          {showAllRoles ? 'show less' : `show more (${roles.length - 5})`}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>

              {/* Skills & Expertise Section */}
              <View className="w-full p-5 bg-white rounded-3xl mb-8 shadow-sm border border-gray-100">
                <View className="flex-row items-center mb-4">
                  <MaterialCommunityIcons name="target" size={20} color="#FF8C69" />
                  <Text className="ml-2 font-bold text-lg text-gray-800">Skills & Expertise</Text>
                </View>

                {/* Search — filters the fetched list on the frontend only */}
                <View className="flex-row items-center bg-gray-50 px-4 py-2.5 rounded-2xl mb-4 border border-gray-200">
                  <Ionicons name="search-outline" size={20} color="#94A0B8" />
                  <TextInput
                    placeholder="Search skills (e.g. Docker)"
                    placeholderTextColor="#94A0B8"
                    className="ml-2 flex-1 text-gray-800"
                    value={searchSkill}
                    onChangeText={setSearchSkill}
                    autoCorrect={false}
                    returnKeyType="search"
                  />
                  {searchSkill.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchSkill('')} activeOpacity={0.7}>
                      <Ionicons name="close-circle" size={18} color="#94A0B8" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Selected Skills */}
                {selectedSkills.length > 0 && (
                  <>
                    <Text className="text-gray-500 font-bold text-xs uppercase mb-3">
                      Selected ({selectedSkills.length})
                    </Text>

                    <View className="flex-row flex-wrap gap-2 mb-5">
                      {selectedSkills.map((skill) => (
                        <TouchableOpacity
                          key={skill.id}
                          className="px-4 py-2 rounded-full bg-primary-full flex-row items-center gap-1"
                          onPress={() => toggleSkill(skill)}
                          activeOpacity={0.7}
                        >
                          <Text className="text-white text-sm font-medium">{skill.name}</Text>
                          <Ionicons name="close-circle" size={16} color="white" />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                )}

                {/* Available Skills */}
                <Text className="text-gray-500 font-bold text-xs uppercase mb-3">
                  {searchSkill.trim() ? 'Search Results' : 'All Skills'} (Tap to toggle)
                </Text>

                {isFetching ? (
                  <ActivityIndicator size="small" color="#FF8C69" className="my-4" />
                ) : loadError ? (
                  <View className="w-full items-center py-2">
                    <Text className="text-secondry-red text-sm text-center mb-3">{loadError}</Text>
                    <TouchableOpacity
                      onPress={fetchOptions}
                      className="bg-primary-light border border-primary-mid px-4 py-2 rounded-full"
                    >
                      <Text className="text-primary-full font-semibold text-sm">Retry</Text>
                    </TouchableOpacity>
                  </View>
                ) : visibleSkills.length === 0 ? (
                  <Text className="text-text-placeholder text-sm">
                    {skills.length === 0
                      ? 'No skills available right now.'
                      : `No skills match "${searchSkill.trim()}".`}
                  </Text>
                ) : (
                  <View className="flex-row flex-wrap gap-2">
                    {displayedSkills.map((skill) => {
                      const isSelected = selectedSkills.some((selected) => selected.id === skill.id)
                      return (
                        <TouchableOpacity
                          key={skill.id}
                          className={`px-4 py-2 rounded-full border ${isSelected
                            ? 'bg-primary-full border-primary-full'
                            : 'bg-primary-light border-primary-mid'
                            }`}
                          onPress={() => toggleSkill(skill)}
                          activeOpacity={0.7}
                        >
                          <Text className={`text-sm ${isSelected ? 'text-white font-semibold' : 'text-primary-full font-medium'}`}>
                            {skill.name}
                          </Text>
                        </TouchableOpacity>
                      )
                    })}
                    {visibleSkills.length > 5 && (
                      <TouchableOpacity
                        onPress={() => setShowAllSkills(!showAllSkills)}
                        className="self-start rounded-full px-3.5 py-2.5 border bg-primary-full border-primary-full"
                      >
                        <Text className="text-white font-bold text-sm">
                          {showAllSkills ? 'show less' : `show more (${visibleSkills.length - 5})`}
                        </Text>
                      </TouchableOpacity>
                    )}
                    {visibleSkills.length === 0 && (
                      <Text className="text-text-placeholder text-sm">No skills available right now.</Text>
                    )}
                  </View>
                )}
              </View>

              <CustomButton
                width="100%"
                borderColor='#FF8C69'
                height={50}
                bgColor='#FF8C69'
                title='Continue'
                titleColor='#fff'
                isLoading={isSubmitting}
                disable={isFetching || Boolean(loadError)}
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