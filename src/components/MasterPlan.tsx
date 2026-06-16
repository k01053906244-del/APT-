import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ClipboardCheck, Eye, Info, TrendingDown, FileText, ArrowRight, Check, CheckCircle2 } from 'lucide-react';

interface MasterPlanProps {
  onOpenNotebook: (type: string) => void;
}

interface ChecklistItem {
  id: string;
  category: string;
  text: string;
}

export default function MasterPlan({ onOpenNotebook }: MasterPlanProps) {
  // Complete 14-item pre-inspection data schema from V3
  const PRE_INSPECTION_DATA: ChecklistItem[] = [
    { id: 'item1', category: '현관/거실', text: '현관문 도어락 작동 및 문틀 고무 패킹 밀착 상태 확인' },
    { id: 'item2', category: '현관/거실', text: '거실 아트월 타일 깨짐, 들뜸 및 줄눈 시공 불량 확인' },
    { id: 'item3', category: '현관/거실', text: '바닥 강마루 들뜸(밟았을 때 소리 오동작) 및 찍힘 확인' },
    { id: 'item4', category: '주방', text: '싱크대 하부장 걸레받이 안쪽 바닥 누수 및 습기 여부 확인' },
    { id: 'item5', category: '주방', text: '싱크대 상/하부장 문짝 수평 및 서랍 개폐 부드러움 확인' },
    { id: 'item6', category: '주방', text: '렌지후드 흡입력 및 인덕션/가스레인지 정상 작동 확인' },
    { id: 'item7', category: '욕실', text: '바닥 타일 구배(경사) 불량으로 인한 물 고임 현상 확인 (필수)' },
    { id: 'item8', category: '욕실', text: '세면대 및 양변기 하부 실리콘 마감 부실 및 누수 여부 확인' },
    { id: 'item9', category: '욕실', text: '수전(수도꼭지) 냉/온수 정상 전환 및 수압 상태 확인' },
    { id: 'item10', category: '침실/창호', text: '각 방 샤시(창문) 고정 장치 잠금 불량 및 흔들림 확인' },
    { id: 'item11', category: '침실/창호', text: '창문 하부 풍지판(바람막이) 누락 여부 확인 (겨울철 황소바람 방지)' },
    { id: 'item12', category: '침실/창호', text: '벽지 들뜸, 찢어짐, 오염 및 마감 훼손 부위 확인' },
    { id: 'item13', category: '발코니', text: '탄성코트(페인트) 균열, 들뜸 및 벗겨짐 현상 확인' },
    { id: 'item14', category: '발코니', text: '빨래건조대 및 전동 장치 구동 소음 및 작동 여부 확인' }
  ];

  // Selected room/area tabs for checklist filtering
  const categories = ['전체', '현관/거실', '주방', '욕실', '침실/창호', '발코니'];
  const [activeCategory, setActiveCategory] = useState<string>('전체');

  // Interactive checked state map
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    item1: false,
    item7: true, // Mark bath tile slope as crucial check initially
    item11: false,
  });

  // Toggle checklist check status
  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter items according to the active category tab
  const filteredItems = useMemo(() => {
    if (activeCategory === '전체') return PRE_INSPECTION_DATA;
    return PRE_INSPECTION_DATA.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  // Overall check list progress KPI
  const progressPercent = useMemo(() => {
    const totalCount = PRE_INSPECTION_DATA.length;
    const checkedCount = PRE_INSPECTION_DATA.filter(item => checkedItems[item.id]).length;
    return Math.round((checkedCount / totalCount) * 100);
  }, [checkedItems]);

  const checkedCountText = PRE_INSPECTION_DATA.filter(item => checkedItems[item.id]).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
      id="masterplan-tab-container"
    >
      {/* Real-time pre-inspection progress metrics */}
      <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg backdrop-blur-md">
        <div className="space-y-1 w-full md:w-auto">
          <div className="flex items-center gap-2 text-[#f2ca50]">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-wider">사전점검 체크 진척도</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">수분양주 셀프 사전점검 완성도</h2>
          <p className="text-xs text-slate-400">
            총 14개의 신축아파트 하자 다발 빈도 체크 시뮬레이션을 완료해 완벽 매물을 인도받으세요.
          </p>
        </div>

        <div className="flex flex-col items-end w-full md:w-64 gap-2">
          <div className="flex justify-between w-full text-xs font-bold text-slate-300">
            <span>완료한 항목</span>
            <span className="text-[#f2ca50] font-mono">{checkedCountText} / 14 개 세대</span>
          </div>
          <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-500 to-[#f2ca50] transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-black text-[#f2ca50] font-mono">{progressPercent}% 완료</span>
        </div>
      </section>

      {/* Category selector slider list */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-white/5">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-150 whitespace-nowrap cursor-pointer ${
              activeCategory === cat
                ? 'bg-[#f2ca50] text-[#3c2f00] font-extrabold shadow-sm'
                : 'bg-zinc-900/60 text-slate-400 hover:text-white hover:bg-zinc-800/80 border border-zinc-800/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main checklist container */}
      <div className="bg-[#1e1e1e]/60 border-l-4 border-l-[#f2ca50] p-6 rounded-2xl backdrop-blur-md">
        <h3 className="text-lg font-bold text-[#f2ca50] mb-6 flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-[#f2ca50]" />
          사전점검 권역별 정밀 필터링 항목
        </h3>
        
        <div className="space-y-3.5">
          <AnimatePresence mode="popLayout">
            {filteredItems.map(item => {
              const isChecked = !!checkedItems[item.id];
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-zinc-900/40 hover:bg-zinc-800/50 border border-white/[0.03] transition-colors group gap-4"
                >
                  <label className="flex items-start gap-4 cursor-pointer flex-1 select-none">
                    <div className="relative flex items-center justify-center mt-1">
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCheck(item.id)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                        isChecked 
                          ? 'border-[#f2ca50] bg-[#f2ca50] text-[#3c2f00]' 
                          : 'border-zinc-600 group-hover:border-[#f2ca50]'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-zinc-800 text-slate-400 px-1.5 py-0.5 rounded border border-white/5">
                          {item.category}
                        </span>
                      </div>
                      <span className={`text-sm md:text-base font-bold text-slate-100 group-hover:text-white transition-all duration-150 mt-1.5 ${isChecked ? 'line-through text-slate-500 opacity-55' : ''}`}>
                        {item.text}
                      </span>
                    </div>
                  </label>
                  
                  {/* Categorized Guide Quick Gateway Link */}
                  <button 
                    className="bg-[#f2ca50]/10 text-[#f2ca50] hover:bg-[#f2ca50]/20 text-xs px-3.5 py-1.5 rounded-full border border-[#f2ca50]/20 flex items-center gap-1 transition-all active:scale-95 shrink-0 self-start sm:self-center cursor-pointer"
                    onClick={() => {
                      const mapping: Record<string, string> = {
                        '현관/거실': 'entrance',
                        '주방': 'kitchen',
                        '욕실': 'bathroom',
                        '침실/창호': 'window',
                        '발코니': 'balcony'
                      };
                      onOpenNotebook(mapping[item.category] || 'bathroom');
                    }}
                  >
                    <Eye className="w-3.5 h-3.5" /> 대정리 가이드
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Practical Pre-inspection Tips & Advisory banner */}
      <div className="bg-[#f2ca50]/10 border border-[#f2ca50]/20 p-6 rounded-2xl flex gap-4">
        <div className="bg-[#f2ca50]/20 p-2.5 rounded-full h-fit flex justify-center items-center">
          <Info className="w-6 h-6 text-[#f2ca50]" />
        </div>
        <div>
          <h4 className="text-base font-bold text-[#f2ca50] mb-2">실전 사전점검 임대 마켓 마케팅 비교</h4>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            대행 외주업체를 사용해 사전점검 리포트(PDF 하자진단서)를 확보하셨다면, 이를 신속하게 다운로드하여 네이버 부동산 매물란과 인근 단지 중개업 소장님들방에 공유해 보세요. <span className="text-[#f2ca50] font-bold">‘체계적인 전문 하자 보수 조치 중인 명품 투명성 세대’</span>로 소장님들의 신뢰를 얻어 아파트 입주장의 대량 경쟁 속에서도 가장 높은 가격으로 원샷 임대차 계약이 성사되는 기폭제가 됩니다.
          </p>
        </div>
      </div>

      {/* NotebookLM vetted document gateway links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/10 pt-8">
        {/* Card 1: Policy Analysis */}
        <div 
          className="bg-[#1e1e1e]/60 p-6 rounded-2xl border border-[#f2ca50]/15 hover:border-[#f2ca50]/40 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          onClick={() => onOpenNotebook('policy')}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#f2ca50]">
              <TrendingDown className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">NotebookLM 핵심 데이터</span>
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-[#f2ca50] transition-colors">📉 뷰빈 부동산 정책 및 시장 분석</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              스트레스 DSR 2단계 규제 분석 및 취득세/대출 등 규제 정적 보정 속에서 황금 반전세 금리 스프레드를 얻기 위한 종합 보고서.
            </p>
          </div>
          <span className="text-[#f2ca50] text-xs font-bold mt-4 flex items-center gap-1">
            자료 분석 리포트 연동 <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Card 2: Legal Spec Clause */}
        <div 
          className="bg-[#1e1e1e]/60 p-6 rounded-2xl border border-[#7dffa2]/15 hover:border-[#7dffa2]/40 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          onClick={() => onOpenNotebook('special-contract')}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#7dffa2]">
              <FileText className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">NotebookLM 마스터 법전</span>
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-[#7dffa2] transition-colors">📜 전세권 설정 등기 특약 법적 효력 &amp; 방어 전략</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              임대인의 우선순위 근저당 이익 대출 등기를 안전하게 지키면서, 세입자를 법적으로 안심시키고 잔금 즉시 완납 절차를 체결하는 법적 계약용 특약 문구.
            </p>
          </div>
          <span className="text-[#7dffa2] text-xs font-bold mt-4 flex items-center gap-1">
            특약 전문 확인 및 문구 복사 <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Card 3: Administrative Required Documents Checklist */}
        <div 
          className="bg-[#1e1e1e]/60 p-6 rounded-2xl border-blue-400/15 hover:border-blue-400/40 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          onClick={() => onOpenNotebook('required-docs')}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-400">
              <ClipboardCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">NotebookLM 대응 행정</span>
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">📋 대출·등기·임대 필수 구비서류 체크리스트</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              잔금대출을 동원한 레버리지 성사 및 소유권이전등기 처리 시, 제출 지연을 무력화하기 위한 3대 행정 필수 가이드라인.
            </p>
          </div>
          <span className="text-blue-400 text-xs font-bold mt-4 flex items-center gap-1">
            구비서류 전문 확인 <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
