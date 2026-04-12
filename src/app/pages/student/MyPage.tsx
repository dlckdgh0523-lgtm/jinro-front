import React, { useState } from "react";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { User, Edit2, Save, GraduationCap, BookOpen } from "lucide-react";

export function MyPage() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("김민준");
  const [school, setSchool] = useState("한빛고등학교");
  const [grade, setGrade] = useState("2학년");
  const [track, setTrack] = useState("이공계열");
  const [email, setEmail] = useState("minjoone@student.ac.kr");

  const inputClass = "w-full h-11 px-3.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-60";

  return (
    <div>
      <Breadcrumb items={[{ label: "계정" }, { label: "마이페이지" }]} />
      <PageTitle title="마이페이지" subtitle="기본 정보와 계정 설정을 관리하세요." />

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Profile card */}
        <div className="bg-card rounded-xl border border-border p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mb-3">
            <User className="w-8 h-8 text-primary" />
          </div>
          <p className="font-medium text-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">{school} · {grade}</p>
          <p className="text-xs text-muted-foreground mt-1">{email}</p>
          <span className="mt-3 text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">{track}</span>
        </div>

        {/* Edit info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-foreground">기본 정보</h3>
              <button
                onClick={() => setEditing(!editing)}
                className="flex items-center gap-1.5 px-3 h-8 rounded-lg border border-border text-xs text-muted-foreground hover:bg-secondary transition-colors"
              >
                {editing ? <><Save className="w-3.5 h-3.5" /> 저장</> : <><Edit2 className="w-3.5 h-3.5" /> 수정</>}
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "이름", value: name, setter: setName },
                { label: "이메일", value: email, setter: setEmail },
                { label: "학교", value: school, setter: setSchool },
                { label: "학년", value: grade, setter: setGrade },
              ].map(({ label, value, setter }) => (
                <div key={label}>
                  <label className="text-xs text-muted-foreground block mb-1.5">{label}</label>
                  <input
                    className={inputClass}
                    value={value}
                    disabled={!editing}
                    onChange={(e) => setter(e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Goal summary */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-foreground mb-4">목표 현황</h3>
            <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-xl border border-border mb-3">
              <GraduationCap className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">서울대학교 컴퓨터공학부</p>
                <p className="text-xs text-muted-foreground">목표 내신 1.5등급 · 목표 수능 310점</p>
              </div>
              <span className="ml-auto text-xs text-primary font-medium">75% 달성</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-xl border border-border">
              <BookOpen className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">수능 준비 과목</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {["국어", "수학", "영어", "한국사", "물리학Ⅰ", "화학Ⅰ"].map((s) => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Account settings */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-foreground mb-3">계정 설정</h3>
            <div className="space-y-2.5">
              {[
                { label: "알림 수신 설정", desc: "성적 변화, 상담 메모 알림", enabled: true },
                { label: "AI 진로 탐색 허용", desc: "AI가 진로 데이터를 분석합니다", enabled: true },
                { label: "데이터 공유 (교사)", desc: "담임교사에게 학습 현황 공유", enabled: true },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm text-foreground">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                  <div className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-colors cursor-pointer ${s.enabled ? "bg-primary" : "bg-muted"}`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${s.enabled ? "translate-x-4" : "translate-x-0"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
