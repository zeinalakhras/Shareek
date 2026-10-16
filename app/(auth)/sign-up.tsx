import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  Alert, 
  TouchableWithoutFeedback, 
  Keyboard 
} from 'react-native'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router'
import { signUpStep1Schema } from '@/schemas/authSchema'
import { useSignUpStore } from '@/store/useSignUpStore'
import { useAuth } from '@/hooks/useAuth'
import { getApiErrorMessage } from '@/utils/apiError'

const signUp = () => {
  const updateFormData = useSignUpStore((state) => state.updateFormData)
  const { register } = useAuth()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [isStudent, setIsStudent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNextStep = async () => {
    if (!form.fullName.trim() || !form.email.trim() || !form.password.trim() || !form.confirmPassword.trim()) {
      Alert.alert('Validation Error', 'Please fill in all required fields.')
      return
    }

    const validation = signUpStep1Schema.safeParse({
      fullName: form.fullName,
      email: form.email,
      password: form.password,
    })
    if (!validation.success) {
      const errorMessage = validation.error.issues[0]?.message || 'Invalid input data.'
      Alert.alert('Validation Error', errorMessage)
      return
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match.')
      return
    }

    const email = form.email.trim()

    updateFormData({
      fullName: form.fullName.trim(),
      email,
      password: form.password,
      isStudent,
    })

    setIsSubmitting(true)

    try {

      await register({
        name: form.fullName.trim(),
        isStudent,
        email,
        password: form.password,
      })

      router.replace({
        pathname: '/(auth)/email-verification',
        params: { email, flow: 'signup' },
      })
    } catch (error) {
      Alert.alert('Registration failed', getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView className='bg-bg flex-1'>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className='items-center mt-4'>
              <View className='flex-row items-center gap-2 mb-8'>
                <Image
                  source={require('../../assets/images/icon-outline.png')}
                  className='w-14 h-14'
                  resizeMode='contain'
                />
                <Text className='text-2xl font-bold'>Shareek</Text>
              </View>

              <Text className='text-3xl font-bold'>Create Account</Text>
              <Text className='text-gray-500 mt-1'>Find your perfect project teammate today.</Text>

              <View className='w-[90%] items-center border-2 border-primary-mid mx-6 mt-6 mb-3 py-6 px-4 rounded-2xl'>
                <FormField
                  title="Full Name"
                  value={form.fullName}
                  placeholder="e.g. Nasser Ali"
                  handelChangeText={(e: string) => setForm({ ...form, fullName: e })}
                />

                <FormField
                  title="Email Address"
                  value={form.email}
                  placeholder="e.g. example@gmail.com"
                  handelChangeText={(e: string) => setForm({ ...form, email: e })}
                  keyboardType="email-address"
                />

                <FormField
                  title="Password"
                  value={form.password}
                  placeholder="********"
                  handelChangeText={(e: string) => setForm({ ...form, password: e })}
                />

                <FormField
                  title="Confirm Password"
                  value={form.confirmPassword}
                  placeholder="********"
                  handelChangeText={(e: string) => setForm({ ...form, confirmPassword: e })}
                />

                <TouchableOpacity 
                  onPress={() => setIsStudent(!isStudent)}
                  activeOpacity={0.7}
                  className='flex-row items-center gap-3 w-full bg-primary-mid p-3 mt-4 mb-2 rounded-2xl'
                >
                  <View className={`w-7 h-7 justify-center items-center border border-primary-full rounded-xl ${isStudent ? 'bg-primary-full' : 'bg-bg'}`}>
                    {isStudent && <Text className="text-white font-bold">✓</Text>}
                  </View>
                  <Text className='font-medium text-gray-700'>I am a university student</Text>
                </TouchableOpacity>

                <CustomButton
                  width='100%'
                  borderColor='#FF8C69'
                  height={50}
                  bgColor='#FF8C69'
                  title="Continue"
                  titleColor='#fff'
                  isLoading={isSubmitting}
                  handelPress={handleNextStep}
                />

                <View className="flex-row items-center my-5 px-4">
                  <View className="flex-1 h-[1px] bg-gray-400" />
                  <Text className="mx-2 text-xs text-gray-600 uppercase">Or sign up with</Text>
                  <View className="flex-1 h-[1px] bg-gray-400" />
                </View>

                <View className='flex-row mx-auto gap-4'>
                  <TouchableOpacity className='flex-row items-center gap-2 border border-gray-300 px-5 py-2.5 rounded-full'>
                    <Image
                      source={require('../../assets/images/google.png')}
                      className='w-5 h-5'
                      resizeMode='contain'
                    />
                    <Text className='font-medium'>Google</Text>
                  </TouchableOpacity>

                  <TouchableOpacity className='flex-row items-center gap-2 border border-gray-300 px-5 py-2.5 rounded-full'>
                    <Image
                      source={require('../../assets/images/github.png')}
                      className='w-5 h-5'
                      resizeMode='contain'
                    />
                    <Text className='font-medium'>GitHub</Text>
                  </TouchableOpacity>
                </View>

                <View className='justify-center pt-5 flex-row gap-2 items-center'>
                  <Text className='text-gray-600'>Already have an account?</Text>
                  <Link href="/(auth)/sign-in">
                    <Text className='text-primary-full font-bold'>Log In</Text>
                  </Link>
                </View>
              </View>

              <View className="flex-row items-center justify-center py-4">
                <View className='w-10 h-10 rounded-full border-2 bg-slate-300 border-white -mr-3' />
                <View className='w-10 h-10 rounded-full border-2 bg-slate-300 border-white -mr-3' />
                <View className='w-10 h-10 rounded-full border-2 bg-slate-300 border-white -mr-3' />
                <View className="w-10 h-10 rounded-full bg-primary-full border-2 border-white items-center justify-center">
                  <Text className="text-white font-bold text-xs">+2k</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default signUp