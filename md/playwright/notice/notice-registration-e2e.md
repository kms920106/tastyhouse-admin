# 공지사항 등록 Playwright E2E 테스트 방법

`src/app/(main)/dashboard/notices` 의 **공지사항 등록** 플로우를 Playwright로 검증하는 방법을 정리한다.
공식 문서(Authentication / Web server / Writing tests) 패턴을 그대로 따른다.

---

## 1. 테스트 대상

| 항목        | 값                                                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------------------- |
| 페이지      | `/dashboard/notices`                                                                                          |
| 등록 진입   | 헤더 **"공지 등록"** 버튼 → Sheet(다이얼로그) "공지사항 등록"                                                 |
| 입력 필드   | 제목 `#notice-title`, 내용 `#notice-content`, 노출 여부 `#notice-visible`(Switch)                             |
| 제출        | **"등록"** 버튼 (`form="notice-form"`)                                                                        |
| 성공 신호   | sonner 토스트 `"공지사항이 등록되었습니다."` + 시트 닫힘 + 목록 반영                                          |
| 데이터 흐름 | 폼 제출 → 서버 액션 `createNoticeAction` → `noticeRepository.create` → **실제 백엔드**(`NEXT_PUBLIC_API_URL`) |

> 등록은 실제 백엔드로 전송되어 **실 데이터가 생성**된다(E2E). 매 실행 시 고유 제목(timestamp)을 사용해 격리한다.

---

## 2. 구성 파일

```
playwright.config.ts          # baseURL :3010, webServer 자동 기동, setup+chromium 프로젝트
e2e/
  auth.setup.ts               # 1회 로그인 → playwright/.auth/user.json 저장 (storageState)
  notices.spec.ts             # 등록 성공+목록 반영 / 검증 에러
playwright/.auth/user.json    # (자동 생성, gitignore) 인증 상태
```

- **인증**: 공식 Authentication 패턴. `setup` 프로젝트가 UI 로그인을 1회 수행해 쿠키를 저장하고, `chromium` 프로젝트가 `storageState`로 재사용한다(매 테스트 로그인 불필요).
- **dev 서버**: `playwright.config.ts` 의 `webServer` 가 `npm run dev`(포트 3010)를 자동 기동한다. 이미 떠 있으면 재사용한다(`reuseExistingServer`).

---

## 3. 사전 준비 (필수)

### 3-1. 의존성 (최초 1회)

```bash
npm install                 # @playwright/test, dotenv 포함
npx playwright install chromium
```

### 3-2. 테스트 계정 설정

`.env.local` 에 로그인 계정을 입력한다(미입력 시 `setup` 단계에서 실패).

```dotenv
E2E_USERNAME=<관리자 아이디>
E2E_PASSWORD=<비밀번호>
```

### 3-3. 백엔드 API 기동

등록은 서버 액션을 통해 실제 백엔드(`NEXT_PUBLIC_API_URL`)로 전송된다.
`.env.local` 의 `NEXT_PUBLIC_API_URL` 이 가리키는 **Spring admin-api 서버가 기동 중**이어야 한다.

---

## 4. 실행 방법 (이 파일만)

> 전체 E2E 실행 방법은 [Playwright E2E 전체 테스트 실행 방법](../playwright-e2e-overview.md) 참고.
> 아래는 **`e2e/notices.spec.ts` 한 파일만** 실행하는 방법이다. (dev 서버·로그인 setup 은 자동 선행)

```bash
# 이 파일만 실행
npx playwright test e2e/notices.spec.ts

# 이 파일을 UI 모드로 실행 (플로우 시각 확인 권장)
npx playwright test e2e/notices.spec.ts --ui

# 브라우저 화면을 보며 실행 (headed)
npx playwright test e2e/notices.spec.ts --headed

# 이 파일 안의 특정 테스트만 (제목 부분일치)
npx playwright test e2e/notices.spec.ts -g "등록에 성공"

# 직렬 실행(워커 1개) — 실 데이터 격리/디버깅 시
npx playwright test e2e/notices.spec.ts --workers=1

# 실행 후 HTML 리포트 열기
npx playwright show-report
```

---

## 5. 테스트 시나리오

### 5-1. 등록 성공 + 목록 반영 (실 백엔드)

```bash
npx playwright test e2e/notices.spec.ts --headed -g "공지사항 등록"
```

1. `/dashboard/notices` 진입
2. "공지 등록" 클릭 → 시트 노출 확인
3. 제목·내용 입력 (제목은 `E2E 테스트 공지 ${Date.now()}` 로 고유화)
4. "등록"(exact) 클릭
5. 토스트 `"공지사항이 등록되었습니다."` 노출 확인
6. 목록 테이블에 새 제목 셀(`getByRole("cell", { name: title })`) 노출 확인

### 5-2. 검증 에러 (클라이언트, 백엔드 불필요)

1. "공지 등록" 클릭 → 시트 노출
2. 빈 폼 그대로 "등록" 클릭
3. `"제목을 입력해 주세요."`, `"내용을 입력해 주세요."` 노출 확인

> 셀렉터는 폼의 `htmlFor`↔`id` 매칭 덕에 `getByLabel("제목")` / `getByLabel("내용")` 으로 접근한다.
> 제출 버튼 "등록"은 헤더 "공지 등록"과 부분일치하므로 반드시 `exact: true` 를 쓴다.

### 5-3. 수정 성공 + 목록 갱신 (실 백엔드)

```bash
npx playwright test e2e/notices.spec.ts --headed -g "공지사항 수정"
```

등록과 동일한 `NoticeFormSheet` 가 **편집 모드**로 재사용된다(시트 제목 `"공지사항 수정"`, 기존 값 prefill, 제출 버튼 `"수정"`).
수정 진입은 목록 각 **행의 작업 메뉴**(`aria-label="공지 작업 메뉴"`) → 드롭다운 `menuitem` `"수정"` 이다.

1. 수정 대상을 먼저 등록한다(고유 제목으로 격리 — 어떤 행이 내 것인지 보장)
2. 대상 행(`getByRole("row", { name: /제목/ })`)의 "공지 작업 메뉴" 버튼 클릭
3. 드롭다운 `menuitem` `"수정"` 클릭 → 시트 `"공지사항 수정"` 노출
4. 제목이 기존 값으로 prefill 되었는지 확인(`getByLabel("제목")` `toHaveValue`)
5. 제목 변경 후 `"수정"`(exact) 클릭
6. 토스트 `"공지사항이 수정되었습니다."` 노출 확인
7. 목록 테이블에 갱신된 제목 셀(`getByRole("cell", { name: updatedTitle })`) 노출 확인

### 5-4. 수정 검증 에러 (클라이언트, 백엔드는 등록 단계만 사용)

1. 대상 공지 등록 → 작업 메뉴 → `"수정"` 진입
2. 제목을 비우고 `"수정"`(exact) 클릭
3. `"제목을 입력해 주세요."` 노출 확인

> 행 단위로 작업 메뉴를 타겟하려면 `page.getByRole("row", { name: new RegExp(title) }).getByRole("button", { name: "공지 작업 메뉴" })` 처럼 행 스코프 안에서 버튼을 찾는다.
> 제출 버튼 "수정"도 정확 매칭(`exact: true`)을 쓴다(편집 모드일 때만 "수정", 생성 모드는 "등록").

### 5-5. 삭제 성공 + 목록 제거 (실 백엔드)

```bash
npx playwright test e2e/notices.spec.ts --headed -g "공지사항 삭제"
```

삭제 진입은 목록 각 **행의 작업 메뉴**(`aria-label="공지 작업 메뉴"`) → 드롭다운 `menuitem` `"삭제"`(destructive)다.
삭제 선택 시 확인용 **AlertDialog**(`role="alertdialog"`, 제목 `"공지사항을 삭제하시겠습니까?"`)가 열리며, 다이얼로그의 `"삭제"` 버튼으로 서버 액션 `deleteNoticeAction` 을 통해 **실제로 삭제**된다.

1. 삭제 대상을 먼저 등록한다(고유 제목으로 격리 — 내 것만 안전하게 삭제)
2. 대상 행(`getByRole("row", { name: /제목/ })`)의 "공지 작업 메뉴" 버튼 클릭
3. 드롭다운 `menuitem` `"삭제"` 클릭 → 다이얼로그 `"공지사항을 삭제하시겠습니까?"` 노출
4. 다이얼로그 설명에 대상 제목이 포함되는지 확인
5. 다이얼로그의 `"삭제"`(exact) 버튼 클릭 → 확정
6. 토스트 `"공지사항이 삭제되었습니다."` 노출 확인
7. revalidatePath 후 목록에서 해당 행 제거 확인(`await expect(targetRow).toHaveCount(0)`)

### 5-6. 삭제 취소 (백엔드는 등록 단계만 사용)

1. 대상 공지 등록 → 작업 메뉴 → `"삭제"` 진입 → 다이얼로그 노출
2. 다이얼로그의 `"취소"`(exact) 버튼 클릭 → 다이얼로그 닫힘
3. 공지 행이 목록에 그대로 남아 있는지 확인(`toBeVisible`)

> 드롭다운의 `"삭제"` menuitem 과 다이얼로그 확정 버튼 `"삭제"` 는 텍스트가 같다.
> 확정 버튼은 반드시 다이얼로그 스코프에서 찾는다: `page.getByRole("alertdialog").getByRole("button", { name: "삭제", exact: true })`.

---

## 6. 통과 기준

- `[setup] authenticate` 1개 + `[chromium] 공지사항 등록` 2개 + `[chromium] 공지사항 수정` 2개 + `[chromium] 공지사항 삭제` 2개 = **총 7개** green
- `playwright-report/` HTML 리포트 생성

---

## 7. 트러블슈팅

| 증상                                | 원인 / 조치                                                                |
| ----------------------------------- | -------------------------------------------------------------------------- |
| `setup` 에서 실패                   | `.env.local` 의 `E2E_USERNAME`/`E2E_PASSWORD` 미설정 또는 계정 오류        |
| 로그인 후 대시보드로 못 감          | 백엔드 미기동 또는 인증 API 오류. 백엔드 로그 확인                         |
| 등록 실패 토스트(`처리 중 오류...`) | 백엔드 미기동/오류. `NEXT_PUBLIC_API_URL` 과 서버 상태 확인                |
| 목록 반영 단언 간헐 실패            | `revalidatePath` 타이밍. 해당 단언 앞에 `await page.reload();` 추가로 보강 |
| dev 서버 충돌(3010 사용 중)         | 기존 dev 서버 재사용됨. 정상. 충돌 시 기존 프로세스 종료 후 재시도         |
| 반복 실행으로 실 데이터 누적        | 고유 제목으로 격리됨. 누적 데이터는 수동/삭제 테스트로 정리                |

---

## 8. 참고 (공식 문서)

- Installation: https://playwright.dev/docs/intro
- Authentication (storageState): https://playwright.dev/docs/auth
- Web server: https://playwright.dev/docs/test-webserver
- Writing tests / Locators: https://playwright.dev/docs/writing-tests
