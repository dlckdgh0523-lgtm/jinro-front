import React from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Compass } from "lucide-react";

const SECTIONS = [
  {
    title: "제1조 (목적)",
    content: `이 약관은 진로나침반(이하 "회사")이 제공하는 교육 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.`,
  },
  {
    title: "제2조 (정의)",
    content: `① "서비스"란 회사가 제공하는 AI 기반 진로 탐색 및 학업 관리 플랫폼 일체를 의미합니다.\n② "이용자"란 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.\n③ "회원"이란 회사에 개인정보를 제공하여 회원 등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.\n④ "학생 회원"이란 학생 자격으로 가입한 회원을 의미합니다.\n⑤ "교사 회원"이란 교육 기관 소속 교사 자격으로 가입한 회원을 의미합니다.`,
  },
  {
    title: "제3조 (약관의 효력 및 변경)",
    content: `① 이 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다.\n② 회사는 「전자상거래 등에서의 소비자 보호에 관한 법률」, 「약관의 규제에 관한 법률」 등 관련 법령을 위반하지 않는 범위에서 이 약관을 개정할 수 있습니다.\n③ 회사가 약관을 개정할 경우에는 적용일자 및 개정 사유를 명시하여 현행 약관과 함께 서비스 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.\n④ 이용자가 개정 약관에 동의하지 않는 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.`,
  },
  {
    title: "제4조 (서비스의 제공 및 변경)",
    content: `① 회사는 다음과 같은 서비스를 제공합니다.\n  1. AI 기반 진로 탐색 및 추천 서비스\n  2. 학업 성적 관리 및 분석 서비스\n  3. 대학·학과 정보 및 입시 데이터 서비스\n  4. 교사-학생 간 상담 지원 서비스\n  5. 주간 학습 계획 수립 및 관리 서비스\n  6. 기타 회사가 추가 개발하거나 다른 회사와의 제휴 계약 등을 통해 회원에게 제공하는 일체의 서비스\n② 회사는 서비스의 내용, 이용 방법, 이용 시간에 대하여 변경이 있는 경우에는 변경 사유, 변경될 서비스의 내용 및 제공 일자 등을 서비스 공지사항에 게시합니다.`,
  },
  {
    title: "제5조 (회원가입)",
    content: `① 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로써 회원 가입을 신청합니다.\n② 회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다.\n  1. 가입 신청자가 이 약관에 의하여 이전에 회원 자격을 상실한 경우\n  2. 등록 내용에 허위, 기재누락, 오기가 있는 경우\n  3. 기타 회원으로 등록하는 것이 서비스 운영상 현저히 지장이 있다고 판단되는 경우\n③ 교사 회원의 경우 재직 중인 학교의 초대 코드를 통해 학급과 연동될 수 있습니다.`,
  },
  {
    title: "제6조 (회원 탈퇴 및 자격 상실)",
    content: `① 회원은 회사에 언제든지 탈퇴를 요청할 수 있으며 회사는 즉시 회원 탈퇴를 처리합니다.\n② 회원이 다음 각 호의 사유에 해당하는 경우, 회사는 회원 자격을 제한 및 정지시킬 수 있습니다.\n  1. 가입 신청 시에 허위 내용을 등록한 경우\n  2. 다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 전자거래 질서를 위협하는 경우\n  3. 서비스를 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우`,
  },
  {
    title: "제7조 (개인정보 보호)",
    content: `회사는 이용자의 개인정보 수집 시 서비스 제공을 위하여 필요한 최소한의 개인정보를 수집합니다. 회사가 수집한 개인정보의 이용 목적, 보유 기간, 제3자 제공 등에 관한 사항은 개인정보처리방침에서 별도로 정합니다.`,
  },
  {
    title: "제8조 (회사의 의무)",
    content: `① 회사는 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 이 약관이 정하는 바에 따라 지속적이고 안정적으로 서비스를 제공하는 데 최선을 다하여야 합니다.\n② 회사는 이용자가 안전하게 인터넷 서비스를 이용할 수 있도록 이용자의 개인정보 보호를 위한 보안 시스템을 구축해야 합니다.\n③ 회사는 서비스 이용과 관련하여 이용자로부터 제기된 의견이나 불만이 정당하다고 인정할 경우에는 이를 처리하여야 합니다.`,
  },
  {
    title: "제9조 (이용자의 의무)",
    content: `이용자는 다음 행위를 하여서는 안 됩니다.\n  1. 신청 또는 변경 시 허위 내용의 등록\n  2. 타인의 정보 도용\n  3. 회사가 게시한 정보의 변경\n  4. 회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시\n  5. 회사 및 기타 제3자의 저작권 등 지식재산권에 대한 침해\n  6. 회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위\n  7. 외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위`,
  },
  {
    title: "제10조 (면책조항)",
    content: `① 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.\n② 회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.\n③ 회사는 이용자가 서비스와 관련하여 게재한 정보, 자료, 사실의 신뢰도, 정확성 등의 내용에 관하여는 책임을 지지 않습니다.`,
  },
  {
    title: "제11조 (분쟁 해결)",
    content: `① 회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상 처리하기 위하여 피해보상처리기구를 설치·운영합니다.\n② 서비스 이용으로 발생한 분쟁에 대해 소송이 제기되는 경우 법령에 정한 절차에 따른 법원을 관할 법원으로 합니다.`,
  },
  {
    title: "부칙",
    content: `이 약관은 2026년 1월 1일부터 적용됩니다.`,
  },
];

export function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            aria-label="뒤로 가기"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <span className="text-white text-xs font-bold">진</span>
            </div>
            <span className="text-sm font-semibold text-foreground">진로나침반</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-3">
            <Compass className="w-3.5 h-3.5" style={{ color: "var(--primary)" }} />
            <span className="text-xs font-medium" style={{ color: "var(--primary)" }}>
              법적 문서
            </span>
          </div>
          <h1 className="text-foreground mb-2">서비스 이용약관</h1>
          <p className="text-sm text-muted-foreground">
            최종 업데이트: 2026년 1월 1일 · 시행일: 2026년 1월 1일
          </p>
        </div>

        {/* Intro box */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl mb-8">
          <p className="text-sm text-foreground leading-relaxed">
            진로나침반 서비스를 이용하시기 전에 본 이용약관을 주의 깊게 읽어 주세요.
            서비스에 가입하거나 이용함으로써 본 약관에 동의하는 것으로 간주됩니다.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {SECTIONS.map((section, idx) => (
            <section key={idx}>
              <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: "var(--primary)", color: "white" }}
                >
                  {idx + 1}
                </span>
                {section.title}
              </h2>
              <div className="pl-8">
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </div>
              {idx < SECTIONS.length - 1 && (
                <div className="mt-8 h-px bg-border" />
              )}
            </section>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 p-5 bg-secondary/40 rounded-xl border border-border text-center">
          <p className="text-sm text-muted-foreground mb-1">문의사항이 있으시면 아래로 연락해 주세요.</p>
          <p className="text-sm font-medium text-foreground">support@jilonachimdian.kr</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center gap-1.5 text-sm hover:underline"
            style={{ color: "var(--primary)" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            이전 페이지로 돌아가기
          </button>
        </div>
      </main>
    </div>
  );
}
