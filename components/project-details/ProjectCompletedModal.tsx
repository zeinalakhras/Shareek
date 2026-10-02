import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface ProjectCompletedModalProps {
  visible: boolean;
}

export const ProjectCompletedModal: React.FC<ProjectCompletedModalProps> = ({
  visible,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent={true}>
      <View className="flex-1 bg-black/40 justify-center items-center px-6">
        <View className="w-full bg-bg rounded-3xl p-6 items-center relative shadow-xl border border-slate-100">

          {/* Close Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white items-center justify-center shadow-sm z-10"
          >
            <Ionicons name="close" size={20} color="#1A1A1A" />
          </TouchableOpacity>

          {/* Rocket Icon & Check Badge */}
          <View className="w-48 h-48 bg-primary-light items-center justify-center mt-6 mb-6 rounded-full relative">
            <Ionicons name="rocket-outline" size={80} color="#FF8C69" />
            <View className="absolute bottom-2 right-2 bg-secondry-green w-12 h-12 rounded-full items-center justify-center border-4 border-bg">
              <Ionicons name="checkmark" size={24} color="#FFF" />
            </View>
          </View>

          {/* Title */}
          <Text className="text-2xl font-black text-text-title text-center mb-3">
            Your project is <Text className="text-primary-full">Completed!</Text>
          </Text>

          {/* Subtitle Description */}
          <Text className="text-xs font-semibold text-slate-500 text-center leading-5 px-2 mb-8">
            Make your project stand out. Document your journey and highlight what makes your work unique on the{' '}
            <Text className="text-primary-full font-bold">completion page.</Text>
          </Text>

          {/* completion page Button */}
          <TouchableOpacity
            className="w-full bg-primary-full py-4 rounded-full items-center justify-center shadow-lg active:opacity-90"
          >
            <Text className="text-white font-bold text-sm">Go to completion page</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};