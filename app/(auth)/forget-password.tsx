import { View, Text , Image, Alert } from 'react-native'
import FormField from '@/components/FormField'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'
import { forgotPasswordSchema } from '@/schemas/authSchema'
import { useAuth } from '@/hooks/useAuth'
import { getApiErrorMessage } from '@/utils/apiError'

const forgotPassword = () => {

    const { requestPasswordReset } = useAuth()

    const [form ,setForm] = useState({
      email: '' ,
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleSendCode = async () => {
      const validation = forgotPasswordSchema.safeParse(form)
      if (!validation.success) {
        Alert.alert('Validation Error', validation.error.issues[0]?.message || 'Invalid email address.')
        return
      }

      const email = form.email.trim()
      setIsLoading(true)

      try {
        await requestPasswordReset({ email })

        router.push({
          pathname: '/(auth)/email-verification',
          params: { email, flow: 'reset' },
        })
      } catch (error) {
        Alert.alert('Could not send the code', getApiErrorMessage(error))
      } finally {
        setIsLoading(false)
      }
    }

  return (
    <SafeAreaView className='bg-bg h-full pt-[20%]'>
      <View className='items-center border-2 border-primary-mid mx-6 mt-6 mb-3 py-8 px-4 rounded-2xl gap-2'>
        <View className='items-center'>
           <Image
            source={require('../../assets/images/icon-outline.png')}
            className='w-24 h-24'
            resizeMode='contain'
            />
            <Text className='font-semibold text-2xl mb-2'>Shareek</Text>
            <Text className='text-center font-light text-gray-600 px-4 mb-2'>Experience collaboration simplified. Welcome back to the family.</Text>
        </View>
        <FormField
          title="Email Address"
          value={form.email}
          placeholder="e.g. example@gmail.com"
          handelChangeText={(e:any)=>setForm({...form, email:e})}
          keyboardType="email-address"
        />
        <CustomButton width='90%' borderColor='#FF8C69' height={50} bgColor='#FF8C69' title="Send code" titleColor='#FFF' isLoading={isLoading} handelPress={handleSendCode}/>
      </View>
    </SafeAreaView>

  )
}

export default forgotPassword
