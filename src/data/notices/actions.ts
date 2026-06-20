"use server";

import { revalidatePath } from "next/cache";

import { createNotice, deleteNotice, fetchNotice, updateNotice } from "./api";
import { type NoticeDetail, type NoticeFormValues, noticeFormSchema } from "./schema";

const NOTICES_PATH = "/dashboard/notices";

export interface ActionResult {
  success: boolean;
  message?: string;
  /** 생성 시 반환되는 ID */
  id?: number;
}

export interface NoticeDetailResult {
  success: boolean;
  message?: string;
  data?: NoticeDetail;
}

/** 공지사항 단건 상세 조회 서버 액션. */
export async function fetchNoticeAction(id: number): Promise<NoticeDetailResult> {
  const { data, error } = await fetchNotice(id);
  if (error !== undefined) {
    return { success: false, message: error };
  }
  return { success: true, data };
}

/** 공지사항 생성 서버 액션. */
export async function createNoticeAction(values: NoticeFormValues): Promise<ActionResult> {
  const parsed = noticeFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다." };
  }

  const { data: id, error } = await createNotice(parsed.data);
  if (error !== undefined) {
    return { success: false, message: error };
  }

  revalidatePath(NOTICES_PATH);
  return { success: true, id };
}

/** 공지사항 수정 서버 액션. */
export async function updateNoticeAction(id: number, values: NoticeFormValues): Promise<ActionResult> {
  const parsed = noticeFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다." };
  }

  const { error } = await updateNotice(id, parsed.data);
  if (error !== undefined) {
    return { success: false, message: error };
  }

  revalidatePath(NOTICES_PATH);
  return { success: true };
}

/** 공지사항 삭제 서버 액션. */
export async function deleteNoticeAction(id: number): Promise<ActionResult> {
  const { error } = await deleteNotice(id);
  if (error !== undefined) {
    return { success: false, message: error };
  }

  revalidatePath(NOTICES_PATH);
  return { success: true };
}
