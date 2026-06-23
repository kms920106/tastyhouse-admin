import { expect, test } from "@playwright/test";

// 공지사항 등록 폼은 헤더 "공지 등록" 버튼으로 열리는 Sheet(dialog)이며,
// 제목/내용 입력 후 "등록" 버튼으로 서버 액션을 통해 실제 백엔드에 생성된다.
test.describe("공지사항 등록", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/notices");
  });

  test("등록에 성공하면 토스트가 뜨고 목록에 반영된다", async ({ page }) => {
    // 고유한 제목 — 등록 후 목록에서 식별하기 위함.
    const title = `E2E 테스트 공지 ${Date.now()}`;

    await page.getByRole("button", { name: "공지 등록" }).click();

    // 등록 폼(Sheet) 노출 확인.
    await expect(page.getByText("공지사항 등록")).toBeVisible();

    await page.getByLabel("제목").fill(title);
    await page.getByLabel("내용").fill("E2E 자동 등록 테스트 내용입니다.");

    // 헤더의 "공지 등록"과 부분일치하지 않도록 정확히 "등록"만 매칭.
    await page.getByRole("button", { name: "등록", exact: true }).click();

    // 성공 토스트(sonner) 확인.
    await expect(page.getByText("공지사항이 등록되었습니다.")).toBeVisible();

    // 서버 액션의 revalidatePath 후 목록에 새 공지가 나타난다.
    await expect(page.getByRole("cell", { name: title })).toBeVisible();
  });

  test("제목·내용 미입력 시 검증 에러가 표시된다", async ({ page }) => {
    await page.getByRole("button", { name: "공지 등록" }).click();
    await expect(page.getByText("공지사항 등록")).toBeVisible();

    // 빈 폼 그대로 제출 → 클라이언트 zod 검증 실패.
    await page.getByRole("button", { name: "등록", exact: true }).click();

    await expect(page.getByText("제목을 입력해 주세요.")).toBeVisible();
    await expect(page.getByText("내용을 입력해 주세요.")).toBeVisible();
  });
});
