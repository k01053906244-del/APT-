import React from 'react';
import { motion } from 'motion/react';
import { Coins, Calculator, Key, Handshake, Landmark } from 'lucide-react';

interface InvestmentAnalysisProps {
  onReturnToCalculator: () => void;
}

export default function InvestmentAnalysis({ onReturnToCalculator }: InvestmentAnalysisProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header Info Block */}
      <div className="bg-[#1e1e1e]/60 border-l-4 border-l-[#f2ca50] p-6 rounded-2xl backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#f2ca50] text-[#3c2f00] font-black text-xs">4</span>
            <h3 className="text-lg font-bold text-[#f2ca50] flex items-center gap-2">
              <Coins className="w-4.5 h-4.5" /> 아파트 진입 전략 비교 분석
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            자산 가용 규모와 목표 투자 성향에 최적화된 아파트 진입 전략을 세우십시오. 초기 최소 대기 자본과 리스크를 정교히 설계해야 합니다.
          </p>
        </div>

        <button 
          onClick={onReturnToCalculator}
          className="bg-[#f2ca50]/15 hover:bg-[#f2ca50]/25 text-[#f2ca50] text-xs px-4 py-2 rounded-full border border-[#f2ca50]/20 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <Calculator className="w-3.5 h-3.5" /> 계산기 복귀
        </button>
      </div>

      {/* Grid of 3 pathways */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Unit A: 청약 / 분양 */}
        <div className="bg-[#1e1e1e]/60 p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-full hover:border-[#f2ca50]/30 transition-all group shadow-lg">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl"><Key className="w-7 h-7 text-[#f2ca50]" /></span>
              <span className="text-[10px] font-black bg-[#f2ca50]/20 text-[#f2ca50] px-2.5 py-1 rounded-full border border-[#f2ca50]/10 tracking-wider">신축 프리미엄</span>
            </div>
            
            <h4 className="font-extrabold text-lg text-white group-hover:text-[#f2ca50] transition-colors text-left">분양 / 청약</h4>
            <p className="text-xs text-slate-400 leading-relaxed text-left">
              계약금 납입 단계 이후 공사기간 동안 대금 분납(중도금 무이자 대출 등)이 가능하여 최초 계약 보증 자본만 확보되면 즉시 분양권을 확보할 수 있는 대중적 신주 유통의 관문입니다.
            </p>
            
            <div className="pt-3.5 space-y-2 border-t border-white/5 text-xs text-left">
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">초기 필요 현금</span>
                <span className="font-bold text-slate-300">총공급가의 10~20%</span>
              </div>
              <div className="flex justify-between font-medium font-sans">
                <span className="text-slate-500">당첨 진입 장벽</span>
                <span className="font-bold text-slate-300">매우 높음 (소득 규제 및 가점제)</span>
              </div>
            </div>
          </div>
          
          <div className="bg-zinc-950/40 p-3.5 rounded-xl mt-6 text-xs text-slate-400 leading-relaxed border border-white/5 text-left">
            💡 <strong>실전 전술:</strong> 최근 자재 마진 원가 고공 행진으로 분양가 메리트가 낮아진 만큼, 인접지 준신축 대장아파트 평당 실거래가 대비 완연한 안전마진이 확실히 보장되는지 선행 분석해야 합니다.
          </div>
        </div>

        {/* Unit B: 매매 / 갭투자 */}
        <div className="bg-[#1e1e1e]/60 p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-full hover:border-[#7dffa2]/35 transition-all group shadow-lg">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl"><Handshake className="w-7 h-7 text-[#7dffa2]" /></span>
              <span className="text-[10px] font-black bg-[#7dffa2]/20 text-[#7dffa2] px-2.5 py-1 rounded-full border border-[#7dffa2]/10 tracking-wider">기존가치 즉각획득</span>
            </div>
            
            <h4 className="font-extrabold text-lg text-white group-hover:text-[#7dffa2] transition-colors text-left">일반매매 / 갭투자</h4>
            <p className="text-xs text-slate-400 leading-relaxed text-left">
              기존에 안전이 입증된 아파트 실물을 눈으로 직접 확인하고 선호 거래가로 등기 수권화 조치를 취하는 가장 기본적이고 빈도가 높은 안전성 매수 방식입니다.
            </p>
            
            <div className="pt-3.5 space-y-2 border-t border-white/5 text-xs text-left">
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">초기 필요 현금</span>
                <span className="font-bold text-slate-300">LTV 배정 차액 (혹은 실투자 갭)</span>
              </div>
              <div className="flex justify-between font-medium font-sans">
                <span className="text-slate-500">진입 장벽</span>
                <span className="font-bold text-slate-300">보통 (소유주 자금력 완납 가능 여부)</span>
              </div>
            </div>
          </div>
          
          <div className="bg-zinc-950/40 p-3.5 rounded-xl mt-6 text-xs text-slate-400 leading-relaxed border border-white/5 text-left">
            💡 <strong>실전 전술:</strong> 매도인의 잔금 변제 압박 또는 세를 안은 조건부 기매물(급매/급급매)을 중점 포착할 때 하락 정적인 저점에 안전하게 발을 디딜 개연성이 극대화됩니다.
          </div>
        </div>

        {/* Unit C: 법원 경매 */}
        <div className="bg-[#1e1e1e]/60 p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-full hover:border-indigo-400/40 transition-all group shadow-lg">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl"><Landmark className="w-7 h-7 text-indigo-400" /></span>
              <span className="text-[10px] font-black bg-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded-full border border-indigo-500/10 tracking-wider">도매가 할인 수취</span>
            </div>
            
            <h4 className="font-extrabold text-lg text-white group-hover:text-indigo-400 transition-colors text-left">부동산 법원경매</h4>
            <p className="text-xs text-slate-400 leading-relaxed text-left">
              금융/개인 채무 불이행 대금을 환수하기 위해 법원이 직접 공매하는 압류 부동산 물건을 법정 최고가 공개 경쟁 입찰로 참여해 시세 아래 도매가 수준인 저가 낙찰을 받는 특수 공법입니다.
            </p>
            
            <div className="pt-3.5 space-y-2 border-t border-white/5 text-xs text-left">
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">초기 필요 현금</span>
                <span className="font-bold text-slate-300">최저입찰보증금 10% 및 경락대금 잔금</span>
              </div>
              <div className="flex justify-between font-medium font-sans">
                <span className="text-slate-500">진입 장벽</span>
                <span className="font-bold text-slate-300">매우 높음 (소송 및 권리분석 능력)</span>
              </div>
            </div>
          </div>
          
          <div className="bg-zinc-950/40 p-3.5 rounded-xl mt-6 text-xs text-slate-400 leading-relaxed border border-white/5 text-left">
            💡 <strong>실전 전술:</strong> 인수권리(대항력 세입자, 유치권 등)가 없는 완전클린 물건을 등기 전조사할 수 있고, 시세 하락 흐름에서 유찰 2회 가량 거친 법원감정가 60~70% 선점 시 불패의 마진이 확보됩니다.
          </div>
        </div>
      </div>
    </motion.div>
  );
}
