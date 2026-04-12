// ============================================================
// 진로나침반 - Mock Data
// ============================================================

export const UNIVERSITIES = [
  "서울대학교", "연세대학교", "고려대학교", "서강대학교", "성균관대학교",
  "한양대학교", "중앙대학교", "경희대학교", "한국외국어대학교", "서울시립대학교",
  "이화여자대학교", "동국대학교", "건국대학교", "홍익대학교", "국민대학교",
  "숭실대학교", "광운대학교", "세종대학교", "서울과학기술대학교", "서울교육대학교",
  "한국체육대학교", "숙명여자대학교", "성신여자대학교", "서울여자대학교",
  "덕성여자대학교", "동덕여자대학교", "삼육대학교", "상명대학교", "서경대학교",
  "성공회대학교", "한성대학교"
];

export const DEPARTMENTS_BY_FIELD: Record<string, string[]> = {
  "공학": ["컴퓨터공학과", "전기공학과", "기계공학과", "화학공학과", "산업공학과", "건축공학과"],
  "AI·소프트웨어": ["소프트웨어학과", "AI학과", "데이터사이언스학과", "정보통신공학과", "컴퓨터과학과"],
  "경영·경제": ["경영학과", "경제학과", "회계학과", "국제경영학과", "금융학과"],
  "교육": ["교육학과", "유아교육학과", "초등교육학과", "영어교육학과", "수학교육학과"],
  "인문": ["국어국문학과", "영어영문학과", "철학과", "사학과", "심리학과"],
  "미디어": ["신문방송학과", "미디어학과", "광고홍보학과", "영상학과"],
  "디자인": ["시각디자인학과", "산업디자인학과", "패션디자인학과", "영상디자인학과"],
  "간호·보건": ["간호학과", "보건관리학과", "임상병리학과", "물리치료학과"],
  "사회과학": ["사회학과", "정치외교학과", "행정학과", "법학과", "사회복지학과"],
  "자연과학": ["수학과", "물리학과", "화학과", "생명과학과", "통계학과"],
};

export const SUBJECTS = {
  core: ["국어", "수학", "영어", "한국사", "통합사회", "통합과학"],
  social: ["한국지리", "세계지리", "동아시아사", "세계사", "경제", "정치와법", "사회문화"],
  science: ["물리학Ⅰ", "화학Ⅰ", "생명과학Ⅰ", "지구과학Ⅰ", "물리학Ⅱ", "화학Ⅱ", "생명과학Ⅱ"],
  foreign: ["중국어Ⅰ", "일본어Ⅰ", "프랑스어Ⅰ", "독일어Ⅰ", "한문Ⅰ"],
};

export const GRADE_DATA = [
  { period: "1학기 중간", korean: 2.3, math: 3.1, english: 2.8, science: 2.5 },
  { period: "1학기 기말", korean: 2.1, math: 2.7, english: 2.5, science: 2.3 },
  { period: "2학기 중간", korean: 1.9, math: 2.4, english: 2.2, science: 2.0 },
  { period: "2학기 기말", korean: 1.8, math: 2.1, english: 2.0, science: 1.9 },
  { period: "3학기 중간", korean: 1.6, math: 1.8, english: 1.8, science: 1.7 },
];

export const WEEKLY_PLAN = [
  { id: 1, subject: "수학", task: "수능 모의고사 3회 풀기", day: "월", priority: "high", done: true },
  { id: 2, subject: "국어", task: "문학 기출문제 풀기", day: "화", priority: "high", done: true },
  { id: 3, subject: "영어", task: "독해 연습 10지문", day: "수", priority: "medium", done: false },
  { id: 4, subject: "화학Ⅰ", task: "2단원 개념 정리", day: "목", priority: "medium", done: false },
  { id: 5, subject: "생명과학Ⅰ", task: "세포 단원 복습", day: "금", priority: "low", done: false },
  { id: 6, subject: "수학", task: "미적분 문제집 1~30번", day: "토", priority: "high", done: false },
  { id: 7, subject: "영어", task: "단어 암기 100개", day: "일", priority: "low", done: false },
];

export const ALERTS = [
  { id: 1, type: "danger", category: "성적", title: "수학 성적 하락 경고", body: "최근 수학 모의고사 성적이 3등급 이하로 하락했습니다.", time: "10분 전", read: false },
  { id: 2, type: "warning", category: "학습", title: "주간 학습 목표 미달성", body: "이번 주 목표 완료율이 42%입니다. 남은 과제를 확인하세요.", time: "1시간 전", read: false },
  { id: 3, type: "info", category: "상담", title: "선생님 메모가 도착했습니다", body: "박지영 선생님이 새 메모를 남겼습니다.", time: "3시간 전", read: true },
  { id: 4, type: "success", category: "진로", title: "AI 진로탐색 결과 준비됨", body: "AI 분석 결과가 준비되었습니다. 결과를 확인해보세요.", time: "어제", read: true },
  { id: 5, type: "info", category: "입시", title: "2026 수시 일정 업데이트", body: "서울대학교 수시 지원 일정이 업데이트되었습니다.", time: "2일 전", read: true },
];

export const STUDENTS = [
  { id: 1, name: "김민준", grade: "2학년", track: "이공계", gpa: 1.8, goal: "서울대 컴퓨터공학과", status: "normal", completion: 85, counselNeeded: false },
  { id: 2, name: "이서연", grade: "2학년", track: "인문계", gpa: 2.3, goal: "연세대 경영학과", status: "warning", completion: 62, counselNeeded: true },
  { id: 3, name: "박지호", grade: "2학년", track: "이공계", gpa: 3.1, goal: "미설정", status: "danger", completion: 35, counselNeeded: true },
  { id: 4, name: "최아연", grade: "2학년", track: "인문계", gpa: 1.5, goal: "고려대 법학과", status: "normal", completion: 92, counselNeeded: false },
  { id: 5, name: "정도현", grade: "2학년", track: "이공계", gpa: 2.7, goal: "한양대 기계공학과", status: "warning", completion: 58, counselNeeded: true },
  { id: 6, name: "윤수민", grade: "2학년", track: "인문계", gpa: 1.9, goal: "서강대 미디어학과", status: "normal", completion: 78, counselNeeded: false },
  { id: 7, name: "한예린", grade: "2학년", track: "예체능", gpa: 2.1, goal: "홍익대 시각디자인과", status: "normal", completion: 71, counselNeeded: false },
  { id: 8, name: "오승우", grade: "2학년", track: "이공계", gpa: 3.5, goal: "미설정", status: "danger", completion: 28, counselNeeded: true },
];

export const COUNSELING_REQUESTS = [
  { id: 1, student: "이서연", type: "학업 고민", message: "수학 성적이 계속 안 오르는데 어떻게 해야 할지 모르겠어요. 상담 부탁드립니다.", date: "2026-04-10", status: "pending" },
  { id: 2, student: "박지호", type: "진로 고민", message: "아직 진로를 못 정해서 불안합니다. 선생님과 이야기하고 싶어요.", date: "2026-04-09", status: "in_progress" },
  { id: 3, student: "정도현", type: "학업 고민", message: "모의고사 준비를 어떻게 해야 할지 체계적으로 알고 싶습니다.", date: "2026-04-08", status: "completed" },
  { id: 4, student: "오승우", type: "정서적 지원", message: "공부에 의욕이 없어서 힘들어요. 이야기 나눠도 될까요?", date: "2026-04-07", status: "pending" },
];

export const ADMISSIONS_DATA = [
  { id: 1, university: "서울대학교", department: "컴퓨터공학부", year: 2025, type: "수시", category: "학생부종합", cutGrade: "1.2", seats: 20, source: "대학어디가", updated: "2026-03-15" },
  { id: 2, university: "연세대학교", department: "경영학과", year: 2025, type: "수시", category: "학생부종합", cutGrade: "1.4", seats: 35, source: "대학 입학처", updated: "2026-03-12" },
  { id: 3, university: "고려대학교", department: "법학과", year: 2025, type: "수시", category: "학생부교과", cutGrade: "1.3", seats: 25, source: "대학어디가", updated: "2026-03-10" },
  { id: 4, university: "서강대학교", department: "AI학과", year: 2025, type: "수시", category: "학생부종합", cutGrade: "1.5", seats: 15, source: "대학 입학처", updated: "2026-03-08" },
  { id: 5, university: "성균관대학교", department: "소프트웨어학과", year: 2025, type: "정시", category: "수능위주", cutGrade: "288점", seats: 30, source: "대학어디가", updated: "2026-03-05" },
  { id: 6, university: "한양대학교", department: "기계공학과", year: 2025, type: "수시", category: "학생부교과", cutGrade: "1.7", seats: 40, source: "대학 입학처", updated: "2026-03-03" },
  { id: 7, university: "중앙대학교", department: "의학부", year: 2025, type: "수시", category: "논술", cutGrade: "1.1", seats: 10, source: "대학어디가", updated: "2026-03-01" },
  { id: 8, university: "경희대학교", department: "간호학과", year: 2025, type: "정시", category: "수능위주", cutGrade: "275점", seats: 20, source: "대학 입학처", updated: "2026-02-28" },
];

export const TEACHER_GRADE_DATA = [
  { period: "1학기 중간", 김민준: 1.8, 이서연: 2.3, 박지호: 3.1, 최아연: 1.5 },
  { period: "1학기 기말", 김민준: 1.6, 이서연: 2.1, 박지호: 2.9, 최아연: 1.4 },
  { period: "2학기 중간", 김민준: 1.5, 이서연: 2.0, 박지호: 3.0, 최아연: 1.3 },
  { period: "2학기 기말", 김민준: 1.4, 이서연: 1.9, 박지호: 3.2, 최아연: 1.2 },
  { period: "3학기 중간", 김민준: 1.3, 이서연: 1.8, 박지호: 3.1, 최아연: 1.1 },
];

export const COMPLETION_TREND = [
  { week: "3/1주", 완료율: 45 },
  { week: "3/2주", 완료율: 58 },
  { week: "3/3주", 완료율: 62 },
  { week: "3/4주", 완료율: 71 },
  { week: "4/1주", 완료율: 68 },
  { week: "4/2주", 완료율: 75 },
];
