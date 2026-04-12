import React, { useState } from "react";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { Search, Edit2, Trash2, Plus, Save, Check } from "lucide-react";
import { STUDENTS } from "../../data/mock";

const INITIAL_MEMOS = [
  { id: 1, student: "이서연", date: "2026-04-09", subject: "수학 학습 방향",    content: "이서연 학생과 면담 결과 수학에 대한 불안감이 높은 상태. 기초 개념 복습을 권장하고 방과후 수업 참여를 유도할 것. 다음 주 다시 면담 예정.", tag: "학업 면담" },
  { id: 2, student: "박지호", date: "2026-04-07", subject: "진로 목표 미설정",  content: "박지호 학생은 아직 진로 목표가 없음. AI 진로 탐색 채팅을 권유했으나 망설이고 있음. 진로 체험 활동 참여 권장. 학부모 상담도 고려.", tag: "진로 상담" },
  { id: 3, student: "정도현", date: "2026-04-05", subject: "모의고사 대비 전략", content: "6월 모의고사 대비 전략 수립. 수학은 계산 실수 줄이기, 영어는 독해 속도 향상 집중. 주 3회 자습 권장.", tag: "학업 면담" },
  { id: 4, student: "오승우", date: "2026-04-03", subject: "학습 동기 부여",    content: "오승우 학생이 학습 의욕 저하 상태. 원인 파악 필요. 부모님께 연락 드려 가정 내 상황 확인 필요. 담당 상담 교사 연계 고려.", tag: "정서 지원" },
  { id: 5, student: "김민준", date: "2026-03-28", subject: "목표 대학 확인",    content: "서울대 컴퓨터공학부 목표 확인. 현재 성적으로 충분히 가능한 목표. 비교과 활동 강화 필요. 특히 소프트웨어 대회 참가를 권장.", tag: "진로 상담" },
];

const TAG_COLORS: Record<string, string> = {
  "학업 면담": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "진로 상담": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "정서 지원": "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  "경고 발송": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

// 트랙 뱃지 색상
const TRACK_COLORS: Record<string, string> = {
  "이공계": "text-blue-500",
  "인문계": "text-purple-500",
  "예체능": "text-rose-500",
};

export function CounselingMemo() {
  const [memos,       setMemos]       = useState(INITIAL_MEMOS);
  const [search,      setSearch]      = useState("");
  const [editId,      setEditId]      = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [showAdd,     setShowAdd]     = useState(false);
  const [newMemo,     setNewMemo]     = useState({ student: "", subject: "", content: "", tag: "학업 면담" });

  // ── 학생 검색 드롭다운 ────────────────────────────────────────────────────
  const [dropOpen, setDropOpen] = useState(false);

  // 입력값 기준 필터링 (빈 칸이면 전체 표시)
  const filteredStudents = STUDENTS.filter(s =>
    newMemo.student.trim() === "" || s.name.includes(newMemo.student.trim())
  );

  const selectStudent = (name: string) => {
    setNewMemo(prev => ({ ...prev, student: name }));
    setDropOpen(false);
  };

  // ── 메모 CRUD ─────────────────────────────────────────────────────────────
  const filtered = memos.filter(m =>
    m.student.includes(search) || m.subject.includes(search) || m.content.includes(search)
  );

  const saveEdit = () => {
    setMemos(prev => prev.map(m => m.id === editId ? { ...m, content: editContent } : m));
    setEditId(null);
  };

  const addMemo = () => {
    if (!newMemo.student || !newMemo.subject || !newMemo.content) return;
    setMemos(prev => [{
      id:   Date.now(),
      date: new Date().toISOString().split("T")[0],
      ...newMemo,
    }, ...prev]);
    setNewMemo({ student: "", subject: "", content: "", tag: "학업 면담" });
    setShowAdd(false);
  };

  return (
    <div>
      <Breadcrumb items={[{ label: "상담 관리" }, { label: "상담 메모" }]} />
      <PageTitle
        title="상담 메모"
        subtitle="학생별 상담 메모를 작성하고 관리하세요."
        action={
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 h-9 rounded-xl bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> 메모 추가
          </button>
        }
      />

      {/* 메모 목록 검색 */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          className="w-full h-10 pl-9 pr-3.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
          placeholder="학생 이름, 내용으로 검색"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* 메모 목록 */}
      <div className="space-y-3">
        {filtered.map(m => (
          <div key={m.id} className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-medium text-foreground">{m.student}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TAG_COLORS[m.tag] ?? "bg-secondary text-muted-foreground"}`}>
                    {m.tag}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">{m.date}</span>
                </div>
                <p className="text-xs font-medium text-primary mb-2">{m.subject}</p>
                {editId === m.id ? (
                  <div>
                    <textarea
                      className="w-full h-24 px-3 py-2 rounded-xl border border-border bg-input-background text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring/50 mb-2"
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button onClick={saveEdit} className="flex items-center gap-1.5 px-3 h-8 rounded-lg bg-primary text-primary-foreground text-xs hover:bg-primary/90 transition-colors">
                        <Save className="w-3 h-3" /> 저장
                      </button>
                      <button onClick={() => setEditId(null)} className="px-3 h-8 rounded-lg border border-border text-xs text-muted-foreground hover:bg-secondary transition-colors">
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-foreground leading-relaxed">{m.content}</p>
                )}
              </div>
              {editId !== m.id && (
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => { setEditId(m.id); setEditContent(m.content); }} className="w-7 h-7 rounded-lg flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setMemos(prev => prev.filter(x => x.id !== m.id))} className="w-7 h-7 rounded-lg flex items-center justify-center border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── 메모 추가 모달 ──────────────────────────────────────────────────── */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md shadow-xl">
            <h3 className="text-foreground mb-4">새 상담 메모</h3>
            <div className="space-y-3">

              {/* 학생 이름 + 태그 */}
              <div className="grid grid-cols-2 gap-3">

                {/* ── 학생 검색 필드 ──────────────────────────────────────── */}
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">학생 이름</label>

                  {/* 검색 input + 드롭다운 래퍼 */}
                  <div className="relative">
                    {/* 돋보기 아이콘 */}
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none z-10" />

                    <input
                      className="w-full h-10 pl-8 pr-3 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow"
                      placeholder="이름 검색"
                      autoComplete="off"
                      value={newMemo.student}
                      onChange={e => {
                        setNewMemo(prev => ({ ...prev, student: e.target.value }));
                        setDropOpen(true);
                      }}
                      onFocus={() => setDropOpen(true)}
                      // onMouseDown으로 선택 후 blur 처리되도록 약간의 딜레이
                      onBlur={() => setTimeout(() => setDropOpen(false), 120)}
                    />

                    {/* ── 애니메이션 드롭다운 ──────────────────────────── */}
                    {/*
                      항상 DOM에 존재 → CSS transition으로 fade+slide 애니메이션
                      열림:  opacity-100 / translate-y-0 / scale-y-100
                      닫힘:  opacity-0  / -translate-y-2 / scale-y-95
                    */}
                    <div
                      className={`
                        absolute left-0 right-0 top-[calc(100%+6px)] z-[70]
                        bg-card border border-border rounded-xl shadow-xl
                        overflow-hidden origin-top
                        transition-all duration-200 ease-out
                        ${dropOpen && filteredStudents.length > 0
                          ? "opacity-100 translate-y-0 scale-y-100 pointer-events-auto"
                          : "opacity-0 -translate-y-2 scale-y-95 pointer-events-none"}
                      `}
                    >
                      {/* 헤더 라벨 */}
                      <div className="px-3 pt-2.5 pb-1.5 border-b border-border">
                        <p className="text-xs text-muted-foreground">
                          학생 {filteredStudents.length}명
                        </p>
                      </div>

                      {/* 학생 목록 */}
                      <ul className="max-h-44 overflow-y-auto py-1">
                        {filteredStudents.map((s, idx) => {
                          const isSelected = newMemo.student === s.name;
                          return (
                            <li key={s.id}>
                              <button
                                type="button"
                                onMouseDown={() => selectStudent(s.name)}
                                className={`
                                  w-full flex items-center gap-2.5 px-3 py-2
                                  transition-colors duration-100 text-left
                                  ${isSelected
                                    ? "bg-primary/8 hover:bg-primary/12"
                                    : "hover:bg-secondary/70 active:bg-secondary"}
                                `}
                                /* 각 항목에 아주 짧은 stagger 딜레이로 자연스럽게 등장 */
                                style={{
                                  opacity:   dropOpen ? 1 : 0,
                                  transform: dropOpen ? "translateX(0)" : "translateX(-4px)",
                                  transition: `opacity 180ms ease ${idx * 18}ms, transform 180ms ease ${idx * 18}ms, background-color 100ms`,
                                }}
                              >
                                {/* 아바타 */}
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold ${
                                  isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                                }`}>
                                  {s.name[0]}
                                </div>

                                {/* 이름 + 학년/트랙 */}
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm leading-none mb-0.5 ${isSelected ? "font-medium text-foreground" : "text-foreground"}`}>
                                    {s.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {s.grade} ·{" "}
                                    <span className={TRACK_COLORS[s.track] ?? "text-muted-foreground"}>
                                      {s.track}
                                    </span>
                                  </p>
                                </div>

                                {/* 선택 체크 */}
                                <span className={`transition-all duration-150 ${isSelected ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
                                  <Check className="w-3.5 h-3.5 text-primary" />
                                </span>
                              </button>
                            </li>
                          );
                        })}

                        {/* 결과 없음 */}
                        {filteredStudents.length === 0 && (
                          <li className="px-3 py-3 text-xs text-muted-foreground text-center">
                            일치하는 학생이 없습니다
                          </li>
                        )}
                      </ul>
                    </div>
                    {/* ── 드롭다운 끝 ──────────────────────────────────── */}
                  </div>
                </div>

                {/* 태그 선택 */}
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">태그</label>
                  <select
                    className="w-full h-10 px-3 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none"
                    value={newMemo.tag}
                    onChange={e => setNewMemo(prev => ({ ...prev, tag: e.target.value }))}
                  >
                    {["학업 면담", "진로 상담", "정서 지원", "경고 발송"].map(t => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 제목 */}
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">제목</label>
                <input
                  className="w-full h-10 px-3 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none"
                  value={newMemo.subject}
                  onChange={e => setNewMemo(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="상담 주제"
                />
              </div>

              {/* 내용 */}
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">내용</label>
                <textarea
                  className="w-full h-24 px-3 py-2 rounded-xl border border-border bg-input-background text-foreground text-sm resize-none focus:outline-none"
                  value={newMemo.content}
                  onChange={e => setNewMemo(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="상담 내용을 입력하세요"
                />
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => { setShowAdd(false); setDropOpen(false); }}
                className="flex-1 h-10 rounded-xl border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors"
              >
                취소
              </button>
              <button
                onClick={addMemo}
                className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}