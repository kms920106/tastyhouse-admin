import { noticeRepository } from "@/data/notice/notice.repository";
import type { ApiPagination } from "@/lib/api/types";

import { Notices } from "./_components/notices";

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}

interface Props {
  searchParams: Promise<{ page?: string; size?: string }>;
}

export default async function Page({ searchParams }: Props) {
  const { page: pageParam, size: sizeParam } = await searchParams;
  const page = parsePositiveInt(pageParam, 0);
  const size = parsePositiveInt(sizeParam, 10);

  const res = await noticeRepository.getList({ page, size });

  const data = res.data ?? [];
  const pagination: ApiPagination = res.pagination ?? {
    page,
    size,
    totalElements: 0,
    totalPages: 0,
  };

  return (
    <Notices notices={data} pagination={pagination} loadError={res.error} />
  );
}
