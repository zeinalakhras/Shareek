import CustomButton from '@/components/CustomButton';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const third = () => {
  const [agreed, setAgreed] = useState(false); 

  return (
    <SafeAreaView className='mt-4 bg-bg h-full'>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:10}}>
       <View className="flex-row justify-center items-center mb-10">
            <View className="w-12 h-12 rounded-full bg-primary-full justify-center items-center mr-3">
              <Text className="text-white text-xl font-bold">S</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-800">Shareek</Text>
       </View>
       <Text className='font-bold text-3xl ml-4'>Let's Get Started</Text>

       <View className='mx-4 mt-4 rounded-xl bg-[#e4e4e4cb] p-4'>
            <Text className=' text-center text-2xl'>our community standards</Text>
            <View className="flex-row p-3">
                <View className="w-16 h-16 rounded-2xl mb-4 bg-primary-light border border-primary-full items-center justify-center">
                  <MaterialIcons name="security" size={30} color="#FF8C69" />
                </View>
                <View className="ml-4 flex-1">
                    <Text className="text-xl font-bold mb-1 text-gray-800">Privacy First</Text>
                    <Text className="text-gray-500 leading-6 mb-2 ml-2">Your data belongs to you. We use enterprise-grade encryption to ensure your collaborative projects remain private and secure.</Text>
                </View>
            </View>
            <View className="flex-row p-3">
                <View className="w-16 h-16 rounded-2xl mb-4 bg-primary-light border border-primary-full items-center justify-center">
                  <FontAwesome6 name="handshake-simple" size={24} color="#FF8C69" />
                </View>
                <View className="ml-4 flex-1">
                    <Text className="text-xl font-bold mb-1 text-gray-800">Respectful Collaboration</Text>
                    <Text className="text-gray-500 leading-6 mb-2 ml-2">Shareek is built on trust. We expect all members to maintain professional etiquette and foster an inclusive environment.</Text>
                </View>
            </View>            
       </View>

       <View className='mr-3 ml-3 flex-row-reverse p-4 justify-center items-center'>
        <Text className='text-xs ml-4'>I have read and agree to the <Text className='text-primary-full'>Terms of Service</Text> and <Text className='text-primary-full'>Privacy Policy</Text>. I understand how my data will be used to enhance my experience.</Text>
        <TouchableOpacity 
          onPress={() => setAgreed(!agreed)} 
          className=''
          activeOpacity={0.8}
          >
           <View className={`w-6 h-6 rounded border-2 items-center ${agreed ? 'bg-green-600 border-green-600' : 'border-gray-300'}`}>
              {agreed && <Text className="text-white text-xs">✓</Text>}
           </View>
        </TouchableOpacity>
       </View>
       
       <CustomButton width='80%' borderColor='#FF8C69' height={50} bgColor='rgba(255,140,105, 0.3)' title="Create Account" disable={!agreed} handelPress={()=>{router.push('/(auth)/sign-up')}} />
       <CustomButton width='80%' borderColor='#000000' height={50} bgColor='F8F6F5' title="Login" handelPress={()=>{router.push('/(auth)/sign-in')}} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default third