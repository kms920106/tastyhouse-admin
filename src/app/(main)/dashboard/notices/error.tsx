"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * 공지사항 세그먼트 에러 바운더리 (Next.js 공식: uncaught exceptions).
 *
 * - error.tsx 는 반드시 Client Component 여야 한다.
 * - 렌더 중 발생한 예기치 않은 예외만 잡는다. 예상된 에러(조회 실패 등)는
 *   page 에서 return 값으로 처리하고, 비동기/이벤트 코드의 에러는 각 컴포넌트의
 *   useState 로 처리한다.
 * - Next 16 기준 reset 이 retry 로 변경되었다.
 */
export default function NoticesError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl leading-none">문제가 발생했습니다</CardTitle>
        <CardDescription>공지사항을 표시하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => retry()}>다시 시도</Button>
      </CardContent>
    </Card>
  );
}
