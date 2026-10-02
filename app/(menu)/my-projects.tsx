import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ProjectCard from '../../components/ProjectCard'; 
import { mockAllProjectsResponse , CURRENT_TEST_USER_ID } from '../../MockData/projectsMock2';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getMyProjects } from '../../utils/projectUtils';
import { Project } from '@/types/project'

export default function MyProjectsScreen() {
  const router = useRouter();

  const currentUserId = CURRENT_TEST_USER_ID; 
  
    const allProjects = (mockAllProjectsResponse?.data?.items || []) as Project[] ;
  
    const myProjects = getMyProjects(allProjects, currentUserId);

  return (
    <SafeAreaView className="flex-1 bg-bg">
      
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-gray-100/50">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 -ml-2 rounded-full"
        >
          <Feather name="arrow-left" size={24} color="#2D3748" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#2D3748] ml-2">My Projects</Text>
      </View>

      {/* Content */}
      <FlatList
        data={myProjects}
        renderItem={({ item }) => <ProjectCard project={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
      />
      
    </SafeAreaView>
  );
}