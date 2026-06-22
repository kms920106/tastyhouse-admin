"use server";

import { authRepository } from "@/api/auth/auth.repository";
import { AUTH_COOKIE_KEYS } from "@/lib/auth-config";
import { getValueFromCookie, removeCookie, setValueToCookie } from "@/server/server-actions";

import { AUTH_MESSAGE } from "./message";
import { type LoginFormValues, loginFormSchema } from "./schema";

const SEVEN_DAYS = 60 * 60 * 24 * 7;
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export interface AuthActionResult {
  success: boolean;
  message?: string;
}

// 로그인
export async function loginAction(values: LoginFormValues): Promise<AuthActionResult> {
  const parsed = loginFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? AUTH_MESSAGE.INVALID_INPUT,
    };
  }

  const { username, password, rememberMe } = parsed.data;
  const res = await authRepository.login({ username, password, rememberMe: rememberMe ?? false });

  if (res.error !== undefined) {
    return { success: false, message: res.error };
  }

  if (!res.data) {
    return { success: false, message: AUTH_MESSAGE.LOGIN_FAILED };
  }

  const maxAge = rememberMe ? THIRTY_DAYS : SEVEN_DAYS;

  await Promise.all([
    setValueToCookie(AUTH_COOKIE_KEYS.ACCESS_TOKEN, res.data.accessToken, { maxAge }),
    setValueToCookie(AUTH_COOKIE_KEYS.REFRESH_TOKEN, res.data.refreshToken, { maxAge }),
  ]);

  return { success: true };
}

// 토큰 갱신
export async function refreshAction(): Promise<AuthActionResult> {
  const refreshToken = await getValueFromCookie(AUTH_COOKIE_KEYS.REFRESH_TOKEN);

  if (!refreshToken) {
    return { success: false, message: AUTH_MESSAGE.REFRESH_FAILED };
  }

  const res = await authRepository.refresh({ refreshToken });

  if (res.error !== undefined) {
    return { success: false, message: res.error };
  }

  if (!res.data) {
    return { success: false, message: AUTH_MESSAGE.REFRESH_FAILED };
  }

  await Promise.all([
    setValueToCookie(AUTH_COOKIE_KEYS.ACCESS_TOKEN, res.data.accessToken),
    setValueToCookie(AUTH_COOKIE_KEYS.REFRESH_TOKEN, res.data.refreshToken),
  ]);

  return { success: true };
}

// 로그아웃
export async function logoutAction(): Promise<AuthActionResult> {
  // 백엔드 로그아웃 호출 (실패해도 쿠키는 삭제)
  await authRepository.logout().catch(() => null);

  await Promise.all([removeCookie(AUTH_COOKIE_KEYS.ACCESS_TOKEN), removeCookie(AUTH_COOKIE_KEYS.REFRESH_TOKEN)]);

  return { success: true };
}
