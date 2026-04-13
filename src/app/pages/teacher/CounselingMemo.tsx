import React, { useEffect, useState } from "react";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { Search, Edit2, Trash2, Plus, Save, Check } from "lucide-react";
import { appGet, appPost, appPatch, appDelete } from "../../utils/appApi";

type Memo = {
  id: string;
  student: string;
  teacher: string;
  date: string;
  subject: string;
  content: string;
  tag: string;
  shared: boolean;
};

type StudentCard = {
  id: string;
  name: string;
  grade: string;
  track: string;
};

const TAG_COLORS: Record<string, string> = {
  "학업 면담": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "진로 상담": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "정서 지원": "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  "경고 발송": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const TRACK_COLORS: Record<string, string> = {
  "이공계": "text-blue-500",
  "인문계": "text-purple-500",
  "예체능": "text-rose-500",
};

export function CounselingMemo() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [students, setStudents] = useState<StudentCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // 편집 상태
  const [editId, setEditId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // 새 메모 추가
  const [showAdd, setShowAdd] = useState(false);
  const [newMemo, setNewMemo] = useState({ studentId: "", student: "", subject: "", content: "", tag: "학업 면담" });
  const [shareWithStudent, setShareWithStudent] = useState(false);
  const [isAddSaving, setIsAddSaving] = useState(false);
  const [addError, setAddError] = useState("");

  // 학생 드롭다운
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const fetch = async () => {
      setIsLoading(true);
      setError("");
      try {
        const [memoList, studentList] = await Promise.all([
          appGet<Memo[]>("/v1/counseling/memos"),
          appGet<StudentCard[]>("/v1/students")
        ]);
        if (active) {
          setMemos(memoList);
          setStudents(studentList);
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "데이터를 불러오지 못했습니다.");
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void fetch();
    return () => { active = false; };
  }, []);

  const filteredMemos = memos.filter(
    (m) =>
      m.student.includes(search) ||
      m.subject.includes(search) ||
      m.content.includes(search)
  );

  const filteredStudents = students.filter(
    (s) => newMemo.student.trim() === "" || s.name.includes(newMemo.student.trim())
  );

  const selectStudent = (s: StudentCard) => {
    setNewMemo((prev) => ({ ...prev, studentId: s.id, student: s.name }));
    setDropOpen(false);
  };

  const saveEdit = async () => {
    if (!editId || isSavingEdit) return;
    setIsSavingEdit(true);
    try {
      await appPatch(`/v1/counseling/memos/${editId}`, { content: editContent });
      setMemos((prev) =>
        prev.map((m) => (m.id === editId ? { ...m, content: editContent } : m))
      );
      setEditId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const deleteMemo = async (id: string) => {
    try {
      await appDelete(`/v1/counseling/memos/${id}`);
      setMemos((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "삭제에 실패했습니다.");
    }
  };

  const addMemo = async () => {
    if (!newMemo.studentId || !newMemo.subject || !newMemo.content) return;
    setIsAddSaving(true);
    setAddError("");
    try {
      const created = await appPost<{ id: string; subject: string; content: string; tag: string }>(
        "/v1/counseling/memos",
        {
          studentId: newMemo.studentId,
          subject: newMemo.subject,
          content: newMemo.content,
          tag: newMemo.tag,
          shareWithStudent
        }
      );
      const today = new Date().toISOString().slice(0, 10);
      setMemos((prev) => [
        {
          id: created.id,
          student: newMemo.student,
          teacher: "",
          date: today,
          subject: created.subject,
          content: created.content,
          tag: created.tag,
          shared: shareWithStudent
        },
        ...prev
      ]);
      setNewMemo({ studentId: "", student: "", subject: "", content: "", tag: "학업 면담" });
      setShareWithStudent(false);
      setShowAdd(false);
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "메모 저장에 실패했습니다.");
    } finally {
      setIsAddSaving(false);
    }
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

      {error && <p className="text-xs text-destructive mb-4">{error}</p>}

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          className="w-full h-10 pl-9 pr-3.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
          placeholder="학생 이름, 내용으로 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center text-sm text-muted-foreground">
          메모를 불러오고 있습니다.
        </div>
      ) : filteredMemos.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center text-sm text-muted-foreground">
          {memos.length === 0 ? "작성된 상담 메모가 없습니다." : "검색 결과가 없습니다."}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMemos.map((m) => (
            <div key={m.id} className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm font-medium text-foreground">{m.student}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        TAG_COLORS[m.tag] ?? "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {m.tag}
                    </span>
                    {m.shared && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium">
                        공개
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">{m.date}</span>
                  </div>
                  <p className="text-xs font-medium text-primary mb-2">{m.subject}</p>
                  {editId === m.id ? (
                    <div>
                      <textarea
                        className="w-full h-24 px-3 py-2 rounded-xl border border-border bg-input-background text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring/50 mb-2"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => void saveEdit()}
                          disabled={isSavingEdit}
                          className="flex items-center gap-1.5 px-3 h-8 rounded-lg bg-primary text-primary-foreground text-xs hover:bg-primary/90 transition-colors disabled:opacity-60"
                        >
                          <Save className="w-3 h-3" /> {isSavingEdit ? "저장 중..." : "저장"}
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="px-3 h-8 rounded-lg border border-border text-xs text-muted-foreground hover:bg-secondary transition-colors"
                        >
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
                    <button
                      onClick={() => { setEditId(m.id); setEditContent(m.content); }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => void deleteMemo(m.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 메모 추가 모달 */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md shadow-xl">
            <h3 className="text-foreground mb-4">새 상담 메모</h3>
            {addError && <p className="text-xs text-destructive mb-3">{addError}</p>}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {/* 학생 검색 드롭다운 */}
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">학생 이름</label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none z-10" />
                    <input
                      className="w-full h-10 pl-8 pr-3 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
                      placeholder="이름 검색"
                      autoComplete="off"
                      value={newMemo.student}
                      onChange={(e) => {
                        setNewMemo((prev) => ({ ...prev, student: e.target.value, studentId: "" }));
                        setDropOpen(true);
                      }}
                      onFocus={() => setDropOpen(true)}
                      onBlur={() => window.setTimeout(() => setDropOpen(false), 120)}
                    />
                    <div
                      className={`absolute left-0 right-0 top-[calc(100%+6px)] z-[70] bg-card border border-border rounded-xl shadow-xl overflow-hidden origin-top transition-all duration-200 ease-out ${
                        dropOpen && filteredStudents.length > 0
                          ? "opacity-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 -translate-y-2 pointer-events-none"
                      }`}
                    >
                      <div className="px-3 pt-2.5 pb-1.5 border-b border-border">
                        <p className="text-xs text-muted-foreground">학생 {filteredStudents.length}명</p>
                      </div>
                      <ul className="max-h-44 overflow-y-auto py-1">
                        {filteredStudents.map((s) => {
                          const isSelected = newMemo.studentId === s.id;
                          return (
                            <li key={s.id}>
                              <button
                                type="button"
                                onMouseDown={() => selectStudent(s)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 transition-colors text-left ${
                                  isSelected ? "bg-primary/10" : "hover:bg-secondary/70"
                                }`}
                              >
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold ${
                                    isSelected
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-secondary text-muted-foreground"
                                  }`}
                                >
                                  {s.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-foreground">{s.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {s.grade} ·{" "}
                                    <span className={TRACK_COLORS[s.track] ?? "text-muted-foreground"}>
                                      {s.track}
                                    </span>
                                  </p>
                                </div>
                                {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                              </button>
                            </li>
                          );
                        })}
                        {students.length === 0 && (
                          <li className="px-3 py-3 text-xs text-muted-foreground text-center">
                            연결된 학생이 없습니다
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 태그 */}
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">태그</label>
                  <select
                    className="w-full h-10 px-3 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none"
                    value={newMemo.tag}
                    onChange={(e) => setNewMemo((prev) => ({ ...prev, tag: e.target.value }))}
                  >
                    {["학업 면담", "진로 상담", "정서 지원", "경고 발송"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">제목</label>
                <input
                  className="w-full h-10 px-3 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none"
                  value={newMemo.subject}
                  onChange={(e) => setNewMemo((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder="상담 주제"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">내용</label>
                <textarea
                  className="w-full h-24 px-3 py-2 rounded-xl border border-border bg-input-background text-foreground text-sm resize-none focus:outline-none"
                  value={newMemo.content}
                  onChange={(e) => setNewMemo((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="상담 내용을 입력하세요"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={shareWithStudent}
                  onChange={(e) => setShareWithStudent(e.target.checked)}
                  className="rounded"
                />
                학생에게 공개
              </label>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => { setShowAdd(false); setDropOpen(false); setAddError(""); setShareWithStudent(false); setNewMemo({ studentId: "", student: "", subject: "", content: "", tag: "학업 면담" }); }}
                className="flex-1 h-10 rounded-xl border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => void addMemo()}
                disabled={!newMemo.studentId || !newMemo.subject || !newMemo.content || isAddSaving}
                className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isAddSaving ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
