import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import CustomButton from '@/components/CustomButton'
import { mockAllProjectsResponse , CURRENT_TEST_USER_ID } from '../../MockData/projectsMock2'
import ProjectCard from '@/components/ProjectCard'
import { router } from 'expo-router'
import SideMenu from '@/components/SideMenu'
import { getMyProjects } from '../../utils/projectUtils';
import { Project } from '@/types/project'

const Home = () => {

  const [menuVisible, setMenuVisible] = useState(false);

  const currentUserId = CURRENT_TEST_USER_ID; 

  const allProjects = (mockAllProjectsResponse?.data?.items || []) as Project[] ;

  const myProjects = getMyProjects(allProjects, currentUserId);


  return (
    <SafeAreaView className=''>
      <FlatList
        data={myProjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProjectCard project={item} />
        )}

        ListHeaderComponent={
          <View>
          {/*Header*/}
          <View className='flex-row justify-between items-center mx-4' style={{marginVertical:20}}>
            <View className="flex-row items-center gap-2">
              <Image 
              source={require('../../assets/images/programing.png')}
              className="w-12 h-12"
              resizeMode="cover"
              />
              <Text className="text-2xl font-bold">Shareek</Text>
            </View>
            <View className='flex-row items-center gap-2'>
              <TouchableOpacity
               onPress={()=>{router.push('/notifications')}}
               >
                <Ionicons name="notifications-sharp" size={35} color="#FF8C69" />
              </TouchableOpacity>
              <TouchableOpacity 
               onPress={() => setMenuVisible(true)}
               >
                <Ionicons name="menu" size={40} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          {/*Cards*/}
          <View className='flex-row px-4' style={{gap:16, marginVertical:20}}>
            <View className='flex-1 bg-primary-light border border-primary-full rounded-2xl p-5 items-center justify-center gap-2'>
              <AntDesign name="appstore-add" size={24} color="#FF8C69" />
              <Text className='text-lg font-semibold text-primary-full'>13</Text>
            </View>
            <View className='flex-1 bg-primary-light border border-primary-full rounded-2xl p-5 items-center justify-center gap-2'>
              <AntDesign name="star" size={24} color="#FF8C69" />
              <Text className='text-lg font-semibold text-primary-full'>3450</Text>
            </View>
            <View className='flex-1 bg-primary-light border border-primary-full rounded-2xl p-5 items-center justify-center gap-2'>
              <Ionicons name="people" size={24} color="#FF8C69" />
              <Text className='text-lg font-semibold text-primary-full'>3</Text>
            </View>
          </View>
          {/*Buttons*/}
          <View className='items-center' style={{marginVertical:20}}>
            <Text className='text-sm'>Do you want to do something new today?</Text>
             <CustomButton width='80%' borderColor='#FF8C69' height={50} bgColor='#FF8C69' title="Start a Project" titleColor='#fff' handelPress={()=>{router.push('/create/create-step1')}} />
             <CustomButton width='80%' borderColor='#000000' height={50} bgColor='F8F6F5' title="Find a Team" handelPress={()=>{router.push('/(tabs)/explore')}} />
          </View>
          {/**/}
          <View className='mb-4 mx-4 flex-row justify-between'>
            <Text className='text-lg'>Recently :</Text>
            <TouchableOpacity onPress={() => router.push('/(menu)/my-projects')}>
              <Text className='text-lg text-primary-full'>View all {`>`}</Text>
            </TouchableOpacity>
          </View>

          <SideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />

        </View>
        }
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

export default Home