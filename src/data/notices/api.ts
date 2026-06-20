import { api } from "@/lib/api/client";
import type { ApiPagination } from "@/lib/api/types";

import type { NoticeDetail, NoticeFormValues, NoticeListItem } from "./schema";

/**
 * 공지사항 admin-api 엔드포인트.
 * Base Path: /api/admin/notices/v1
 *
 * Next.js 공식 권장(에러를 return 값으로 모델링)에 맞춰, 각 함수는 throw 하지 않고
 * `{ data?, error? }` 형태의 Result 를 반환한다. 호출부(page/server action)는
 * `error` 필드를 검사해 분기한다.
 */

const BASE = "/api/admin/notices/v1";

/** 데이터 계층 공통 Result. error 가 있으면 실패, 없으면 성공. */
export interface ApiResult<T> {
  data?: T;
  error?: string;
}

export interface NoticeListResult {
  items: NoticeListItem[];
  pagination: ApiPagination;
  error?: string;
}

const DEFAULT_PAGINATION: ApiPagination = { page: 0, size: 10, totalElements: 0, totalPages: 0 };

/** 공지사항 목록 조회 (페이징, active=true 만, ID 내림차순). */
export async function fetchNotices(params: { page?: number; size?: number } = {}): Promise<NoticeListResult> {
  const size = params.size ?? 10;
  const res = await api.get<NoticeListItem[]>(BASE, {
    params: { page: params.page ?? 0, size },
  });

  if (res.error !== undefined) {
    return { items: [], pagination: { ...DEFAULT_PAGINATION, size }, error: res.error };
  }

  return {
    items: res.data ?? [],
    pagination: res.pagination ?? { ...DEFAULT_PAGINATION, size },
  };
}

/** 공지사항 단건 조회. */
export async function fetchNotice(id: number): Promise<ApiResult<NoticeDetail>> {
  const res = await api.get<NoticeDetail>(`${BASE}/${id}`);
  if (res.error !== undefined) {
    return { error: res.error };
  }
  return { data: res.data };
}

/** 공지사항 생성 — 생성된 ID 반환. */
export async function createNotice(values: NoticeFormValues): Promise<ApiResult<number>> {
  const res = await api.post<number>(BASE, values);
  if (res.error !== undefined) {
    return { error: res.error };
  }
  return { data: res.data };
}

/** 공지사항 수정. */
export async function updateNotice(id: number, values: NoticeFormValues): Promise<ApiResult<null>> {
  const res = await api.put<null>(`${BASE}/${id}`, values);
  if (res.error !== undefined) {
    return { error: res.error };
  }
  return { data: null };
}

/** 공지사항 삭제 (하드 삭제). */
export async function deleteNotice(id: number): Promise<ApiResult<null>> {
  const res = await api.delete<null>(`${BASE}/${id}`);
  if (res.error !== undefined) {
    return { error: res.error };
  }
  return { data: null };
}
