import React, { useEffect, useMemo, useState } from "react";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { MessageSquare, Send, User, Info } from "lucide-react";
import { appGet, appPost } from "../../utils/appApi";

type CounselingMemo = {
  id: string;
  teacher: string;
  date: string;
  subject: string;
  content: string;
  tag?: string | null;
  shared: boolean;
};

type CounselingRequest = {
  id: string;
  student?: string;
  type: string;
  message: string;
  date: string;
  status: "pending" | "in_progress" | "completed" | "canceled" | "rejected";
};

type MeResponse = {
  studentProfile: {
    isConnectedToTeacher: boolean;
  } | null;
};

const REQUEST_TYPES = ["학업 고민", "진로 고민", "정서적 지원", "기타"] as const;

const STATUS_LABELS: Record<CounselingRequest["status"], string> = {
  pending: "대기중",
  in_progress: "진행중",
  completed: "완료",
  canceled: "취소",
  rejected: "거절됨"
};

export function StudentCounseling() {
  const [message, setMessage] = useState("");
  const [reqType, setReqType] = useState<(typeof REQUEST_TYPES)[number]>("학업 고민");
  const [sent, setSent] = useState(false);
  const [memos, setMemos] = useState<CounselingMemo[]>([]);
  const [requests, setRequests] = useState<CounselingRequest[]>([]);
  const [isConnectedToTeacher, setIsConnectedToTeacher] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchCounseling = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [memoResponse, requestResponse, meResponse] = await Promise.all([
          appGet<CounselingMemo[]>("/v1/counseling/memos"),
          appGet<CounselingRequest[]>("/v1/counseling/requests"),
          appGet<MeResponse>("/v1/me")
        ]);

        if (!active) {
          return;
        }

        setMemos(memoResponse);
        setRequests(requestResponse);
        setIsConnectedToTeacher(meResponse.studentProfile?.isConnectedToTeacher ?? false);
      } catch (requestError) {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "상담 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void fetchCounseling();

    return () => {
      active = false;
    };
  }, []);

  const sortedRequests = useMemo(
    () => [...requests].sort((left, right) => right.date.localeCompare(left.date)),
    [requests]
  );

  const handleSend = async () => {
    if (!message.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const created = await appPost<CounselingRequest>("/v1/counseling/requests", {
        type: reqType,
        message: message.trim()
      });

      setRequests((prev) => [created, ...prev]);
      setSent(true);
      setMessage("");
      window.setTimeout(() => setSent(false), 3000);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "상담 요청을 보내지 못했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: "상담" }, { label: "상담 페이지" }]} />
      <PageTitle title="상담 페이지" subtitle="선생님과의 상담 이력을 확인하고 상담을 요청하세요." />

      {error && <p className="text-xs text-destructive mb-4">{error}</p>}

      {!isLoading && isConnectedToTeacher === false && (
        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 mb-5">
          <Info className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-400">
            담임 선생님과 아직 연결되지 않았습니다. 선생님의 초대 코드를 입력하면 상담 요청을 보낼 수 있습니다.
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-foreground">선생님 메모</h3>
            <p className="text-xs text-muted-foreground mt-0.5">담임 선생님이 남긴 메모를 확인하세요.</p>
          </div>
          <div className="divide-y divide-border">
            {isLoading ? (
              <div className="p-5 text-sm text-muted-foreground">메모를 불러오고 있습니다.</div>
            ) : memos.length === 0 ? (
              <div className="p-5 text-sm text-muted-foreground">공유된 상담 메모가 없습니다.</div>
            ) : (
              memos.map((memo) => (
                <div key={memo.id} className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{memo.teacher} 선생님</p>
                      <p className="text-xs text-muted-foreground">{memo.date}</p>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-primary mb-1.5">{memo.subject}</p>
                  <p className="text-sm text-foreground leading-relaxed">{memo.content}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-foreground mb-3">상담 요청 보내기</h3>
            {sent && (
              <div className="mb-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700 text-sm text-emerald-700 dark:text-emerald-400">
                상담 요청이 선생님께 전달되었습니다.
              </div>
            )}
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">상담 유형</label>
                <div className="flex flex-wrap gap-2">
                  {REQUEST_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setReqType(type)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                        reqType === type
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">내용</label>
                <textarea
                  className="w-full h-28 px-3.5 py-3 rounded-xl border border-border bg-input-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/50 placeholder:text-muted-foreground/60"
                  placeholder="선생님께 전달할 내용을 자유롭게 적어주세요. 걱정하지 마세요. 편하게 이야기해도 괜찮아요."
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                />
              </div>
              <button
                onClick={() => void handleSend()}
                disabled={!message.trim() || isSubmitting || isConnectedToTeacher === false}
                className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                상담 요청 보내기
              </button>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-foreground mb-3">이전 상담 요청</h3>
            <div className="space-y-2.5">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">상담 요청을 불러오고 있습니다.</p>
              ) : sortedRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground">이전 상담 요청이 없습니다.</p>
              ) : (
                sortedRequests.map((request) => (
                  <div key={request.id} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/40">
                    <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-medium text-foreground">{request.type}</span>
                        <span className="text-xs text-muted-foreground">{request.date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{request.message}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                        request.status === "completed"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : request.status === "in_progress"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : request.status === "canceled"
                              ? "bg-slate-100 text-slate-600 dark:bg-slate-700/30 dark:text-slate-400"
                              : request.status === "rejected"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}
                    >
                      {STATUS_LABELS[request.status]}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
