import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const ProjectCard = ({ project }: any) => {
  const date = project.created_at ? new Date(project.created_at) : null;

  const formattedDate =
    date && !Number.isNaN(date.getTime())
      ? date.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      : null;
  const status = String(project.status ?? "").toUpperCase();
  const isCompleted = status === "COMPLETED";
  const starCount = project.starCount ?? project.stars_count ?? 0;

  const STATUS_META: Record<string, { label: string; color: string }> = {
    DRAFT: { label: "Draft", color: "#9CA3AF" },
    RECRUITING: { label: "Recruiting", color: "#FF8C69" },
    PREPARATION: { label: "Preparation", color: "#FF8C69" },
    IN_PROGRESS: { label: "In Progress", color: "#FF8C69" },
    ACTIVE: { label: "Active", color: "#9CA3AF" },
    COMPLETED: { label: "Completed", color: "#22C55E" },
    CANCELLED: { label: "Cancelled", color: "#ff0000" },
    SUSPENDED: { label: "Suspended", color: "#ff0000" },
    BLOCKED: { label: "Blocked", color: "#ff0000" },
    DELETED: { label: "Deleted", color: "#ff0000" },
    INSUFFICIENTPARTNERS: { label: "Insufficient partners", color: "#9CA3AF" },
  };

  const statusMeta = STATUS_META[status] ?? {
    label: status
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char: string) => char.toUpperCase()),
    color: "#9CA3AF",
  };

  const renderProjectStatus = () => (
    <View className="flex-row gap-2 items-center">
      <Text style={{ color: statusMeta.color }}>{statusMeta.label}</Text>
      {isCompleted && (
        <View className="flex-row gap-1 items-center">
          <Text style={{ color: "#9CA3AF" }}>{starCount}</Text>
          <AntDesign name="star" size={16} color="#FF8C69" />
        </View>
      )}
    </View>
  );

  return (
    <View className="w-[90%] mx-auto bg-white mb-5 p-5 rounded-2xl">
      <View className="flex-row justify-between mb-4">
        <View className="flex-1" style={{ gap: 15 }}>
          <Text className="text-xl font-bold">{project.name}</Text>
          {formattedDate && (
            <View className="flex-row gap-2 items-center">
              <Ionicons
                name="calendar-clear-outline"
                size={20}
                color="#9CA3AF"
              />
              <Text style={{ color: "#9CA3AF" }}>Applied {formattedDate}</Text>
            </View>
          )}
        </View>
        <View
          style={{
            width: 35,
            height: 35,
            borderRadius: 8,
            backgroundColor: "#F0F0F0",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Image
            source={
              project.coverImage || project.image_url
                ? { uri: project.coverImage || project.image_url }
                : require("../assets/images/icon.png")
            }
            style={{ width: "100%", height: "100%" }}
            resizeMode={
              project.coverImage || project.image_url ? "cover" : "contain"
            }
          />
        </View>
      </View>
      <View className="flex-row gap-2 items-center mb-1 reverse ">
        <Text className="text-sm text-gray-500">{project.description}</Text>
      </View>
      <View>
        <View
          className="w-[100%]"
          style={{ height: 3, backgroundColor: "#F0F0F0" }}
        />
        <View className="flex-row justify-between mt-4">
          <TouchableOpacity
            className="flex-row gap-1"
            onPress={() => {
              router.push({
                pathname: "/projects/[id]",
                params: { id: project.id },
              });
            }}
          >
            <Text className="text-primary-full">View Details</Text>
            <Ionicons name="arrow-forward" size={20} color="#FF8C69" />
          </TouchableOpacity>
          {renderProjectStatus()}
        </View>
      </View>
    </View>
  );
};

export default ProjectCard;
