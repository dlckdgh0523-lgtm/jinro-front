import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";

interface Message {
  id: string;
  from: "ai" | "user";
  text: string;
  chips?: string[];
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    from: "ai",
    text: "안녕하세요, 김민준님! 저는 진로나침반 AI예요. 오늘은 함께 여러분의 진로를 탐색해 볼게요. 😊\n\n먼저, 지금까지 학교에서 가장 재미있었던 과목이나 활동이 있었나요?",
    chips: ["수학/과학이 재밌어요", "국어/사회가 좋아요", "예체능 활동이요", "특별히 없어요"],
  },
];

const AI_RESPONSES: Record<string, { text: string; chips?: string[] }> = {
  "수학/과학이 재밌어요": {
    text: "수학과 과학을 좋아하시는군요! 논리적 사고와 문제 해결 능력이 뛰어나신 것 같아요. 🧮\n\n수학과 과학 중에서 특히 어떤 부분이 매력적으로 느껴지나요?",
    chips: ["공식을 풀어낼 때 쾌감이 좋아요", "실험하는 게 재밌어요", "새로운 개념을 이해할 때 좋아요", "프로그래밍에도 관심 있어요"],
  },
  "프로그래밍에도 관심 있어요": {
    text: "훌륭해요! 수학적 사고 + 프로그래밍 관심이라면 컴퓨터공학, AI/머신러닝, 데이터사이언스 분야가 정말 잘 맞을 것 같아요. 💻\n\n미래에 어떤 방식으로 일하고 싶으세요?",
    chips: ["기술을 개발하는 연구자", "제품을 만드는 엔지니어", "창업해서 서비스를 만들고 싶어요", "안정적인 직업을 원해요"],
  },
  "제품을 만드는 엔지니어": {
    text: "좋아요! 실제로 사람들이 사용하는 제품을 만드는 것을 원하신다면, 소프트웨어 엔지니어링 또는 AI 프로덕트 개발 분야가 딱 맞아요. 🚀\n\n현재 김민준님의 성적을 고려하면 다음과 같은 방향을 추천드려요:",
    chips: ["추천 대학 보기", "수능 과목 전략 보기", "처음부터 다시 탐색"],
  },
  default: {
    text: "좋은 답변이에요! 조금 더 구체적으로 알아볼게요. 현재 생각하는 미래 직업이 있나요?",
    chips: ["IT/개발자", "의사/간호사", "교사", "디자이너", "경영/금융", "아직 모르겠어요"],
  },
};

export default function AICareerChat() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: String(Date.now()), from: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = AI_RESPONSES[text] || AI_RESPONSES["default"];
      const aiMsg: Message = {
        id: String(Date.now() + 1),
        from: "ai",
        text: response.text,
        chips: response.chips,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-white"
          style={{ background: "linear-gradient(135deg, #C17B6E 0%, #D4906A 100%)" }}
        >
          <Sparkles size={18} />
        </div>
        <div>
          <h1 style={{ color: "var(--brand-text)", fontWeight: 700 }}>AI 진로 탐색</h1>
          <p className="text-sm" style={{ color: "var(--brand-text-muted)" }}>AI와 대화하며 나에게 맞는 진로를 찾아가세요</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        {/* Chat area */}
        <div className="lg:col-span-3">
          <div
            className="rounded-2xl flex flex-col"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              height: "calc(100vh - 280px)",
              minHeight: "480px",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-5 py-4"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs" style={{ background: "var(--brand-coral)" }}>AI</div>
              <div>
                <p className="text-sm" style={{ color: "var(--brand-text)", fontWeight: 600 }}>진로 탐색 AI</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-xs" style={{ color: "var(--brand-text-muted)" }}>온라인</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] ${msg.from === "ai" ? "flex gap-2" : ""}`}>
                    {msg.from === "ai" && (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5" style={{ background: "var(--brand-coral)" }}>
                        AI
                      </div>
                    )}
                    <div>
                      <div
                        className="px-4 py-3 rounded-2xl"
                        style={{
                          background: msg.from === "user" ? "var(--brand-coral)" : "var(--background)",
                          color: msg.from === "user" ? "white" : "var(--brand-text)",
                          borderRadius: msg.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                          fontSize: "0.875rem",
                          lineHeight: 1.6,
                          whiteSpace: "pre-line",
                        }}
                      >
                        {msg.text}
                      </div>
                      {msg.chips && msg.from === "ai" && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {msg.chips.map((chip) => (
                            <button
                              key={chip}
                              onClick={() => sendMessage(chip)}
                              className="px-3 py-1.5 rounded-xl text-xs transition-all hover:opacity-80"
                              style={{
                                background: "var(--brand-peach)",
                                color: "var(--brand-coral)",
                                fontWeight: 600,
                                border: "1px solid var(--brand-rose)",
                              }}
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 items-end">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs" style={{ background: "var(--brand-coral)" }}>AI</div>
                  <div className="px-4 py-3 rounded-2xl" style={{ background: "var(--background)", borderRadius: "18px 18px 18px 4px" }}>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            background: "var(--brand-coral)",
                            animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4" style={{ borderTop: "1px solid var(--border)" }}>
              <div
                className="flex gap-2 rounded-xl px-4"
                style={{
                  background: "var(--input-background)",
                  border: "1.5px solid var(--border)",
                }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                  placeholder="자유롭게 입력하세요..."
                  className="flex-1 bg-transparent outline-none py-3 text-sm"
                  style={{ color: "var(--brand-text)" }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  className="p-2 rounded-lg transition-colors hover:opacity-80"
                  style={{ color: "var(--brand-coral)" }}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Progress */}
        <div className="space-y-4">
          <div className="rounded-2xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="text-sm mb-3" style={{ color: "var(--brand-text)", fontWeight: 600 }}>탐색 진행 상황</h3>
            <div className="space-y-2">
              {[
                { label: "관심사 파악", done: true },
                { label: "강점 분석", done: true },
                { label: "선호 업무 스타일", done: false },
                { label: "미래 방향 설정", done: false },
                { label: "진로 추천", done: false },
              ].map((step) => (
                <div key={step.label} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: step.done ? "var(--brand-success)" : "var(--muted)",
                      border: `1.5px solid ${step.done ? "var(--brand-success)" : "var(--border)"}`,
                    }}
                  >
                    {step.done && <span className="text-white text-[8px]">✓</span>}
                  </div>
                  <span className="text-xs" style={{ color: step.done ? "var(--brand-text)" : "var(--brand-text-muted)" }}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-4" style={{ background: "var(--brand-peach)", border: "1px solid var(--brand-rose)" }}>
            <h3 className="text-sm mb-2" style={{ color: "var(--brand-coral)", fontWeight: 600 }}>💡 지금까지 탐색</h3>
            <div className="space-y-1">
              {["수학/과학 선호", "프로그래밍 관심", "제품 개발 지향"].map((tag) => (
                <span
                  key={tag}
                  className="inline-block mr-1 mb-1 px-2 py-0.5 rounded text-xs"
                  style={{ background: "var(--card)", color: "var(--brand-text)", border: "1px solid var(--border)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
