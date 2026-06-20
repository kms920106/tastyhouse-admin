import { fetchNotices } from "@/data/notices/api";

import { Notices } from "./_components/notices";

interface PageProps {
  searchParams: Promise<{ page?: string; size?: string }>;
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}

export default async function Page({ searchParams }: PageProps) {
  const { page: pageParam, size: sizeParam } = await searchParams;
  const page = parsePositiveInt(pageParam, 0);
  const size = parsePositiveInt(sizeParam, 10);

  const { items, pagination, error } = await fetchNotices({ page, size });

  return <Notices items={items} pagination={pagination} loadError={error} />;
}
