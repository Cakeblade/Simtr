# 🌐 Simtr - AI 기반 번역 및 글쓰기 도우미

> **S**mart **I**ntelligent **M**ulti-purpose **Tr**anslator  
> Google Gemini AI를 활용한 스마트 번역 및 텍스트 분석 데스크톱 애플리케이션

![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Google AI](https://img.shields.io/badge/Google%20AI-4285F4?style=for-the-badge&logo=google&logoColor=white)

---

## 📖 프로젝트 소개

**Simtr**은 Google Generative AI(Gemini)를 활용한 멀티기능 데스크톱 애플리케이션입니다. 번역, 글쓰기 지원, 텍스트 분석 등 다양한 언어 처리 기능을 하나의 직관적인 인터페이스로 제공합니다.

### 🎯 개발 목적
- **효율적인 번역**: 다양한 언어 간의 자연스럽고 맥락을 고려한 번역
- **글쓰기 개선**: AI를 활용한 텍스트 품질 향상 및 스타일 개선
- **텍스트 분석**: 문자수, 바이트수, 단어수 등 상세한 텍스트 통계
- **개발자 친화적**: 개발자들이 자주 사용하는 기능들을 하나의 앱으로 통합

---

## ✨ 주요 기능

### 🔄 **AI 번역기 (Translator)**
- **다중 언어 지원**: 영어, 한국어 등 다양한 언어 간 번역
- **맥락 번역**: 단순 직역이 아닌 문맥을 고려한 자연스러운 번역
- **커스텀 지시사항**: 번역 스타일이나 특정 요구사항 지정 가능
- **언어 쌍 스왑**: 원본-대상 언어를 쉽게 교체

### ✍️ **AI 글쓰기 도우미 (Writing Assistant)**
- **텍스트 품질 향상**: 문법, 명확성, 문체 개선
- **다양한 글쓰기 스타일**: 학술적, 캐주얼, 전문적, 창의적 등
- **맞춤형 지시사항**: 특정 톤이나 스타일로 텍스트 개선
- **마크다운 지원**: 결과물을 마크다운 형식으로 렌더링

### 📊 **문자 계산기 (Character Calculator)**
- **다중 카운팅**: 총 문자수, 바이트수, 단어수 통계
- **한글 바이트 계산**: 한글 문자를 2바이트로 정확히 계산
- **필터링 옵션**: 공백, 줄바꿈 제외 옵션
- **실시간 분석**: 입력과 동시에 즉시 통계 업데이트

### ⚙️ **설정 관리**
- **API 키 관리**: Google Gemini API 키 안전 저장
- **모델 선택**: 다양한 Gemini 모델 중 선택 가능
- **개인화**: 사용자별 설정 저장 및 관리

---

## 🛠️ 기술 스택

### Frontend
- **Vue 3** + **TypeScript**: 반응형 사용자 인터페이스
- **Vue Router**: SPA 라우팅
- **Vite**: 빠른 개발 서버 및 빌드 도구
- **CSS3**: 모던 스타일링 및 반응형 디자인

### Backend
- **Electron**: 크로스 플랫폼 데스크톱 애플리케이션
- **Express.js**: 내장 API 서버
- **Google Generative AI**: AI 기능 제공
- **Node.js**: 서버 런타임

### Development Tools
- **TypeScript**: 타입 안정성
- **ESLint**: 코드 품질 관리
- **Electron Builder**: 앱 패키징 및 배포

---

## 📋 시스템 요구사항

### 개발 환경
- **Node.js**: 18.x 이상
- **npm**: 8.x 이상
- **Google Gemini API Key**: [Google AI Studio](https://makersuite.google.com/app/apikey)에서 발급

---

## 📁 프로젝트 구조

```
simtr/
├── build/                   # 빌드 설정 및 출력
│   ├── output/             # 빌드 결과물
│   │   ├── web/           # Vite 웹 빌드
│   │   ├── electron/      # Electron 프로세스 빌드
│   │   └── release/       # 최종 패키징된 앱
│   ├── vite.config.ts     # Vite 설정
│   ├── tsconfig.json      # TypeScript 설정
│   └── electron-builder.json5  # Electron 빌드 설정
├── src/                    # Vue 프론트엔드 소스
│   ├── components/        # Vue 컴포넌트
│   ├── composables/       # Vue Composition API 훅
│   ├── config/           # 설정 파일들
│   ├── router/           # Vue Router 설정
│   ├── store/            # 상태 관리
│   ├── types/            # TypeScript 타입 정의
│   └── views/            # 페이지 컴포넌트
├── electron/              # Electron 메인/렌더러 프로세스
│   ├── main.ts           # Electron 메인 프로세스
│   ├── preload.ts        # 프리로드 스크립트
│   ├── server.ts         # Express API 서버
│   └── prompts/          # AI 프롬프트 관리
└── public/               # 정적 파일들
```

---

## 🎭 Cursor가 작성한 것과 그렇지 않은 것

### 🤖 **Cursor님이 열심히 작성해주신 것들**
- **95%의 코드**: Cursor는 정말 성실한 개발자입니다. 코딩 속도는 인간을 압도하죠! ⚡
- **TypeScript 타입 정의**: 타입 안정성에 대한 집착은 인간보다 더 강한 것 같습니다 🔒
- **에러 핸들링**: 예외 상황에 대한 대비는 완벽합니다. 인간은 보통 "설마 이런 일이?"라고 하는데 Cursor는 "이런 일도 있을 수 있지!"라고 합니다 🛡️
- **컴포넌트 구조**: Vue 컴포넌트 설계가 교과서적입니다. 아마 Vue 창시자보다 Vue를 더 잘 아는 것 같아요 📚
- **프로젝트 리팩토링**: 파일 정리의 신! 인간이 어지럽혀 놓은 프로젝트를 깔끔하게 정리해주는 마리 콘도 같은 존재 🧹
- **README 작성**: 이 문서도 Cursor가 작성했지만, 인간이 "유머러스하게 써달라"고 요청했습니다 😄

### 👨‍💻 **인간이 개입한 영역들**
- **API 키 발급**: Google API 키는 아직 인간이 직접 발급받아야 합니다 🔑

### 🤝 **협업의 미학**
Cursor는 인간의 애매한 요구사항을 구체적인 코드로 변환하는 번역기 같은 존재입니다. 
"대충 이런 느낌으로"라고 말하면 "정확히 이런 코드로 구현하시겠다는 말씀이군요!"라고 답하며 완벽한 코드를 제공합니다.

인간은 상상하고, Cursor는 구현하는... 완벽한 분업! 🎯

---

## 📝 변경 사항 (Changelog)

### 🎉 v1.0.0 (2024-06-05) - 첫 번째 안정 버전
- ✨ **주요 기능 완성**: AI 번역기, 글쓰기 도우미, 문자 계산기
- 🏗️ **프로젝트 구조 개선**: 빌드 파일 `/build` 폴더로 통합
- 🧹 **코드 정리**: 사용하지 않는 라이브러리 제거 및 최적화
- 🛡️ **타입 안정성**: 전체 프로젝트 TypeScript 완전 적용
- 📦 **빌드 시스템**: Vite + Electron Builder로 안정적인 패키징
- 🎨 **UI/UX**: 반응형 디자인 및 사용자 친화적 인터페이스
- 🔧 **설정 관리**: API 키 및 모델 선택 기능
- 📚 **문서화**: 포괄적인 한국어 README 및 사용 가이드

---

## 📄 라이선스

이 프로젝트는 [MIT License](LICENSE)로 배포됩니다.

```
MIT License

Copyright (c) 2024 Simtr Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```