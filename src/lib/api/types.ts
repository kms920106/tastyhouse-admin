/**
 * admin-api(Spring) 공통 응답 타입.
 *
 * 백엔드 원본 응답은 `ApiEnvelope<T>` 래퍼로 감싸여 반환되며,
 * ApiClient 가 이를 언래핑해 `ApiResponse<T>`(client.ts) 형태로 전달한다.
 * 목록 조회 시에만 `pagination` 객체가 포함된다.
 */

export interface ApiPagination {
  /** 현재 페이지 번호 (0부터 시작) */
  page: number;
  /** 페이지 당 항목 수 */
  size: number;
  /** 전체 항목 수 */
  totalElements: number;
  /** 전체 페이지 수 */
  totalPages: number;
}

/** 백엔드(Spring) 원본 응답 래퍼. ApiClient 내부에서 언래핑된다. */
export interface ApiEnvelope<T> {
  success: boolean;
  message: string | null;
  errorCode?: string;
  data: T;
  pagination: ApiPagination | null;
}
