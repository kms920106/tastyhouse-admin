import { z } from "zod";

/**
 * 공지사항 도메인 스키마 (admin-api 명세 기준).
 *
 * 제약: title 최대 200자, content 최대 1000자 (둘 다 공백 불가).
 */

export const NOTICE_TITLE_MAX = 200;
export const NOTICE_CONTENT_MAX = 1000;

/** 목록 조회 항목 (active/updatedAt 미포함). */
export interface NoticeListItem {
  id: number;
  title: string;
  content: string;
  /** ISO-8601 LocalDateTime 문자열 */
  createdAt: string;
}

/** 단건 상세 (active/updatedAt 포함). */
export interface NoticeDetail extends NoticeListItem {
  active: boolean;
  /** ISO-8601 LocalDateTime 문자열 */
  updatedAt: string;
}

/** 생성/수정 요청 폼 스키마. */
export const noticeFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "제목을 입력해 주세요." })
    .max(NOTICE_TITLE_MAX, { message: `제목은 최대 ${NOTICE_TITLE_MAX}자까지 입력할 수 있습니다.` }),
  content: z
    .string()
    .trim()
    .min(1, { message: "내용을 입력해 주세요." })
    .max(NOTICE_CONTENT_MAX, { message: `내용은 최대 ${NOTICE_CONTENT_MAX}자까지 입력할 수 있습니다.` }),
});

export type NoticeFormValues = z.infer<typeof noticeFormSchema>;
