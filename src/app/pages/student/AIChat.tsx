import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Breadcrumb } from "../../components/AppShell";
import { Brain, Send, ArrowRight } from "lucide-react";
import { appPost } from "../../utils/appApi";

interface Message {
  id: number;
  role: "ai" | "user";
  text: string;
}

type ChatResponse = {
  conversationId: string;
  route: "LLM" | "RAG" | "HYBRID";
  answer: string;
  citations: Array<{
    documentId: string;
    title: string;
    locator?: string | null;
    sourceName: string;
    excerpt: string;
  }>;
  meta: {
    provider: string;
    model: string;
    isStub: boolean;
  };
};

const STARTER_PROMPTS = [
  "AI 전공과 컴퓨터공학 중에서 어떤 방향이 더 맞을까요?",
  "수시 학생부종합으로 준비하려면 무엇부터 해야 하나요?",
  "내신 1.8등급 기준으로 도전·적정·안정 대학을 알려주세요.",
  "최근 입시 정보 근거를 바탕으로 상담해 주세요."
];

const INITIAL_MESSAGE =
  "진로, 대학, 학과, 전형, 학습 계획 중 무엇이든 질문해 주세요. 필요한 경우 입시 근거를 함께 찾아서 답변해 드릴게요.";

export function AIChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([{ id: 0, role: "ai", text: INITIAL_MESSAGE }]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [isStub, setIsStub] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isSending) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: text.trim()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError("");
    setIsSending(true);

    try {
      const response = await appPost<ChatResponse>("/v1/ai/chat", {
        conversationId: conversationId || undefined,
        message: text.trim()
      });

      setConversationId(response.conversationId);
      if (response.meta.isStub) setIsStub(true);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          text: response.answer
        }
      ]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "AI 상담 응답을 불러오지 못했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  const showStarterPrompts = messages.length === 1 && !isSending;

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      <Breadcrumb items={[{ label: "진로 / 입시" }, { label: "AI 진로 탐색" }]} />

      {isStub && (
        <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 mb-5">
          <Brain className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            <strong>준비 중</strong>: 현재 AI 진로 상담은 샘플 응답을 제공합니다. 실제 AI 기능은 준비 중입니다.
          </p>
        </div>
      )}

      <div className="flex-1 flex flex-col bg-card rounded-xl border border-border overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">진로봇 AI</p>
            <p className="text-xs text-muted-foreground">진로 탐색 도우미</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            {isStub ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-xs text-amber-600 dark:text-amber-400">준비 중</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-muted-foreground">온라인</span>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "ai" && (
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                  <Brain className="w-3.5 h-3.5 text-primary" />
                </div>
              )}
              <div
                className={`max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  message.role === "ai"
                    ? "bg-secondary/60 text-foreground rounded-tl-sm"
                    : "bg-primary/15 text-foreground rounded-tr-sm"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                <Brain className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="max-w-sm px-4 py-3 rounded-2xl rounded-tl-sm bg-secondary/60 text-sm text-muted-foreground">
                답변을 준비하고 있습니다...
              </div>
            </div>
          )}

          {showStarterPrompts && (
            <div className="flex flex-wrap gap-2 pl-9">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => void sendMessage(prompt)}
                  className="px-3.5 py-2 rounded-full border border-primary/30 text-primary text-xs bg-primary/5 hover:bg-primary/10 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="px-5 py-4 border-t border-border">
          {isStub && (
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-3 py-2 mb-3 flex items-start gap-2">
              <span className="text-amber-500 text-xs flex-shrink-0 mt-0.5">⚠️</span>
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                AI 상담 기능이 아직 준비 중입니다. 현재 표시되는 응답은 실제 AI 분석 결과가 아닙니다.
              </p>
            </div>
          )}
          {error && <p className="text-xs text-destructive mb-2">{error}</p>}
          <div className="flex gap-2">
            <input
              className="flex-1 h-11 px-4 rounded-xl border border-border bg-input-background text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/50"
              placeholder="입시, 학과, 진로 고민을 입력해 주세요."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void sendMessage(input);
                }
              }}
              disabled={isSending}
            />
            <button
              onClick={() => void sendMessage(input)}
              disabled={!input.trim() || isSending}
              className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-2 gap-3">
            <p className="text-xs text-muted-foreground">
              AI 상담은 참고용이며, 최종 진로 결정은 직접 검토해 주세요.
            </p>
            <button
              onClick={() => navigate("/student/career/recommendation")}
              className="flex items-center gap-1 text-xs text-primary hover:underline flex-shrink-0"
            >
              추천 결과 보기 <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
