import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Calendar, Snowflake, Coins, Clipboard, Check, Share2, Award } from 'lucide-react';

interface CustomClauseOption {
  id: string;
  label: string;
  text: string;
}

export default function SpecialNotes() {
  // Real-time clipboard feedback
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Dynamic user covenant selection state for the contract clause builder
  const [selectedClauses, setSelectedClauses] = useState<Record<string, boolean>>({
    simultaneous: true,
    aircon: true,
  });

  const notes = [
    {
      title: "미등기 상태 계약서 필수 특약 (동시이행)",
      icon: <FileText className="w-5 h-5 text-[#f2ca50]" />,
      accentClass: "border-t-2 border-t-[#f2ca50]/50",
      text: "임대인은 임차인의 잔금 지급과 동시에 기존 주택담보 잔금대출을 일부 또는 전액 상환처리하며, 본 절차는 수분양 협약 지정 위임 법무사를 통해 안전하게 동시이행 처리하고 수령하는 즉시 완납 증명서류를 교부하기로 약정한다.",
    },
    {
      title: "입주 지정 기간 공실 최속 해결 비책",
      icon: <Calendar className="w-5 h-5 text-[#7dffa2]" />,
      accentClass: "border-t-2 border-t-[#7dffa2]/50",
      text: "아파트 단지 공식 입주 지정 기간(통상 2개월) 중 초반 2주 이내에 선점 소화하는 매물이 가장 높은 전월세를 방어합니다. 중반 이후부터 잔금 기일이 촉박해진 임대 수분양인들의 초저가 덤핑 투매 물량이 쏟아지기 전에 선계약을 체결하십시오.",
    },
    {
      title: "시스템 에어컨 선제적 설치 및 플랜 B",
      icon: <Snowflake className="w-5 h-5 text-sky-400" />,
      accentClass: "border-t-2 border-t-sky-400/50",
      text: "시스템 에어컨(4대 거실/안방/방 전체)이 제외된 세대는 신축 입주장에서 임차인의 선택지에서 가장 빠르게 제외됩니다. 에어컨이 누락된 매물일 경우 신속히 월 요금을 약 5~10만 원 즉시 감액 조정하는 공실 방지 플랜 B를 조기 승인해야 장기 공실 피해를 막습니다.",
    },
    {
      title: "공실 관리비 및 장기수선충당금 청산 의무",
      icon: <Coins className="w-5 h-5 text-[#f2ca50]" />,
      accentClass: "border-t-2 border-t-[#f2ca50]/50",
      text: "입주 지정 기간 종료일까지 세대에 부과된 기본 관리비와 공실 관리비는 수분양자인 임대인 전액 부담이며, 실제 임차인의 현관 열쇠 양도일 및 전입 개시일 이후 분부터 임차인 부담입니다. 퇴거 시 임차인이 매월 대납한 장기수선충당금 반환 의무를 숙지하십시오.",
    },
  ];

  // Raw contract options to choose and build from
  const CLAUSE_OPTIONS: CustomClauseOption[] = [
    {
      id: 'simultaneous',
      label: '임차인 잔금 즉시 기존 대출 일부 상환 조항 (필수)',
      text: '임대인은 임차인의 잔금 지급과 동시에 기존 잔금대출을 일부 상환하며, 해당 상환 절차는 완납을 보장하기 위해 단지 지정 법무사를 통해 상환 동시이행 절차로 집행하며 즉각 완납증명서 사본을 임차인에게 교부한다.'
    },
    {
      id: 'aircon',
      label: '시스템 에어컨 임대인 유지관리 한정 조항',
      text: '임대인은 인도 목적물 내 설치된 기본 옵션(시스템 에어컨 등)의 필터 청소 등 일상의 가벼운 유지보수를 임차인의 부담으로 하며, 노후 소모에 따른 압축기 고장이나 모터 교체 등 원천적인 하자 보수 의무만을 부담하기로 한다.'
    },
    {
      id: 'pets',
      label: '반려동물 사육 금지 및 양도 원상복구 명시',
      text: '임차인은 목적물 전용 부분 내에서 반려동물(개, 고양이 등)을 사육할 수 없으며, 불법 사육이나 실내 흡연 등으로 발생하는 벽지 훼손, 냄새, 파손 등에 대해서는 임대차 만료 퇴거 즉시 원상복구 비용 전체를 실비 정산 보상하기로 정한다.'
    },
    {
      id: 'preInspection',
      label: '사전점검 하자 통보 기간 임차인 협조 조항',
      text: '임차인은 입주 후 신축 주택 구조상 발견되는 소소한 시공 하자에 대하여 수분양자인 임대인 및 시공사 AS팀의 수리 보수 공사 세대 출입 요청에 적극 협조해주기로 신뢰를 전제한다.'
    }
  ];

  // Helper trigger to toggle check
  const handleToggleClauseOption = (id: string) => {
    setSelectedClauses(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Generate complete combined clause text block
  const generatedCovenants = CLAUSE_OPTIONS
    .filter(opt => selectedClauses[opt.id])
    .map((opt, idx) => `[특약사항 제 ${idx + 1}항] ${opt.text}`)
    .join('\n\n');

  // Copy to Clipboard
  const handleCopyToClipboard = () => {
    if (!generatedCovenants) return;
    navigator.clipboard.writeText(generatedCovenants);
    setCopiedText("특약 제안 전문이 클립보드에 복사되었습니다!");
    setTimeout(() => {
      setCopiedText(null);
    }, 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
      id="specialnotes-tab-container"
    >
      <div className="space-y-1.5 px-1">
        <h3 className="text-xl font-bold text-[#f2ca50] flex items-center gap-2">
          <Award className="w-5 h-5 text-[#f2ca50]" /> 임대인 신축 입주장 관리 비책 가이드
        </h3>
        <p className="text-xs text-slate-400">
          신축 단지만의 특수성을 이해하고 불리한 독소 조항과 공실 위기를 회피하셔야 명품 가치가 지켜집니다.
        </p>
      </div>
      
      {/* 4 Cards Grid of Landlord rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {notes.map((note, index) => (
          <div 
            key={index}
            className={`bg-[#1e1e1e]/60 p-6 rounded-2xl hover:bg-[#201f1f] duration-300 transition-all border border-white/[0.04] group flex flex-col justify-start space-y-3 shadow-md ${note.accentClass}`}
          >
            <div className="flex items-center gap-2.5 mb-1">
              {note.icon}
              <span className="text-sm font-extrabold uppercase tracking-tight text-white group-hover:text-[#f2ca50] transition-colors">
                {note.title}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {note.text}
            </p>
          </div>
        ))}
      </div>

      {/* NEW: Contract special clause compounding builder block */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="border-b border-white/5 pb-4">
          <h4 className="text-base font-black text-[#f2ca50] flex items-center gap-2">
            <FileText className="w-4.5 h-4.5 text-[#f2ca50]" /> 뷰빈 단독: 신축임대 계약 특약 조합기 V3
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            부동산 계약서 작성 시 동시이행 대출 상환 조항과 분쟁 방지 특약 문구를 임의 조합하여 복사하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Checkboxes */}
          <div className="lg:col-span-6 space-y-3">
            {CLAUSE_OPTIONS.map(opt => {
              const isSelected = !!selectedClauses[opt.id];
              return (
                <div 
                  key={opt.id}
                  onClick={() => handleToggleClauseOption(opt.id)}
                  className={`p-3.5 rounded-xl border transition-all duration-150 cursor-pointer flex items-start gap-3 select-none ${
                    isSelected 
                      ? 'bg-[#f2ca50]/5 border-[#f2ca50]/20 text-[#f2ca50]' 
                      : 'bg-zinc-950/40 border-zinc-800/80 text-slate-400 hover:text-slate-300 hover:bg-zinc-900/40'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center mt-0.5 shrink-0 transition-all ${
                    isSelected 
                      ? 'border-[#f2ca50] bg-[#f2ca50] text-[#3c2f00]' 
                      : 'border-zinc-700'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs font-bold leading-tight">{opt.label}</span>
                </div>
              );
            })}
          </div>

          {/* Right Combined Output Container */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-zinc-950 border border-zinc-800 rounded-xl p-4.5 space-y-4">
            <div className="space-y-1.5 flex-1">
              <span className="text-[10px] bg-zinc-800/80 text-slate-300 border border-white/5 px-2 py-0.7 rounded font-black max-w-fit block">
                실제 수임 법률 계약서용 특약 전문 프리뷰
              </span>
              <div className="bg-transparent text-slate-300 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto pr-1 select-text scrollbar-thin scrollbar-thumb-zinc-700">
                {generatedCovenants ? (
                  generatedCovenants
                ) : (
                  <span className="text-zinc-500 italic block py-4 text-center">자격을 갖추기 위해 왼쪽에서 원하는 임대 계약 특약을 선택하십시오.</span>
                )}
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <span className="text-[10px] text-zinc-500 font-sans">
                *본 특약은 대표 수분양주님의 이권을 수호하기 위해 사전 보정된 표준 법령 조절문입니다.
              </span>
              <button
                disabled={!generatedCovenants}
                onClick={handleCopyToClipboard}
                className={`w-full sm:w-auto px-4.5 py-2 rounded-full text-xs font-black transition-all active:scale-95 duration-100 flex items-center justify-center gap-1.5 cursor-pointer ${
                  generatedCovenants 
                    ? 'bg-[#f2ca50] hover:bg-yellow-400 text-[#3c2f00] shadow-sm' 
                    : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                }`}
              >
                <Clipboard className="w-3.5 h-3.5" /> 특약사항 문구 복사
              </button>
            </div>
          </div>
        </div>

        {/* Floating Clip Success Banner inside build if copied */}
        {copiedText && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-[#7dffa2]/10 border border-[#7dffa2]/20 text-[#7dffa2] text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5 animate-bounce"
          >
            <Share2 className="w-4 h-4" /> {copiedText}
          </motion.div>
        )}
      </section>
    </motion.div>
  );
}
