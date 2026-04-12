import React from "react";
import { useNavigate } from "react-router";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { ChartCard } from "../../components/ChartCard";
import { StatusBadge } from "../../components/StatusBadge";
import { COMPLETION_TREND, STUDENTS } from "../../data/mock";
import { MessageSquare } from "lucide-react";

export function CompletionStatus() {
  const navigate = useNavigate();
  const lowStudents = STUDENTS.filter((s) => s.completion < 50).sort((a, b) => a.completion - b.completion);

  return (
    <div>
      <Breadcrumb items={[{ label: "학생 관리" }, { label: "학습 완료 현황" }]} />
      <PageTitle title="학습 완료 현황" subtitle="학급 전체의 학습 완료 현황과 이행률 추이를 확인하세요." />

      {/* Class summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label: "학급 평균 완료율", value: "68%", color: "text-primary" },
          { label: "80% 이상 학생", value: "12명", color: "text-emerald-600 dark:text-emerald-400" },
          { label: "50~80% 학생", value: "9명", color: "text-amber-600 dark:text-amber-400" },
          { label: "50% 미만 학생", value: `${lowStudents.length}명`, color: "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Trend chart */}
      <ChartCard
        title="주간 학급 완료율 추이"
        subtitle="최근 6주 기준"
        data={COMPLETION_TREND}
        xKey="week"
        lines={[{ dataKey: "완료율", label: "학급 평균 완료율", color: "#C5614A" }]}
        height={260}
        className="mb-5"
      />

      {/* Low performers */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-foreground">학습 이행 저조 학생</h3>
          <span className="text-xs text-muted-foreground">(완료율 50% 미만)</span>
        </div>
        <div className="divide-y divide-border">
          {lowStudents.map((s) => (
            <div key={s.id} className="flex items-center gap-4 px-5 py-4 hover:bg-secondary/20 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <StatusBadge variant={s.status as any} label={s.status === "danger" ? "위험" : "주의"} size="sm" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden max-w-xs">
                    <div className="h-full rounded-full bg-red-400" style={{ width: `${s.completion}%` }} />
                  </div>
                  <span className="text-xs text-red-500 font-medium">{s.completion}%</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-muted-foreground">{s.goal}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.track}</p>
              </div>
              <button
                onClick={() => navigate("/teacher/counseling/support")}
                className="flex items-center gap-1.5 px-3 h-8 rounded-xl border border-border text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors flex-shrink-0"
              >
                <MessageSquare className="w-3.5 h-3.5" /> 상담
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
