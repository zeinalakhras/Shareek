import CustomButton from '@/components/CustomButton'
import { useState } from 'react'
import { Alert, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import { Link } from 'expo-router'
import { signInSchema } from '@/schemas/authSchema'
import { useAuth } from '@/hooks/useAuth'
import { getApiErrorMessage } from '@/utils/apiError'

const signIn = () => {

  const { login } = useAuth()

  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.email.trim() || !form.password.trim()) {
      Alert.alert('Validation Error', 'Please fill in all required fields.')
      return
    }

    const validation = signInSchema.safeParse(form)
    if (!validation.success) {
      const errorMessage = validation.error.issues[0]?.message || 'Invalid input data.'
      Alert.alert('Validation Error', errorMessage)
      return
    }

    setIsLoading(true)

    try {
      await login({ email: form.email.trim(), password: form.password })
    } catch (error) {
      Alert.alert('Login failed', getApiErrorMessage(error, 'Login failed. Please try again later.'))
    } finally {
      setIsLoading(false)
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
                source={require('../../assets/images/icon-outline.png')}
                className='w-24 h-24'
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

            <Text className='text-gray-400 text-xs text-center mx-14'>You have agreed to Privacy Policy and Terms of Service</Text>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default signIn