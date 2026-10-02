import { View, Text , Image } from 'react-native'
import FormField from '@/components/FormField'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'

const resetPassword = () => {

    const [form ,setForm] = useState({
      email: '' ,
    })

  return (
    <SafeAreaView className='bg-bg h-full pt-[20%]'>
      <View className='items-center border-2 border-primary-mid mx-6 mt-6 mb-3 py-8 px-4 rounded-2xl gap-2'>
        <View className='items-center'>
           <Image 
            source={require('../../assets/images/programing.png')}
            className='w-20 h-20 mb-2' 
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
        <CustomButton width='90%' borderColor='#FF8C69' height={50} bgColor='#FF8C69' title="Send code" titleColor='#FFF' handelPress={()=>{router.push('/(auth)/email-verification')}}/>
      </View>

      <Text className='text-gray-600 font-light text-sm text-center mx-14'>© 2024 Shareek Inc. All rights reserved. Privacy Policy • Terms of Service</Text>
    </SafeAreaView>
      
  )
}

export default resetPassword