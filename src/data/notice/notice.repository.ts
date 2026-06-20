import "server-only";

import { api } from "@/lib/api/client";

import { ApiResponse } from "@/lib/api/types";
import type { NoticeDetail, NoticeListItem, NoticeRequest } from "./notice.dto";

/**
 * 공지사항 관리자 API
 */

const ENDPOINT = "/api/notices";

export const noticeRepository = {
  // 공지사항 목록 조회
  getList(params: {
    page?: number;
    size?: number;
  }): Promise<ApiResponse<NoticeListItem[]>> {
    return api.get<NoticeListItem[]>(`${ENDPOINT}/v1`, { params });
  },

  // 공지사항 등록
  create(body: NoticeRequest): Promise<ApiResponse<number>> {
    return api.post<number>(`${ENDPOINT}/v1`, body);
  },

  // 공지사항 상세 조회
  getDetail(id: number): Promise<ApiResponse<NoticeDetail>> {
    return api.get<NoticeDetail>(`${ENDPOINT}/v1/${id}`);
  },

  // 공지사항 수정
  update(id: number, body: NoticeRequest): Promise<ApiResponse<null>> {
    return api.put<null>(`${ENDPOINT}/v1/${id}`, body);
  },

  // 공지사항 삭제
  remove(id: number): Promise<ApiResponse<null>> {
    return api.delete<null>(`${ENDPOINT}/v1/${id}`);
  },
};
