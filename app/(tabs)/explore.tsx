import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import TeamCard from '../../components/TeamCard';
import ExploreProjectsCard from '../../components/ExploreProjectsCard';
import { mockRecommendedProjectsResponse, mockAllProjectsResponse } from '../../MockData/projectsMock2';
import { ProjectSummaryDTO, RecommendedProjectDTO } from '../../types/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

type TabType = 'findTeam' | 'exploreProjects';


const Explore = () => {

  const [activeTab, setActiveTab] = useState<TabType>('findTeam');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const recommendedProjects: RecommendedProjectDTO[] = mockRecommendedProjectsResponse.data.items;

  const allProjects: ProjectSummaryDTO[] = mockAllProjectsResponse.data.items.filter(
    (project) => project.status === 'completed'
  );
  
  const handleViewDetails = (id: string) => {
    router.push({
      pathname: '/projects/[id]',
      params: { id },
    })
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">

      {/* Header */}
      <View className="flex-row justify-between items-center px-5 pt-3 pb-2">
        <TouchableOpacity className="p-2 bg-white rounded-full shadow-sm border border-gray-50">
          <Feather name="arrow-left" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-text-title">Explore</Text>
        <Image
          source={require('../../assets/images/profile.png')}
          className="w-12 h-12 rounded-full border-2 border-primary-full"
          resizeMode='cover'
        />
      </View>

      {/* Flat list for automatic data processing */}
      <FlatList
        data={(activeTab === 'findTeam' ? recommendedProjects : allProjects) as any[]}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }}

        renderItem={({ item }) => {
          if (activeTab === 'findTeam') {
            return (
              <TeamCard
                item={item as RecommendedProjectDTO}
                onViewDetails={handleViewDetails}
              />
            );
          } else {
            return (
              <ExploreProjectsCard
                item={item as ProjectSummaryDTO}
                onViewDetails={handleViewDetails}
              />
            );
          }
        }}

        ListHeaderComponent={
          <View>
            {/* Search and Filter Bar */}
            <View className="flex-row items-center mb-5">
              <View className="flex-1 flex-row items-center bg-white rounded-full px-4 py-3 shadow-sm border border-gray-100">
                <Feather name="search" size={20} color="#94A0B8" />
                <TextInput
                  placeholder="Search projects, partners ,..."
                  placeholderTextColor="#94A0B8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  className="flex-1 text-base ml-2 py-0"
                />
              </View>
              <TouchableOpacity className="bg-primary-full p-3.5 rounded-full ml-3 shadow-md">
                <Ionicons name="options-outline" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Tabs Toggle */}
            <View className="flex-row justify-between bg-transparent mb-6">
              <TouchableOpacity
                onPress={() => setActiveTab('findTeam')}
                className={`flex-1 py-3 rounded-full mr-2 items-center shadow-sm ${activeTab === 'findTeam' ? 'bg-primary-full' : 'bg-secondry-one'}`}
              >
                <Text className="text-white font-semibold text-base">Find Team</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab('exploreProjects')}
                className={`flex-1 py-3 rounded-full ml-2 items-center shadow-sm ${activeTab === 'exploreProjects' ? 'bg-primary-full' : 'bg-secondry-one'}`}
              >
                <Text className="text-white font-semibold text-base">Explore Projects</Text>
              </TouchableOpacity>
            </View>

            {/* Recommended For You */}
            {activeTab === 'findTeam' && (
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold text-text-title">
                  Recommended <Text className="text-primary-full">for you</Text>
                </Text>
                <View className="bg-gray-100 px-3 py-1 rounded-full">
                  <Text className="text-xs text-gray-500 font-medium">
                    {recommendedProjects.length} matches
                  </Text>
                </View>
              </View>
            )}
          </View>
        }
      />

    </SafeAreaView>
  );
}

export default Explore;