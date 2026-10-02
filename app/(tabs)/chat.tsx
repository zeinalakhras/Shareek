import { View, Text, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Entypo } from '@expo/vector-icons'

const Chat = () => {
  return (
    <SafeAreaView>
      <View className='h-full items-center'>
            <View style={{width:256 , height:256 , marginTop:64 , marginBottom:16}} className='items-center justify-center bg-primary-light rounded-full'>
                <Entypo name="tools" size={100} color="#FF8C69" />
            </View>
            <View className='bg-primary-light border border-primary-full p-2 mb-4 rounded-full'>
              <Text className='font-bold text-sm text-primary-full uppercase' style={{letterSpacing:1}}>Coming soon</Text>
            </View>
            <Text className='text-3xl font-semibold'>Feature Coming Soon</Text>
            <Text className='text-center font-light text-xl text-gray-500 mt-2'>We're working hard to bring this feature to you. Please check back later or explore other sections.</Text>
      </View>
    </SafeAreaView>
  )
}

export default Chat