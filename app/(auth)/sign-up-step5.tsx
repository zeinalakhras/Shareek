import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ProgressBar from '@/components/ProgressBar'
import { AntDesign, Entypo, Feather, FontAwesome5, Fontisto } from '@expo/vector-icons'
import CustomButton from '@/components/CustomButton'
import { router, useLocalSearchParams } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'

const SignUpStep5 = () => {

  const previousParams = useLocalSearchParams()

  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [linkedin, setLinkedin] = useState('')
  const [github, setGithub] = useState('')
  const [website, setWebsite] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'Permission to access gallery is required!')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled && result.assets[0].uri) {
      setProfileImage(result.assets[0].uri)
    }
  }

const handleCompleteSetup = async () => {
  setLoading(true)

  const finalPayload = {
    ...previousParams,
    profileImage,
    socialLinks: {
      linkedin,
      github,
      website,
    },
  }

  try {
    // console.log('Final Registration Payload:', finalPayload)
    // await api.post('/register', finalPayload)

    router.dismissAll()
    // 🟢 مرر الاسم مع الـ Route
    router.replace({
      pathname: '/(auth)/sign-up-success',
      params: { 
        fullName: (previousParams.fullName || previousParams.firstName || '') as string 
      }
    })
  } catch (error) {
    Alert.alert('Error', 'Failed to complete registration. Please try again.')
  } finally {
    setLoading(false)
  }
}

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
            <ProgressBar stepCount={5} stepNumber={5} />
          </View>

          <View className='mx-6 items-center bg-white rounded-3xl p-5'>
            <Text className='text-3xl font-bold text-center'>Connect &{`\n`}Personalize</Text>
            <Text className='text-[#7a7a7a] mx-4 my-2 text-center'>Put a face to the name and link your professional presence.</Text>

            {/* Upload Photo Section */}
            <View className="items-center mt-5 mb-10">
              <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8} className="relative">
                <View className="w-32 h-32 rounded-full border-2 border-dashed border-primary-mid items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <Image source={{ uri: profileImage }} className="w-full h-full rounded-full" />
                  ) : (
                    <View className="w-28 h-28 bg-primary-light rounded-full items-center justify-center">
                      <FontAwesome5 name="user-alt" size={45} color="rgba(255,140,105, 0.3)" />
                    </View>
                  )}
                </View>
                <View className="absolute bottom-1 right-1 bg-primary-full w-8 h-8 rounded-full border-2 border-white items-center justify-center">
                  <Feather name={profileImage ? "check" : "edit-2"} size={14} color="white" />
                </View>
              </TouchableOpacity>

              <Text className="text-primary-full font-bold mt-4">
                {profileImage ? 'Change Photo' : 'Upload Photo'}
              </Text>
              <Text className="text-gray-400 text-sm mt-1">PNG or JPG up to 2MB</Text>
            </View>

            {/* Social Connectivity Section */}
            <View className="w-full mb-8">
              <View className="flex-row items-center mb-6">
                <Entypo name="share" size={24} color="#FF8C69" />
                <Text className="text-text-title text-xl font-bold ml-2">Social Connectivity</Text>
              </View>

              <View className='gap-3'>
                <View className="flex-row items-center bg-primary-light rounded-2xl px-4 py-2">
                  <AntDesign name="link" size={20} color="#FF8C69" />
                  <TextInput
                    placeholder="LinkedIn Profile URL"
                    value={linkedin}
                    onChangeText={setLinkedin}
                    autoCapitalize="none"
                    keyboardType="url"
                    className="flex-1 ml-3 text-slate-600"
                    placeholderTextColor="#94A0B8"
                  />
                </View>

                <View className="flex-row items-center bg-primary-light rounded-2xl px-4 py-2">
                  <Feather name="code" size={20} color="#FF8C69" />
                  <TextInput
                    placeholder="GitHub Username or Profile"
                    value={github}
                    onChangeText={setGithub}
                    autoCapitalize="none"
                    className="flex-1 ml-3 text-slate-600"
                    placeholderTextColor="#94A0B8"
                  />
                </View>

                <View className="flex-row items-center bg-primary-light rounded-2xl px-4 py-2">
                  <Fontisto name="world-o" size={20} color="#FF8C69" />
                  <TextInput
                    placeholder="Portfolio / Website URL"
                    value={website}
                    onChangeText={setWebsite}
                    autoCapitalize="none"
                    keyboardType="url"
                    className="flex-1 ml-3 text-slate-600"
                    placeholderTextColor="#94A0B8"
                  />
                </View>
              </View>
            </View>

            <View className="w-[80%] mb-4 px-4 h-[1px] bg-primary-mid" />

            {/* Actions */}
            <CustomButton
              width='90%'
              height={50}
              borderColor='#FF8C69'
              bgColor='rgba(255,140,105, 0.1)'
              title='Back'
              titleColor='#FF8C69'
              handelPress={() => router.back()}
            />

            <CustomButton
              width='90%'
              height={50}
              borderColor='#FF8C69'
              bgColor='#FF8C69'
              title={loading ? 'Completing...' : 'Complete Setup'}
              titleColor='#fff'
              handelPress={handleCompleteSetup}
            />

            <Text className='text-slate-400 font-light my-4 text-sm text-center'>
              By completing setup, you agree to our <Text className='underline'>Terms of Service</Text>
            </Text>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default SignUpStep5