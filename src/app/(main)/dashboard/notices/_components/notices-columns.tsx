"use client";
"use no memo";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { NoticeListItem } from "@/data/notice/notice.dto";

import { formatDateTime } from "./utils";

/** 공지 테이블 셀에서 접근하는 콜백/메타 값. */
export interface NoticesTableMeta {
  /** 서버 전체 항목 수 (manualPagination 이라 row 수로 알 수 없음). */
  totalElements: number;
  onView: (notice: NoticeListItem) => void;
  onEdit: (notice: NoticeListItem) => void;
  onDelete: (notice: NoticeListItem) => void;
}

export const noticesColumns: ColumnDef<NoticeListItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <span className="tabular-nums">{row.original.id}</span>,
    size: 64,
  },
  {
    accessorKey: "title",
    header: "제목",
    cell: ({ row }) => (
      <span className="line-clamp-1 font-medium">{row.original.title}</span>
    ),
  },
  {
    accessorKey: "content",
    header: "내용",
    cell: ({ row }) => (
      <span className="line-clamp-1 max-w-md text-muted-foreground">
        {row.original.content}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "생성일시",
    cell: ({ row }) => (
      <span className="whitespace-nowrap tabular-nums">
        {formatDateTime(row.original.createdAt)}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">작업</div>,
    cell: ({ row, table }) => {
      const notice = row.original;
      const meta = table.options.meta as NoticesTableMeta;

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label="공지 작업 메뉴"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => meta.onView(notice)}>
                상세 보기
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => meta.onEdit(notice)}>
                수정
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => meta.onDelete(notice)}
              >
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
