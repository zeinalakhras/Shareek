import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather, FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { notifications } from '@/MockData/projectsMock2';

type NotificationType = 'support' | 'request' | 'match' | 'review';

const Notifications = () => {

  const router = useRouter();

  const getNotificationConfig = (type: NotificationType) => {
    switch (type) {
      case 'support':
        return {
          icon: <FontAwesome6 name="headset" size={24} color="#FF8C69" />,
          bgColor: 'bg-[#FFF1EC]',
        };
      case 'request':
        return {
          icon: <FontAwesome5 name="user" size={18} color="#4A60FF" />,
          bgColor: 'bg-[#EEF1FF]',
        };
      case 'match':
        return {
          icon: <Ionicons name="briefcase-outline" size={20} color="#E28743" />,
          bgColor: 'bg-[#FDF2EC]',
        };
      case 'review':
        return {
          icon: <Feather name="star" size={20} color="#A3A3A3" />,
          bgColor: 'bg-[#F5F5F5]',
        };
    }
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
        <Text className="text-xl font-bold text-[#2D3748] ml-2">Notifications</Text>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-6 pt-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-4 pb-10">
          {notifications.map((item) => {
            const config = getNotificationConfig(item.type);
            return (
              <View
                key={item.id}
                className="bg-white rounded-3xl p-5 flex-row items-start shadow-sm border border-gray-100/40"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 10,
                  elevation: 2
                }}
              >
                {/* Notification Icon */}
                <View className={`w-12 h-12 rounded-2xl items-center justify-center ${config.bgColor}`}>
                  {config.icon}
                </View>

                <View className="flex-1 ml-4">
                  <View className="flex-row justify-between items-start w-full">
                    <Text className="text-base font-bold text-text-title flex-1 pr-2">
                      {item.title}
                    </Text>
                    <Text className="text-xs text-primary-full font-medium pt-0.5">
                      {item.time}
                    </Text>
                  </View>

                  <Text className="text-sm text-secondry-one mt-1.5 leading-relaxed">
                    {item.description}
                    {item.clickableText && (
                      <Text className="text-secondry-red font-semibold underline">
                        {item.clickableText}
                      </Text>
                    )}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
        {/* Footer */}
        <View className="items-center justify-center pb-8 pt-4 px-6 border-t border-gray-100/30">
          <View className="bg-primary-light p-4 rounded-full mb-3 shadow-inner">
            <FontAwesome5 name="bell" size={24} color="#FF8C69" solid />
          </View>
          <Text className="text-xs text-center text-[#7A7A7A] max-w-[280px] leading-normal font-medium">
            Note : Notifications are deleted 30 days after they are sent.
          </Text>
        </View>
      </ScrollView>

    </SafeAreaView>
  );



}

export default Notifications; 