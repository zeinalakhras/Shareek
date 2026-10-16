import { View, Text , Image, Alert } from 'react-native'
import FormField from '@/components/FormField'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '@/components/CustomButton'
import { router, useLocalSearchParams } from 'expo-router'
import { resetPasswordSchema } from '@/schemas/authSchema'
import { useAuth } from '@/hooks/useAuth'
import { getApiErrorMessage } from '@/utils/apiError'

const resetPassword = () => {

    const { resetToken } = useLocalSearchParams<{ email?: string; resetToken?: string }>()
    const { confirmPasswordReset } = useAuth()

    const [form ,setForm] = useState({
      password: '' ,
    })
        const [form1 ,setForm1] = useState({
      password1: '' ,
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleReset = async () => {
      if (!resetToken) {
        Alert.alert('Link expired', 'Please request a new verification code.', [
          { text: 'OK', onPress: () => router.replace('/(auth)/forget-password') },
        ])
        return
      }

      const validation = resetPasswordSchema.safeParse({
        password: form.password,
        confirmPassword: form1.password1,
      })
      if (!validation.success) {
        Alert.alert('Validation Error', validation.error.issues[0]?.message || 'Invalid input data.')
        return
      }

      setIsLoading(true)

      try {
        await confirmPasswordReset({
          reset_token: resetToken,
          new_password: form.password,
        })

        Alert.alert('Password updated', 'You can now sign in with your new password.', [
          { text: 'Sign in', onPress: () => router.replace('/(auth)/sign-in') },
        ])
      } catch (error) {
        Alert.alert('Could not reset the password', getApiErrorMessage(error))
      } finally {
        setIsLoading(false)
      }
    }

  return (
    <SafeAreaView className='bg-bg h-full'>
      <View className='items-center border-2 border-primary-mid mx-6 mt-6 mb-3 py-8 px-4 rounded-2xl gap-2'>
        <View className='items-center'>
           <Image
            source={require('../../assets/images/icon-outline.png')}
            className='w-20 h-20 mb-2'
            resizeMode='contain'
            />
            <Text className='font-semibold text-2xl mb-2'>Shareek</Text>
            <Text className='text-center font-light text-gray-600 px-4 mb-2'>Experience collaboration simplified. Welcome back to the family.</Text>
        </View>
        <FormField
          title="New Password"
          value={form.password}
          placeholder="********"
          handelChangeText={(e:any)=>setForm({...form, password:e})}
        />
        <FormField
          title="Confirm Password"
          value={form1.password1}
          placeholder="********"
          handelChangeText={(e:any)=>setForm1({...form1, password1:e})}
        />
        <CustomButton width='90%' borderColor='#FF8C69' height={50} bgColor='#FF8C69' title="Reset Password" titleColor='#FFF' isLoading={isLoading} handelPress={handleReset}/>
      </View>
    </SafeAreaView>

  )
}

export default resetPassword
