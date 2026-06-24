# Playwright E2E 전체 테스트 실행 방법

`tastyhouse-admin` 프로젝트의 **전체 Playwright E2E 테스트**를 실행하는 방법을 정리한다.
개별 테스트 파일 실행 방법은 각 기능별 문서를 참고한다. (예: [공지사항 등록](./notice/notice-registration-e2e.md))

---

## 1. 구성 개요

```
playwright.config.ts          # baseURL :3010, webServer 자동 기동, setup+chromium 프로젝트
e2e/
  auth.setup.ts               # 1회 로그인 → playwright/.auth/user.json 저장 (storageState)
  notices.spec.ts             # 공지사항 등록 시나리오
playwright/.auth/user.json    # (자동 생성, gitignore) 인증 상태
```

- **인증**: `setup` 프로젝트가 UI 로그인을 1회 수행해 쿠키를 저장하고, `chromium` 프로젝트가 `storageState`로 재사용한다(매 테스트 로그인 불필요).
- **dev 서버**: `playwright.config.ts` 의 `webServer` 가 `npm run dev`(포트 3010)를 자동 기동한다. 이미 떠 있으면 재사용한다(`reuseExistingServer`).

---

## 2. 사전 준비 (필수)

### 2-1. 의존성 (최초 1회)
```bash
npm install                 # @playwright/test, dotenv 포함
npx playwright install chromium
```

### 2-2. 테스트 계정 설정
`.env.local` 에 로그인 계정을 입력한다(미입력 시 `setup` 단계에서 실패).
```dotenv
E2E_USERNAME=<관리자 아이디>
E2E_PASSWORD=<비밀번호>
```

### 2-3. 백엔드 API 기동
등록·수정 등 일부 시나리오는 서버 액션을 통해 실제 백엔드(`NEXT_PUBLIC_API_URL`)로 전송된다.
`.env.local` 의 `NEXT_PUBLIC_API_URL` 이 가리키는 **Spring admin-api 서버가 기동 중**이어야 한다.

---

## 3. 전체 테스트 실행

```bash
# 전체 실행 (dev 서버 자동 기동 → 로그인 setup → 모든 테스트)
npm run test:e2e

# UI 모드 — 모든 테스트를 시각적으로 확인하며 실행 (권장)
npm run test:e2e:ui

# 브라우저 화면을 보며 실행 (headed)
npx playwright test --headed

# 직렬 실행 (워커 1개) — 실 데이터 격리/디버깅 시
npx playwright test --workers=1

# 실패한 테스트만 재실행
npx playwright test --last-failed

# 실행 후 HTML 리포트 열기
npx playwright show-report
```

> `npm run test:e2e` 는 내부적으로 `playwright test` 를 실행하며, `setup` 프로젝트(로그인)가 먼저 수행된 뒤 `chromium` 프로젝트의 모든 `*.spec.ts` 가 실행된다.

---

## 4. 통과 기준

- `[setup] authenticate` 1개 + 각 spec 파일의 테스트 케이스가 모두 green
- `playwright-report/` HTML 리포트 생성

---

## 5. 트러블슈팅

| 증상 | 원인 / 조치 |
|---|---|
| `setup` 에서 실패 | `.env.local` 의 `E2E_USERNAME`/`E2E_PASSWORD` 미설정 또는 계정 오류 |
| 로그인 후 대시보드로 못 감 | 백엔드 미기동 또는 인증 API 오류. 백엔드 로그 확인 |
| 등록/저장 실패 토스트 | 백엔드 미기동/오류. `NEXT_PUBLIC_API_URL` 과 서버 상태 확인 |
| dev 서버 충돌(3010 사용 중) | 기존 dev 서버 재사용됨. 정상. 충돌 시 기존 프로세스 종료 후 재시도 |
| 반복 실행으로 실 데이터 누적 | 각 테스트는 고유 식별자로 격리됨. 누적 데이터는 수동으로 정리 |

---

## 6. 참고 (공식 문서)

- Installation: https://playwright.dev/docs/intro
- Authentication (storageState): https://playwright.dev/docs/auth
- Web server: https://playwright.dev/docs/test-webserver
- Test CLI: https://playwright.dev/docs/test-cli
- Writing tests / Locators: https://playwright.dev/docs/writing-tests
