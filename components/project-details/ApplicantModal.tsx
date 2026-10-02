import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';

interface ApplicantData {
  id: string;
  name: string;
  role: string;
  match: string;
  avatar: string;
  skills: string[];
  bio: string;
}

interface ApplicantModalProps {
  visible: boolean;
  applicant: ApplicantData | null;
  onClose: () => void;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

export const ApplicantModal: React.FC<ApplicantModalProps> = ({
  visible,
  applicant,
  onClose,
  onAccept,
  onDecline,
}) => {
  if (!applicant) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/40 justify-center items-center px-6">
          <TouchableWithoutFeedback>
            <View className="w-full bg-white rounded-3xl p-6 shadow-xl border border-slate-100 relative">

              {/* Header */}
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-3">
                  <Image source={{ uri: applicant.avatar }} className="w-14 h-14 rounded-full" />
                  <View>
                    <Text className="text-base font-bold text-text-title">{applicant.name}</Text>
                    <Text className="text-xs text-slate-400 mt-0.5">
                      Applied for <Text className="text-primary-full font-semibold">{applicant.role}</Text>
                    </Text>
                  </View>
                </View>
                <View className="bg-emerald-100 px-3 py-1 rounded-full">
                  <Text className="text-emerald-700 text-xs font-bold">{applicant.match}</Text>
                </View>
              </View>

              {/* Skills Tags */}
              <View className="flex-row flex-wrap gap-2 mb-4">
                {applicant.skills.map((skill, index) => (
                  <View key={index} className="bg-slate-100 px-3 py-1 rounded-xl">
                    <Text className="text-slate-600 text-xs font-medium">{skill}</Text>
                  </View>
                ))}
              </View>

              {/* Role Application Statement */}
              <Text className="text-xs font-bold text-text-title mb-2">
                I am applying for the role of: <Text className="font-normal text-slate-600">{applicant.role}</Text>
              </Text>

              {/* Bio / Description */}
              <Text className="text-xs text-slate-600 leading-5 mb-6">
                {applicant.bio}
              </Text>

              {/* Action Buttons */}
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => onDecline(applicant.id)}
                  className="flex-1 bg-white border border-slate-300 py-3.5 rounded-full items-center justify-center active:bg-slate-50"
                >
                  <Text className="text-slate-400 font-bold text-sm">Decline</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => onAccept(applicant.id)}
                  className="flex-1 bg-primary-full py-3.5 rounded-full items-center justify-center shadow-sm active:opacity-90"
                >
                  <Text className="text-white font-bold text-sm">Accept</Text>
                </TouchableOpacity>
              </View>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};