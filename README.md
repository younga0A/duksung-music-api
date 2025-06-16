# 보이넥스트도어 노래 추천 API 🎧

날씨와 기분을 입력받아, 남자 아이돌 그룹 **보이넥스트도어**의 노래 중 하루에 어울리는 노래를 추천해주는 API입니다.  
Google의 Gemini 1.5 모델을 사용하여 추천 결과를 생성합니다.

---

## 프로젝트 구조

```
/api
  └── duksungAI.js
.env
vercel.json
README.md
```

---

## 설치 및 실행 방법

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경변수 설정

루트 경로에 `.env` 파일을 만들고 아래처럼 작성합니다:

```
GEMINI_API_KEY=당신의_API_키
```

### 3. 로컬 테스트

```bash
vercel dev
```

---

## API 사용법

### ● 요청

- **URL**: `POST /api/duksungAI`
- **Headers**:
  - `Content-Type: application/json`
- **Body**:

```json
{
  "weather": "맑음",
  "mood": "설렘"
}
```

### ● 응답

```json
{
  "answer": "오늘 같은 맑고 설레는 날엔 보이넥스트도어의 'One and Only'를 추천해요! 청량하고 밝은 분위기가 기분과 딱 어울려요."
}
```

---

## 배포 (Vercel)

`vercel.json` 설정으로 `/` 요청 시 `/api/duksungAI`로 자동 라우팅됩니다:

```json
{
  "version": 2,
  "rewrites": [
    { "source": "/(.*)", "destination": "/api/duksungAI" }
  ]
}
```

---

## 사용 기술

- Node.js
- Google Generative AI SDK (`@google/generative-ai`)
- Vercel Serverless Functions
- dotenv

---
