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

// 공지사항 수정은 목록 각 행의 "공지 작업 메뉴" 드롭다운 → "수정" 으로 진입한다.
// 등록과 동일한 NoticeFormSheet 가 편집 모드("공지사항 수정")로 열리며,
// 기존 값이 prefill 된 상태에서 "수정" 버튼으로 서버 액션을 통해 갱신된다.
test.describe("공지사항 수정", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/notices");
  });

  test("수정에 성공하면 토스트가 뜨고 목록에 갱신된 제목이 반영된다", async ({
    page,
  }) => {
    // 수정 대상은 직접 등록해 격리한다(목록의 어떤 행이 내 것인지 보장).
    const originalTitle = `E2E 수정대상 공지 ${Date.now()}`;
    const updatedTitle = `${originalTitle} (수정됨)`;

    // 1) 수정할 공지를 먼저 등록한다.
    await page.getByRole("button", { name: "공지 등록" }).click();
    await expect(page.getByText("공지사항 등록")).toBeVisible();
    await page.getByLabel("제목").fill(originalTitle);
    await page.getByLabel("내용").fill("수정 테스트용 초기 내용입니다.");
    await page.getByRole("button", { name: "등록", exact: true }).click();
    await expect(page.getByText("공지사항이 등록되었습니다.")).toBeVisible();

    // 등록한 공지 행이 목록에 나타날 때까지 대기.
    const targetRow = page.getByRole("row", { name: new RegExp(originalTitle) });
    await expect(targetRow).toBeVisible();

    // 2) 해당 행의 작업 메뉴 → "수정" 진입.
    await targetRow
      .getByRole("button", { name: "공지 작업 메뉴" })
      .click();
    await page.getByRole("menuitem", { name: "수정" }).click();

    // 수정 폼(Sheet)이 편집 모드로 열리고 기존 값이 prefill 된다.
    await expect(page.getByText("공지사항 수정")).toBeVisible();
    await expect(page.getByLabel("제목")).toHaveValue(originalTitle);

    // 3) 제목을 변경하고 "수정" 으로 제출.
    await page.getByLabel("제목").fill(updatedTitle);
    await page.getByRole("button", { name: "수정", exact: true }).click();

    // 성공 토스트(sonner) 확인.
    await expect(page.getByText("공지사항이 수정되었습니다.")).toBeVisible();

    // revalidatePath 후 목록에 갱신된 제목이 반영된다.
    await expect(
      page.getByRole("cell", { name: updatedTitle }),
    ).toBeVisible();
  });

  test("수정 폼에서 제목을 비우면 검증 에러가 표시된다", async ({ page }) => {
    // 검증할 대상 공지를 먼저 등록한다.
    const title = `E2E 수정검증 공지 ${Date.now()}`;

    await page.getByRole("button", { name: "공지 등록" }).click();
    await expect(page.getByText("공지사항 등록")).toBeVisible();
    await page.getByLabel("제목").fill(title);
    await page.getByLabel("내용").fill("수정 검증 테스트용 내용입니다.");
    await page.getByRole("button", { name: "등록", exact: true }).click();
    await expect(page.getByText("공지사항이 등록되었습니다.")).toBeVisible();

    const targetRow = page.getByRole("row", { name: new RegExp(title) });
    await expect(targetRow).toBeVisible();

    // 작업 메뉴 → "수정" 진입.
    await targetRow.getByRole("button", { name: "공지 작업 메뉴" }).click();
    await page.getByRole("menuitem", { name: "수정" }).click();
    await expect(page.getByText("공지사항 수정")).toBeVisible();

    // 제목을 비우고 제출 → 클라이언트 zod 검증 실패.
    await page.getByLabel("제목").fill("");
    await page.getByRole("button", { name: "수정", exact: true }).click();

    await expect(page.getByText("제목을 입력해 주세요.")).toBeVisible();
  });
});
