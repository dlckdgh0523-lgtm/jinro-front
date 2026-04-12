import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Compass, TrendingUp, Brain, CalendarDays, BarChart2,
  ChevronRight, Star, ArrowRight, BookOpen, Users,
  Moon, Sun, GraduationCap, MessageCircle
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12"
        style={{
          height: "64px",
          background: "rgba(254,249,246,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ background: "linear-gradient(135deg, #C17B6E 0%, #D4906A 100%)" }}
          >
            🧭
          </div>
          <span className="text-lg" style={{ color: "var(--brand-coral)", fontWeight: 700 }}>
            진로나침반
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode((d) => !d)}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            {darkMode ? <Sun size={16} style={{ color: "var(--brand-warning)" }} /> : <Moon size={16} style={{ color: "var(--brand-text-muted)" }} />}
          </button>
          <button
            onClick={() => navigate("/student/login")}
            className="px-4 py-2 rounded-xl text-sm transition-colors hover:bg-accent"
            style={{ color: "var(--brand-coral)", fontWeight: 600 }}
          >
            학생 로그인
          </button>
          <button
            onClick={() => navigate("/teacher/login")}
            className="px-4 py-2 rounded-xl text-sm text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--brand-coral)", fontWeight: 600 }}
          >
            교사 로그인
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 md:px-12 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm"
          style={{ background: "var(--brand-peach)", color: "var(--brand-coral)", fontWeight: 600 }}
        >
          <Star size={13} />
          한국형 AI 진로·학업 관리 플랫폼
        </div>
        <h1
          className="text-4xl md:text-5xl mb-6 max-w-3xl mx-auto"
          style={{ color: "var(--brand-text)", fontWeight: 700, lineHeight: 1.25 }}
        >
          내 진로, 이제{" "}
          <span style={{ color: "var(--brand-coral)" }}>AI가 함께</span>{" "}
          찾아드립니다
        </h1>
        <p
          className="text-lg mb-10 max-w-xl mx-auto"
          style={{ color: "var(--brand-text-muted)", lineHeight: 1.7 }}
        >
          성적 관리부터 AI 진로 탐색, 대학·학과 추천, 담임교사 상담까지
          <br />
          고등학생의 입시를 위한 모든 것을 하나로.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate("/student/signup")}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--brand-coral)", fontWeight: 600, fontSize: "1rem" }}
          >
            <GraduationCap size={18} />
            학생으로 시작하기
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => navigate("/teacher/signup")}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl transition-colors hover:bg-accent"
            style={{
              border: "1.5px solid var(--brand-coral)",
              color: "var(--brand-coral)",
              fontWeight: 600,
              fontSize: "1rem",
              background: "transparent"
            }}
          >
            <Users size={18} />
            교사로 시작하기
          </button>
        </div>
      </section>

      {/* Stats bar */}
      <section
        className="py-10 px-6 md:px-12"
        style={{ background: "var(--brand-peach)" }}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: "12,400+", label: "등록 학생" },
            { num: "830+", label: "담임 교사" },
            { num: "98%", label: "사용자 만족도" },
            { num: "2026", label: "입시 데이터 최신화" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl" style={{ color: "var(--brand-coral)", fontWeight: 700 }}>
                {s.num}
              </div>
              <div className="text-sm mt-1" style={{ color: "var(--brand-text-muted)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature 1: AI 진로 탐색 */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-4 text-xs"
              style={{ background: "var(--brand-peach)", color: "var(--brand-coral)", fontWeight: 600 }}
            >
              <Brain size={12} />
              AI 진로 탐색
            </div>
            <h2 className="text-3xl mb-4" style={{ color: "var(--brand-text)", fontWeight: 700, lineHeight: 1.3 }}>
              AI가 묻고, 학생이 답하면<br />진로가 보입니다
            </h2>
            <p className="mb-6" style={{ color: "var(--brand-text-muted)", lineHeight: 1.7 }}>
              관심사, 강점 과목, 미래 방향을 AI와 대화하며 탐색하세요. 진로가 정해지지 않은 학생도 단계적으로 자신의 길을 발견할 수 있습니다.
            </p>
            <button
              onClick={() => navigate("/student/ai-career")}
              className="flex items-center gap-2 text-sm transition-colors hover:opacity-80"
              style={{ color: "var(--brand-coral)", fontWeight: 600 }}
            >
              AI 진로 탐색 미리보기 <ChevronRight size={15} />
            </button>
          </div>
          {/* Preview card */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              boxShadow: "0 8px 32px rgba(193,123,110,0.1)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs" style={{ background: "var(--brand-coral)" }}>AI</div>
              <span className="text-sm" style={{ color: "var(--brand-text)", fontWeight: 600 }}>진로 탐색 AI</span>
            </div>
            {[
              { from: "ai", text: "안녕하세요! 어떤 과목이 가장 재밌었나요? 😊" },
              { from: "user", text: "수학이랑 컴퓨터 프로그래밍이 재밌어요." },
              { from: "ai", text: "좋아요! 논리적 사고를 즐기시는군요. 소프트웨어 공학이나 AI 분야는 어떻게 생각하세요?" },
            ].map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} mb-2`}
              >
                <div
                  className="px-3 py-2 rounded-xl text-sm max-w-[80%]"
                  style={{
                    background: msg.from === "user" ? "var(--brand-coral)" : "var(--brand-peach)",
                    color: msg.from === "user" ? "white" : "var(--brand-text)",
                    lineHeight: 1.5,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div className="flex gap-2 mt-3 flex-wrap">
              {["네, 관심 있어요", "더 알아볼게요"].map((chip) => (
                <span
                  key={chip}
                  className="px-3 py-1.5 rounded-lg text-xs"
                  style={{ background: "var(--brand-peach)", color: "var(--brand-coral)", fontWeight: 600 }}
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2: 성적 관리 */}
      <section className="py-20 px-6 md:px-12" style={{ background: "var(--secondary)" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Preview */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              boxShadow: "0 8px 32px rgba(193,123,110,0.1)",
            }}
          >
            <h4 className="text-sm mb-4" style={{ color: "var(--brand-text)", fontWeight: 600 }}>
              📊 성적 변화 추이
            </h4>
            <div className="space-y-3">
              {[
                { subject: "국어", grade: "1등급", change: "+0.3", trend: "up" },
                { subject: "수학", grade: "2등급", change: "+1.0", trend: "up" },
                { subject: "영어", grade: "1등급", change: "0.0", trend: "same" },
                { subject: "과학탐구", grade: "2등급", change: "+0.5", trend: "up" },
              ].map((item) => (
                <div key={item.subject} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--border)" }}>
                  <span className="text-sm" style={{ color: "var(--brand-text)" }}>{item.subject}</span>
                  <div className="flex items-center gap-3">
                    <span
                      className="px-2 py-0.5 rounded text-xs"
                      style={{ background: "var(--brand-peach)", color: "var(--brand-coral)", fontWeight: 600 }}
                    >
                      {item.grade}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: item.trend === "up" ? "#6BAE8A" : "var(--brand-text-muted)", fontWeight: 600 }}
                    >
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-4 text-xs"
              style={{ background: "var(--brand-peach)", color: "var(--brand-coral)", fontWeight: 600 }}
            >
              <TrendingUp size={12} />
              성적 관리
            </div>
            <h2 className="text-3xl mb-4" style={{ color: "var(--brand-text)", fontWeight: 700, lineHeight: 1.3 }}>
              내신부터 수능까지<br />한 곳에서 관리하세요
            </h2>
            <p className="mb-6" style={{ color: "var(--brand-text-muted)", lineHeight: 1.7 }}>
              중간고사, 기말고사, 모의고사 성적을 입력하고 변화 추이를 한눈에 확인하세요. 국어, 수학, 탐구까지 한국형 과목 구조를 완벽히 지원합니다.
            </p>
            <button
              onClick={() => navigate("/student/grades")}
              className="flex items-center gap-2 text-sm transition-colors hover:opacity-80"
              style={{ color: "var(--brand-coral)", fontWeight: 600 }}
            >
              성적 입력 미리보기 <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* Feature 3: 학습 계획 */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-4 text-xs"
              style={{ background: "var(--brand-peach)", color: "var(--brand-coral)", fontWeight: 600 }}
            >
              <CalendarDays size={12} />
              주간 학습 계획
            </div>
            <h2 className="text-3xl mb-4" style={{ color: "var(--brand-text)", fontWeight: 700, lineHeight: 1.3 }}>
              오늘의 계획, 내일의 성장
            </h2>
            <p className="mb-6" style={{ color: "var(--brand-text-muted)", lineHeight: 1.7 }}>
              수능 준비 과목을 반영한 주간 학습 플래너로 매일 목표를 설정하고 완료 현황을 추적하세요. 담임교사도 학생의 학습 이행률을 실시간으로 확인합니다.
            </p>
            <button
              onClick={() => navigate("/student/weekly-plan")}
              className="flex items-center gap-2 text-sm transition-colors hover:opacity-80"
              style={{ color: "var(--brand-coral)", fontWeight: 600 }}
            >
              학습 계획 미리보기 <ChevronRight size={15} />
            </button>
          </div>
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              boxShadow: "0 8px 32px rgba(193,123,110,0.1)",
            }}
          >
            <h4 className="text-sm mb-4" style={{ color: "var(--brand-text)", fontWeight: 600 }}>
              📅 이번 주 학습 계획
            </h4>
            {[
              { subject: "수학", task: "수열 단원 복습", done: true, priority: "높음" },
              { subject: "국어", task: "독서 지문 3개 풀기", done: true, priority: "중간" },
              { subject: "영어", task: "EBS 어법 20문항", done: false, priority: "높음" },
              { subject: "과학탐구", task: "화학 개념 정리", done: false, priority: "낮음" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-2"
                style={{ borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}
              >
                <div
                  className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                  style={{
                    background: item.done ? "var(--brand-success)" : "var(--muted)",
                    border: `1.5px solid ${item.done ? "var(--brand-success)" : "var(--border)"}`,
                  }}
                >
                  {item.done && <span className="text-white text-[9px]">✓</span>}
                </div>
                <div className="flex-1">
                  <span className="text-xs" style={{ color: "var(--brand-text-muted)", fontWeight: 600 }}>
                    {item.subject}
                  </span>
                  <p className="text-sm" style={{ color: item.done ? "var(--brand-text-muted)" : "var(--brand-text)", textDecoration: item.done ? "line-through" : "none" }}>
                    {item.task}
                  </p>
                </div>
                <span
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{
                    background: item.priority === "높음" ? "rgba(212, 72, 72, 0.1)" : item.priority === "중간" ? "rgba(212, 149, 106, 0.1)" : "rgba(107, 174, 138, 0.1)",
                    color: item.priority === "높음" ? "#D44848" : item.priority === "중간" ? "#D4956A" : "#6BAE8A",
                    fontWeight: 600,
                  }}
                >
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature 4: 최근 입시 데이터 */}
      <section className="py-20 px-6 md:px-12" style={{ background: "var(--brand-peach)" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              boxShadow: "0 8px 32px rgba(193,123,110,0.1)",
            }}
          >
            <h4 className="text-sm mb-4" style={{ color: "var(--brand-text)", fontWeight: 600 }}>
              🎓 최근 입시 데이터
            </h4>
            <div className="space-y-3">
              {[
                { univ: "연세대학교", dept: "컴퓨터공학과", type: "학생부종합", cutoff: "1.2등급", source: "대학어디가" },
                { univ: "고려대학교", dept: "소프트웨어학부", type: "학생부교과", cutoff: "1.5등급", source: "입학처" },
                { univ: "한양대학교", dept: "컴퓨터소프트웨어", type: "수능위주", cutoff: "1.8등급", source: "대학어디가" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl"
                  style={{ background: "var(--background)", border: "1px solid var(--border)" }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm" style={{ color: "var(--brand-text)", fontWeight: 600 }}>
                        {item.univ}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--brand-text-muted)" }}>
                        {item.dept} · {item.type}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--brand-peach)", color: "var(--brand-coral)", fontWeight: 600 }}>
                        {item.cutoff}
                      </span>
                      <span className="text-xs" style={{ color: "var(--brand-text-light)" }}>
                        {item.source}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-4 text-xs"
              style={{ background: "rgba(193,123,110,0.15)", color: "var(--brand-coral)", fontWeight: 600 }}
            >
              <Database size={12} />
              최근 입시 데이터
            </div>
            <h2 className="text-3xl mb-4" style={{ color: "var(--brand-text)", fontWeight: 700, lineHeight: 1.3 }}>
              2026 입시 데이터를<br />바로 확인하세요
            </h2>
            <p className="mb-6" style={{ color: "var(--brand-text-muted)", lineHeight: 1.7 }}>
              대학, 학과, 전형 유형별로 최신 등급컷과 결과를 필터링해 찾아보세요. 대학어디가, 대학 입학처 등 공식 출처를 명시합니다.
            </p>
            <button
              onClick={() => navigate("/student/admissions")}
              className="flex items-center gap-2 text-sm"
              style={{ color: "var(--brand-coral)", fontWeight: 600 }}
            >
              입시 데이터 보기 <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* Feature 5: 교사 대시보드 */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-4 text-xs"
              style={{ background: "var(--brand-peach)", color: "var(--brand-coral)", fontWeight: 600 }}
            >
              <Users size={12} />
              교사용 대시보드
            </div>
            <h2 className="text-3xl mb-4" style={{ color: "var(--brand-text)", fontWeight: 700, lineHeight: 1.3 }}>
              담임교사가 더 쉽게<br />학생을 지도할 수 있도록
            </h2>
            <p className="mb-6" style={{ color: "var(--brand-text-muted)", lineHeight: 1.7 }}>
              학생 전체 현황, 학습 이행 저조 학생, 상담 요청을 한 곳에서 관리하세요. 학생의 성적 추이와 목표를 실시간으로 파악해 효과적인 상담을 제공합니다.
            </p>
            <button
              onClick={() => navigate("/teacher/login")}
              className="flex items-center gap-2 text-sm"
              style={{ color: "var(--brand-coral)", fontWeight: 600 }}
            >
              교사 대시보드 보기 <ChevronRight size={15} />
            </button>
          </div>
          {/* Teacher dashboard preview */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              boxShadow: "0 8px 32px rgba(193,123,110,0.1)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm" style={{ color: "var(--brand-text)", fontWeight: 600 }}>
                👩‍🏫 교사 대시보드
              </h4>
              <span className="text-xs px-2 py-1 rounded" style={{ background: "var(--brand-peach)", color: "var(--brand-coral)" }}>
                HB-2026-3B
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: "전체 학생", value: "32", color: "var(--brand-coral)" },
                { label: "상담 필요", value: "5", color: "#D44848" },
                { label: "목표 미설정", value: "8", color: "#D4956A" },
                { label: "학습 저조", value: "6", color: "#8B9ED4" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-3 rounded-xl"
                  style={{ background: "var(--background)", border: "1px solid var(--border)" }}
                >
                  <p className="text-xl" style={{ color: stat.color, fontWeight: 700 }}>{stat.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--brand-text-muted)" }}>{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[
                { name: "이수연", issue: "수학 성적 하락 주의", badge: "주의" },
                { name: "박준호", issue: "상담 요청 1건", badge: "상담" },
              ].map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between px-3 py-2 rounded-lg"
                  style={{ background: "var(--background)" }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ background: "var(--brand-coral)" }}>
                      {s.name[0]}
                    </div>
                    <span className="text-sm" style={{ color: "var(--brand-text)" }}>{s.name}</span>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ background: "rgba(212,149,106,0.15)", color: "#D4956A", fontWeight: 600 }}
                  >
                    {s.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 px-6 md:px-12 text-center"
        style={{ background: "linear-gradient(135deg, #F5E6E0 0%, #FEF4F0 100%)" }}
      >
        <h2 className="text-3xl mb-4" style={{ color: "var(--brand-text)", fontWeight: 700 }}>
          지금 바로 시작하세요
        </h2>
        <p className="mb-8" style={{ color: "var(--brand-text-muted)" }}>
          진로나침반과 함께 목표를 향한 첫 걸음을 내딛으세요.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate("/student/signup")}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl text-white"
            style={{ background: "var(--brand-coral)", fontWeight: 600 }}
          >
            <GraduationCap size={18} />
            학생 무료 시작하기
          </button>
          <button
            onClick={() => navigate("/teacher/signup")}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl"
            style={{
              border: "1.5px solid var(--brand-coral)",
              color: "var(--brand-coral)",
              fontWeight: 600,
              background: "transparent"
            }}
          >
            <Users size={18} />
            교사 계정 만들기
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-10 px-6 md:px-12"
        style={{ background: "var(--card)", borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs" style={{ background: "var(--brand-coral)" }}>
              🧭
            </div>
            <span style={{ color: "var(--brand-coral)", fontWeight: 700 }}>진로나침반</span>
          </div>
          <div className="flex gap-6 text-sm" style={{ color: "var(--brand-text-muted)" }}>
            <span>이용약관</span>
            <span>개인정보처리방침</span>
            <span>고객센터</span>
          </div>
          <p className="text-sm" style={{ color: "var(--brand-text-light)" }}>
            © 2026 진로나침반. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
