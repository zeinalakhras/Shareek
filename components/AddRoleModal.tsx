import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Switch, ScrollView, KeyboardAvoidingView, Platform, } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

export interface RoleData {
  id?: string;
  name: string;
  skills: string[];
  description: string;
  isBeginnerFriendly: boolean;
}

interface AddRoleModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (role: RoleData) => void;
  onDelete?: () => void;
  initialData?: RoleData | null;
}

export const AddRoleModal: React.FC<AddRoleModalProps> = ({ visible, onClose, onSave, onDelete, initialData, }) => {
  
  const [roleName, setRoleName] = useState('');
  const [skills, setSkills] = useState<string[]>(['React', 'Tailwind CSS', 'TypeScript']);
  const [newSkill, setNewSkill] = useState('');
  const [description, setDescription] = useState('');
  const [isBeginnerFriendly, setIsBeginnerFriendly] = useState(false);

  useEffect(() => {
    if (initialData) {
      setRoleName(initialData.name || '');
      setSkills(initialData.skills || []);
      setDescription(initialData.description || '');
      setIsBeginnerFriendly(initialData.isBeginnerFriendly || false);
    } else {
      setRoleName('');
      setSkills(['React', 'Tailwind CSS', 'TypeScript']);
      setDescription('');
      setIsBeginnerFriendly(false);
    }
  }, [initialData, visible]);

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      if (!skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()]);
      }
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleDone = () => {
    onSave({
      id: initialData?.id,
      name: roleName,
      skills,
      description,
      isBeginnerFriendly,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-black/40 justify-center items-center px-5"
      >
        {/* Backdrop Press to Close */}
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={onClose} 
          className="absolute inset-0"
        />

        {/* Modal Card */}
        <View className="w-full bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 max-h-[85%]">
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            
            {/* Header */}
            <View className="flex-row items-center justify-between mb-5">
              <View className="flex-row items-center flex-1 mr-3">
                <View className="w-10 h-10 bg-primary-light justify-center items-center mr-3 rounded-2xl">
                  <Feather name="briefcase" size={18} color="#FF8C69" />
                </View>
                <TextInput
                  value={roleName}
                  onChangeText={setRoleName}
                  placeholder="ROLE NAME ..."
                  placeholderTextColor="#94A3B8"
                  className="flex-1 text-base font-bold text-slate-800 tracking-wide"
                />
              </View>

              {onDelete && (
                <TouchableOpacity onPress={onDelete} className="p-1">
                  <Feather name="trash-2" size={18} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            {/* Skills Needed */}
            <View className="mb-5">
              <Text className="text-sm font-bold text-text-title mb-3">Skills Needed</Text>
              
              {/* Skill Badges */}
              <View className="flex-row flex-wrap gap-2 mb-3">
                {skills.map((skill, index) => (
                  <View 
                    key={index} 
                    className="flex-row items-center bg-primary-light border border-primary-full px-3 py-1.5 rounded-full"
                  >
                    <Text className="text-xs font-semibold text-primary-full mr-1.5">{skill}</Text>
                    <TouchableOpacity onPress={() => handleRemoveSkill(skill)}>
                      <Ionicons name="close" size={14} color="#FF8C69" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* Add Skill Input */}
              <View className="flex-row items-center bg-slate-100/80 rounded-2xl px-4 py-2.5">
                <TextInput
                  value={newSkill}
                  onChangeText={setNewSkill}
                  placeholder="Add a skill (e.g. Next.js)..."
                  placeholderTextColor="#94A3B8"
                  className="flex-1 text-xs text-slate-800 font-medium mr-2"
                  onSubmitEditing={handleAddSkill}
                />
                <TouchableOpacity onPress={handleAddSkill}>
                  <Text className="text-xs font-bold text-primary-full">ADD</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Role Description */}
            <View className="mb-5">
              <Text className="text-sm font-bold text-text-title mb-3">Role Description</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Describe the responsibilities and what you are looking for in a candidate..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="bg-slate-100/80 rounded-2xl p-4 text-xs text-slate-800 font-medium min-h-[90px]"
              />
            </View>

            {/* Divider Line */}
            <View className="h-[1px] bg-slate-100 mb-4" />

            {/* Beginner Friendly Toggle */}
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-1 mr-3">
                <Text className="text-sm font-bold text-slate-900">Beginner Friendly</Text>
                <Text className="text-xs text-slate-400 font-medium mt-0.5">
                  Is this role suitable for juniors?
                </Text>
              </View>
              <Switch
                value={isBeginnerFriendly}
                onValueChange={setIsBeginnerFriendly}
                trackColor={{ false: '#E2E8F0', true: '#FF8C69' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Action Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleDone}
              className="w-full bg-primary-full py-3.5 rounded-full items-center shadow-md active:opacity-90"
            >
              <Text className="text-white font-bold text-base">Done</Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};