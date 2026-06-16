/**
 * 인증 관련 쿠키 키 정의.
 *
 * admin-api 호출 시 ApiClient 가 access token 을 Authorization 헤더로 실어 보낸다.
 */

export const AUTH_COOKIE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
} as const;
