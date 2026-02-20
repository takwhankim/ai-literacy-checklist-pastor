export const COPY = {
  landing: {
    title: "사역자 AI 리터러시 체크",
    subtitle: "약 5-7분 소요 · 평가가 아닌 교육 설계용 진단",
    description:
      "이 진단은 사역자와 교사가 AI를 얼마나 이해하고 안전하게 활용하는지 확인하는 체크리스트입니다. 결과는 점수 경쟁이 아니라, 교회 교육과 훈련 계획을 세우기 위한 기초 자료로 사용됩니다.",
    cta: "시작하기",
    frameworkNote:
      "본 체크리스트는 유네스코(UNESCO) 교사 및 리더용 AI 역량 프레임워크를 기반으로 제작되었습니다.",
  },

  start: {
    heading: "기본 정보",
    intro: "아래 항목을 선택해 주세요.",
    roleLabel: "역할",
    roleOptions: ["목회자", "전도사", "중직사", "행정 및 미디어담당자", "교사 및 교회 봉사자", "기타"],
    ministryLabel: "사역 부서",
    ministryOptions: ["예배팀", "미디어팀", "새가족팀", "교육부", "선교부", "행정팀", "그외"],
    genderLabel: "성별",
    genderOptions: ["남", "여"],
    ageLabel: "연령",
    ageOptions: ["10-20대", "30대", "40대", "50대", "60대", "70대 이상"],
    churchSizeLabel: "출석교회 규모",
    churchSizeOptions: ["100명 미만", "100-499명", "500-1,999명", "2,000-9,999명", "1만명 이상"],
    regionLabel: "지역",
    regionOptions: ["서울", "경기", "한국내"],
    consentAgg: "익명 집계에 동의합니다(필수)",
    submit: "설문 시작",
    requiredError: "모든 항목을 선택해 주세요.",
    consentError: "필수 동의 항목을 체크해 주세요.",
    submitError: "시작 처리 중 오류가 발생했습니다.",
  },

  survey: {
    heading: "사역자 AI 리터러시 설문",
    description: "1-5점 척도로 가장 가까운 항목을 선택해 주세요.",
    progressComplete: "완료",
    previous: "이전",
    next: "다음",
    finish: "결과 보기",
    answeredStatus: "문항 응답 완료",
    submit: "제출하기",
    progress: "진행률",
    requiredError: "모든 문항에 답변해 주세요.",
    submitError: "제출 중 오류가 발생했습니다.",
  },

  result: {
    loading: "결과를 불러오는 중...",
    fetchError: "결과를 불러오지 못했습니다.",
    title: "사역자 AI 리터러시 결과",
    topNote:
      "이 결과는 평가가 아니라, 사역을 위한 현재 위치 확인입니다. 점수보다 중요한 것은 ‘다음에 무엇을 하면 좋을지’입니다.",
    total: "총점",
    outOf100: "/100점",
    domainScores: "영역별 점수",
    warnings: "주의 항목",
    nextSteps: "다음 단계 제안",
    print: "인쇄 / PDF 저장",
    copyLink: "결과 링크 복사",
    copied: "링크가 복사되었습니다.",
    retry: "다시 하기",
    extraNote: "AI는 도구입니다. 최종 판단과 책임은 언제나 사람에게 있습니다.",
    levelTitle: "현재 수준 해설",
    levelDescriptions: {
      1: {
        title: "기초",
        desc: "AI를 아직 익숙하게 쓰기 전 단계입니다. 먼저 기본 사용 경험과 ‘AI는 틀릴 수 있다’는 감각을 익히는 것이 중요합니다.",
      },
      2: {
        title: "활용",
        desc: "개인 업무 중심으로 AI를 활용하는 단계입니다. 이제 사역 적용과 검증 습관을 함께 만들어갈 때입니다.",
      },
      3: {
        title: "적용",
        desc: "사역에 적용 중이며 기준과 안전장치가 필요한 단계입니다. 개인 활용을 넘어 교회 기준을 준비할 시점입니다.",
      },
      4: {
        title: "리더",
        desc: "AI 활용과 운영을 함께 이끌 수 있는 단계입니다. 공동체를 돕는 역할로 확장할 수 있습니다.",
      },
    },
    warningsText: {
      ethicsLow: "주의: 개인정보·책임 영역 보완이 필요합니다.",
      criticalLow: "주의: AI 결과 검증 루틴이 필요합니다.",
    },
  },

  likert: {
    labels: [
      "1 전혀 그렇지 않다",
      "2 그렇지 않다",
      "3 보통이다",
      "4 그렇다",
      "5 매우 그렇다",
    ],
    descriptions: [
      "이 문장은 나와 전혀 맞지 않습니다.",
      "이 문장은 대체로 나와 맞지 않습니다.",
      "확신하기 어렵거나 부분적으로만 맞습니다.",
      "이 문장은 대체로 나와 맞습니다.",
      "이 문장은 현재 나를 매우 잘 설명합니다.",
    ],
  },

  admin: {
    login: {
      heading: "관리자 로그인",
      email: "이메일",
      password: "비밀번호",
      submit: "로그인",
      error: "로그인에 실패했습니다.",
    },
    dashboard: {
      heading: "관리자 대시보드",
      export: "CSV 내보내기",
      logout: "로그아웃",
      loading: "불러오는 중...",
      error: "요약 데이터를 불러오지 못했습니다.",
      levelDistribution: "레벨 분포",
      domainAverage: "영역 평균 점수(/25)",
      genderDistribution: "성별 분포",
      ageDistribution: "연령 분포",
      churchSizeDistribution: "교회 규모 분포",
      regionDistribution: "지역 분포",
      summary: "요약",
      totalAssessments: "제출 완료 수",
      last30Days: "최근 30일 제출",
      weakestDomain: "취약 영역",
      domainAveragePrefix: "영역",
      domainAverageSuffix: "평균",
    },
  },

  common: {
    levelLabel: "레벨",
    copyright: "© 2026 onmam.com. All rights reserved.",
  },
} as const;
