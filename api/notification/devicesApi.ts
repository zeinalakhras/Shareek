import { api } from "../axiosInstance";
import { DeviceRegistrationRequest, RegisterDeviceResponse, GetDevicesResponse, DeleteDeviceResponse } from "./types";

export const registerDevice = async (
  body: DeviceRegistrationRequest,
  accessToken: string
): Promise<RegisterDeviceResponse> => {
  const res = await api.post<RegisterDeviceResponse>(
    "/api/v1/devices",
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};

export const getDevices = async (
  accessToken: string
): Promise<GetDevicesResponse> => {
  const res = await api.get<GetDevicesResponse>(
    "/api/v1/devices",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};

export const deleteDevice = async (
  deviceId: string,
  accessToken: string
): Promise<DeleteDeviceResponse> => {
  const res = await api.delete<DeleteDeviceResponse>(
    `/api/v1/devices/${deviceId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};
