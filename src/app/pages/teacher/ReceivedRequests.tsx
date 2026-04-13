import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Breadcrumb, PageTitle, StatCard } from "../../components/AppShell";
import { StatusBadge } from "../../components/StatusBadge";
import { MessageSquare, CheckCircle, Clock, ArrowRight, XCircle } from "lucide-react";
import { appGet, appPatch } from "../../utils/appApi";

type CounselingRequest = {
  id: string;
  student: string;
  type: string;
  message: string;
  date: string;
  status: "pending" | "in_progress" | "completed" | "canceled" | "rejected";
};

const statusLabel: Record<CounselingRequest["status"], string> = {
  pending: "대기중",
  in_progress: "진행중",
  completed: "완료",
  canceled: "취소",
  rejected: "거절됨"
};

const statusIcon: Record<CounselingRequest["status"], JSX.Element> = {
  pending: <Clock className="w-3.5 h-3.5 text-amber-500" />,
  in_progress: <MessageSquare className="w-3.5 h-3.5 text-blue-500" />,
  completed: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />,
  canceled: <Clock className="w-3.5 h-3.5 text-slate-500" />,
  rejected: <XCircle className="w-3.5 h-3.5 text-red-500" />
};

export function ReceivedRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<CounselingRequest[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "in_progress" | "completed">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchRequests = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await appGet<CounselingRequest[]>("/v1/counseling/requests");

        if (active) {
          setRequests(response);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "상담 요청을 불러오지 못했습니다.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void fetchRequests();

    return () => {
      active = false;
    };
  }, []);

  const updateStatus = async (id: string, status: "in_progress" | "completed" | "rejected") => {
    try {
      const updated = await appPatch<{ id: string; status: CounselingRequest["status"] }>(
        `/v1/counseling/requests/${id}/status`,
        { status }
      );

      setRequests((prev) =>
        prev.map((request) =>
          request.id === id
            ? {
                ...request,
                status: updated.status
              }
            : request
        )
      );
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "상담 요청 상태를 변경하지 못했습니다.");
    }
  };

  const filtered = useMemo(
    () => (filter === "all" ? requests : requests.filter((request) => request.status === filter)),
    [filter, requests]
  );

  const pending = requests.filter((request) => request.status === "pending").length;
  const completed = requests.filter((request) => request.status === "completed").length;

  return (
    <div>
      <Breadcrumb items={[{ label: "상담 관리" }, { label: "받은 상담 요청" }]} />
      <PageTitle title="받은 상담 요청" subtitle="학생들이 보낸 상담 요청을 확인하고 처리하세요." />

      {error && <p className="text-xs text-destructive mb-4">{error}</p>}

      <div className="grid grid-cols-3 gap-4 mb-5">
        <StatCard label="전체 요청" value={`${requests.length}건`} icon={<MessageSquare className="w-4 h-4" />} color="default" />
        <StatCard label="대기중" value={`${pending}건`} icon={<Clock className="w-4 h-4" />} color="warning" />
        <StatCard label="완료" value={`${completed}건`} icon={<CheckCircle className="w-4 h-4" />} color="success" />
      </div>

      <div className="flex gap-1 bg-muted/50 rounded-xl p-1 w-fit mb-5">
        {(["all", "pending", "in_progress", "completed", "rejected"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 h-8 rounded-lg text-sm transition-colors ${
              filter === tab
                ? "bg-card text-foreground shadow-sm font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "all" ? "전체" : statusLabel[tab as CounselingRequest["status"]]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <MessageSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">상담 요청을 불러오고 있습니다.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <MessageSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">해당 상태의 상담 요청이 없습니다.</p>
          </div>
        ) : (
          filtered.map((request) => (
            <div
              key={request.id}
              className={`bg-card rounded-xl border p-5 ${
                request.status === "pending" ? "border-amber-200 dark:border-amber-700" : "border-border"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <p className="text-sm font-medium text-foreground">{request.student}</p>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground border border-border">
                      {request.type}
                    </span>
                    <div className="flex items-center gap-1 ml-auto">
                      {statusIcon[request.status]}
                      <StatusBadge variant={request.status === "canceled" ? "warning" : request.status} label={statusLabel[request.status]} size="sm" />
                    </div>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed mb-2">{request.message}</p>
                  <p className="text-xs text-muted-foreground">{request.date}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                {request.status === "pending" && (
                  <>
                    <button
                      onClick={() => void updateStatus(request.id, "in_progress")}
                      className="flex items-center gap-1.5 px-3 h-8 rounded-xl bg-primary text-primary-foreground text-xs hover:bg-primary/90 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> 상담 시작
                    </button>
                    <button
                      onClick={() => void updateStatus(request.id, "rejected")}
                      className="flex items-center gap-1.5 px-3 h-8 rounded-xl border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" /> 거절
                    </button>
                    <button
                      onClick={() => navigate("/teacher/counseling/support")}
                      className="flex items-center gap-1.5 px-3 h-8 rounded-xl border border-border text-xs text-muted-foreground hover:bg-secondary transition-colors"
                    >
                      상담 지원 보기
                    </button>
                  </>
                )}
                {request.status === "in_progress" && (
                  <>
                    <button
                      onClick={() => void updateStatus(request.id, "completed")}
                      className="flex items-center gap-1.5 px-3 h-8 rounded-xl bg-emerald-600 text-white text-xs hover:bg-emerald-700 transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> 완료 처리
                    </button>
                    <button
                      onClick={() => navigate("/teacher/counseling/memo")}
                      className="flex items-center gap-1.5 px-3 h-8 rounded-xl border border-border text-xs text-muted-foreground hover:bg-secondary transition-colors"
                    >
                      메모 작성 <ArrowRight className="w-3 h-3" />
                    </button>
                  </>
                )}
                {request.status === "completed" && (
                  <button
                    onClick={() => navigate("/teacher/counseling/memo")}
                    className="flex items-center gap-1.5 px-3 h-8 rounded-xl border border-border text-xs text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    상담 메모 확인 <ArrowRight className="w-3 h-3" />
                  </button>
                )}
                {request.status === "rejected" && (
                  <span className="flex items-center gap-1.5 px-3 h-8 text-xs text-red-500 dark:text-red-400">
                    <XCircle className="w-3.5 h-3.5" /> 거절 처리됨
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
