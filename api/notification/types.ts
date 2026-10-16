import { ApiResponse } from "../auth/types";

export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  resource_id?: string | null;
  resource_type?: string | null;
  created_at: string;
}

export interface GetNotificationsParams {
  page?: number;
  per_page?: number;
  unread_only?: boolean;
}

export type GetNotificationsResponse = ApiResponse<
  PaginationResponse<Notification>
>;

export interface UnreadCount {
  unread_count: number;
}

export type GetUnreadCountResponse = ApiResponse<UnreadCount>;

export type MarkNotificationAsReadResponse =
  ApiResponse<Notification>;

export type MarkAllNotificationsAsReadResponse =
  ApiResponse<number>;

export type DeleteNotificationResponse = ApiResponse<null>;

export type DevicePlatform = "ANDROID" | "IOS" | "WEB";

export interface Device {
  id: string;
  device_token: string;
  platform: DevicePlatform;
  device_name?: string | null;
  created_at: string;
}

export interface DeviceRegistrationRequest {
  device_token: string;
  platform: DevicePlatform;
  device_name?: string;
}

export type RegisterDeviceResponse = ApiResponse<Device>;
export type GetDevicesResponse = ApiResponse<Device[]>;
export type DeleteDeviceResponse = ApiResponse<null>;
