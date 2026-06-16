import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map, Calculator, Sliders, Play, CheckCircle, ChevronDown, ChevronUp, Edit } from 'lucide-react';
import { LocationPreset } from '../types';

interface LocationAnalysisProps {
  onReturnToCalculator: () => void;
}

export default function LocationAnalysis({ onReturnToCalculator }: LocationAnalysisProps) {
  // Preset databases
  const presets: Record<string, LocationPreset> = {
    mafo: {
      name: "수원 매교역 팰루시드",
      traffic: 9,
      environment: 9,
      jobs: 9,
      infra: 8,
      nature: 6,
      school: 8
    },
    geomdan: {
      name: "검단 아라 신도시",
      traffic: 6,
      environment: 10,
      jobs: 5,
      infra: 7,
      nature: 9,
      school: 8
    },
    jangwi: {
      name: "장위 래디언트",
      traffic: 8,
      environment: 9,
      jobs: 7,
      infra: 7,
      nature: 8,
      school: 7
    }
  };

  // State Management
  const [aptName, setAptName] = useState<string>(() => {
    try {
      return localStorage.getItem('byubin_apt_name') || "신축 아파트";
    } catch {
      return "신축 아파트";
    }
  });
  const [traffic, setTraffic] = useState<number>(9);
  const [environment, setEnvironment] = useState<number>(9);
  const [jobs, setJobs] = useState<number>(9);
  const [infra, setInfra] = useState<number>(8);
  const [nature, setNature] = useState<number>(6);
  const [school, setSchool] = useState<number>(8);
  const [activePreset, setActivePreset] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('byubin_apt_name');
      return (!saved || saved === "수원 매교역 팰루시드") ? "mafo" : "custom";
    } catch {
      return "mafo";
    }
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleAptNameSync = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail !== undefined) {
        setAptName(customEvent.detail || '신축 아파트');
        setActivePreset('custom');
      } else {
        const savedApt = localStorage.getItem('byubin_apt_name');
        setAptName(savedApt || '신축 아파트');
        setActivePreset(savedApt === '수원 매교역 팰루시드' ? 'mafo' : 'custom');
      }
    };
    window.addEventListener('byubin_apt_name_updated', handleAptNameSync);
    return () => {
      window.removeEventListener('byubin_apt_name_updated', handleAptNameSync);
    };
  }, []);

  // Helper to load presets
  const handleApplyPreset = (key: string) => {
    setActivePreset(key);
    if (key === 'custom') return;
    
    const data = presets[key];
    if (data) {
      setAptName(data.name);
      setTraffic(data.traffic);
      setEnvironment(data.environment);
      setJobs(data.jobs);
      setInfra(data.infra);
      setNature(data.nature);
      setSchool(data.school);
    }
  };

  const handleSliderChange = (type: string, val: number) => {
    setActivePreset('custom');
    switch (type) {
      case 'traffic': setTraffic(val); break;
      case 'environment': setEnvironment(val); break;
      case 'jobs': setJobs(val); break;
      case 'infra': setInfra(val); break;
      case 'nature': setNature(val); break;
      case 'school': setSchool(val); break;
    }
  };

  // Mathematical average calculations
  const averageScore = parseFloat(((traffic + environment + jobs + infra + nature + school) / 6).toFixed(1));

  // Determine letter grade and text
  let gradeBadge = "C등급 관망대상지";
  let gradeText = "인프라 및 미래 호재 대기 구역";
  let badgeColorClass = "bg-rose-500 text-white";

  if (averageScore >= 9.0) {
    gradeBadge = "S+등급 초고입지";
    gradeText = "강남/도심 핵심 최상위 주거 쾌적지";
    badgeColorClass = "bg-[#7dffa2] text-[#131313]";
  } else if (averageScore >= 8.0) {
    gradeBadge = "S등급 최우수입지";
    gradeText = "도심 밀집 인프라 명품 주거 권역";
    badgeColorClass = "bg-[#7dffa2]/90 text-[#131313]";
  } else if (averageScore >= 7.0) {
    gradeBadge = "A등급 우수입지";
    gradeText = "교통 및 일자리 중심 밸런스형 단지";
    badgeColorClass = "bg-[#f2ca50] text-[#3c2f00]";
  } else if (averageScore >= 6.0) {
    gradeBadge = "B등급 양호입지";
    gradeText = "주거 쾌적성 중심 신흥 개발 거점";
    badgeColorClass = "bg-orange-400 text-zinc-950";
  }

  // Bar Graph color classes based on rank
  const getBarColorClass = (val: number): string => {
    if (val >= 9) return "bg-[#7dffa2]";
    if (val >= 7) return "bg-[#f2ca50]";
    if (val >= 5) return "bg-orange-400";
    return "bg-rose-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header Container */}
      <div className="bg-[#1e1e1e]/60 border-l-4 border-l-[#7dffa2] p-6 rounded-2xl backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#7dffa2] text-[#131313] font-black text-xs">2</span>
            <h3 className="text-lg font-bold text-[#7dffa2] flex items-center gap-2">
              <Map className="w-4.5 h-4.5" /> 미시적 입지 분석 시뮬레이터 (6대 요소)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            "부동산 시장 여건이 양호해도 개별 아파트의 자산 가격을 주도하는 것은 결국 입지입니다." 6대 핵심 입지 요소를 점조사하여 절대 가치를 판정해 보십시오.
          </p>
        </div>

        <button 
          onClick={onReturnToCalculator}
          className="bg-[#f2ca50]/15 hover:bg-[#f2ca50]/25 text-[#f2ca50] text-xs px-4 py-2 rounded-full border border-[#f2ca50]/20 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <Calculator className="w-3.5 h-3.5" /> 계산기 복귀
        </button>
      </div>

      {/* Styled AI Accordion Drawer Toggle */}
      <div className="w-full">
        <button 
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className="w-full py-4 px-6 rounded-2xl font-black text-sm tracking-wide text-cyan-400 bg-gradient-to-r from-purple-950/40 via-[#0d1b3e]/40 to-cyan-950/40 border border-purple-500/40 shadow-2xl hover:border-cyan-400/80 transition-all flex items-center justify-center gap-2.5 cursor-pointer outline-none active:scale-[0.99] duration-200"
        >
          🔮 6대 입지 경쟁력 평가 요소별 표준 분석 리서치
          {isDrawerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <AnimatePresence>
          {isDrawerOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                {/* 1. 교통 */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#7dffa2]/30 transition-all duration-200 group">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#7dffa2]/10 text-[#7dffa2] group-hover:scale-105 duration-150 text-sm">🚇</span>
                    <span className="text-xs font-extrabold text-white">교통 편의성</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">지하철역 도보 접근성, 주요 도심(강남/여의도 등) 도달 소요 시간, 교통 신설 호재 수혜지 분석</p>
                </div>
                
                {/* 2. 환경 */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#7dffa2]/30 transition-all duration-200 group">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#7dffa2]/10 text-[#7dffa2] group-hover:scale-105 duration-150 text-sm">🏙️</span>
                    <span className="text-xs font-extrabold text-white">주거 쾌적성</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">아파트 연식(신축 프리미엄), 대단지 브랜드 가치, 세대당 주차 넉넉함, 주차 지하화 및 커뮤니티 면적</p>
                </div>

                {/* 3. 직종 */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#7dffa2]/30 transition-all duration-200 group">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#7dffa2]/10 text-[#7dffa2] group-hover:scale-105 duration-150 text-sm">💼</span>
                    <span className="text-xs font-extrabold text-white">직주 근접성</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">고소득 전문직 배후수요, 주요 IT 대기업군 및 바이오벨트 산업 단지의 통근 물리적 쾌속 가능성</p>
                </div>

                {/* 4. 생활 */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#7dffa2]/30 transition-all duration-200 group">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#7dffa2]/10 text-[#7dffa2] group-hover:scale-105 duration-150 text-sm">🛒</span>
                    <span className="text-xs font-extrabold text-white">생활 인프라</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">대형마트·백화점 인접 정도, 대형 종합병원 근접 골든아워, 랜드마크 중심상업지역 상권의 발달기</p>
                </div>

                {/* 5. 자연 */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#7dffa2]/30 transition-all duration-200 group">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#7dffa2]/10 text-[#7dffa2] group-hover:scale-105 duration-150 text-sm">🌳</span>
                    <span className="text-xs font-extrabold text-white">자연 친화성</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">인근 대규모 숲세권 파크 가치, 강·수변공원(천) 전방 뷰, 운동 산책 및 가족 액티비티 쾌적 코스 보유</p>
                </div>

                {/* 6. 학군 */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#7dffa2]/30 transition-all duration-200 group">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#7dffa2]/10 text-[#7dffa2] group-hover:scale-105 duration-150 text-sm">🎓</span>
                    <span className="text-xs font-extrabold text-white">명문 학군력</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">명문 학군 배정권(대치/부천/광교 학원가 등 라이딩 가능 범위), 초품아(초등학교를 안심 품은 아파트)</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🏢 주력 단지 퀵 프리셋 배지 영역 */}
      <div className="bg-[#1e1e1e]/60 p-5 rounded-2xl border border-white/5 space-y-3">
        <h4 className="text-xs font-extrabold text-slate-300 flex items-center gap-1">
          <span className="text-xs text-[#7dffa2]">🏢</span>
          주력 단지 입지별 프리셋 (원클릭 자동 세팅 적용)
        </h4>
        <div className="flex flex-wrap gap-2 text-xs">
          <button 
            onClick={() => handleApplyPreset('mafo')}
            className={`py-2 px-3 rounded-xl font-bold transition-all duration-200 active:scale-95 cursor-pointer ${
              activePreset === 'mafo' 
                ? 'bg-[#7dffa2]/20 border border-[#7dffa2] text-[#7dffa2]' 
                : 'bg-zinc-900 border border-zinc-800 text-slate-300 hover:border-zinc-700'
            }`}
          >
            🏢 수원 매교역 팰루시드 (도심초밀집)
          </button>
          <button 
            onClick={() => handleApplyPreset('geomdan')}
            className={`py-2 px-3 rounded-xl font-bold transition-all duration-200 active:scale-95 cursor-pointer ${
              activePreset === 'geomdan' 
                ? 'bg-[#7dffa2]/20 border border-[#7dffa2] text-[#7dffa2]' 
                : 'bg-zinc-900 border border-zinc-800 text-slate-300 hover:border-zinc-700'
            }`}
          >
            🏘️ 검단 아라 신도시 (신흥주거대단지)
          </button>
          <button 
            onClick={() => handleApplyPreset('jangwi')}
            className={`py-2 px-3 rounded-xl font-bold transition-all duration-200 active:scale-95 cursor-pointer ${
              activePreset === 'jangwi' 
                ? 'bg-[#7dffa2]/20 border border-[#7dffa2] text-[#7dffa2]' 
                : 'bg-zinc-900 border border-zinc-800 text-slate-300 hover:border-zinc-700'
            }`}
          >
            🏡 장위 래디언트 (도크 교통밸런스)
          </button>
          <button 
            onClick={() => handleApplyPreset('custom')}
            className={`py-2 px-3 rounded-xl font-bold transition-all duration-200 active:scale-95 cursor-pointer ${
              activePreset === 'custom' 
                ? 'bg-[#f2ca50]/20 border border-[#f2ca50] text-[#f2ca50]' 
                : 'bg-zinc-900 border border-zinc-800 text-slate-300 hover:border-zinc-700'
            }`}
          >
            ✨ 직접 커스텀 조정
          </button>
        </div>
      </div>

      {/* 아파트명 직접 수동 타이핑 */}
      <div className="bg-[#1e1e1e]/60 p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center gap-3">
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 shrink-0">
          <Edit className="w-3.5 h-3.5 text-[#7dffa2]" />
          분석 대상 특정 아파트명 수동 설정:
        </span>
        <input 
          type="text"
          value={aptName}
          onChange={(e) => {
            setAptName(e.target.value);
            setActivePreset('custom');
          }}
          placeholder="단지 명칭을 입력하세요"
          className="flex-1 w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#7dffa2] transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Interactive Sliders */}
        <div className="bg-[#1e1e1e]/60 p-6 md:p-8 rounded-2xl border border-white/5 space-y-6 flex flex-col justify-center">
          <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-[#7dffa2]" />
            개별 입지 미세조정 점수 (1~10점)
          </h4>
          
          <div className="space-y-4">
            {/* 교통 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>🚇 교통 배정성 (도심 접근도)</span>
                <span className="text-[#7dffa2] font-bold font-mono">{traffic} / 10점</span>
              </div>
              <input 
                type="range" min="1" max="10" value={traffic}
                onChange={(e) => handleSliderChange('traffic', parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#7dffa2]"
              />
            </div>

            {/* 주거환경 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>🏙️ 주거 쾌적성 (브랜드 대단지)</span>
                <span className="text-[#7dffa2] font-bold font-mono">{environment} / 10점</span>
              </div>
              <input 
                type="range" min="1" max="10" value={environment}
                onChange={(e) => handleSliderChange('environment', parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#7dffa2]"
              />
            </div>

            {/* 일자리 배정 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>💼 주요 상권 일자리 접근 인합성</span>
                <span className="text-[#7dffa2] font-bold font-mono">{jobs} / 10점</span>
              </div>
              <input 
                type="range" min="1" max="10" value={jobs}
                onChange={(e) => handleSliderChange('jobs', parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#7dffa2]"
              />
            </div>

            {/* 생활 인프라 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>🛒 생활 마켓 인프라 (백화점/병원 등)</span>
                <span className="text-[#7dffa2] font-bold font-mono">{infra} / 10점</span>
              </div>
              <input 
                type="range" min="1" max="10" value={infra}
                onChange={(e) => handleSliderChange('infra', parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#7dffa2]"
              />
            </div>

            {/* 자연환경 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>🌳 자연권 (강변 숲세권 조경가치)</span>
                <span className="text-[#7dffa2] font-bold font-mono">{nature} / 10점</span>
              </div>
              <input 
                type="range" min="1" max="10" value={nature}
                onChange={(e) => handleSliderChange('nature', parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#7dffa2]"
              />
            </div>

            {/* 학군 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>🎓 학원 학군력 (중/고 학업 배정율)</span>
                <span className="text-[#7dffa2] font-bold font-mono">{school} / 10점</span>
              </div>
              <input 
                type="range" min="1" max="10" value={school}
                onChange={(e) => handleSliderChange('school', parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#7dffa2]"
              />
            </div>
          </div>
        </div>

        {/* Right Output Graphs */}
        <div className="bg-[#1e1e1e]/60 p-6 md:p-8 rounded-2xl border border-white/5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h4 className="text-xs sm:text-sm font-black text-slate-300 flex items-center gap-1.5">
              🏢 [<span className="text-[#7dffa2]">{aptName || "선택지"}</span>] 종합 가치 평가 리포트
            </h4>
            
            <div className="space-y-4 text-xs font-semibold">
              {/* Graph items */}
              {[
                { label: "🚇 교통 배정성", val: traffic },
                { label: "🏙️ 주거 쾌적성", val: environment },
                { label: "💼 일자리 접근", val: jobs },
                { label: "🛒 생활 인프라", val: infra },
                { label: "🌳 자연권 가치", val: nature },
                { label: "🎓 학군 학원가", val: school },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>{item.label}</span>
                    <span className="font-extrabold text-[#7dffa2] font-mono">{item.val}점</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${getBarColorClass(item.val)}`}
                      style={{ width: `${item.val * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Letter grade output box */}
          <div className="bg-[#7dffa2]/5 p-4 rounded-xl border border-[#7dffa2]/25 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-[#7dffa2] uppercase tracking-wider block">소유 가치 종합 지수</span>
              <div className="text-xl md:text-2xl font-black text-white font-mono">
                {averageScore} <span className="text-xs text-slate-500 font-normal">/ 10점</span>
              </div>
            </div>
            
            <div className="text-right space-y-1">
              <span className={`text-[11px] px-2.5 py-1 rounded-full font-black shadow-md ${badgeColorClass}`}>
                {gradeBadge}
              </span>
              <p className="text-[10px] text-slate-400 mt-1 leading-tight">{gradeText}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
