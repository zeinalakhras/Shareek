import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

interface BlockedProjectViewProps {
  projectName?: string;
  category?: string;
  imageUrl?: string | null;
  onContactSupport?: () => void;
}

export const BlockedProjectView: React.FC<BlockedProjectViewProps> = ({
  projectName = "EcoTracker App",
  category = "Sustainable Living • Hackathon",
  imageUrl,
  onContactSupport,
}) => {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }} className="flex-1 bg-bg">
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 pt-2 pb-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 bg-white rounded-full shadow-sm border border-gray-50">
          <Feather name="arrow-left" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <View className="flex-row gap-3">
          <TouchableOpacity className="w-10 h-10 rounded-full bg-white justify-center items-center shadow-sm">
            <Ionicons name="bookmark-outline" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-white justify-center items-center shadow-sm">
            <Ionicons name="share-social" size={20} color="#1A1A1A" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 items-center px-6 pt-5">

        {/* Project Header & Badge */}
        <View className="relative mb-4">
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} className="w-24 h-24 rounded-full bg-slate-200" />
          ) : (
            <View className="w-24 h-24 bg-primary-light justify-center items-center rounded-full">
              <Ionicons name="laptop-outline" size={44} color="#FF8C69" />
            </View>
          )}
          <View className="absolute bottom-0 right-0 bg-white rounded-full p-0.5">
            <Ionicons name="ban" size={24} color="#FF5C55" />
          </View>
        </View>

        {/* Project Title & Category */}
        <Text className="text-2xl font-bold text-text-title mb-1 text-center">{projectName}</Text>
        <Text className="text-sm text-slate-500 mb-5 font-medium">{category}</Text>

        {/* Warning Section */}
        <View className="items-center mb-10 px-2">
          <View className="mb-2">
            <Ionicons name="ban-outline" size={100} color="#FF5C55" />
          </View>

          <Text className="text-xl font-bold text-secondry-red text-center leading-7 mb-4">
            This project has been banned for violating the application policy.
          </Text>

          <Text className="text-base text-slate-600 text-center leading-6 font-medium">
            If you believe this is a mistake, please contact support.
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          className="w-full bg-primary-full py-4 rounded-full items-center shadow-sm active:opacity-80"
          onPress={onContactSupport}
        >
          <Text className="text-white text-base font-semibold">Contact support</Text>
        </TouchableOpacity>
        
      </View>
    </SafeAreaView>
  );
};