import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Shadow } from 'react-native-shadow-2'
import { Entypo, Feather, FontAwesome5 } from '@expo/vector-icons'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import ProjectCard from '@/components/ProjectCard'
import { router } from 'expo-router'

const LinkItem = ({ label, value, iconName, IconComponent }: any) => (
  <View className="mb-4 w-full">
    <Text className="text-sm font-semibold text-text-title mb-2 ml-1">{label}</Text>
    <View className="flex-row items-center bg-white border border-gray-100 rounded-2xl px-4 py-3.5 shadow-sm justify-between">
      <View className="flex-row items-center flex-1">
        <IconComponent name={iconName} size={18} color="#FF8C69" />
        <Text className="text-gray-400 text-sm ml-3 bg-transparent">{value}</Text>
      </View>
      <Feather name="external-link" size={18} color="#FF8C69" />
    </View>
  </View>
);

const SkillBadge = ({ label, dotColor }: any) => (
  <View className="flex-row items-center bg-white border border-gray-100 rounded-full px-4 py-2 mr-2.5 shadow-sm">
    <View style={{ backgroundColor: dotColor }} className="w-2.5 h-2.5 rounded-full mr-2" />
    <Text className="text-gray-700 font-medium text-sm">{label}</Text>
  </View>
);

const projectsData = [
  {
    id: '1',
    name: 'Shareek App',
    created_at: '2026-05-10T12:00:00Z',
    status: 'active',
  },
  {
    id: '2',
    name: 'FinTrack',
    created_at: '2026-06-01T12:00:00Z',
    status: 'insufficientPartners',
  },
  {
    id: '3',
    name: 'E-Shop',
    created_at: '2026-03-15T12:00:00Z',
    status: 'completed',
    stars_count: 5,
  },
];

const Profile = () => {

  const tabBarHeight = useBottomTabBarHeight();

  const currentProjects = projectsData.filter(item => item.status !== 'completed');
  const completedProjects = projectsData.filter(item => item.status === 'completed');


  return (
    <SafeAreaView className='bg-bg'>
      <ScrollView showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: tabBarHeight }}>
        <View>
          {/*photo && name section*/}
          <View className='items-center p-8 pb-4' style={{ gap: 15 }}>
            <Shadow
              style={{ borderRadius: 64 }}
              distance={10}
              startColor={'#FF8C69'}
              endColor={'rgba(255,140,105, 0.1)'}
              offset={[0, 0]}
            >
              <View className='w-32 h-32 rounded-full overflow-hidden'>
                <Image
                  source={require('../../assets/images/profile.png')}
                  className='w-full h-full'
                  resizeMode='cover'
                />
              </View>
            </Shadow>
            <View>
              <Text className='font-semibold text-2xl text-center'>Nasser kamali</Text>
              <View className="bg-primary-light border border-primary-mid items-center px-4 py-1 rounded-full mt-2">
                <Text className="text-primary-full font-medium text-xs">University Student</Text>
              </View>
              <Text className="text-gray-500 text-center text-xs mt-2 font-medium tracking-wide">ID: 1299001</Text>
            </View>
          </View>
          {/*Edit Button*/}
          <View className='px-6'>
            <TouchableOpacity
              onPress={()=>{router.push('/profile/edit-profile')}}
              className='flex-row justify-center items-center gap-2 bg-black rounded-full p-3'
            >
              <Entypo name="edit" size={16} color="white" />
              <Text className='text-white'>Edit Profile</Text>
            </TouchableOpacity>
          </View>
          {/*Bio Section*/}
          <View className="px-6 mt-6">
            <Text className="text-lg font-bold text-text-title mb-2">Bio</Text>
            <Text className="text-gray-600 leading-6 text-sm">
              CS Junior at Cairo University. Passionate about UI/UX and React Native. Building things for the future 🚀
            </Text>
          </View>
          {/*Links Section*/}
          <View className="px-6 mt-6">
            <LinkItem
              label="Github Account"
              value="github.com/one"
              iconName="code"
              IconComponent={Feather}
            />
            <LinkItem
              label="Portfolio"
              value="https://naseerkamali.com"
              iconName="globe"
              IconComponent={Feather}
            />
            <LinkItem
              label="Linkedin"
              value="www.linkedin.com/in/username"
              iconName="linkedin"
              IconComponent={FontAwesome5}
            />
          </View>
          {/*About me button*/}
          <View className="px-6 mt-2">
            <TouchableOpacity
              onPress={() => { router.push('/profile/additional-info') }}
              className="flex-row items-center justify-between bg-primary-full/20 border border-primary-full rounded-3xl px-5 py-4 active:opacity-90">
              <View className="flex-row items-center">
                <Feather name="info" size={20} color="#FF8C69" />
                <Text className="text-primary-full font-bold text-base ml-3">About me</Text>
              </View>
              <Feather name="arrow-right" size={20} color="#FF8C69" />
            </TouchableOpacity>
          </View>
          {/*Skills*/}
          <View className="mt-6 px-6">
            <Text className="text-sm font-bold text-text-title tracking-wider mb-3">SKILLS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row pr-6">
              <SkillBadge label="React" dotColor="#38BDF8" />
              <SkillBadge label="Figma" dotColor="#FF8C69" />
              <SkillBadge label="Python" dotColor="#0284C7" />
              <SkillBadge label="TypeScript" dotColor="#3178C6" />
            </ScrollView>
          </View>
          {/*Current Projects*/}
          <View className='mt-6'>
            <View className="flex-row justify-between items-center mb-4 px-5">
              <Text className="text-2xl font-bold text-text-title">Current Projects</Text>
              <TouchableOpacity>
                <Text className="text-base font-semibold text-primary-full">View All {`>`}</Text>
              </TouchableOpacity>
            </View>
            <View className='px-6'>
              {currentProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </View>
          </View>
          {/*Completed Projects*/}
          <View className='mt-6'>
            <View className="px-5 mb-4">
              <Text className="text-2xl font-bold text-text-title">Completed</Text>
            </View>
            <View className='px-6'>
              {completedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile

