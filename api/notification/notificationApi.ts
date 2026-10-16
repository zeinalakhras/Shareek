import { api } from "../axiosInstance";
import { DeleteNotificationResponse, GetNotificationsParams, GetNotificationsResponse, GetUnreadCountResponse, MarkAllNotificationsAsReadResponse, MarkNotificationAsReadResponse } from "./types";

export const getNotifications = async (
  accessToken: string,
  params?: GetNotificationsParams
): Promise<GetNotificationsResponse> => {
  const res = await api.get<GetNotificationsResponse>(
    "/api/v1/notifications",
    {
      params: {
        page: params?.page,
        per_page: params?.per_page,
        unread_only: params?.unread_only ?? false,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};

export const getUnreadCount = async (
  accessToken: string
): Promise<GetUnreadCountResponse> => {
  const res = await api.get<GetUnreadCountResponse>(
    "/api/v1/notifications/unread-count",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};

export const markNotificationAsRead = async (
  notificationId: string,
  accessToken: string
): Promise<MarkNotificationAsReadResponse> => {
  const res = await api.patch<MarkNotificationAsReadResponse>(
    `/api/v1/notifications/${notificationId}`,
    undefined,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};

export const markAllNotificationsAsRead = async (
  accessToken: string
): Promise<MarkAllNotificationsAsReadResponse> => {
  const res = await api.patch<MarkAllNotificationsAsReadResponse>(
    "/api/v1/notifications",
    undefined,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};

export const deleteNotification = async (
  notificationId: string,
  accessToken: string
): Promise<DeleteNotificationResponse> => {
  const res = await api.delete<DeleteNotificationResponse>(
    `/api/v1/notifications/${notificationId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};
