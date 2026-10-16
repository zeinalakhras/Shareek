import { Ionicons } from "@expo/vector-icons"
import { router, Tabs } from "expo-router"
import { View } from "react-native"


const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF8C69',
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          marginHorizontal: 10,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          paddingTop: 5
        }
      }}
      backBehavior= 'none'
    >
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: ({ size, color }) => (<Ionicons name="home" size={size} color={color} />) }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore', tabBarIcon: ({ size, color }) => (<Ionicons name="compass" size={size} color={color} />) }} />
      <Tabs.Screen
        name="create"
        options={{
          title: '', tabBarIcon: ({ size, color }) => (
            <View style={{ width: 60, height: 60, backgroundColor: '#1e3a45', borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 40, borderWidth: 4, borderColor: '#f2f2f2' }} >
              <Ionicons name="add" size={30} color="white" />
            </View>
          )
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/create/create-step1');
          },
        }} />
      <Tabs.Screen name="chat" options={{ title: 'Chat', tabBarIcon: ({ size, color }) => (<Ionicons name="chatbubble" size={size} color={color} />) }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ size, color }) => (<Ionicons name="person" size={size} color={color} />) }} />
    </Tabs>
  )
}

export default TabsLayout