# 1주차 평가

## 주제 선정: 빅데이터 분산 기반 에듀테크 환경 서비스

### ESLint, Ts, Tailwind, Prettier 설정

#### 참고 블로그

- [Creating a Modern React App: Vite + TypeScript + ESLint + Tailwind + shadcn/ui and Zustand](https://dev.to/manojspace/creating-a-modern-react-app-a-comprehensive-guide-1plk)

#### 설정 과정

1.  **Vite 프로젝트 생성**: `npm create vite@latest my-vite-project -- --template react-ts`

2.  **필요 의존성 설치**:

    ```bash
    npm install
    npm install -D tailwindcss@latest postcss autoprefixer eslint prettier eslint-config-prettier eslint-plugin-react @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react-hooks
    npm install -D eslint-plugin-tailwindcss eslint-plugin-no-relative-import-paths
    ```

3.  **Tailwind CSS 설정**

    - 초기화: `npx tailwindcss init -p`
    - `tailwind.config.js` 수정:
      ```javascript
      /** @type {import('tailwindcss').Config} */
      export default {
        content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
        theme: {
          extend: {},
        },
        plugins: [],
      }
      ```
    - `src/index.css` 수정:
      ```css
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
      ```

4.  **ESLint 설정**: `eslint.config.js` 활용

    - ESLint의 새로운 플랫 설정 형식을 활용하여 더 유연하고 강력한 설정 가능
    - TypeScript, React, Tailwind CSS 관련 규칙 적용
    - 네이밍 컨벤션, 절대 경로 import 제한 규칙 등 설정

5.  **Prettier 설정**: `.prettierrc` 생성

6.  **스크립트 설정**: `package.json`의 "scripts" 섹션 수정

    ```json
    "scripts": {
      "dev": "vite",
      "build": "tsc && vite build",
      "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
      "preview": "vite preview",
      "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,css,md}\"",
      "lint:fix": "eslint . --ext ts,tsx --fix"
    }
    ```

7.  **Vite 설정**: `vite.config.ts` 수정

    ```typescript
    import { defineConfig } from "vite"
    import react from "@vitejs/plugin-react"

    export default defineConfig({
      plugins: [react()],
    })
    ```

#### 오류 발생시 대처법

- Tailwind CSS 3.4.1 버전으로 다운그레이드 후 eslint 플러그인 재설치

```bash
npm uninstall tailwindcss
npm install -D tailwindcss@3.4.1
npm install -D eslint-plugin-tailwindcss eslint-plugin-no-relative-import-paths
```

#### Vite 개발 서버를 이해하고 있으면 겪는 의문점

- 코드 수정 시 같은 내용이 3번 뜨는 이유 ->

**해결:** Vite 개발 서버는 브라우저, 서버, 빌드 과정에서 코드 검사를 각각 수행하기 때문

- **햄버거 가게 비유**:

  1.  주문 접수 (클라이언트 사이드 변환)
  2.  주방 조리 (서버 사이드 변환)
  3.  품질 검사 (빌드 프로세스)

**결론:** 여러 단계에서 검사를 수행하여 코드 품질 향상

### TypeScript 학습 내용 정리

#### 1. 제네릭 (Generics)

제네릭은 타입을 마치 함수의 파라미터처럼 사용할 수 있게 해줍니다.

```jsx
// 제네릭 함수
const identity = (arg: T): T => {
  return arg
}

// 사용 예
const numberResult = identity(42)
const stringResult = identity("Hello")

// 제네릭 인터페이스
interface Box {
  contents: T;
}

const numberBox: Box = { contents: 123 }
const stringBox: Box = { contents: "TypeScript" }
```

- **제네릭 사용 ``와 `(arg: T)`의 차이, 그리고 타입 추론**

  - `` - "**이 함수는 제네릭 타입 T를 사용할** 거야"라고 선언하는 부분. 함수 정의에서 타입 변수를 소개하는 역할.
  - `(arg: T)` - 실제로 함수의 매개변수 `arg`가 위에서 선언한 타입 T를 가진다고 지정하는 부분.
  - TypeScript는 타입 추론 기능이 있어 `identity(42)`라고만 써도 올바르게 `number` 타입으로 추론.

- **제네릭에 대해 더 자세히 이해해보기**

  - ``에서 쉼표(,)를 사용하는 이유
    - TypeScript의 문법적 특징. 여러 타입 매개변수를 사용할 때 구분하기 위해 사용. (예: ``)
  - ``와 `(arg: T)`의 의미
    - `` - 제네릭 타입 매개변수를 선언하는 부분. 함수가 다양한 타입을 받을 수 있음을 나타냄.
    - `(arg: T)` - 함수의 매개변수 `arg`가 `T` 타입임을 지정. 여기서 `T`는 위에서 선언한 제네릭 타입.
  - `identity('hello')`에서 타입을 명시하지 않고 사용하는 이유
    - TypeScript는 타입 추론 기능이 있어 전달된 인자의 타입을 자동으로 추론.
  - 일반 인터페이스와 제네릭 인터페이스의 차이
    - 제네릭 인터페이스를 사용하면 더 유연하고 타입 안전한 코드를 작성 가능. 제네릭을 사용하지 않으면 `any`를 사용하거나 특정 타입으로 제한해야 함.

- **제네릭 함수 심층 이해하기: 함수 타입 선언 → 매개변수 반드시 일치**
  - ``는 함수가 어떤 타입을 사용할 것인지 '선언'하는 부분. 함수의 '타입 매개변수'를 정의.
  - `(arg: T)`에서 `T`는 위에서 선언한 타입과 반드시 일치해야 함.
  - 여러 타입 매개변수를 사용하거나 제약을 둠으로써 유연성을 가질 수 있음.

#### 2. 인터페이스 (Interfaces)

인터페이스는 객체의 구조를 정의합니다.

```jsx
interface User {
  id: number;
  name: string;
  email: string;
}

interface AdminUser extends User {
  role: "admin";
  permissions: string[];
}

const user: User = { id: 1, name: "John", email: "john@example.com" }
const admin: AdminUser = {
  id: 2,
  name: "Jane",
  email: "jane@example.com",
  role: "admin",
  permissions: ["read", "write", "delete"],
}
```

#### 느낀점

TypeScript 학습 과정에서 제네릭과 인터페이스를 능숙하게 활용하고, 이를 바탕으로 다양한 실습 예제를 통해 개념을 내재화하려는 노력했습니다. 이 외에도 ESLint, Prettier, Tailwind CSS 등의 설정 과정을 꼼꼼하게 기록하고, 발생할 수 있는 문제점과 해결 방안을 제시하여 프로젝트의 통일성과 일관성을 높이기 위해 노력했습니다.
그 과정에서 학습의 어려움도 느꼈지만 뿌듯했습니다.
