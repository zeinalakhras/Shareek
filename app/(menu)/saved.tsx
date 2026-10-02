import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Image, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import SavedCard from '@/components/SavedCard';
import { ProjectSummaryDTO } from '@/types/types';

const CURRENT_TEST_USER_ID = "usr_test_user_id";

const SAVED_PROJECTS_MOCK: ProjectSummaryDTO[] = [
  {
    id: "prj_complete_1",
    name: "E-Commerce Suite",
    description: "A fully functional microservices-based e-commerce platform with live tracking and cross-platform mobile apps.",
    status: "completed",
    visibility: "public",
    work_type: "remote",
    duration: "long",
    is_university_project: false,
    image_url: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",
    github_url: "https://github.com/example/ecommerce-suite",
    website_url: "https://ecommerce-suite-demo.com",
    owner: {
      id: "usr_owner1",
      full_name: "Omar Khaled",
      profile_image: null
    },
    stars_count: 245,
    members_count: 6,
    tags: ["Microservices", "E-Commerce", "React Native"],
    created_at: "2026-01-10T08:00:00Z"
  },
  {
    id: "prj_complete_2",
    name: "AI-Powered Resume Builder",
    description: "An intelligent platform that helps users build ATS-friendly resumes with real-time AI suggestions and custom tracking.",
    status: "completed",
    visibility: "public",
    work_type: "hybrid",
    duration: "medium",
    is_university_project: true,
    image_url: null,
    github_url: "https://github.com/example/ai-resume-builder",
    website_url: "https://ai-resume-builder.app",
    owner: {
      id: "usr_owner2",
      full_name: "Sara Ahmad",
      profile_image: "https://randomuser.me/api/portraits/women/12.jpg"
    },
    stars_count: 189,
    members_count: 3,
    tags: ["AI", "Resume", "TypeScript"],
    created_at: "2026-02-15T10:30:00Z"
  },
  {
    id: "prj_my_active_owner",
    name: "EcoTracker App",
    description: "We are building a React Native app to help users track their daily carbon footprint through automated purchase analysis and manual logging.",
    status: "completed",
    visibility: "public",
    work_type: "remote",
    duration: "medium",
    is_university_project: true,
    image_url: null,
    github_url: "https://github.com/example/ecotracker-app",
    website_url: "https://ecotracker.dev",
    owner: {
      id: CURRENT_TEST_USER_ID,
      full_name: "My Account",
      profile_image: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    stars_count: 54,
    members_count: 3,
    tags: ["React Native", "Sustainability", "Expo"],
    created_at: "2026-04-01T10:00:00Z"
  },
  {
    id: "prj_test_rec_owner_1",
    name: "My Next Big SaaS App",
    description: "A specialized project created by me currently in recruitment mode seeking UI designers and backend developers.",
    status: "RECRUITING",
    visibility: "public",
    work_type: "remote",
    duration: "3 Months",
    is_university_project: false,
    image_url: "https://cdn-icons-png.flaticon.com/512/1086/1086741.png",
    owner: {
      id: CURRENT_TEST_USER_ID,
      full_name: "My Account",
      profile_image: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    tags: ["React Native", "Tailwind", "Supabase"],
    stars_count: 15,
    members_count: 1,
    members: [
      { id: CURRENT_TEST_USER_ID, full_name: "My Account", role_title: "Project Creator", profile_image: "https://randomuser.me/api/portraits/men/1.jpg" }
    ],
    open_roles: [
      { id: "role_my_1", title: "UI/UX Designer", isRequired: true, requiredCount: 1, filledCount: 0, skills: ["Figma"] },
      { id: "role_my_2", title: "Backend Engineer", isRequired: true, requiredCount: 1, filledCount: 0, skills: ["Node.js", "PostgreSQL"] }
    ],
    created_at: "2026-09-20T10:00:00Z"
  },

];


export default function SavedProjectsScreen() {
  const router = useRouter();
  const [savedProjects, setSavedProjects] = useState<ProjectSummaryDTO[]>(SAVED_PROJECTS_MOCK);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const handleRemoveSaved = (id: string, name: string) => {
    Alert.alert(
      'Remove Saved Project',
      `Are you sure you want to remove "${name}" from your saved projects?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setSavedProjects((prev) => prev.filter((item) => item.id !== id));
          },
        },
      ]
    );
  };

  const filteredProjects = savedProjects.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.tags?.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };


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
        <Text className="text-xl font-bold text-[#2D3748] ml-2">Saved</Text>
      </View>

      {/* Search Bar */}
      <View className='px-4'>
        {savedProjects.length > 0 && (
          <View className="flex-row items-center bg-white px-3 py-2.5 rounded-xl border border-gray-200 mb-4 shadow-sm">
            <Ionicons name="search-outline" size={18} color="#9ca3af" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search saved projects..."
              placeholderTextColor="#9ca3af"
              className="flex-1 ml-2 text-sm text-gray-800 p-0"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Content */}
      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SavedCard project={item} onRemoveSaved={(id, name) => handleRemoveSaved(id, name)} />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-16 px-4">
            <View className="w-16 h-16 bg-primary-light items-center justify-center rounded-full mb-3">
              <Ionicons name="bookmark-outline" size={32} color="#FF8C69" />
            </View>
            <Text className="text-base font-bold text-gray-800 mb-1">
              {searchQuery ? 'No matching projects' : 'No saved projects'}
            </Text>
            <Text className="text-xs text-gray-500 text-center max-w-[240px] leading-5">
              {searchQuery
                ? 'Try searching with another keyword or tag.'
                : 'Bookmark interesting projects to easily access them here later.'}
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}