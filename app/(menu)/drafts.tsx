import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import ProjectCard from "@/components/ProjectCard";
import { Feather} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/useAuthStore";
import { getMyProjects } from "@/api/project/projectApi";
import { ProjectSummary } from "@/api/project/types";
import { getApiErrorMessage } from "@/utils/apiError";

export default function DraftsScreen() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);

  const fetchProjects = useCallback(async () => {
    if (!accessToken) return;
    const response = await getMyProjects(accessToken, { status: ["DRAFT"] });

    setProjects(response.data?.items ?? []);
  }, [accessToken]);

  const loadData = useCallback(
    async (mode: "initial" | "refresh") => {
      if (mode === "initial") {
        setIsLoading(true);
      } else {
        setRefreshing(true);
      }

      try {
        await Promise.all([fetchProjects()]);
      } catch (error) {
        Alert.alert(
          "Could not load",
          getApiErrorMessage(
            error,
            "Something went wrong while loading your home feed.",
          ),
        );
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    },
    [fetchProjects],
  );
  
  useEffect(() => {
    loadData("initial");
  }, [loadData]);

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
        <Text className="text-xl font-bold text-[#2D3748] ml-2">My Drafts</Text>
      </View>

      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={() => loadData("refresh")}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" color="#FF8C69" className="my-10" />
          ) : (
            <Text className="text-center text-text-placeholder my-10">
              No projects yet. Start one to see it here.
            </Text>
          )
        }
        renderItem={({ item }) => (
          <View className="relative mb-3">
            <ProjectCard project={item} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
