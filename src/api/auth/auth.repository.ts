import { api, publicApi } from "@/api/shared/client";
import type { ApiResponse } from "@/api/shared/types";

import type { AuthToken, LoginRequest, RefreshRequest } from "./auth.dto";

const ENDPOINT = "/api/auth";

export const authRepository = {
  // 로그인 (미인증 — publicApi 사용, 401 시 리다이렉트 없음)
  login(body: LoginRequest): Promise<ApiResponse<AuthToken>> {
    return publicApi.post<AuthToken>(`${ENDPOINT}/v1/login`, body);
  },

  // 토큰 갱신 (미인증 — publicApi 사용)
  refresh(body: RefreshRequest): Promise<ApiResponse<AuthToken>> {
    return publicApi.post<AuthToken>(`${ENDPOINT}/v1/refresh`, body);
  },

  // 로그아웃 (인증 필요 — api 사용, Authorization 헤더 자동 첨부)
  logout(): Promise<ApiResponse<null>> {
    return api.post<null>(`${ENDPOINT}/v1/logout`);
  },
};
