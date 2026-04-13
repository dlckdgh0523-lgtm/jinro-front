import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { User, Edit2, Save, GraduationCap, Link, Link2Off, Trash2, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { appGet, appPatch, appPost } from "../../utils/appApi";
import { clearAuthSession } from "../../utils/authApi";

type InquiryItem = {
  id: string;
  subject: string;
  content: string;
  status: "open" | "in_review" | "answered" | "closed";
  adminReply: string | null;
  repliedAt: string | null;
  createdAt: string;
};

const INQUIRY_STATUS_LABELS: Record<InquiryItem["status"], string> = {
  open: "접수됨",
  in_review: "검토 중",
  answered: "답변 완료",
  closed: "종료"
};

type MeResponse = {
  id: string;
  email: string;
  role: string;
  studentProfile: {
    id: string;
    name: string;
    schoolName: string;
    grade: string | null;
    track: string | null;
    onboardingCompleted: boolean;
    isConnectedToTeacher: boolean;
    goal: {
      university: string;
      department: string;
      targetGrade: number | null;
      targetScore: number | null;
    } | null;
  } | null;
};

export function MyPage() {
  const navigate = useNavigate();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(false);
  const [editEmail, setEditEmail] = useState("");
  const [editSchool, setEditSchool] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [inquirySubject, setInquirySubject] = useState("");
  const [inquiryContent, setInquiryContent] = useState("");
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState("");
  const [expandedInquiryId, setExpandedInquiryId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchMe = async () => {
      setIsLoading(true);
      setError("");
      try {
        const [response, inquiryList] = await Promise.all([
          appGet<MeResponse>("/v1/me"),
          appGet<InquiryItem[]>("/v1/inquiries")
        ]);
        if (active) {
          setMe(response);
          setEditEmail(response.email);
          setEditSchool(response.studentProfile?.schoolName ?? "");
          setInquiries(inquiryList);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "프로필 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void fetchMe();
    return () => { active = false; };
  }, []);

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveError("");
    try {
      await appPatch("/v1/me", {
        email: editEmail !== me?.email ? editEmail : undefined,
        schoolName: editSchool !== me?.studentProfile?.schoolName ? editSchool : undefined,
      });
      setMe((prev) =>
        prev
          ? {
              ...prev,
              email: editEmail,
              studentProfile: prev.studentProfile
                ? { ...prev.studentProfile, schoolName: editSchool }
                : null,
            }
          : prev
      );
      setEditing(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await appPatch("/v1/me/deactivate");
      clearAuthSession();
      navigate("/login/student");
    } catch (err) {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setError(err instanceof Error ? err.message : "회원탈퇴에 실패했습니다.");
    }
  };

  const handleSubmitInquiry = async () => {
    if (!inquirySubject.trim() || !inquiryContent.trim() || isSubmittingInquiry) return;
    setIsSubmittingInquiry(true);
    setInquiryError("");
    try {
      const created = await appPost<InquiryItem>("/v1/inquiries", {
        subject: inquirySubject.trim(),
        content: inquiryContent.trim()
      });
      setInquiries((prev) => [created, ...prev]);
      setInquirySubject("");
      setInquiryContent("");
      setInquirySuccess(true);
      window.setTimeout(() => setInquirySuccess(false), 3000);
    } catch (err) {
      setInquiryError(err instanceof Error ? err.message : "문의 전송에 실패했습니다.");
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  const inputClass =
    "w-full h-11 px-3.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-60";

  if (isLoading) {
    return (
      <div>
        <Breadcrumb items={[{ label: "계정" }, { label: "마이페이지" }]} />
        <PageTitle title="마이페이지" subtitle="기본 정보와 계정 설정을 관리하세요." />
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <p className="text-sm text-muted-foreground">정보를 불러오고 있습니다...</p>
        </div>
      </div>
    );
  }

  const profile = me?.studentProfile;
  const name = profile?.name ?? "-";
  const school = profile?.schoolName ?? "-";
  const grade = profile?.grade ?? "-";
  const track = profile?.track ?? "-";
  const email = me?.email ?? "-";

  return (
    <div>
      <Breadcrumb items={[{ label: "계정" }, { label: "마이페이지" }]} />
      <PageTitle title="마이페이지" subtitle="기본 정보와 계정 설정을 관리하세요." />

      {error && <p className="text-xs text-destructive mb-4">{error}</p>}

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Profile card */}
        <div className="bg-card rounded-xl border border-border p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mb-3">
            <User className="w-8 h-8 text-primary" />
          </div>
          <p className="font-medium text-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">{school} · {grade}</p>
          <p className="text-xs text-muted-foreground mt-1">{email}</p>
          {track && track !== "-" && (
            <span className="mt-3 text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
              {track}
            </span>
          )}
          <div className="mt-3 flex items-center gap-1.5 text-xs">
            {profile?.isConnectedToTeacher ? (
              <>
                <Link className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">담임 선생님 연결됨</span>
              </>
            ) : (
              <>
                <Link2Off className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">선생님 미연결</span>
              </>
            )}
          </div>
        </div>

        {/* Edit info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-foreground">기본 정보</h3>
              {editing ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditing(false); setEditEmail(me?.email ?? ""); setEditSchool(profile?.schoolName ?? ""); setSaveError(""); }}
                    className="flex items-center gap-1.5 px-3 h-8 rounded-lg border border-border text-xs text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => void handleSave()}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 px-3 h-8 rounded-lg bg-primary text-primary-foreground text-xs hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    <Save className="w-3.5 h-3.5" /> {isSaving ? "저장 중..." : "저장"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 px-3 h-8 rounded-lg border border-border text-xs text-muted-foreground hover:bg-secondary transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> 수정
                </button>
              )}
            </div>
            {saveError && <p className="text-xs text-destructive mb-3">{saveError}</p>}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">이름</label>
                <input className={inputClass} value={name} disabled />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">이메일</label>
                <input
                  className={inputClass}
                  value={editing ? editEmail : email}
                  disabled={!editing}
                  onChange={(e) => setEditEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">학교</label>
                <input
                  className={inputClass}
                  value={editing ? editSchool : school}
                  disabled={!editing}
                  onChange={(e) => setEditSchool(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">학년</label>
                <input className={inputClass} value={grade} disabled />
              </div>
            </div>
          </div>

          {/* Goal summary */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-foreground mb-4">목표 현황</h3>
            {profile?.goal ? (
              <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-xl border border-border">
                <GraduationCap className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {profile.goal.university} {profile.goal.department}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    목표 내신 {profile.goal.targetGrade ?? "-"}등급 · 목표 수능 {profile.goal.targetScore ?? "-"}점
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">목표 대학/학과가 설정되지 않았습니다.</p>
            )}
          </div>

          {/* Account actions */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-foreground mb-3">계정 관리</h3>
            {showDeleteConfirm ? (
              <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4">
                <p className="text-sm text-foreground mb-1 font-medium">정말 탈퇴하시겠습니까?</p>
                <p className="text-xs text-muted-foreground mb-4">
                  탈퇴 시 계정이 비활성화되며 모든 데이터 접근이 중단됩니다. 이 작업은 되돌릴 수 없습니다.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 h-9 rounded-xl border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => void handleDelete()}
                    disabled={isDeleting}
                    className="flex-1 h-9 rounded-xl bg-destructive text-destructive-foreground text-sm hover:bg-destructive/90 transition-colors disabled:opacity-60"
                  >
                    {isDeleting ? "처리 중..." : "탈퇴 확인"}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 text-sm text-destructive hover:underline"
              >
                <Trash2 className="w-4 h-4" />
                회원 탈퇴
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Inquiry section */}
      <div className="mt-5 bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-4 h-4 text-primary" />
          <h3 className="text-foreground">문의 / 건의사항</h3>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <div>
            <p className="text-xs text-muted-foreground mb-3">
              서비스 이용 중 불편한 점이나 건의사항을 남겨주세요.
            </p>
            {inquirySuccess && (
              <div className="mb-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700 text-xs text-emerald-700 dark:text-emerald-400">
                문의가 접수되었습니다. 검토 후 답변 드리겠습니다.
              </div>
            )}
            {inquiryError && <p className="text-xs text-destructive mb-2">{inquiryError}</p>}
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">제목</label>
                <input
                  className={inputClass}
                  placeholder="문의 제목을 입력하세요"
                  value={inquirySubject}
                  onChange={(e) => setInquirySubject(e.target.value)}
                  maxLength={200}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">내용</label>
                <textarea
                  className="w-full h-28 px-3.5 py-3 rounded-xl border border-border bg-input-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/50 placeholder:text-muted-foreground/60"
                  placeholder="문의 내용을 자세히 적어주세요."
                  value={inquiryContent}
                  onChange={(e) => setInquiryContent(e.target.value)}
                  maxLength={2000}
                />
              </div>
              <button
                onClick={() => void handleSubmitInquiry()}
                disabled={!inquirySubject.trim() || !inquiryContent.trim() || isSubmittingInquiry}
                className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSubmittingInquiry ? "전송 중..." : "문의 보내기"}
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-3">이전 문의 내역</p>
            {inquiries.length === 0 ? (
              <p className="text-sm text-muted-foreground">접수된 문의가 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {inquiries.map((item) => (
                  <div key={item.id} className="rounded-xl border border-border overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 bg-secondary/30 hover:bg-secondary/50 transition-colors text-left"
                      onClick={() => setExpandedInquiryId(expandedInquiryId === item.id ? null : item.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{item.subject}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(item.createdAt).toLocaleDateString("ko-KR")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          item.status === "answered"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : item.status === "in_review"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              : item.status === "closed"
                                ? "bg-slate-100 text-slate-600 dark:bg-slate-700/30 dark:text-slate-400"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}>
                          {INQUIRY_STATUS_LABELS[item.status]}
                        </span>
                        {expandedInquiryId === item.id
                          ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                          : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                        }
                      </div>
                    </button>
                    {expandedInquiryId === item.id && (
                      <div className="px-4 py-3 border-t border-border space-y-2">
                        <p className="text-xs text-foreground whitespace-pre-wrap">{item.content}</p>
                        {item.adminReply && (
                          <div className="mt-2 p-3 bg-primary/5 rounded-xl border border-primary/20">
                            <p className="text-xs text-primary font-medium mb-1">답변</p>
                            <p className="text-xs text-foreground whitespace-pre-wrap">{item.adminReply}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
