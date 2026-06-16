import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, Calculator, ShieldCheck, AlertOctagon, PlusCircle, AlertTriangle, Home } from 'lucide-react';
import { ProductType, ProductDetail } from '../types';

interface ProductAnalysisProps {
  onReturnToCalculator: () => void;
}

export default function ProductAnalysis({ onReturnToCalculator }: ProductAnalysisProps) {
  const [selectedType, setSelectedType] = useState<ProductType>('apt');

  const products: Record<ProductType, ProductDetail> = {
    apt: {
      bgClass: 'bg-[#f2ca50]/5 border-[#f2ca50]/15',
      titleLeft: '아파트 (Apartment) 투자 강점',
      titleLeftClass: 'text-[#f2ca50]',
      iconLeft: 'ShieldCheck',
      leftList: [
        '표준 규격화된 도면 및 세대로 거래 유동성이 독보적으로 높음 (높은 환금 대기수요)',
        '시세 검증이 용이(국토부 실거래가 및 KB시세 조회)하여 담보대출 감정비율이 가장 유리함',
        '체계화된 아파트 단지 관리 위탁으로 소유주의 실제 건물 유지보수 관리 부담 제로'
      ],
      titleRight: '아파트 투자 유의사항',
      titleRightClass: 'text-amber-300',
      iconRight: 'AlertTriangle',
      rightList: [
        '초기 진입 장벽 자본이 타 주택 유형보다 상대적으로 무거움 (매매 원가 절대치 높음)',
        '공용 및 대지 지분이 낮아, 연한 초과 시 초고층 재건축 공정분담금 분쟁 리스크 존재'
      ]
    },
    villa: {
      bgClass: 'bg-[#7dffa2]/5 border-[#7dffa2]/15',
      titleLeft: '빌라 / 다세대 투자 강점',
      titleLeftClass: 'text-[#7dffa2]',
      iconLeft: 'PlusCircle',
      leftList: [
        '초기 실자본금이 적어 소액 주택담보 갭투자 세팅 시 현금 투입 부담 최소화',
        '노후 저층 주택가 재개발 지정 시, 주택 입주권을 목적으로 지분 평당단가 폭등 수혜'
      ],
      titleRight: '빌라 투자 유의사항',
      titleRightClass: 'text-rose-300',
      iconRight: 'AlertOctagon',
      rightList: [
        '불투명한 유동성 및 정확한 감정가 평정의 한계로 인하여 전세사기/역전세 취약',
        '단일 신축 빌라 공급 급증 시 감가상각 가치 하강 우려 및 아파트 대비 더딘 자산 증가 속도'
      ]
    },
    house: {
      bgClass: 'bg-indigo-500/5 border-indigo-500/15',
      titleLeft: '단독 / 다가구 투자 강점',
      titleLeftClass: 'text-indigo-400',
      iconLeft: 'Home',
      leftList: [
        '지상 대지 지분율(땅 권한)이 총 대지면적 기준 절대적으로 많아 미래 토지 가치 안정 보장',
        '올수리 리모델링 및 용도변경(근린 상가 등) 기획을 통한 꼬마빌딩 밸류업 기회가 열려 있음'
      ],
      titleRight: '단독 / 다가구 유의사항',
      titleRightClass: 'text-rose-400',
      iconRight: 'AlertOctagon',
      rightList: [
        '보일러, 옥상 방수, 내부 배수관 등 노후 유지 관리의 물리적 노동비와 유지비 전액 임대인 부담',
        '거래 유동 주기가 통상 수개월에서 수년 이상까지 소요되며, 신속한 현금화 융통에 불리'
      ]
    }
  };

  const current = products[selectedType];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header Info Banner */}
      <div className="bg-[#1e1e1e]/60 border-l-4 border-l-[#f2ca50] p-6 rounded-2xl backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#f2ca50] text-[#3c2f00] font-black text-xs">3</span>
            <h3 className="text-lg font-bold text-[#f2ca50] flex items-center gap-2">
              <Building2 className="w-4.5 h-4.5" /> 투자 대상 상품 분류 분석
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            신축 단지 아파트뿐만 아니라, 주거 지형에 배포된 다른 대표적 주택 유형의 가치를 교차 분석하여 리스크와 가치 균형을 평정할 필요가 있습니다.
          </p>
        </div>

        <button 
          onClick={onReturnToCalculator}
          className="bg-[#f2ca50]/15 hover:bg-[#f2ca50]/25 text-[#f2ca50] text-xs px-4 py-2 rounded-full border border-[#f2ca50]/20 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0 animate-pulse"
        >
          <Calculator className="w-3.5 h-3.5" /> 계산기 복귀
        </button>
      </div>

      <div className="bg-[#1e1e1e]/60 p-5 md:p-6 rounded-2xl border border-white/5 space-y-6">
        {/* Real-estate 3-tab select array */}
        <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm">
          <button 
            onClick={() => setSelectedType('apt')}
            className={`py-3 px-2 sm:px-4 rounded-xl font-bold transition-all duration-200 cursor-pointer text-center ${
              selectedType === 'apt' 
                ? 'bg-[#f2ca50] text-[#3c2f00] shadow-md font-extrabold'
                : 'bg-zinc-900 border border-zinc-800 text-slate-400 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            🏢 아파트 (초점)
          </button>
          <button 
            onClick={() => setSelectedType('villa')}
            className={`py-3 px-2 sm:px-4 rounded-xl font-bold transition-all duration-200 cursor-pointer text-center ${
              selectedType === 'villa' 
                ? 'bg-[#f2ca50] text-[#3c2f00] shadow-md font-extrabold'
                : 'bg-zinc-900 border border-zinc-800 text-slate-400 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            🏘️ 빌라 / 다세대
          </button>
          <button 
            onClick={() => setSelectedType('house')}
            className={`py-3 px-2 sm:px-4 rounded-xl font-bold transition-all duration-200 cursor-pointer text-center ${
              selectedType === 'house' 
                ? 'bg-[#f2ca50] text-[#3c2f00] shadow-md font-extrabold'
                : 'bg-zinc-900 border border-zinc-800 text-slate-400 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            🏡 단독주택 / 다가구
          </button>
        </div>

        {/* Tab detail list display block */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedType}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl border ${current.bgClass}`}
          >
            {/* Strengths panel */}
            <div className="space-y-4">
              <h4 className={`text-base font-extrabold flex items-center gap-1.5 ${current.titleLeftClass}`}>
                {selectedType === 'apt' && <ShieldCheck className="w-5 h-5 text-[#f2ca50]" />}
                {selectedType === 'villa' && <PlusCircle className="w-5 h-5 text-[#7dffa2]" />}
                {selectedType === 'house' && <Home className="w-5 h-5 text-indigo-400" />}
                {current.titleLeft}
              </h4>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
                {current.leftList.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-[#7dffa2] font-black mr-2 bg-[#7dffa2]/10 px-1.5 py-0.2 rounded-md">✓</span>
                    <span className="leading-relaxed text-left">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Warnings panel */}
            <div className="space-y-4">
              <h4 className={`text-base font-extrabold flex items-center gap-1.5 ${current.titleRightClass}`}>
                {selectedType === 'apt' && <AlertTriangle className="w-5 h-5 text-amber-300" />}
                {selectedType === 'villa' && <AlertOctagon className="w-5 h-5 text-rose-300" />}
                {selectedType === 'house' && <AlertOctagon className="w-5 h-5 text-rose-400" />}
                {current.titleRight}
              </h4>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
                {current.rightList.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-rose-400 font-black mr-2 bg-rose-500/10 px-1.5 py-0.2 rounded-md">!</span>
                    <span className="leading-relaxed text-left">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
