import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';

interface ApplicationSuccessModalProps {
  visible: boolean;
  projectName?: string;
  onClose: () => void;
  onBackToExplore: () => void;
  onViewApplications: () => void;
}

export const ApplicationSuccessModal: React.FC<ApplicationSuccessModalProps> = ({
  visible,
  projectName,
  onClose,
  onBackToExplore,
  onViewApplications,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent={true} >
      <View className="flex-1 bg-black/40 justify-center items-center px-6">
        <View className="w-full bg-bg rounded-3xl p-6 items-center relative shadow-xl border border-slate-100">

          {/* Close Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white items-center justify-center shadow-sm z-10"
          >
            <Ionicons name="close" size={20} color="#1A1A1A" />
          </TouchableOpacity>

          {/* Icon & Done Badge */}
          <View className="w-44 h-44 rounded-full bg-primary-light items-center justify-center mt-6 mb-6 relative">
            <FontAwesome5 name="telegram-plane" size={80} color="#FF8C69" />
            <View className="absolute bottom-2 right-1 transform rotate-12">
              <Text className="text-secondry-green font-black text-2xl tracking-wide">
                Done!
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text className="text-2xl font-black text-text-title text-center mb-2">
            Application <Text className="text-primary-full">Sent!</Text>
          </Text>

          {/* Subtitle */}
          <Text className="text-xs font-semibold text-slate-400 text-center leading-5 px-2 mb-8">
            The project leader of <Text className="font-bold text-slate-600">{projectName}</Text> has been notified. We'll let you know as soon as they review your application.
          </Text>

          {/* Actions */}
          <View className="w-full gap-3">
            <TouchableOpacity
              onPress={onBackToExplore}
              className="w-full bg-primary-full py-4 rounded-full flex-row items-center justify-center shadow-sm active:opacity-90"
            >
              <Text className="text-white font-bold text-sm mr-2">Back to Explore</Text>
              <Feather name="arrow-right" size={16} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onViewApplications}
              className="w-full border border-primary-full py-4 rounded-full items-center justify-center active:bg-primary-light"
            >
              <Text className="text-primary-full font-bold text-sm">View My Applications</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}; 