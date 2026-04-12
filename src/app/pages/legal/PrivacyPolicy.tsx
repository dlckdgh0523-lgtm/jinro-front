import React from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Shield } from "lucide-react";

const SECTIONS = [
  {
    title: "개인정보의 수집 항목 및 수집 방법",
    content: `① 회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.\n\n[필수 항목]\n  · 학생 회원: 이름, 이메일 주소, 비밀번호, 학교명, 학년, 반\n  · 교사 회원: 이름, 이메일 주소, 비밀번호, 학교명, 담당 학년, 담당 반, 담당 과목\n\n[선택 항목]\n  · 학생 회원: 교사 초대코드, 진로 희망 분야, 목표 대학·학과\n  · 교사 회원: 담당 과목 세부 정보\n\n[자동 수집 항목]\n  · 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보, 기기 정보\n\n② 개인정보 수집 방법: 홈페이지 회원가입, Google OAuth 인증, 서비스 이용 중 이용자의 자발적 입력을 통해 수집합니다.`,
  },
  {
    title: "개인정보의 수집 및 이용 목적",
    content: `회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.\n\n① 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금 정산\n  · AI 진로 탐색 서비스, 성적 관리 서비스, 맞춤형 대학·학과 추천 등\n\n② 회원 관리\n  · 회원제 서비스 이용에 따른 본인 확인, 개인 식별\n  · 불량 회원의 부정 이용 방지와 비인가 사용 방지\n  · 가입 의사 확인, 연령 확인, 불만 처리 등 민원 처리\n  · 고지사항 전달\n\n③ AI 서비스 품질 향상\n  · 학습 패턴 분석 및 개인 맞춤형 서비스 제공\n  · 신규 서비스(콘텐츠) 개발 및 특화\n  · 서비스의 유효성 확인, 접속 빈도 파악, 회원의 서비스 이용에 대한 통계`,
  },
  {
    title: "개인정보의 보유 및 이용 기간",
    content: `① 회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.\n\n② 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.\n\n[회원 탈퇴 후 보존 항목]\n  · 보존 항목: 이름, 이메일, 서비스 이용 기록\n  · 보존 근거: 불량 이용자의 재가입 방지, 분쟁 해결 등\n  · 보존 기간: 탈퇴 후 1년\n\n[관련 법령에 의한 정보 보유]\n  · 계약 또는 청약 철회 등에 관한 기록: 5년 (전자상거래법)\n  · 소비자 불만 또는 분쟁 처리에 관한 기록: 3년 (전자상거래법)\n  · 접속에 관한 기록: 1년 (통신비밀보호법)`,
  },
  {
    title: "개인정보의 제3자 제공",
    content: `① 회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.\n\n  · 이용자들이 사전에 동의한 경우\n  · 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우\n\n② 교사-학생 연동 서비스의 경우, 교사 회원이 학생을 초대한 경우에 한해 담당 교사에게 해당 학생의 학습 현황 및 성적 정보가 제공됩니다. 이는 서비스의 핵심 기능으로 가입 시 동의를 받습니다.`,
  },
  {
    title: "개인정보 처리의 위탁",
    content: `① 회사는 서비스 향상을 위해 아래와 같이 개인정보 처리 업무를 외부 전문업체에 위탁하여 운영합니다.\n\n  · 수탁 업체: Google LLC\n  · 위탁 업무 내용: Google OAuth 인증 서비스\n  · 개인정보 보유 및 이용 기간: 서비스 이용 기간\n\n  · 수탁 업체: Amazon Web Services\n  · 위탁 업무 내용: 데이터 저장 및 인프라 운영\n  · 개인정보 보유 및 이용 기간: 서비스 이용 기간\n\n② 회사는 위탁 계약 시 관련 법령에 따라 위탁 업체가 개인정보를 안전하게 처리하도록 관리·감독합니다.`,
  },
  {
    title: "이용자 및 법정 대리인의 권리와 행사 방법",
    content: `① 이용자 및 법정 대리인은 언제든지 등록되어 있는 자신 혹은 당해 만 14세 미만 아동의 개인정보를 조회하거나 수정할 수 있으며 가입 해지를 요청할 수도 있습니다.\n\n② 이용자 혹은 만 14세 미만 아동의 개인정보 조회, 수정을 위해서는 "마이페이지"를, 가입 해지(동의 철회)를 위해서는 "계정 설정 > 회원 탈퇴"를 클릭하여 본인 확인 절차를 거치신 후 직접 열람, 정정 또는 탈퇴가 가능합니다.\n\n③ 개인정보의 오류에 대한 정정을 요청하신 경우에는 정정을 완료하기 전까지 당해 개인정보를 이용 또는 제공하지 않습니다.`,
  },
  {
    title: "개인정보의 파기 절차 및 방법",
    content: `① 회사는 원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 파기 절차 및 방법은 다음과 같습니다.\n\n[파기 절차]\n이용자가 회원 가입 등을 위해 입력한 정보는 목적이 달성된 후 별도의 DB로 옮겨져 내부 방침 및 기타 관련 법령에 의한 정보 보호 사유에 따라 일정 기간 저장된 후 파기됩니다.\n\n[파기 방법]\n  · 종이에 출력된 개인정보: 분쇄기로 분쇄하거나 소각\n  · 전자적 파일 형태로 저장된 개인정보: 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제`,
  },
  {
    title: "쿠키(Cookie)의 운용 및 거부",
    content: `① 회사는 이용자에게 개인화된 서비스를 제공하기 위해 쿠키(cookie)를 사용합니다.\n\n② 쿠키는 웹사이트를 운영하는 데 이용되는 서버가 이용자의 브라우저에게 보내는 소량의 정보이며 이용자들의 PC 컴퓨터 내의 하드디스크에 저장되기도 합니다.\n\n③ 이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서 이용자는 웹 브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다. 단, 쿠키 설치를 거부하는 경우 서비스 이용에 불편함이 있을 수 있습니다.`,
  },
  {
    title: "개인정보의 기술적·관리적 보호 대책",
    content: `회사는 이용자들의 개인정보를 취급함에 있어 개인정보가 분실, 도난, 누출, 변조 또는 훼손되지 않도록 안전성 확보를 위하여 다음과 같은 기술적·관리적 대책을 강구하고 있습니다.\n\n  · 비밀번호의 암호화: 이용자의 비밀번호는 단방향 암호화하여 저장·관리\n  · 해킹 등에 대비한 대책: 보안 프로그램 설치, 시스템 취약점 정기 점검\n  · 개인정보 취급 직원의 최소화 및 교육\n  · 개인정보에 대한 접근 제한 및 접근 권한 관리\n  · 개인정보 처리 시스템 접근 기록의 보관 및 위·변조 방지`,
  },
  {
    title: "개인정보 보호 책임자",
    content: `① 회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보 주체의 불만 처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호 책임자를 지정하고 있습니다.\n\n  · 개인정보 보호 책임자: 진로나침반 개인정보보호팀\n  · 이메일: privacy@jilonachimdian.kr\n  · 연락 가능 시간: 평일 09:00 ~ 18:00 (공휴일 제외)\n\n② 이용자께서는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만, 피해구제 등에 관한 사항을 개인정보 보호 책임자에게 문의하실 수 있습니다.`,
  },
  {
    title: "개인정보처리방침의 변경",
    content: `이 개인정보처리방침은 2026년 1월 1일부터 적용되며, 법령 및 방침에 따른 변경 내용의 추가, 삭제 및 정정이 있는 경우에는 변경 사항의 시행 7일 전부터 공지사항을 통하여 고지합니다.`,
  },
];

export function PrivacyPolicy() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-3">
            <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              개인정보 보호
            </span>
          </div>
          <h1 className="text-foreground mb-2">개인정보처리방침</h1>
          <p className="text-sm text-muted-foreground">
            최종 업데이트: 2026년 1월 1일 · 시행일: 2026년 1월 1일
          </p>
        </div>

        {/* Intro box */}
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl mb-8">
          <p className="text-sm text-foreground leading-relaxed">
            진로나침반(이하 "회사")은 「개인정보 보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을 준수하며,
            이용자의 개인정보를 소중히 여기고 안전하게 보호합니다.
            본 방침을 통해 수집되는 개인정보의 항목, 이용 목적, 보유 기간 등을 안내드립니다.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {SECTIONS.map((section, idx) => (
            <section key={idx}>
              <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
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
          <p className="text-sm text-muted-foreground mb-1">개인정보 관련 문의사항은 아래로 연락해 주세요.</p>
          <p className="text-sm font-medium text-foreground">privacy@jilonachimdian.kr</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            이전 페이지로 돌아가기
          </button>
        </div>
      </main>
    </div>
  );
}
