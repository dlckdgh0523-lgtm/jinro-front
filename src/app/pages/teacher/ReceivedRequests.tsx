import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Breadcrumb, PageTitle, StatCard } from "../../components/AppShell";
import { StatusBadge } from "../../components/StatusBadge";
import { COUNSELING_REQUESTS } from "../../data/mock";
import { MessageSquare, CheckCircle, Clock, XCircle, ArrowRight } from "lucide-react";

const statusLabel: Record<string, string> = {
  pending: "대기중",
  in_progress: "진행중",
  completed: "완료",
};

const statusIcon: Record<string, JSX.Element> = {
  pending: <Clock className="w-3.5 h-3.5 text-amber-500" />,
  in_progress: <MessageSquare className="w-3.5 h-3.5 text-blue-500" />,
  completed: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />,
};

export function ReceivedRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState(COUNSELING_REQUESTS);
  const [filter, setFilter] = useState<"all" | "pending" | "in_progress" | "completed">("all");

  const updateStatus = (id: number, status: string) => {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
  };

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);
  const pending = requests.filter((r) => r.status === "pending").length;
  const inProgress = requests.filter((r) => r.status === "in_progress").length;
  const completed = requests.filter((r) => r.status === "completed").length;

  return (
    <div>
      <Breadcrumb items={[{ label: "상담 관리" }, { label: "받은 상담 요청" }]} />
      <PageTitle title="받은 상담 요청" subtitle="학생들이 보낸 상담 요청을 확인하고 처리하세요." />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <StatCard label="전체 요청" value={`${requests.length}건`} icon={<MessageSquare className="w-4 h-4" />} color="default" />
        <StatCard label="대기중" value={`${pending}건`} icon={<Clock className="w-4 h-4" />} color="warning" />
        <StatCard label="완료" value={`${completed}건`} icon={<CheckCircle className="w-4 h-4" />} color="success" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-muted/50 rounded-xl p-1 w-fit mb-5">
        {(["all", "pending", "in_progress", "completed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 h-8 rounded-lg text-sm transition-colors ${
              filter === tab ? "bg-card text-foreground shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "all" ? "전체" : statusLabel[tab]}
          </button>
        ))}
      </div>

      {/* Request cards */}
      <div className="space-y-3">
        {filtered.map((req) => (
          <div key={req.id} className={`bg-card rounded-xl border p-5 ${
            req.status === "pending" ? "border-amber-200 dark:border-amber-700" : "border-border"
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <p className="text-sm font-medium text-foreground">{req.student}</p>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground border border-border">{req.type}</span>
                  <div className="flex items-center gap-1 ml-auto">
                    {statusIcon[req.status]}
                    <StatusBadge variant={req.status as any} label={statusLabel[req.status]} size="sm" />
                  </div>
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-2">{req.message}</p>
                <p className="text-xs text-muted-foreground">{req.date}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-3 pt-3 border-t border-border">
              {req.status === "pending" && (
                <>
                  <button
                    onClick={() => updateStatus(req.id, "in_progress")}
                    className="flex items-center gap-1.5 px-3 h-8 rounded-xl bg-primary text-primary-foreground text-xs hover:bg-primary/90 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> 상담 시작
                  </button>
                  <button
                    onClick={() => navigate("/teacher/counseling/support")}
                    className="flex items-center gap-1.5 px-3 h-8 rounded-xl border border-border text-xs text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    상담 지원 보기
                  </button>
                </>
              )}
              {req.status === "in_progress" && (
                <>
                  <button
                    onClick={() => updateStatus(req.id, "completed")}
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
              {req.status === "completed" && (
                <button
                  onClick={() => navigate("/teacher/counseling/memo")}
                  className="flex items-center gap-1.5 px-3 h-8 rounded-xl border border-border text-xs text-muted-foreground hover:bg-secondary transition-colors"
                >
                  상담 메모 확인 <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <MessageSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">해당 상태의 상담 요청이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
