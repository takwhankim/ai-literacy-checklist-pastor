# Church AI Literacy Check

UNESCO 프레임워크 기반 교회 사역자/교사 대상 AI 리터러시 진단 웹앱입니다.

## 기술 스택
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Prisma ORM + PostgreSQL
- Recharts
- 쿠키 세션 기반 관리자 인증

## 실행 방법
1. 의존성 설치
```bash
npm install
```

2. 환경 변수 설정
```bash
cp .env.example .env
```

3. Prisma Client 생성
```bash
npx prisma generate
```

4. DB 마이그레이션
```bash
npx prisma migrate dev --name init
```

5. 개발 서버 실행
```bash
npm run dev
```

## 주요 경로
- 공개 진단: `/` -> `/start` -> `/survey/[id]` -> `/result/[id]`
- 관리자 로그인: `/admin/login`
- 관리자 대시보드: `/admin`
- CSV 내보내기 API: `/api/admin/export`

## 환경 변수
- `DATABASE_URL`: PostgreSQL 연결 문자열
- `ADMIN_EMAIL`: 관리자 이메일
- `ADMIN_PASSWORD`: 관리자 비밀번호
- `ADMIN_SESSION_SECRET`: 관리자 세션 서명 키
