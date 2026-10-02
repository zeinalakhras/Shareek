import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ProjectSummaryDTO } from '@/types/types';

interface SavedCardProps {
  project: ProjectSummaryDTO;
  onRemoveSaved?: (id: string, name: string) => void;
}

const SavedCard = ({ project, onRemoveSaved }: SavedCardProps) => {
  const date = new Date(project.created_at || Date.now());

  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });


  return (
    <View className="w-[90%] mx-auto bg-white mb-4 p-5 rounded-2xl shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-start">
        <View className="flex-1 mr-3 space-y-1">
          <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>
            {project.name}
          </Text>
          <View className="flex-row items-center gap-1.5 mt-1">
            <Ionicons name="calendar-clear-outline" size={16} color="#9CA3AF" />
            <Text className="text-xs text-gray-400">Applied {formattedDate}</Text>
          </View>
          <View className='mt-3'>
            <Text className='text-xs font-medium text-gray-400 uppercase'>project status: {project.status}</Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          {onRemoveSaved && (
            <TouchableOpacity
              onPress={() => onRemoveSaved(project.id, project.name)}
              className="w-9 h-9 rounded-xl bg-primary-light items-center justify-center"
            >
              <Ionicons name="bookmark" size={18} color="#FF8C69" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="w-full h-[1px] bg-gray-100 my-2" />
      
      <View className="flex-row justify-between items-center mt-2">
        <TouchableOpacity
          className="flex-row items-center gap-1.5"
          onPress={() => {
            router.push({
              pathname: '/projects/[id]',
              params: { id: project.id },
            });
          }}
        >
          <Text className="text-sm font-semibold text-primary-full">View Details</Text>
          <Ionicons name="arrow-forward" size={18} color="#FF8C69" />
        </TouchableOpacity>

        <View className="flex-row items-center gap-1.5">
          <Text className="text-xs font-medium text-gray-400">
            {project.stars_count || 0}
          </Text>
          <AntDesign name="star" size={18} color="#FF8C69" />
        </View>
      </View>
    </View>
  );
};

export default SavedCard;