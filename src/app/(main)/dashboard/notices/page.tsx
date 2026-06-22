import { noticeRepository } from "@/api/notice/notice.repository";
import { NOTICE_MESSAGE } from "@/feature/notice/message";
import logger from "@/lib/logger";
import { parseNonNegativeInt } from "@/lib/utils";
import { Notices } from "./_components/notices";

export default async function Page({
  searchParams,
}: PageProps<"/dashboard/notices">) {
  const { page: pageParam, size: sizeParam } = await searchParams;
  const page = parseNonNegativeInt(pageParam, 0);
  const size = parseNonNegativeInt(sizeParam, 10);

  const { error, data, pagination } = await noticeRepository.getList({
    page,
    size,
  });

  if (error || !data || !pagination) {
    logger.error(
      { reason: error, data, pagination },
      "공지사항 목록 조회 실패",
    );
    throw new Error(NOTICE_MESSAGE.LIST_LOAD_FAILED);
  }

  return <Notices notices={data} pagination={pagination} />;
}
