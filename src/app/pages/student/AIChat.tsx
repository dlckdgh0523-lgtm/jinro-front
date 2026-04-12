import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Breadcrumb } from "../../components/AppShell";
import { Brain, Send, ArrowRight } from "lucide-react";

interface Message {
  id: number;
  role: "ai" | "user";
  text: string;
}

const AI_FLOW: { question: string; chips: string[] }[] = [
  { question: "안녕하세요 😊 저는 진로나침반 AI예요. 함께 진로 방향을 찾아볼게요. 어떤 분야나 활동이 가장 즐거우신가요?", chips: ["수학/과학 문제 풀기", "글 쓰기/독서", "코딩/만들기", "사람들과 이야기하기"] },
  { question: "좋아요! 그렇다면 어떤 과목을 가장 좋아하시나요?", chips: ["수학", "국어/영어", "과학 (물리·화학·생물)", "사회/역사"] },
  { question: "학교 이후 어떤 생활을 원하시나요?", chips: ["회사에서 안정적으로 일하고 싶어요", "창업해서 내 것을 만들고 싶어요", "연구나 학문을 더 깊이 파고 싶어요", "사람을 직접 돕는 일을 하고 싶어요"] },
  { question: "미래에 어떤 사람이 되고 싶으신가요?", chips: ["기술로 세상을 바꾸는 엔지니어", "경제와 비즈니스를 이끄는 리더", "학문과 교육으로 사회에 기여하는 사람", "창작과 디자인으로 세상을 아름답게 하는 사람"] },
  { question: "분석 완료! 🎉 답변을 바탕으로 AI·소프트웨어 또는 공학 계열이 잘 맞을 것 같아요. 관련 대학·학과를 추천해드릴까요?", chips: ["네, 추천 받고 싶어요", "다른 분야도 탐색하고 싶어요"] },
];

export function AIChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "ai", text: AI_FLOW[0].question },
  ]);
  const [flowStep, setFlowStep] = useState(0);
  const [input, setInput] = useState("");
  const [finished, setFinished] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: messages.length, role: "user", text };
    const nextStep = flowStep + 1;

    let aiMsg: Message | null = null;
    if (nextStep < AI_FLOW.length) {
      aiMsg = { id: messages.length + 1, role: "ai", text: AI_FLOW[nextStep].question };
      setFlowStep(nextStep);
    } else {
      setFinished(true);
    }

    setMessages((prev) => [
      ...prev,
      userMsg,
      ...(aiMsg ? [aiMsg] : []),
    ]);
    setInput("");
  };

  const currentChips = !finished && flowStep < AI_FLOW.length ? AI_FLOW[flowStep].chips : [];

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      <Breadcrumb items={[{ label: "진로 / 입시" }, { label: "AI 진로 탐색" }]} />

      <div className="flex-1 flex flex-col bg-card rounded-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">나침반 AI</p>
            <p className="text-xs text-muted-foreground">진로 탐색 도우미</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-muted-foreground">온라인</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "ai" && (
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                  <Brain className="w-3.5 h-3.5 text-primary" />
                </div>
              )}
              <div
                className={`max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "ai"
                    ? "bg-secondary/60 text-foreground rounded-tl-sm"
                    : "bg-primary/15 text-foreground rounded-tr-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Chips */}
          {currentChips.length > 0 && (
            <div className="flex flex-wrap gap-2 pl-9">
              {currentChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="px-3.5 py-2 rounded-full border border-primary/30 text-primary text-xs bg-primary/5 hover:bg-primary/10 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {finished && (
            <div className="flex justify-start pl-9">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-2xl p-4 max-w-sm">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-2">탐색 완료! 🎉</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-500 mb-3">AI 분석 결과를 바탕으로 맞춤형 대학·학과 추천을 확인해보세요.</p>
                <button
                  onClick={() => navigate("/student/career/recommendation")}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-colors"
                >
                  추천 결과 보기 <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-5 py-4 border-t border-border">
          <div className="flex gap-2">
            <input
              className="flex-1 h-11 px-4 rounded-xl border border-border bg-input-background text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/50"
              placeholder="직접 입력하거나 위 버튼을 선택하세요..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
              disabled={finished}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || finished}
              className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">AI 답변은 참고용이며, 최종 진로 결정은 스스로 결정하세요.</p>
        </div>
      </div>
    </div>
  );
}
