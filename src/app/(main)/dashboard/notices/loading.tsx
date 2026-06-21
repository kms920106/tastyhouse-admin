import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * 공지사항 세그먼트 로딩 스켈레톤 (Next.js 공식: loading.tsx = Suspense 경계).
 * 서버에서 목록을 조회하는 동안 즉시 표시되어 페이지 전체 블로킹을 막는다.
 */
export default function NoticesLoading() {
  return (
    <Card>
      <CardHeader className="border-b has-data-[slot=card-action]:grid-cols-1 md:has-data-[slot=card-action]:grid-cols-[1fr_auto]">
        <CardTitle className="text-xl leading-none">공지사항</CardTitle>
        <CardDescription className="max-w-sm leading-snug">
          서비스 공지사항을 등록하고 관리합니다. 활성화된 공지만 목록에 표시됩니다.
        </CardDescription>
        <CardAction className="col-start-1 row-start-auto flex w-full flex-wrap justify-start gap-2 justify-self-stretch md:col-start-2 md:row-span-2 md:row-start-1 md:w-auto md:flex-nowrap md:justify-end md:justify-self-end">
          <Skeleton className="h-8 w-24" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-0">
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-3 px-4 pt-4">
            {Array.from({ length: 10 }, (_, index) => `notice-skeleton-${index}`).map((key) => (
              <Skeleton key={key} className="h-10 w-full" />
            ))}
          </div>
          <Separator />
          <div className="flex items-center justify-between px-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-8 w-64" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
