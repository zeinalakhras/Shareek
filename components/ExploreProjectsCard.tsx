import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { ProjectSummaryDTO } from '../types/types';

interface ExploreProjectsCardProps {
  item: ProjectSummaryDTO;
  onViewDetails: (id: string) => void;
}

export default function ExploreProjectsCard({ item, onViewDetails }: ExploreProjectsCardProps) {
  if (!item) return null;

  return (
    <View className="bg-white rounded-3xl p-5 mb-4 shadow-sm border border-gray-50 relative">
      {/* Compeleted Project Sign */}
      <View className="absolute top-3 right-3 bg-[#F0FDF4] px-2.5 py-1 rounded-xl flex-row items-center">
        <Ionicons name="checkmark-circle" size={14} color="#22C55E" />
        <Text className="text-[10px] text-secondry-green font-bold ml-1 uppercase">Completed</Text>
      </View>

      <View className="flex-row items-center mb-3">
        <View className="w-11 h-11 bg-[#F8FAFC] rounded-2xl items-center justify-center mr-3 border border-gray-100">
          <Ionicons name="ribbon-outline" size={22} color="#1E3A47" />
        </View>
        <View className="flex-1 pr-24">
          <Text className="text-base font-bold text-[#1E293B]" numberOfLines={1}>{item.name}</Text>
          <Text className="text-xs text-gray-400 font-medium capitalize">{item.duration} Project</Text>
        </View>
      </View>

      <Text className="text-gray-500 text-sm mb-4 leading-5" numberOfLines={2}>
        {item.description}
      </Text>

      <View className="w-full h-[1px] bg-gray-100 my-2" />

      <View className="flex-row justify-between items-center mt-2">
        <View className="flex-row items-center">
          <FontAwesome name="star" size={15} color="#FF8C69" />
          <Text className="text-gray-700 font-bold text-xs ml-1.5">{item.stars_count || 0}</Text>
          <Text className="text-gray-400 text-xs ml-3">({item.members_count || 0} Contributors)</Text>
        </View>
        
        <TouchableOpacity onPress={() => onViewDetails(item.id)} className="flex-row items-center">
          <Text className="text-primary-full font-bold text-sm mr-1">View Details</Text>
          <Feather name="arrow-right" size={14} color="#FF8C69" />
        </TouchableOpacity>
      </View>
    </View>
  );
}