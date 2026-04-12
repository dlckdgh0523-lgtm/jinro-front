import React, { useState } from "react";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { MessageSquare, Send, User, ChevronDown } from "lucide-react";

const RECEIVED_MEMOS = [
  { id: 1, teacher: "박지영", date: "2026-04-09", subject: "수학 학습 방향", content: "최근 모의고사 결과를 보니 수학 미적분 파트에서 실수가 잦습니다. 개념 정리보다는 실전 문제 풀이에 집중해 보세요. 시간이 되면 학교에 들러 이야기 나눠요.", read: true },
  { id: 2, teacher: "박지영", date: "2026-04-05", subject: "진로 방향 안내", content: "AI/소프트웨어 분야 관심이 많군요. 컴퓨터 관련 동아리 활동을 적극 추천합니다. 학생부 활동 내역에 잘 반영될 거예요.", read: true },
];

const REQUEST_TYPES = ["학업 고민", "진로 고민", "정서적 지원", "기타"];

export function StudentCounseling() {
  const [message, setMessage] = useState("");
  const [reqType, setReqType] = useState("학업 고민");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    setSent(true);
    setMessage("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div>
      <Breadcrumb items={[{ label: "상담" }, { label: "상담 페이지" }]} />
      <PageTitle title="상담 페이지" subtitle="선생님과의 상담 내역을 확인하고 상담을 요청하세요." />

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Received memos */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-foreground">선생님 메모</h3>
            <p className="text-xs text-muted-foreground mt-0.5">담임 선생님이 남긴 메모를 확인하세요.</p>
          </div>
          <div className="divide-y divide-border">
            {RECEIVED_MEMOS.map((memo) => (
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
            ))}
          </div>
        </div>

        {/* Request area */}
        <div className="space-y-4">
          {/* Send request */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-foreground mb-3">상담 요청 보내기</h3>
            {sent && (
              <div className="mb-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700 text-sm text-emerald-700 dark:text-emerald-400">
                ✅ 상담 요청이 선생님께 전달되었습니다!
              </div>
            )}
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">상담 유형</label>
                <div className="flex flex-wrap gap-2">
                  {REQUEST_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setReqType(t)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                        reqType === t
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">내용</label>
                <textarea
                  className="w-full h-28 px-3.5 py-3 rounded-xl border border-border bg-input-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/50 placeholder:text-muted-foreground/60"
                  placeholder="선생님께 전달할 내용을 자유롭게 적어주세요. 걱정하지 마세요, 편하게 이야기해도 돼요 😊"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                상담 요청 보내기
              </button>
            </div>
          </div>

          {/* Past requests */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-foreground mb-3">이전 상담 요청</h3>
            <div className="space-y-2.5">
              {[
                { type: "학업 고민", date: "2026-04-05", status: "completed", preview: "수학 성적이 계속 안 오르는데..." },
                { type: "진로 고민", date: "2026-03-28", status: "completed", preview: "AI 분야로 진로를 정하고 싶은데..." },
              ].map((req, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/40">
                  <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-medium text-foreground">{req.type}</span>
                      <span className="text-xs text-muted-foreground">{req.date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{req.preview}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium flex-shrink-0">
                    완료
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
