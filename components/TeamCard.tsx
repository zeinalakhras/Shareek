import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { RecommendedProjectDTO } from '../types/types';

interface TeamCardProps {
  item: RecommendedProjectDTO;
  onViewDetails: (id: string) => void;
}

const TeamCard = ({ item, onViewDetails }: TeamCardProps) => {
  if (!item) return null;

  return (
    <View className="bg-white rounded-3xl p-5 mb-4 shadow-sm border border-gray-50 relative overflow-hidden">
      {/* Match Percentage */}
      <View className="absolute top-0 right-0 bg-[#E8F8F2] px-3 py-1 rounded-bl-xl">
        <Text className="text-secondry-green text-xs font-bold">
          {item.match_score ? `${Math.round(item.match_score * 100)}% Match` : 'Looking for Team'}
        </Text>
      </View>

      <View className="flex-row items-center mb-3">
        <View className="w-11 h-11 bg-primary-light rounded-2xl items-center justify-center mr-3">
          <MaterialCommunityIcons name="account-group-outline" size={22} color="#FF8C69" />
        </View>
        <View className="flex-1 pr-16">
          <Text className="text-base font-bold text-text-title" numberOfLines={1}>{item.name}</Text>
          <Text className="text-xs text-gray-400 font-medium">By {item.owner?.full_name}</Text>
        </View>
      </View>

      <Text className="text-gray-500 text-sm mb-4 leading-5" numberOfLines={2}>
        {item.description}
      </Text>

      {/* Required Roles */}
      {item.open_roles && item.open_roles.length > 0 && (
        <View className="mb-3">
          <Text className="text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Hiring Positions:</Text>
          <View className="flex-row flex-wrap">
            {item.open_roles?.map((role, idx) => (
              <View key={idx} className="bg-[#EFF6FF] px-2.5 py-1 rounded-lg mr-2 mb-1.5 border border-[#DBEAFE]">
                <Text className="text-xs font-semibold text-[#1E40AF]">{role.title}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className="w-full h-[1px] bg-gray-100 my-1" />

      <View className="flex-row justify-between items-center mt-2">
        <Text className="text-xs text-primary-full font-bold bg-primary-light px-2 py-1 rounded-md">Incomplete • Recruiting</Text>
        <TouchableOpacity onPress={() => onViewDetails(item.id)} className="flex-row items-center">
          <Text className="text-primary-full font-bold text-sm mr-1">View Details</Text>
          <Feather name="arrow-right" size={14} color="#FF8C69" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default TeamCard ;