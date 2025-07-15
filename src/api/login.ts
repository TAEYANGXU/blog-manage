import httpClient, { ApiResponse } from "@/http";

export interface LoginResponseData {
  user: any; // 可根据实际 user 类型替换 any
  token: string;
}

export const login = async (username: string, password: string) => {
  return httpClient.post<ApiResponse<LoginResponseData>>("/api/login", {
    username,
    password,
  });
};
