export type NoticeColumnId =
  | "id"
  | "title"
  | "content"
  | "createdAt"
  | "actions";

export interface NoticeColumnConfig {
  id: NoticeColumnId;
  header: string;
  align: "left" | "right";
  width: number;
  minWidth: number;
  maxWidth?: number;
}

export const NOTICE_COLUMNS: readonly NoticeColumnConfig[] = [
  {
    id: "id",
    header: "ID",
    align: "left",
    width: 80,
    minWidth: 80,
    maxWidth: 80,
  },
  {
    id: "title",
    header: "제목",
    align: "left",
    width: 320,
    minWidth: 200,
    maxWidth: 360,
  },
  { id: "content", header: "내용", align: "left", width: 480, minWidth: 280 },
  {
    id: "createdAt",
    header: "생성일시",
    align: "left",
    width: 180,
    minWidth: 180,
    maxWidth: 180,
  },
  {
    id: "actions",
    header: "작업",
    align: "right",
    width: 80,
    minWidth: 80,
    maxWidth: 80,
  },
];

/** react-table ColumnDef의 size/minSize/maxSize에 그대로 전개할 수 있는 id별 너비 맵. */
export const NOTICE_COLUMN_WIDTH: Record<
  NoticeColumnId,
  { size: number; minSize: number; maxSize?: number }
> = Object.fromEntries(
  NOTICE_COLUMNS.map((column) => [
    column.id,
    { size: column.width, minSize: column.minWidth, maxSize: column.maxWidth },
  ]),
) as Record<
  NoticeColumnId,
  { size: number; minSize: number; maxSize?: number }
>;

/** loading.tsx(react-table 인스턴스 없음)의 table-fixed minWidth 계산용 너비 합계. */
export const NOTICE_COLUMN_TOTAL_WIDTH = NOTICE_COLUMNS.reduce(
  (sum, column) => sum + column.width,
  0,
);

/** 컬럼 id로 설정을 조회하는 맵. react-table leaf column(id만 보유)에서 align 등 메타 조회용. */
export const NOTICE_COLUMN_BY_ID: Record<NoticeColumnId, NoticeColumnConfig> =
  Object.fromEntries(
    NOTICE_COLUMNS.map((column) => [column.id, column]),
  ) as Record<NoticeColumnId, NoticeColumnConfig>;

/**
 * 로딩 스켈레톤 바의 클래스를 컬럼 정렬로 파생한다.
 * 셀 너비는 table-fixed가 고정하므로 스켈레톤 바는 셀을 채우고,
 * 우측 정렬 컬럼(작업)만 메뉴 버튼 모양(size-8)을 유지한다.
 */
export function noticeSkeletonClass(
  align: NoticeColumnConfig["align"] | undefined,
): string {
  return align === "right" ? "ml-auto size-8" : "h-5 w-full";
}
