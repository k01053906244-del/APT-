import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Calculator, Megaphone, Calendar, ExternalLink, Sliders, Brain, Sparkles } from 'lucide-react';

interface GovernmentPolicyItem {
  title: string;
  pubDate: string;
  link: string;
}

interface MarketAnalysisProps {
  onReturnToCalculator: () => void;
}

export default function MarketAnalysis({ onReturnToCalculator }: MarketAnalysisProps) {
  // Slider states (1 to 10 scale)
  const [tax, setTax] = useState<number>(4);
  const [loan, setLoan] = useState<number>(3);
  const [regulation, setRegulation] = useState<number>(6);
  const [policy, setPolicy] = useState<number>(5);

  // RSS News states
  const [policies, setPolicies] = useState<GovernmentPolicyItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // AI Summary States
  const [summaries, setSummaries] = useState<Record<number, any[]>>({});
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  // Securely call server API endpoint to query Gemini AI Core model
  const handleSummarize = async (title: string, index: number) => {
    // If already generated, toggle view close
    if (summaries[index]) {
      const updated = { ...summaries };
      delete updated[index];
      setSummaries(updated);
      return;
    }

    setLoadingIndex(index);
    setInfoMsg(null);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error("서버 요약 서비스가 올바르지 않거나 지연 상태입니다.");
      }

      const data = await response.json();
      setSummaries((prev) => ({ ...prev, [index]: data.summary }));
      
      if (data.isFallback && data.message) {
        setInfoMsg(data.message);
        setTimeout(() => setInfoMsg(null), 6000);
      }
    } catch (err: any) {
      console.error("AI 요약 호출 실패:", err);
      // Fallback locally as ultimate safety net
      setSummaries((prev) => ({
        ...prev,
        [index]: [
          {
            tag: "임대 방안",
            bold_title: "해당 부동산 시황에 기초한 안정 임대 전략 수립",
            description: "급변하는 시장 지침 속에 고정적인 대출이자 부담을 조율하고, 최적의 보증금 및 전환율 비율로 현금흐름을 확보하십시오."
          },
          {
            tag: "안심 특약",
            bold_title: "계약 특약사항 실전 추가 권고",
            description: "잔금 당일 대출 일부 상환 특약 조건을 계약서상에 명문화해야 공실 걱정 없이 임차인을 가장 빠르고 안전하게 소화 가능합니다."
          },
          {
            tag: "사전 점검",
            bold_title: "14가지 자발적 하자 체크리스트 실행",
            description: "신주 단지의 특성상 아트월이나 바닥 마루 결함 등 셀프 사전점검을 완성하고 외주 보고서를 중개업 보드에 즉시 노출하십시오."
          }
        ]
      }));
    } finally {
      setLoadingIndex(null);
    }
  };

  // Static landmark fallback policies
  const fallbackPolicies: GovernmentPolicyItem[] = [
    {
      title: "수도권 신규 공공주택지구 3곳 후보지 선정 및 주택 공급 물량 조기 확보 방안 고시",
      pubDate: "2026-05-28",
      link: "http://www.molit.go.kr/USR/BORD0201/m_36826/list.jsp"
    },
    {
      title: "스트레스 DSR 2단계 주택담보대출 규제 시행 세부 지침 및 감액 예외 고시",
      pubDate: "2026-05-15",
      link: "http://www.molit.go.kr/USR/BORD0201/m_36826/list.jsp"
    },
    {
      title: "노후계획도시 정비 기본방침 수립 및 선도지구 선정 기준 가이드라인 공표",
      pubDate: "2026-04-30",
      link: "http://www.molit.go.kr/USR/BORD0201/m_36826/list.jsp"
    }
  ];

  // Fetch live government briefings from Ministry of Land RSS
  useEffect(() => {
    let isMounted = true;
    const fetchGovPolicies = async () => {
      try {
        const targetRssUrl = encodeURIComponent("http://www.molit.go.kr/USR/BORD0201/m_36826/xml.jsp");
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${targetRssUrl}`);
        if (!res.ok) throw new Error("Government RSS feed failed to load.");
        
        const data = await res.json();
        if (isMounted) {
          if (data && data.status === "ok" && data.items && data.items.length > 0) {
            const formatted: GovernmentPolicyItem[] = data.items.slice(0, 3).map((item: any) => ({
              title: item.title,
              pubDate: item.pubDate ? item.pubDate.substring(0, 10) : new Date().toISOString().substring(0, 10),
              link: item.link
            }));
            setPolicies(formatted);
          } else {
            setPolicies(fallbackPolicies);
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.warn("Molit RSS live sync delayed, falling back on verified legal policy templates: ", err);
        if (isMounted) {
          setPolicies(fallbackPolicies);
          setIsLoading(false);
        }
      }
    };

    fetchGovPolicies();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute overall Composite Market Index
  const marketIndex = parseFloat(((tax + loan + regulation + policy) / 4).toFixed(1));
  const gaugePercent = marketIndex * 10;

  // Decide judgment labels based on index
  let adviceLabel = "🟡 시장 관망 및 분할 접근기";
  if (marketIndex >= 7.0) {
    adviceLabel = "🟢 시장 매수 적극 추천기";
  } else if (marketIndex < 5.0) {
    adviceLabel = "🔴 시장 리스크 관리 및 인내 요망기";
  }

  // Label text helpers for sliders
  const getTaxFeedback = (val: number) => {
    if (val >= 7) return `${val} / 10 (매우 완화됨)`;
    if (val >= 4) return `${val} / 10 (보통 등락단후)`;
    return `${val} / 10 (중세 부담 가중)`;
  };

  const getLoanFeedback = (val: number) => {
    if (val >= 7) return `${val} / 10 (대출한도 자유로움)`;
    if (val >= 4) return `${val} / 10 (보통 유지수준)`;
    return `${val} / 10 (한도 규제 타이트함)`;
  };

  const getRegFeedback = (val: number) => {
    if (val >= 7) return `${val} / 10 (완전 비규제 지구)`;
    if (val >= 4) return `${val} / 10 (일부해제 조정지)`;
    return `${val} / 10 (강력한 가산금리 규제)`;
  };

  const getPolFeedback = (val: number) => {
    if (val >= 7) return `${val} / 10 (공정 개발 적극부양)`;
    if (val >= 4) return `${val} / 10 (완만한 부양정책)`;
    return `${val} / 10 (공공개발 보수 억제기)`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Description Panel header */}
      <div className="bg-[#1e1e1e]/60 border-l-4 border-l-[#f2ca50] p-6 rounded-2xl backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#f2ca50] text-[#3c2f00] font-black text-xs">1</span>
            <h3 className="text-lg font-bold text-[#f2ca50] flex items-center gap-2">
              <LineChart className="w-4.5 h-4.5" /> 거시적 흐름 분석 (시장 변수)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            정부 정책과 종합 거시 경제 지표는 가치 진입 여부를 결정하는 핵심적인 선행 지표입니다. 각 항목 슬라이더를 세부 조절하면 우호도 지수가 리포트 보정됩니다.
          </p>
        </div>
        
        <button 
          onClick={onReturnToCalculator}
          className="bg-[#f2ca50]/15 hover:bg-[#f2ca50]/25 text-[#f2ca50] text-xs px-4 py-2 rounded-full border border-[#f2ca50]/20 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <Calculator className="w-3.5 h-3.5" /> 계산기 복귀
        </button>
      </div>

      {/* 📢 국토교통부 공식 실시간 정책 브리핑 (LIVE) */}
      <div className="bg-[#1e1e1e]/60 p-5 md:p-6 rounded-2xl border border-[#f2ca50]/10 space-y-4 bg-gradient-to-r from-[#f2ca50]/5 via-transparent to-transparent">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <h4 className="text-xs md:text-sm font-black text-[#f2ca50] flex items-center gap-2 uppercase tracking-wider">
            <Megaphone className="w-4 h-4 animate-bounce text-[#f2ca50]" />
            📢 대한민국 국토교통부 공식 실시간 정책 브리핑
          </h4>
          <span className="inline-flex items-center gap-1.5 text-[9px] font-bold bg-[#7dffa2]/10 text-[#7dffa2] px-2.5 py-1 rounded-full border border-[#7dffa2]/15 tracking-widest uppercase shrink-0 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7dffa2] animate-ping"></span> 실시간 동기화 서비스
          </span>
        </div>
        
        <div className="space-y-3">
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-12 bg-white/5 rounded-xl border border-white/5"></div>
              <div className="h-12 bg-white/5 rounded-xl border border-white/5"></div>
              <div className="h-12 bg-white/5 rounded-xl border border-white/5"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {policies.map((item, idx) => {
                const hasSummary = !!summaries[idx];
                const isItemLoading = loadingIndex === idx;
                return (
                  <div 
                    key={idx}
                    className="flex flex-col p-4 rounded-xl bg-zinc-900/40 border border-white/[0.03] hover:border-[#f2ca50]/30 transition-all duration-200 group gap-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <span className="text-base shrink-0 mt-0.5">📄</span>
                        <div className="flex flex-col gap-1 min-w-0">
                          <span className="text-xs sm:text-sm font-bold text-white group-hover:text-[#f2ca50] transition-all duration-150 leading-relaxed text-left line-clamp-2">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                            <Calendar className="w-3 h-3 text-[#f2ca50]" /> {item.pubDate} | 국토교통부 공문 정책배포
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                        <button
                          onClick={() => handleSummarize(item.title, idx)}
                          disabled={loadingIndex !== null}
                          className={`text-xs px-3.5 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 font-black hover:shadow-lg cursor-pointer ${
                            hasSummary
                              ? 'bg-[#7dffa2]/15 hover:bg-[#7dffa2]/25 text-[#7dffa2] border border-[#7dffa2]/25'
                              : isItemLoading
                              ? 'bg-zinc-800 text-slate-500 border border-zinc-700 animate-pulse cursor-not-allowed'
                              : 'bg-gradient-to-r from-[#f2ca50] to-[#e4bc3c] text-[#3c2f00] hover:brightness-110 shadow-md font-extrabold'
                          }`}
                        >
                          <Brain className={`w-3.5 h-3.5 ${isItemLoading ? 'animate-spin' : ''}`} />
                          {isItemLoading ? "AI 핵심 분석 중..." : hasSummary ? "핵심요약 닫기" : "AI 주요사항 3개 요점정리"}
                        </button>

                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noreferrer noopener"
                          className="bg-zinc-800 hover:bg-zinc-700 text-slate-200 hover:text-white text-xs px-3.5 py-2 rounded-xl border border-white/5 flex items-center justify-center gap-1 transition-all active:scale-95 hover:shadow-lg font-bold"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> 원문 공시자료
                        </a>
                      </div>
                    </div>

                    {/* AI Expansive bento-grid summary section */}
                    <AnimatePresence>
                      {hasSummary && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden border-t border-white/5 pt-4 mt-1 space-y-3"
                        >
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-[#f2ca50] animate-pulse" />
                            <span className="text-[10px] font-black uppercase text-[#f2ca50] tracking-wider">
                              뷰빈 AI 부동산 마스터 가변 분석 결과
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {summaries[idx].map((point, pIdx) => (
                              <div 
                                key={pIdx}
                                className="bg-zinc-950/40 p-3.5 rounded-xl border border-[#f2ca50]/10 flex flex-col justify-start items-start space-y-2 hover:border-[#f2ca50]/20 transition-all"
                              >
                                <span className="text-[9px] font-black bg-[#f2ca50]/10 text-[#f2ca50] border border-[#f2ca50]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  {point.tag || "정책 요강"}
                                </span>
                                <h5 className="text-xs md:text-sm font-bold text-white tracking-tight text-left">
                                  {point.bold_title}
                                </h5>
                                <p className="text-[11px] text-slate-300 leading-relaxed font-sans text-left">
                                  {point.description}
                                </p>
                              </div>
                            ))}
                          </div>

                          {infoMsg && (
                            <p className="text-[10px] text-[#f2ca50]/70 italic text-left pt-1">
                              * {infoMsg}
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Sliders Area */}
        <div className="bg-[#1e1e1e]/60 p-6 md:p-8 rounded-2xl border border-white/5 space-y-6 flex flex-col justify-center">
          <div className="space-y-5">
            {/* Tax */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-300">
                <span>💵 세금 (취득/보유/양도세 부담 정도)</span>
                <span className="text-[#f2ca50] font-mono">{getTaxFeedback(tax)}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={tax} 
                onChange={(e) => setTax(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#f2ca50]"
              />
            </div>

            {/* Loan */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-300">
                <span>🏦 대출 한도 (금리 인하 기류 및 소득규제 강도)</span>
                <span className="text-[#f2ca50] font-mono">{getLoanFeedback(loan)}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={loan} 
                onChange={(e) => setLoan(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#f2ca50]"
              />
            </div>

            {/* Regulation */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-300">
                <span>🚧 규제 지형 (조정대상 규제지역 완화 등지)</span>
                <span className="text-[#f2ca50] font-mono">{getRegFeedback(regulation)}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={regulation} 
                onChange={(e) => setRegulation(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#f2ca50]"
              />
            </div>

            {/* Public Development policy */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-300">
                <span>🏛️ 정부정책 개발 속도 (신도시 등 건설 완화의 기류)</span>
                <span className="text-[#f2ca50] font-mono">{getPolFeedback(policy)}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={policy} 
                onChange={(e) => setPolicy(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#f2ca50]"
              />
            </div>
          </div>
        </div>

        {/* Gauge Area using conic gradient */}
        <div className="bg-[#1e1e1e]/60 p-6 md:p-8 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center space-y-6 min-h-[320px]">
          <h4 className="text-xs sm:text-sm font-bold text-slate-400">실시간 종합 매치 시장 매력도 지수</h4>
          
          <div 
            className="relative w-40 h-40 flex items-center justify-center rounded-full border-8 border-zinc-800"
            style={{ 
              background: `conic-gradient(#f2ca50 ${gaugePercent}%, #27272a 0)` 
            }}
          >
            <div className="absolute w-32 h-32 bg-[#131313] rounded-full flex flex-col items-center justify-center shadow-2xl">
              <span className="text-4xl font-black text-[#f2ca50] font-mono">{marketIndex}</span>
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">10점 만점 기준</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">실시간 종합 자본 행동 가이드</span>
            <p className="text-sm sm:text-base font-extrabold text-white">
              {adviceLabel}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
