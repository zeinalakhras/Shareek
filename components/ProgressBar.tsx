import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';


interface stepsProps {
    stepNumber: number , 
    stepCount: number
}

const ProgressBar = ({stepNumber , stepCount}:stepsProps) => {
    const progress = (stepNumber / stepCount) * 100;
  return (
  <>
    <View className="flex-row w-full justify-center items-center mb-6">
        <TouchableOpacity 
        onPress={() => router.back()} 
        className="p-2 bg-white rounded-full absolute left-0"
        >
        <Ionicons name="arrow-back" size={20} color="#FF8C69" />
        </TouchableOpacity>
        <Text className="text-primary-full font-bold">Step {stepNumber} of {stepCount}</Text>
    </View>
    <View className='w-full h-2 bg-[#dfdede] rounded-full mb-8'>
        <View style={{width:`${progress}%`}} className="h-full bg-primary-full rounded-full" />
    </View>
  </>
  )
}

export default ProgressBar
