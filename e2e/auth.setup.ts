import path from "node:path";

import { expect, test as setup } from "@playwright/test";

// 인증 상태(쿠키)를 저장할 파일. chromium 프로젝트가 storageState로 재사용한다.
const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  const username = process.env.E2E_USERNAME;
  const password = process.env.E2E_PASSWORD;

  expect(
    username && password,
    ".env.local에 E2E_USERNAME / E2E_PASSWORD를 설정하세요.",
  ).toBeTruthy();

  // 로그인 페이지로 이동해 자격증명 입력 후 제출한다.
  await page.goto("/auth/login");
  await page.locator("#login-username").fill(username!);
  await page.locator("#login-password").fill(password!);
  await page.getByRole("button", { name: "로그인" }).click();

  // 로그인 성공 시 대시보드로 리다이렉트된다.
  await page.waitForURL("/dashboard/default");

  // 인증된 브라우저 상태(쿠키)를 파일로 저장한다.
  await page.context().storageState({ path: authFile });
});
