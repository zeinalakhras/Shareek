import CustomButton from '@/components/CustomButton'
import { useState } from 'react'
import { Alert, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import { Link } from 'expo-router'
import { signInSchema } from '@/schemas/authSchema'
import { useAuthStore } from '@/store/useAuthStore'
import { UserProfileData } from '@/types/user'

const signIn = () => {

  const setAuth = useAuthStore((state) => state.setAuth)

  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // 1. Check for empty fields
    if (!form.email.trim() || !form.password.trim()) {
      Alert.alert('Validation Error', 'Please fill in all required fields.')
      return
    }

    // 2. Validate inputs using Zod Schema
    const validation = signInSchema.safeParse(form)
    if (!validation.success) {
      const errorMessage = validation.error.issues[0]?.message || 'Invalid input data.'
      Alert.alert('Validation Error', errorMessage)
      return
    }

    setIsLoading(true)

    try {
      // 3. Simulate API request (replace with authService.login(form) later)
      setTimeout(async () => {
        const mockUser: UserProfileData = {
          id: '1',
          email: form.email,
          full_name: 'User Name',
          bio: '',
          profile_image: '',
          is_student: true,
          university: null,
          major: 'IT Engineering',
          study_year: 3,
          skills: [],
          roles: [],
          stats: {} as any,
          created_at: new Date().toISOString(),
          website_url: '',
          linkedin_url: '',
          github_url: '',
          collaboration_style: 'remote',
          time_commitment: '10-20 hours/week',
          project_duration: 'long-term',
          phone_number: '',
          location: '',
          is_verified: true,
          telegram_username: null,
          completed_projects: [],
        };
        const mockToken = 'mock-jwt-token-12345'

        // Save token and user details to global store
        await setAuth(mockUser, mockToken)
        setIsLoading(false)
      }, 1000)
    } catch (error: any) {
      setIsLoading(false)
      Alert.alert('Error', error?.response?.data?.message || 'Login failed. Please try again later.')
    }
  }

  return (
    <SafeAreaView className='bg-bg flex-1'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className='items-center border-2 border-primary-mid mx-6 mt-6 mb-3 py-6 px-4 rounded-2xl'>
              <Image
                source={require('../../assets/images/programing.png')}
                className='w-20 h-20'
                resizeMode='contain'
              />
              <Text className='font-semibold text-2xl mb-2'>Shareek</Text>
              <Text className='text-center font-light text-gray-600 px-4 mb-2'>Experience collaboration simplified. Welcome back to the family.</Text>
              <FormField
                title="Email Address"
                value={form.email}
                placeholder="e.g. example@gmail.com"
                handelChangeText={(e: any) => setForm({ ...form, email: e })}
                keyboardType="email-address"
              />
              <FormField
                title="Password"
                value={form.password}
                placeholder="********"
                handelChangeText={(e: any) => setForm({ ...form, password: e })}
              />
              <Link href='/(auth)/forget-password' className='my-4 mx-4 self-end'><Text className='text-primary-full font-semibold'>Forget Password ?</Text></Link>
              <CustomButton width='90%' borderColor='#FF8C69' height={50} bgColor='#FF8C69' title="Login" titleColor='#fff' isLoading={isLoading} handelPress={handleLogin} />

              <View className="flex-row items-center my-5 px-4">
                <View className="flex-1 h-[1px] bg-gray-400" />
                <View>
                  <Text className="mx-2 text-xs text-gray-600 uppercase">or continue with</Text>
                </View>
                <View className="flex-1 h-[1px] bg-gray-400" />
              </View>

              <View className='flex-row mx-auto gap-8'>
                <TouchableOpacity className='flex-row items-center gap-2 border px-6 py-2 rounded-full'>
                  <Image
                    source={require('../../assets/images/google.png')}
                    className='w-5 h-5'
                    resizeMode='contain'
                  />
                  <Text>Google</Text>
                </TouchableOpacity>
                <TouchableOpacity className='flex-row items-center gap-2 border px-6 py-2 rounded-full'>
                  <Image
                    source={require('../../assets/images/github.png')}
                    className='w-5 h-5'
                    resizeMode='contain'
                  />
                  <Text>GitHub</Text>
                </TouchableOpacity>
              </View>

              <View className='justify-center pt-5 flex-row gap-2 items-center'>
                <Text className='text-gray-600'>New to the platform?</Text>
                <Link href="/(auth)/sign-up"><Text className='text-primary-full font-psemibold'>Create new Account</Text></Link>
              </View>

            </View>

            <Text className='text-gray-400 text-xs text-center mx-14'>© 2024 Shareek Inc. All rights reserved. Privacy Policy • Terms of Service</Text>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default signIn