import React from "react";
import { useNavigate } from "react-router";
import { useTheme } from "../context/ThemeContext";
import {
  Brain, TrendingUp, Bell, BookOpen, Target, GraduationCap,
  Users, BarChart2, CheckCircle, Sun, Moon, ArrowRight,
  Star, Shield, Zap, ChevronRight
} from "lucide-react";

export function Landing() {
  const navigate = useNavigate();
  const { dark, toggleDark } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-foreground">진로나침반</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleDark} className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors text-muted-foreground">
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => navigate("/login/student")} className="text-sm px-4 h-9 rounded-lg border border-border hover:bg-secondary transition-colors">
              로그인
            </button>
            <button onClick={() => navigate("/signup/student")} className="text-sm px-4 h-9 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              시작하기
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-secondary/60 border border-border rounded-full px-4 py-1.5 text-sm text-muted-foreground mb-6">
            <Zap className="w-3.5 h-3.5 text-primary" />
            AI 기반 한국형 진로·학업 관리 플랫폼
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold text-foreground leading-tight mb-4">
            나만의 진로를 찾는<br />
            <span className="text-primary">AI 나침반</span>을 만나보세요
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            성적 관리부터 AI 진로 탐색, 대학·학과 추천까지.<br />
            진로나침반은 고등학생과 담임교사를 위한 완전한 에듀테크 플랫폼입니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/signup/student")}
              className="flex items-center justify-center gap-2 px-7 h-12 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              학생으로 시작하기 <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/signup/teacher")}
              className="flex items-center justify-center gap-2 px-7 h-12 rounded-xl bg-secondary text-foreground font-medium hover:bg-muted transition-colors border border-border"
            >
              교사로 시작하기 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Preview Cards - Student */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
                <BookOpen className="w-3.5 h-3.5" /> 학생 워크스페이스
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                성적 관리부터 진로까지<br />한 곳에서
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                내신, 모의고사 성적을 입력하고 AI가 분석한 진로 방향과 맞춤형 대학·학과를 추천받아보세요. 주간 학습 계획도 자동으로 생성됩니다.
              </p>
              <ul className="space-y-2.5">
                {["AI 진로 탐색 채팅", "성적 변화 추이 분석", "대학·학과 맞춤 추천", "주간 학습 계획 자동 생성"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Student Preview Card */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">안녕하세요,</p>
                  <p className="text-sm font-medium text-foreground">김민준 학생 👋</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { label: "평균 내신", value: "1.8등급", color: "text-primary" },
                  { label: "완료 과제", value: "5/7", color: "text-emerald-600" },
                  { label: "목표 달성률", value: "72%", color: "text-amber-600" },
                ].map((s) => (
                  <div key={s.label} className="bg-secondary/60 rounded-xl p-2.5 text-center">
                    <p className={`text-sm font-semibold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-secondary/40 rounded-xl p-3">
                <p className="text-xs text-muted-foreground mb-2">🎯 목표</p>
                <p className="text-sm font-medium text-foreground">서울대학교 컴퓨터공학부</p>
                <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-3/4 rounded-full bg-primary" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">목표 달성도 75%</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">오늘 할 일</p>
                {["수학 모의고사 3회 풀기", "화학 2단원 개념 정리"].map((task, i) => (
                  <div key={task} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${i === 0 ? "border-primary bg-primary" : "border-muted-foreground/30"}`}>
                      {i === 0 && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-xs ${i === 0 ? "line-through text-muted-foreground" : "text-foreground"}`}>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Career Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* AI Chat Preview */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3 order-2 md:order-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                  <Brain className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">나침반 AI</p>
                  <p className="text-xs text-muted-foreground">온라인</p>
                </div>
              </div>
              <div className="bg-secondary/50 rounded-xl rounded-tl-sm p-3 max-w-xs">
                <p className="text-xs text-foreground">안녕하세요! 저는 진로나침반 AI예요. 어떤 분야에 관심이 있으신가요?</p>
              </div>
              <div className="flex justify-end">
                <div className="bg-primary/15 rounded-xl rounded-tr-sm p-3 max-w-xs">
                  <p className="text-xs text-foreground">컴퓨터공학 쪽에 관심이 있어요!</p>
                </div>
              </div>
              <div className="bg-secondary/50 rounded-xl rounded-tl-sm p-3 max-w-xs">
                <p className="text-xs text-foreground">좋아요! 수학과 과학 성적이 좋으시네요. 소프트웨어공학, AI 분야가 잘 맞을 것 같아요 🎯</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {["더 자세히 알고 싶어요", "관련 대학 추천해줘"].map((chip) => (
                  <span key={chip} className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors">
                    {chip}
                  </span>
                ))}
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
                <Brain className="w-3.5 h-3.5" /> AI 진로 탐색
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                AI와 대화하며<br />진로 방향을 찾아보세요
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                관심사, 선호 과목, 업무 스타일을 AI와 대화하며 탐색하고 나에게 맞는 진로를 찾아가세요. 결과는 대학·학과 추천과 자연스럽게 연결됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Plan & Alerts Section */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
            <Bell className="w-3.5 h-3.5" /> 학습 계획 & 알림
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            주간 학습 계획부터 실시간 알림까지
          </h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">선택한 수능 과목 기반으로 주간 학습 계획을 세우고, 성적 변화 알림을 실시간으로 받아보세요.</p>
          <div className="grid sm:grid-cols-3 gap-5 text-left">
            {[
              { icon: <BookOpen className="w-5 h-5 text-primary" />, title: "주간 학습 계획", desc: "수능 과목별 우선순위와 일정을 체계적으로 관리" },
              { icon: <CheckCircle className="w-5 h-5 text-emerald-500" />, title: "학습 완료 체크", desc: "완료한 과제를 체크하고 달성률을 한눈에 확인" },
              { icon: <Bell className="w-5 h-5 text-amber-500" />, title: "실시간 알림", desc: "성적 변화, 상담 메모, 입시 일정을 즉시 알림" },
            ].map((f) => (
              <div key={f.title} className="bg-card rounded-xl border border-border p-5">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-3">{f.icon}</div>
                <p className="font-medium text-foreground mb-1">{f.title}</p>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admissions Data Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
                <BarChart2 className="w-3.5 h-3.5" /> 최근 입시 데이터
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                최신 입시 데이터를<br />한눈에 확인하세요
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                수시/정시, 전형 유형별로 필터링하고 최신 등급컷과 합격 데이터를 확인하세요. 대학어디가, 각 대학 입학처의 공식 데이터를 기반으로 합니다.
              </p>
              <div className="flex flex-wrap gap-2">
                {["학생부교과", "학생부종합", "논술", "수능위주", "실기/특기"].map((t) => (
                  <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-secondary border border-border text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">2025학년도 입시 결과</span>
              </div>
              <div className="divide-y divide-border">
                {[
                  { univ: "서울대학교", dept: "컴퓨터공학부", type: "학생부종합", grade: "1.2등급" },
                  { univ: "연세대학교", dept: "경영학과", type: "학생부종합", grade: "1.4등급" },
                  { univ: "고려대학교", dept: "법학과", type: "학생부교과", grade: "1.3등급" },
                ].map((row) => (
                  <div key={row.univ + row.dept} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{row.univ}</p>
                      <p className="text-xs text-muted-foreground">{row.dept} · {row.type}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">{row.grade}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teacher Dashboard Section */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Teacher Preview */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-4 order-2 md:order-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">박지영 선생님</p>
                  <p className="text-sm font-medium text-foreground">한빛고등학교 · 3학년 B반</p>
                </div>
                <span className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-full">코드: HB-2026-3B</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: "전체 학생", value: "28명", color: "text-foreground" },
                  { label: "상담 필요", value: "4명", color: "text-red-500" },
                  { label: "목표 미설정", value: "3명", color: "text-amber-500" },
                  { label: "학습 이행 저조", value: "5명", color: "text-orange-500" },
                ].map((s) => (
                  <div key={s.label} className="bg-secondary/60 rounded-xl p-2.5">
                    <p className={`text-sm font-semibold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">최근 상담 요청</p>
                {["이서연 - 수학 성적 고민", "박지호 - 진로 미결정"].map((req) => (
                  <div key={req} className="flex items-center gap-2 py-1.5 px-3 bg-secondary/40 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    <span className="text-xs text-foreground">{req}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
                <Users className="w-3.5 h-3.5" /> 교사 대시보드
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                학생 현황을 한눈에<br />파악하고 지원하세요
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                학급 전체 학생의 성적 추이, 학습 이행률, 상담 요청을 한 화면에서 관리하세요. 상담이 필요한 학생을 빠르게 파악하고 메모를 남겨 체계적으로 지원할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            지금 바로 시작해보세요
          </h2>
          <p className="text-muted-foreground mb-8">학생과 교사 모두를 위한 진로나침반으로 더 나은 학업 여정을 시작하세요.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate("/signup/student")} className="flex items-center justify-center gap-2 px-7 h-12 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
              학생 무료 시작 <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => navigate("/signup/teacher")} className="flex items-center justify-center gap-2 px-7 h-12 rounded-xl border border-border bg-card text-foreground font-medium hover:bg-secondary transition-colors">
              교사 계정 만들기
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white text-xs font-bold">진</span>
            </div>
            <span className="font-medium text-foreground">진로나침반</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 진로나침반. 모든 권리 보유.</p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer">이용약관</span>
            <span className="hover:text-foreground cursor-pointer">개인정보처리방침</span>
          </div>
        </div>
      </footer>
    </div>
  );
}