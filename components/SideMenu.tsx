import { Modal, View, Text, TouchableOpacity, Image, Pressable, ScrollView, Platform } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';

interface SideMenuProps {
    visible: boolean;
    onClose: () => void;
}

const SideMenu = ({ visible, onClose }: SideMenuProps) => {

    const router = useRouter();

    const logout = useAuthStore((state) => state.logout);

    const navigateTo = (path: string) => {
        onClose();
        router.push(path as any);
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            statusBarTranslucent={true}
            presentationStyle="overFullScreen"
        >
            {/* Background Screen */}
            <Pressable onPress={onClose} className="flex-1 bg-black/40 flex-row">

                {/* Side Menu */}
                <Pressable
                    onPress={(e) => e.stopPropagation()}
                    className="w-[80%] bg-bg h-full justify-between pb-8 shadow-2xl">

                    {/* Content */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingTop: Platform.OS === 'ios' ? 60 : 50 }}>
                        {/* Header */}
                        <View className="flex-row justify-between items-start px-6 mb-8">
                            {/* Profile Picture & Name */}
                            <View>
                                <View className="relative w-16 h-16 mb-3">
                                    <Image
                                        source={require('../assets/images/profile.png')}
                                        className="w-full h-full rounded-full border-2 border-primary-full"
                                    />
                                    <View className="absolute bottom-0 right-0 w-4 h-4 bg-secondry-green rounded-full border-2 border-white" />
                                </View>
                                <Text className="text-xl font-bold text-text-title">Zein Al Akhras</Text>
                                <TouchableOpacity onPress={() => navigateTo('/profile')} className="flex-row items-center mt-1">
                                    <Text className="text-sm font-medium text-primary-full mr-1">View Profile</Text>
                                    <Feather name="chevron-right" size={14} color="#FF8C69" />
                                </TouchableOpacity>
                            </View>

                            {/* Close Side Menu */}
                            <TouchableOpacity onPress={onClose} className="p-1">
                                <Ionicons name="close" size={24} color="black" />
                            </TouchableOpacity>
                        </View>

                        {/* Routes */}
                        <View className="px-4 gap-2 mb-6">

                            <TouchableOpacity
                                onPress={() => navigateTo('/(menu)/my-projects')}
                                className="flex-row items-center bg-primary-light px-4 py-3.5 rounded-2xl"
                            >
                                <Feather name="folder" size={20} color="#FF8C69" />
                                <Text className="text-base font-semibold text-primary-full ml-4">My Projects</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="flex-row items-center px-4 py-3.5 rounded-2xl"
                                onPress={() => { navigateTo('/(menu)/my-requests') }}
                            >
                                <Feather name="file-text" size={20} color="#A38F85" />
                                <Text className="text-base font-medium text-secondry-text ml-4">My Requests</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => navigateTo('/(tabs)/chat')}
                                className="flex-row items-center justify-between px-4 py-3.5 rounded-2xl"
                            >
                                <View className="flex-row items-center">
                                    <Feather name="message-square" size={20} color="#A38F85" />
                                    <Text className="text-base font-medium text-secondry-text ml-4">Messages</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => navigateTo('/(menu)/notifications')}
                                className="flex-row items-center px-4 py-3.5 rounded-2xl">
                                <Feather name="bell" size={20} color="#A38F85" />
                                <Text className="text-base font-medium text-secondry-text ml-4">Notifications</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => { navigateTo('/(menu)/saved') }}
                                className="flex-row items-center px-4 py-3.5 rounded-2xl">
                                <Feather name="bookmark" size={24} color="#A38F85" />
                                <Text className="text-base font-medium text-secondry-text ml-4">Saved</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => navigateTo('/(tabs)/explore')}
                                className="flex-row items-center px-4 py-3.5 rounded-2xl">
                                <Feather name="users" size={20} color="#A38F85" />
                                <Text className="text-base font-medium text-secondry-text ml-4">Explore Teams</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => { navigateTo('/(menu)/drafts') }}
                                className="flex-row items-center px-4 py-3.5 rounded-2xl">
                                <Ionicons name="archive-outline" size={22} color="#A38F85" />
                                <Text className="text-base font-medium text-secondry-text ml-4">Drafts</Text>
                            </TouchableOpacity>

                        </View>
                    </ScrollView>

                    {/* Settings & Log Out */}
                    <View className="px-4 gap-2">
                        <TouchableOpacity
                            onPress={() => { navigateTo('/(menu)/settings') }}
                            className="flex-row items-center px-4 py-3.5 rounded-2xl">
                            <Feather name="settings" size={20} color="#A38F85" />
                            <Text className="text-base font-bold text-secondry-text ml-4">Settings</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                        onPress={logout}
                         className="flex-row items-center px-4 py-3.5 rounded-2xl">
                            <Feather name="log-out" size={20} color="#A38F85" />
                            <Text className="text-base font-bold text-secondry-text ml-4">Log Out</Text>
                        </TouchableOpacity>
                    </View>

                </Pressable>
            </Pressable>
        </Modal>
    );

}

export default SideMenu; 
