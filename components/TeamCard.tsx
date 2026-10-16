import { View, Text, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import type { ProjectSummary } from '../api/project/types';

interface TeamCardProps {
  item: ProjectSummary;
  onViewDetails: (id: string) => void;
}

const STATUS_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  DRAFT: { label: 'Draft', bg: 'bg-slate-100', color: '#64748B' },
  RECRUITING: { label: 'Incomplete • Recruiting', bg: 'bg-primary-light', color: '#FF8C69' },
  PREPARATION: { label: 'Preparing', bg: 'bg-[#EFF6FF]', color: '#2563EB' },
  IN_PROGRESS: { label: 'In Progress', bg: 'bg-[#EFF6FF]', color: '#2563EB' },
  COMPLETED: { label: 'Completed', bg: 'bg-[#ECFDF5]', color: '#16A34A' },
  CANCELLED: { label: 'Cancelled', bg: 'bg-[#FEF2F2]', color: '#DC2626' },
  SUSPENDED: { label: 'Suspended', bg: 'bg-[#FEF2F2]', color: '#DC2626' },
  DELETED: { label: 'Removed', bg: 'bg-slate-100', color: '#64748B' },
};

const TeamCard = ({ item, onViewDetails }: TeamCardProps) => {
  if (!item) return null;

  const badge = STATUS_BADGE[item.status] ?? {
    label: item.status || 'Open',
    bg: 'bg-primary-light',
    color: '#FF8C69',
  };
  const roleNames = item.roleNames ?? [];

  return (
    <View className="bg-white rounded-3xl p-5 mb-4 shadow-sm border border-gray-50 relative overflow-hidden">
      {/* Match Percentage */}
      <View className="absolute top-0 right-0 bg-[#E8F8F2] px-3 py-1 rounded-bl-xl">
        <Text className="text-secondry-green text-xs font-bold">
          {item.matchPercentage != null ? `${item.matchPercentage}% Match` : 'Looking for Team'}
        </Text>
      </View>

      <View className="flex-row items-center mb-3">
        <View className="w-11 h-11 bg-primary-light rounded-2xl items-center justify-center mr-3">
          <MaterialCommunityIcons name="account-group-outline" size={22} color="#FF8C69" />
        </View>
        <View className="flex-1 pr-16">
          <Text className="text-base font-bold text-text-title" numberOfLines={1}>{item.name}</Text>
          <Text className="text-xs text-gray-400 font-medium" numberOfLines={1}>
            By {item.creatorName || 'Unknown creator'}
          </Text>
        </View>
      </View>

      <Text className="text-gray-500 text-sm mb-4 leading-5" numberOfLines={2}>
        {item.description}
      </Text>

      {/* Required Roles — fed by `roleNames` from the feed, no extra request */}
      {roleNames.length > 0 && (
        <View className="mb-3">
          <Text className="text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Hiring Positions:</Text>
          <View className="flex-row flex-wrap">
            {roleNames.map((role, idx) => (
              <View
                key={`${role}-${idx}`}
                className="bg-[#EFF6FF] px-2.5 py-1 rounded-lg mr-2 mb-1.5 border border-[#DBEAFE]"
              >
                <Text className="text-xs font-semibold text-[#1E40AF]">{role}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className="w-full h-[1px] bg-gray-100 my-1" />

      <View className="flex-row justify-between items-center mt-2">
        <Text
          className={`text-xs font-bold px-2 py-1 rounded-md ${badge.bg}`}
          style={{ color: badge.color }}
        >
          {badge.label}
        </Text>
        <TouchableOpacity onPress={() => onViewDetails(item.id)} className="flex-row items-center">
          <Text className="text-primary-full font-bold text-sm mr-1">View Details</Text>
          <Feather name="arrow-right" size={14} color="#FF8C69" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default TeamCard;