import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";


const second = () => {
    const router = useRouter();
  
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView className="w-full h-full" contentContainerStyle={{alignItems:"center" , paddingTop:40}} showsVerticalScrollIndicator={false}>

          <View className="flex-row items-center mb-10">
              <View className="w-12 h-12 rounded-full bg-primary-full justify-center items-center mr-3 shadow-md">
                <Text className="text-white text-xl font-bold">S</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-800">Shareek</Text>
          </View>
            
          <View className="w-[90%] bg-white rounded-[30px] p-6 shadow-lg border border-gray-100 mb-8">
            <View className="flex-row items-center">
               <View className="w-16 h-16 rounded-full mb-4 bg-primary-light items-center justify-center">
                <Ionicons name="person-add" size={24} color="#FF8C69" />
               </View>
               <View className="ml-4 flex-1">
                  <Text className="text-xl font-bold mb-1 text-gray-800"> Create Profile </Text>
                  <Text className="text-gray-500 leading-6 mb-2">Highlight your skills, stack (React, Python, etc.), and what kind of projects you love.</Text>
               </View>
            </View>
            <View className="h-1.5 w-full rounded-full overflow-hidden mt-2" >
               <View className="w-full h-full rounded-full bg-primary-full" />
            </View>
          </View>

          <View className="w-[90%] bg-white rounded-[30px] p-6 shadow-lg border border-gray-100 mb-8">
            <View className="flex-row items-center">
               <View className="w-16 h-16 rounded-full mb-4 bg-[#ffa85146] items-center justify-center">
                <MaterialIcons name="search" size={30} color="#FFA751" />
               </View>
               <View className="ml-4 flex-1">
                  <Text className="text-xl font-bold mb-1 text-gray-800"> Browse Projects </Text>
                  <Text className="text-gray-500 leading-6 mb-2">Filter by interest or tech stack. Find a hackathon team or a long-term startup partner.</Text>
               </View>
            </View>
            <View className="h-1.5 w-full rounded-full overflow-hidden mt-2" >
               <View className="w-full h-full rounded-full bg-[#FFA751]" />
            </View>
          </View>

          <View className="w-[90%] bg-white rounded-[30px] p-6 shadow-lg border border-gray-100 mb-8">
            <View className="flex-row items-center">
               <View className="w-16 h-16 rounded-full mb-4 bg-[#1e3d4a62] items-center justify-center">
                <MaterialIcons name="handshake" size={30} color="#1E3D4A" />
               </View>
               <View className="ml-4 flex-1">
                  <Text className="text-xl font-bold mb-1 text-gray-800"> Collaborate </Text>
                  <Text className="text-gray-500 leading-6 mb-2">Chat, share ideas, and start building. We help you manage the initial connection.</Text>
               </View>
            </View>
            <View className="h-1.5 w-full rounded-full overflow-hidden mt-2" >
               <View className="w-full h-full rounded-full bg-[#1E3D4A]" />
            </View>
          </View>

          <View className="flex-row justify-center gap-2 space-x-2 mb-5">
              <View className="w-3 h-3 rounded-full bg-gray-300" /> 
              <View className="w-3 h-3 rounded-full bg-primary-full" />
              <View className="w-3 h-3 rounded-full bg-gray-300" />
          </View>

          <View className="flex-row w-[90%] self-center justify-between mt-4 mb-10">
            <TouchableOpacity className="w-[42%] py-4 px-4 border-2 border-[#B9B8B8] rounded-2xl items-center justify-center mr-8"
              onPress={ () => router.push('/(onboarding)/first')}
            >
              <Text className="text-[#B9B8B8] font-semibold text-lg">Previous</Text>
            </TouchableOpacity>

            <TouchableOpacity className="w-[42%] py-4 px-4 border-2 border-primary-full rounded-2xl items-center justify-center bg-primary-mid ml-4"
              onPress={ () => router.push('/(onboarding)/third')}
            >
              <Text className="text-black font-semibold text-lg">   Next   </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
    </SafeAreaView>
  )
}

export default second
