"use client";
"use no memo";

import * as React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import {
  getCoreRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { NoticeListItem } from "@/data/notices/schema";
import type { ApiPagination } from "@/lib/api/types";

import { DeleteNoticeDialog } from "./delete-notice-dialog";
import { NoticeDetailSheet } from "./notice-detail-sheet";
import { NoticeFormSheet } from "./notice-form-sheet";
import { noticesColumns, type NoticesTableMeta } from "./notices-columns";
import { NoticesTable } from "./notices-table";

interface NoticesProps {
  items: NoticeListItem[];
  pagination: ApiPagination;
  loadError?: string;
}

export function Notices({ items, pagination, loadError }: NoticesProps) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<NoticeListItem | null>(null);
  const [detailId, setDetailId] = React.useState<number | null>(null);
  const [deleting, setDeleting] = React.useState<NoticeListItem | null>(null);

  React.useEffect(() => {
    if (loadError) {
      toast.error(loadError);
    }
  }, [loadError]);

  function pushParams(next: { page?: number; size?: number }) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.page !== undefined) params.set("page", String(next.page));
    if (next.size !== undefined) params.set("size", String(next.size));
    router.push(`?${params.toString()}`);
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(notice: NoticeListItem) {
    setEditing(notice);
    setFormOpen(true);
  }

  const table = useReactTable({
    data: items,
    columns: noticesColumns,
    state: {
      pagination: { pageIndex: pagination.page, pageSize: pagination.size },
    },
    manualPagination: true,
    pageCount: Math.max(pagination.totalPages, 1),
    getRowId: (row) => String(row.id),
    autoResetPageIndex: false,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: (updater) => {
      const previous: PaginationState = {
        pageIndex: pagination.page,
        pageSize: pagination.size,
      };
      const next = typeof updater === "function" ? updater(previous) : updater;
      if (next.pageSize !== previous.pageSize) {
        pushParams({ page: 0, size: next.pageSize });
      } else if (next.pageIndex !== previous.pageIndex) {
        pushParams({ page: next.pageIndex });
      }
    },
    meta: {
      totalElements: pagination.totalElements,
      onView: (notice) => setDetailId(notice.id),
      onEdit: (notice) => openEdit(notice),
      onDelete: (notice) => setDeleting(notice),
    } satisfies NoticesTableMeta,
  });

  return (
    <Card>
      <CardHeader className="border-b has-data-[slot=card-action]:grid-cols-1 md:has-data-[slot=card-action]:grid-cols-[1fr_auto]">
        <CardTitle className="text-xl leading-none">공지사항</CardTitle>
        <CardDescription className="max-w-sm leading-snug">
          서비스 공지사항을 등록하고 관리합니다. 활성화된 공지만 목록에
          표시됩니다.
        </CardDescription>
        <CardAction className="col-start-1 row-start-auto flex w-full flex-wrap justify-start gap-2 justify-self-stretch md:col-start-2 md:row-span-2 md:row-start-1 md:w-auto md:flex-nowrap md:justify-end md:justify-self-end">
          <Button size="sm" onClick={openCreate}>
            <Plus /> 공지 등록
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-0">
        <NoticesTable table={table} />
      </CardContent>

      <NoticeFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        notice={editing}
      />
      <NoticeDetailSheet
        noticeId={detailId}
        onOpenChange={(open) => !open && setDetailId(null)}
      />
      <DeleteNoticeDialog
        notice={deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      />
    </Card>
  );
}
