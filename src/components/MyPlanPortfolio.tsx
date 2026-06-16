import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Coins, 
  Percent, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  Home, 
  PiggyBank, 
  TrendingDown, 
  Calculator, 
  ArrowUpRight, 
  Briefcase, 
  ShieldCheck, 
  HelpCircle,
  TrendingUp,
  LineChart,
  Grid,
  Info,
  CheckCircle2,
  FileText,
  Lock,
  Unlock,
  AlertTriangle
} from 'lucide-react';
import { playIgniteSound } from '../utils/audio';

interface MyPlanPortfolioProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

// FORMAT HELPER: Convert number of won into Korean visual units "X억 Y천만원"
const formatExactDraftWon = (val: number): string => {
  if (val === 0) return '0원';
  const isNegative = val < 0;
  const absVal = Math.abs(val);
  
  const eok = Math.floor(absVal / 100000000);
  const remaining = absVal % 100000000;
  const man = Math.floor(remaining / 10000);
  
  let result = '';
  if (eok > 0) {
    if (man > 0) {
      result = `${eok}억 ${man.toLocaleString()}만 원`;
    } else {
      result = `${eok}억 원`;
    }
  } else {
    result = `${man.toLocaleString()}만 원`;
  }
  return isNegative ? `-${result}` : result;
};

export default function MyPlanPortfolio({ isOpen, onClose, onShowToast }: MyPlanPortfolioProps) {
  // Modal view mode state
  const [activeSubTab, setActiveSubTab] = useState<'story' | 'gears'>('story');

  // --- STATE FOR DISK PERSISTENT INVESTMENT CRITERIA (동기화 가능한 세부 금융 값 상태) ---
  const [aptName, setAptName] = useState<string>(() => {
    try {
      return localStorage.getItem('byubin_apt_name') || '신축 아파트';
    } catch {
      return '신축 아파트';
    }
  });
  
  // 가용 자산 가치 평가액 (총 필요 자금)
  const [estimatedPrice, setEstimatedPrice] = useState<number>(800000000);

  // 초기 대출 신청액
  const [initialLoan, setInitialLoan] = useState<number>(430000000);

  // 아파트 기본 전세 시세
  const [marketJeonse, setMarketJeonse] = useState<number>(400000000);

  // 대출 약정 이자율 (%)
  const [interestRate, setInterestRate] = useState<number>(5.0);

  // 시장 전월세 전환율 (%)
  const [conversionRate, setConversionRate] = useState<number>(6.0);

  // 목표 반전세 월세액
  const [targetRent, setTargetRent] = useState<number>(1500000);

  // 만기 상환 연한 (Amortization Period in Years)
  const [amortizationYears, setAmortizationYears] = useState<number>(30);

  // 최종 소유권 이전 지정일
  const [targetDate, setTargetDate] = useState<string>('2026-12-31');

  // LOCK status checkers for the 6 keys
  const [locks, setLocks] = useState({
    totalCapital: false,
    initialLoan: false,
    marketJeonse: false,
    interestRate: false,
    conversionRate: false,
    deposit: false,
  });

  // State to track if report is generated (Gate 2 confirmation step state)
  const [isReportGenerated, setIsReportGenerated] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const readLockStates = () => {
    try {
      const lockTotal = localStorage.getItem('byubin_lock_total_capital') === 'locked';
      const lockLoan = localStorage.getItem('byubin_lock_initial_loan') === 'locked';
      const lockJeonse = localStorage.getItem('byubin_lock_market_jeonse') === 'locked';
      const lockInterest = localStorage.getItem('byubin_lock_interest_rate') === 'locked';
      const lockConversion = localStorage.getItem('byubin_lock_conversion_rate') === 'locked';
      const lockDeposit = localStorage.getItem('byubin_lock_deposit') === 'locked';

      return {
        totalCapital: lockTotal,
        initialLoan: lockLoan,
        marketJeonse: lockJeonse,
        interestRate: lockInterest,
        conversionRate: lockConversion,
        deposit: lockDeposit,
      };
    } catch {
      return {
        totalCapital: false,
        initialLoan: false,
        marketJeonse: false,
        interestRate: false,
        conversionRate: false,
        deposit: false,
      };
    }
  };

  // Toggle single lock state from within list helper
  const toggleLockState = (key: 'totalCapital' | 'initialLoan' | 'marketJeonse' | 'interestRate' | 'conversionRate' | 'deposit', labelName: string) => {
    try {
      const storageKeys = {
        totalCapital: 'byubin_lock_total_capital',
        initialLoan: 'byubin_lock_initial_loan',
        marketJeonse: 'byubin_lock_market_jeonse',
        interestRate: 'byubin_lock_interest_rate',
        conversionRate: 'byubin_lock_conversion_rate',
        deposit: 'byubin_lock_deposit',
      };
      const storageKey = storageKeys[key];
      const nextState = locks[key] ? 'unlocked' : 'locked';
      localStorage.setItem(storageKey, nextState);
      
      // Retrigger update events
      window.dispatchEvent(new CustomEvent('byubin_locks_updated'));
      window.dispatchEvent(new CustomEvent('byubin_plan_updated'));
      
      onShowToast(`🔒 [${labelName}] 상태가 ${nextState === 'locked' ? '완전 고정(잠금)' : '실시간 조절 가능'}상태로 전환지정 되었습니다.`);
    } catch (e) {
      console.error(e);
    }
  };

  // Force all locks at once to ease barrier
  const handleForceLockAll = () => {
    try {
      localStorage.setItem('byubin_lock_total_capital', 'locked');
      localStorage.setItem('byubin_lock_initial_loan', 'locked');
      localStorage.setItem('byubin_lock_market_jeonse', 'locked');
      localStorage.setItem('byubin_lock_interest_rate', 'locked');
      localStorage.setItem('byubin_lock_conversion_rate', 'locked');
      localStorage.setItem('byubin_lock_deposit', 'locked');

      // Retrigger update events
      window.dispatchEvent(new CustomEvent('byubin_locks_updated'));
      window.dispatchEvent(new CustomEvent('byubin_plan_updated'));
      
      onShowToast('🔑 축하합니다 대표님! 모든 핵심 재무 인자가 완전 잠금상태로 일괄 지정되었습니다.');
    } catch (e) {
      console.error(e);
    }
  };

  // --- EFFECT: ON OPEN, READ LIVE STATE DIRECTLY FROM CALCULATOR'S STORAGE ---
  useEffect(() => {
    if (isOpen) {
      try {
        const savedCapital = localStorage.getItem('byubin_total_capital');
        const savedLoan = localStorage.getItem('byubin_initial_loan');
        const savedJeonse = localStorage.getItem('byubin_market_jeonse');
        const savedInterest = localStorage.getItem('byubin_interest_rate');
        const savedConversion = localStorage.getItem('byubin_conversion_rate');
        const savedRent = localStorage.getItem('byubin_target_rent');
        const savedApt = localStorage.getItem('byubin_apt_name');

        if (savedCapital) setEstimatedPrice(Number(savedCapital));
        if (savedLoan) setInitialLoan(Number(savedLoan));
        if (savedJeonse) setMarketJeonse(Number(savedJeonse));
        if (savedInterest) setInterestRate(Number(savedInterest));
        if (savedConversion) setConversionRate(Number(savedConversion));
        if (savedRent) setTargetRent(Number(savedRent));
        setAptName(savedApt || '신축 아파트');

        setLocks(readLockStates());
        setIsReportGenerated(false);
        setIsGenerating(false);
      } catch (e) {
        console.error("Failed to load synced values on modal open: ", e);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleLocksSync = () => {
      setLocks(readLockStates());
    };
    const handleAptNameSync = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail !== undefined) {
        setAptName(customEvent.detail || '신축 아파트');
      } else {
        const savedApt = localStorage.getItem('byubin_apt_name');
        setAptName(savedApt || '신축 아파트');
      }
    };
    window.addEventListener('byubin_locks_updated', handleLocksSync);
    window.addEventListener('byubin_plan_updated', handleLocksSync);
    window.addEventListener('byubin_apt_name_updated', handleAptNameSync);
    return () => {
      window.removeEventListener('byubin_locks_updated', handleLocksSync);
      window.removeEventListener('byubin_plan_updated', handleLocksSync);
      window.removeEventListener('byubin_apt_name_updated', handleAptNameSync);
    };
  }, []);

  // --- RECALCULATIONS ON COOPERATING VALUES (실시간 대칭 연립 방정식) ---
  const myCash = Math.max(0, estimatedPrice - initialLoan); // 순 자력 실투자 자금
  const conversionRateDecimal = conversionRate / 100;
  
  // 월세 150만 원의 가치만큼 보증금 감액분 계산 = (월세 * 12) / 전환율
  const decreasedDeposit = Math.max(0, Math.round((targetRent * 12) / conversionRateDecimal));
  
  // 실제 세입자에게 받게 되는 보증금 = 전세시세 - 보증금 감액분
  const depositValue = Math.max(0, marketJeonse - decreasedDeposit);
  
  // 실제 세입자 보증금 1억 수령 후 즉시 대출 상환하고 남은 최종 빚
  const remainingLoan = Math.max(0, initialLoan - depositValue);

  // 원리금 균등상환 계산식 (남은 대출금 기준)
  const monthlyAmortizationPayment = React.useMemo(() => {
    if (remainingLoan <= 0 || interestRate <= 0) return 0;
    const r = (interestRate / 100) / 12;
    const n = amortizationYears * 12;
    const payment = remainingLoan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.floor(payment);
  }, [remainingLoan, interestRate, amortizationYears]);

  // 최종 실질 순수 현금흐름 (월수입 - 매월 원리금)
  const netCashFlow = targetRent - monthlyAmortizationPayment;

  // --- SAVE PORTFOLIO AND SYNC BACK (양방향 상태 영속 조치 및 강제 리트리거) ---
  const handleSaveAndSyncAll = () => {
    try {
      localStorage.setItem('byubin_apt_name', aptName);
      localStorage.setItem('byubin_total_capital', estimatedPrice.toString());
      localStorage.setItem('byubin_initial_loan', initialLoan.toString());
      localStorage.setItem('byubin_market_jeonse', marketJeonse.toString());
      localStorage.setItem('byubin_interest_rate', interestRate.toString());
      localStorage.setItem('byubin_conversion_rate', conversionRate.toString());
      localStorage.setItem('byubin_target_rent', targetRent.toString());
      localStorage.setItem('byubin_amortization_years', amortizationYears.toString());
      localStorage.setItem('byubin_target_date', targetDate);

      // Trigger custom window event to force LeverageCalculator.tsx to refresh its view dynamically
      window.dispatchEvent(new CustomEvent('byubin_plan_updated'));

      onShowToast('🔑 수원 매교역 팰루시드 연동 플랜이 메인 계산기에 실시간 반영 저장되었습니다!');
    } catch (e) {
      console.error(e);
      onShowToast('⚠️ 값 동기화 중 에러가 발생했습니다.');
    }
  };

  // Prevent scroll propagation
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 font-sans overflow-y-auto bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative bg-zinc-900 border border-[#f2ca50]/30 rounded-2xl w-full max-w-4xl shadow-[0_20px_50px_rgba(242,202,80,0.15)] outline-none max-h-[92vh] flex flex-col"
        >
          {/* Top Elegant Panel Header */}
          <div className="p-5 sm:p-6 border-b border-zinc-800 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-[#f2ca50]/15 border border-[#f2ca50]/30 p-2.5 rounded-xl text-[#f2ca50]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-white tracking-tight">나의 입주 마스터플랜 설명서</h2>
                  <span className="bg-[#f2ca50]/20 text-[#f2ca50] text-[9px] font-black px-1.5 py-0.5 rounded border border-[#f2ca50]/20">실시간 연동</span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5">
                  기어 조정에 따라 실시간으로 풀어서 설명되는 맞춤형 입주금융 분석 보고서
                </p>
              </div>
            </div>
            
            {/* Tab Switching Controls */}
            <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-lg border border-zinc-800 self-start sm:self-auto">
              <button
                onClick={() => setActiveSubTab('story')}
                className={`px-3 py-1.5 text-[11px] font-extrabold rounded-md transition-all duration-150 ${
                  activeSubTab === 'story'
                    ? 'bg-[#f2ca50] text-zinc-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📖 알기 쉬운 스토리 해설
              </button>
              <button
                onClick={() => setActiveSubTab('gears')}
                className={`px-3 py-1.5 text-[11px] font-extrabold rounded-md transition-all duration-150 ${
                  activeSubTab === 'gears'
                    ? 'bg-[#f2ca50] text-zinc-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ⚙️ 수치 직접 수정 기어
              </button>
            </div>
          </div>

          {/* Core Content Body */}
          <div className="overflow-y-auto p-4 sm:p-6 flex-1 custom-scrollbar">
            
            {/* Dynamic Real-time Status Header */}
            <div className="mb-5 bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center gap-2.5">
                <div className="bg-sky-500/10 text-sky-400 p-1.5 rounded-md border border-sky-400/20">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">대상 단지 정보</div>
                  <div className="text-xs sm:text-sm font-black text-white">{aptName}</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <div className="text-[9px] text-slate-500 font-bold">총비용</div>
                  <div className="text-xs font-black text-[#f2ca50]">{formatExactDraftWon(estimatedPrice)}</div>
                </div>
                <div className="text-right border-l border-zinc-800 pl-4">
                  <div className="text-[9px] text-slate-500 font-bold">소득 목표</div>
                  <div className="text-xs font-black text-teal-400">{formatExactDraftWon(targetRent)}</div>
                </div>
              </div>
            </div>

            {/* TAB CONTENT: 1. STORY INTERPRETATIVE REPORT */}
            {activeSubTab === 'story' && (() => {
              const allLocked = locks.totalCapital && 
                                locks.initialLoan && 
                                locks.marketJeonse && 
                                locks.interestRate && 
                                locks.conversionRate && 
                                locks.deposit;

              if (!allLocked) {
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Warn Banner Card */}
                    <div className="bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-900 border border-red-500/20 rounded-xl p-5 text-left relative overflow-hidden">
                      <div className="absolute right-0 top-0 w-32 h-32 bg-[#f2ca50]/5 rounded-full pointer-events-none" />
                      <div className="flex items-start gap-4">
                        <div className="bg-amber-500/10 text-[#f2ca50] p-2.5 rounded-lg border border-[#f2ca50]/20 shrink-0">
                          <Lock className="w-5 h-5 animate-pulse" />
                        </div>
                        <div className="space-y-1.5">
                          <h3 className="text-sm font-black text-[#f2ca50] tracking-tight flex items-center gap-1.5">
                            🔒 아직 모든 재무 수치 설정이 고정 잠금되지 않았습니다
                          </h3>
                          <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                            대표님, <span className="text-[#f2ca50] font-bold">{aptName}</span> 맞춤형 마스터플랜 설명서를 생성하기 전에 메인 레버리지 계산기에서 모든 핵심 금융 수치를 완전하게 잠금(🔒 또는 열쇠 모양 아이콘 선택)하여 최종 고정해 주십시오. 
                          </p>
                          <p className="text-xs text-slate-400 font-bold">
                            값의 흔들림을 원천 방지하고 정밀한 수치 시뮬레이션을 보증하기 위해 모든 잠금(열쇠) 버튼을 체결해야 설명서가 작성됩니다.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Lock Grid Dashboard */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { key: 'totalCapital', label: '총 필요자금 (Leverage Base)', val: formatExactDraftWon(estimatedPrice), icon: Coins, desc: '주택 매매비용 및 세금/부대비용' },
                        { key: 'initialLoan', label: '초기 신청 대출금 (Initial Loan)', val: formatExactDraftWon(initialLoan), icon: PiggyBank, desc: '은행 대출 신청 초기 기준 한도액' },
                        { key: 'marketJeonse', label: '기준 시장 전세가 (Market Jeonse)', val: formatExactDraftWon(marketJeonse), icon: Home, desc: '주변 비교 대상 아파트 표준 임대 전세가' },
                        { key: 'interestRate', label: '예상 대출 금리 (Interest Rate)', val: `${interestRate.toFixed(1)}%`, icon: Percent, desc: '원리금 및 매월 총 이자 비용을 결정하는 금리' },
                        { key: 'conversionRate', label: '시장 전월세 전환율 (Conversion Rate)', val: `${conversionRate.toFixed(1)}%`, icon: TrendingUp, desc: '보증금 감액을 월세 부하량으로 치환하는 비율' },
                        { key: 'deposit', label: '예상 계약 보증금 (Contract Deposit)', val: formatExactDraftWon(depositValue), icon: Briefcase, desc: '조율 후 임차인에게 안전 수취할 최종 보증금' },
                      ].map((item) => {
                        const isLocked = locks[item.key as keyof typeof locks];
                        return (
                          <div 
                            key={item.key} 
                            className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 flex justify-between items-center gap-4 hover:border-zinc-700 transition duration-150 text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg shrink-0 ${isLocked ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                <item.icon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{item.desc}</div>
                                <div className="text-[11px] font-black text-white">{item.label}</div>
                                <div className="text-xs font-black text-slate-350 mt-0.5">{item.val}</div>
                              </div>
                            </div>

                            <button
                              onClick={() => toggleLockState(item.key as any, item.label.split(' ')[0])}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all duration-150 flex items-center gap-1 cursor-pointer select-none active:scale-95 shrink-0 ${
                                isLocked 
                                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-extrabold' 
                                  : 'bg-amber-500/15 border border-amber-500/30 text-amber-450 hover:bg-amber-500/25 font-bold'
                              }`}
                            >
                              {isLocked ? <Lock className="w-3 h-3 text-emerald-400" /> : <Unlock className="w-3 h-3 text-amber-450 animate-bounce" />}
                              {isLocked ? '고정완료' : '조정중 (잠금)'}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Auto-Lock CTA Button */}
                    <div className="bg-zinc-950/60 p-5 rounded-xl border border-zinc-800/80 text-center space-y-3.5">
                      <div className="text-xs text-slate-400 font-extrabold flex justify-center items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#f2ca50]" />
                        귀찮은 절차 없이 아래 버튼을 사용하여 6개의 모든 인자를 즉시 고정(Lock🔒)할 수 있습니다.
                      </div>
                      
                      <button
                        onClick={handleForceLockAll}
                        className="mx-auto max-w-sm bg-gradient-to-r from-[#f2ca50] to-[#e4bc3c] text-zinc-950 hover:brightness-110 active:scale-98 duration-150 p-3 rounded-lg text-xs font-black transition-all flex justify-center items-center gap-1.5 cursor-pointer shadow-lg w-full"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        모든 변수 완전 잠금(🔒) 일괄 적용하기
                      </button>
                    </div>
                  </motion.div>
                );
              }

              // Gate 2: Confirmation Screen
              if (!isReportGenerated) {
                return (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 max-w-md mx-auto text-center space-y-6"
                  >
                    {isGenerating ? (
                      <div className="space-y-4">
                        <div className="relative w-14 h-14 mx-auto">
                          <div className="absolute inset-x-0 inset-y-0 border-4 border-zinc-800 rounded-full" />
                          <div className="absolute inset-x-0 inset-y-0 border-4 border-t-[#f2ca50] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                        </div>
                        <p className="text-xs sm:text-sm font-black text-white">
                          수원 매교역 팰루시드 마스터플랜 보고서 고밀도 설계 중...
                        </p>
                        <p className="text-[10px] sm:text-xs text-slate-400 font-semibold max-w-xs mx-auto">
                          대표님께서 기어 조정을 마치고 잠금 설정하신 주택 가치평가 및 대출 상환이율 데이터 세트를 실시간 교차 대칭 분석하여 보고서 스토리를 빌드하고 있습니다.
                        </p>
                        <div className="w-full bg-zinc-800 rounded-full h-1 max-w-[200px] mx-auto overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.2 }}
                            className="bg-[#f2ca50] h-full"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-5 text-center">
                        <div className="bg-[#f2ca50]/10 border border-[#f2ca50]/30 p-4 rounded-full w-14 h-14 flex items-center justify-center mx-auto text-[#f2ca50]">
                          <ShieldCheck className="w-7 h-7" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-base sm:text-lg font-black text-white tracking-tight">수원 매교역 팰루시드 가치평가 고정완료</h3>
                          <p className="text-xs text-slate-400 font-bold px-4">
                            축하합니다! 모든 금융 설계 데이터 세트가 완벽하게 안전고정(🔒) 상태로 지정되었습니다.
                          </p>
                          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 max-w-sm mx-auto text-left space-y-2.5 mt-4">
                            <div className="flex justify-between text-[11px] font-bold">
                              <span className="text-slate-500">분석 아파트 단지명</span>
                              <span className="text-white font-black">{aptName}</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-bold">
                              <span className="text-slate-500">인수용 총 필요자금</span>
                              <span className="text-[#f2ca50] font-black">{formatExactDraftWon(estimatedPrice)}</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-bold">
                              <span className="text-slate-500">은행 신청 초기 대출</span>
                              <span className="text-sky-450 font-black">{formatExactDraftWon(initialLoan)}</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-bold">
                              <span className="text-slate-500">실 세입자 예상보증금</span>
                              <span className="text-emerald-400 font-bold">{formatExactDraftWon(depositValue)}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            playIgniteSound();
                            setIsGenerating(true);
                            setTimeout(() => {
                              setIsGenerating(false);
                              setIsReportGenerated(true);
                              try {
                                localStorage.setItem('byubin_flame_quenched', 'true');
                                window.dispatchEvent(new CustomEvent('byubin_flame_quenched_updated'));
                              } catch {}
                              onShowToast('📂 수원 매교역 팰루시드 맞춤형 실전 자금조달 스토리 보고서가 성공적으로 빌드되었습니다.');
                            }, 1200);
                          }}
                          className="w-full bg-[#f2ca50] hover:bg-[#e4bc3c] text-zinc-950 font-black p-3.5 rounded-lg text-xs transition-all flex justify-center items-center gap-1.5 cursor-pointer shadow-md active:scale-95 duration-100"
                        >
                          <Sparkles className="w-4 h-4 text-zinc-950" />
                          확인하기 및 플랜 보고서 작성 개봉
                        </button>

                        <p className="text-[10px] text-slate-500 font-bold">
                          위 [확인하기] 버튼을 누르면 스토리라인 중심의 대표님 전용 설명서가 아래로 쫘악 펼쳐집니다.
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              }

              // Case 3: Confirmed & Locked! Render full dynamic story narrative with stagger entrance
              return (
                <div className="space-y-6">
                  {/* Recalculate Alert / Top Quick Indicator */}
                  <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl px-4 py-3 text-left flex justify-between items-center text-xs">
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      수원 매교역 팰루시드 정밀 고정 리포트 성립완료 (작동 중)
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold text-right hidden sm:inline">
                      수치를 재조정하려면 메인 화면에서 잠금(열쇠)을 해제하십시오
                    </span>
                  </div>

                  {/* 1. 첫 출발: 내 집 마련을 위한 총비용과 대출 */}
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-zinc-900 border border-zinc-800 hover:border-[#f2ca50]/20 rounded-xl p-4 sm:p-5 transition-all text-left space-y-3 shadow-sm relative overflow-hidden"
                  >
                    <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-[#f2ca50]/5 to-transparent rounded-full pointer-events-none" />
                    <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-800/60">
                      <span className="flex items-center justify-center bg-[#f2ca50] text-[#1c1917] text-xs font-black rounded-full w-5 h-5 font-mono">1</span>
                      <h3 className="text-xs sm:text-sm font-black text-white">첫 출발: 내 집 마련을 위한 총비용과 대출</h3>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                      첫 집을 사거나 투자할 때는 주택 매매대금뿐 아니라 세금과 부대비용을 포함한 전체 밑천이 필요합니다.
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                      화면의 첫 칸에 설정된 총 필요자금 <span className="text-[#f2ca50] font-black">{formatExactDraftWon(estimatedPrice)}</span>이 바로 이 집을 완전히 손에 쥐기까지 필요한 총금액입니다.
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                      이 중에서 대표님이 은행에서 빌리겠다고 처음 신청한 초기 대출금은 <span className="text-sky-400 font-black">{formatExactDraftWon(initialLoan)}</span>입니다.
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                      따라서 은행 대출금을 뺀 대표님의 순수한 비상금 등 진짜 주머니 사정은 내 현금 자력 실투자금 <span className="text-emerald-400 font-black">{formatExactDraftWon(myCash)}</span>이 됩니다.
                    </p>
                  </motion.div>

                  {/* 2. 세입자를 들여 월세를 만드는 계산법 */}
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="bg-zinc-900 border border-zinc-800 hover:border-[#f2ca50]/20 rounded-xl p-4 sm:p-5 transition-all text-left space-y-3 shadow-sm relative overflow-hidden"
                  >
                    <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-[#f2ca50]/5 to-transparent rounded-full pointer-events-none" />
                    <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-800/60">
                      <span className="flex items-center justify-center bg-[#f2ca50] text-[#1c1917] text-xs font-black rounded-full w-5 h-5 font-mono">2</span>
                      <h3 className="text-xs sm:text-sm font-black text-white">세입자를 들여 월세를 만드는 계산법</h3>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                      대표님이 주택 보유 기간 동안 매달 안정적인 소득인 월세 <span className="text-emerald-400 font-black">{formatExactDraftWon(targetRent)}</span>을 꼬박꼬박 수취하는 구조를 성립시키고자 합니다. 이때 전세계약을 반전세(월세계약)로 부분 전환하는 시장 합의 이율(시장 전월세 전환율)이 현재 연 <span className="text-[#f2ca50] font-black">{conversionRate.toFixed(1)}%</span>로 고정되어 있습니다.
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                      매달 대표님이 수령할 월세 수입 <span className="text-teal-400 font-black">{formatExactDraftWon(targetRent)}</span>(연간 환산 연세 수입 <span className="text-[#f2ca50] font-black">{formatExactDraftWon(targetRent * 12)}</span>)를 정상 획득하기 위해서는, 최초에 명시된 기본 기준 전세 시세(<span className="text-slate-300 font-bold">{formatExactDraftWon(marketJeonse)}</span>) 대비 보증금 감액을 수반해야 합니다.
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                      전환율 법정 산출식에 기초하여 매년 수령할 <span className="text-[#f2ca50] font-black">{formatExactDraftWon(targetRent * 12)}</span>의 가치만큼 보증금을 감액 공제해 보니, 정확히 <span className="text-sky-400 font-black">{formatExactDraftWon(decreasedDeposit)}</span>만큼의 전세금 가치가 월세 계약으로 대칭 치환됩니다.
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                      결과적으로, 원래 기본 시장 전세가 (<span className="text-slate-400">{formatExactDraftWon(marketJeonse)}</span>)에서 월세 계약으로 조대된 보증금 가비 가치공제액 (<span className="text-sky-400 font-semibold">{formatExactDraftWon(decreasedDeposit)}</span>)을 차감 정산한 최종 <span className="text-[#f2ca50] font-black underline decoration-wavy underline-offset-4">{formatExactDraftWon(depositValue)}</span>이 바로 실제 반전세 임차 세입자로부터 안전하게 건네받을 계약 보증금이 성립됩니다.
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                      즉, 세입자는 실제 보증금 <span className="text-[#f2ca50] font-black">{formatExactDraftWon(depositValue)}</span>에 추가적으로 매달 월세 <span className="text-emerald-400 font-black">{formatExactDraftWon(targetRent)}</span>을 부담하는 구조로 최종 입주가 이루어집니다.
                    </p>
                  </motion.div>

                  {/* 3. 세입자의 보증금으로 대출금 갚기 */}
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="bg-zinc-900 border border-zinc-800 hover:border-[#f2ca50]/20 rounded-xl p-4 sm:p-5 transition-all text-left space-y-3 shadow-sm relative overflow-hidden"
                  >
                    <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-[#f2ca50]/5 to-transparent rounded-full pointer-events-none" />
                    <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-800/60">
                      <span className="flex items-center justify-center bg-[#f2ca50] text-[#1c1917] text-xs font-black rounded-full w-5 h-5 font-mono">3</span>
                      <h3 className="text-xs sm:text-sm font-black text-white">세입자의 보증금으로 대출금 갚기</h3>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                      세입자가 최종 입주하며 건넨 예상 계약 보증금 <span className="text-[#f2ca50] font-black">{formatExactDraftWon(depositValue)}</span>이 대표님 계좌에 수취되는 즉시, 대표님은 이 보증금 수령액 전액을 최초 실행했던 대출 원금(<span className="text-sky-400 font-semibold">{formatExactDraftWon(initialLoan)}</span>) 잔당을 직접 긴급 상환하여 지혜로운 현금흐름 다이어트를 이행합니다.
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                      그에 따라, 대표님이 앞으로 보유 기간 동안 실제 이자 및 상환 부담을 지고 갈 최종 실질 대출 잔당은 <span className="bg-sky-500/10 text-sky-400 font-black px-2 py-0.5 rounded border border-sky-500/20">최종 남은 대출금 {formatExactDraftWon(remainingLoan)}</span>으로 극소화 정비됩니다.
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                      기존 은행 빚이 <span className="text-slate-400">{formatExactDraftWon(initialLoan)}</span>에서 불과 <span className="text-sky-400 font-bold">{formatExactDraftWon(remainingLoan)}</span> 수준으로 가볍게 경감되었으므로, 매월 은행에 갚아야 할 원금 및 이자 총 상환 비중(매월 원리금 분할 상환 평가액)도 엄청나게 절감되어 매달 약 <span className="text-red-400 font-black underline underline-offset-2">{formatExactDraftWon(monthlyAmortizationPayment)}</span>만 부담하면 충분해집니다.
                    </p>
                  </motion.div>

                  {/* 4. 내 지갑에 남는 최종 진짜 현금흐름 */}
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="bg-zinc-900 border border-zinc-800 hover:border-[#f2ca50]/20 rounded-xl p-4 sm:p-5 transition-all text-left space-y-4 shadow-sm relative overflow-hidden"
                  >
                    <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-[#f2ca50]/5 to-transparent rounded-full pointer-events-none" />
                    <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-800/60">
                      <span className="flex items-center justify-center bg-[#f2ca50] text-[#1c1917] text-xs font-black rounded-full w-5 h-5 font-mono">4</span>
                      <h3 className="text-xs sm:text-sm font-black text-white">내 지갑에 남는 최종 진짜 현금흐름</h3>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold font-bold">
                      마지막으로 대표님의 매달 현금흐름 순수 수익 구조(Net Cash Flow Structure)를 면밀하게 대조해 확인해 보겠습니다.
                    </p>
                    
                    <div className="bg-zinc-950 p-3.5 rounded-lg border border-zinc-800/80 space-y-2 max-w-md">
                      <div className="flex justify-between items-center text-xs font-bold font-bold font-bold">
                        <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 수입 금액 (임차 세입자 월세)
                        </span>
                        <span className="text-emerald-400 font-black">+{formatExactDraftWon(targetRent)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-bold font-bold font-bold">
                        <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> 비용 상환 (원리금 월 부담액)
                        </span>
                        <span className="text-red-400 font-black">-{formatExactDraftWon(monthlyAmortizationPayment)}</span>
                      </div>
                      <div className="h-px bg-zinc-800 my-1 font-bold font-bold font-bold" />
                      <div className="flex justify-between items-center text-xs font-black text-white">
                        <span>최종 실질 현금흐름 (순수 월 소득)</span>
                        <span className={netCashFlow >= 0 ? "text-emerald-400 font-black text-sm" : "text-red-400 font-black text-sm"}>
                          {netCashFlow >= 0 ? "+" : ""}{formatExactDraftWon(netCashFlow)} / 월
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-semibold pt-1">
                      이를 통해 계산 및 가치 평가해 본 대표님의 매달 최종 실질 현금흐름은 <span className={`font-black px-1.5 py-0.5 rounded-md ${
                        netCashFlow >= 0 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-400/20" : "bg-red-500/10 text-red-400 border border-red-400/20"
                      }`}>{formatExactDraftWon(netCashFlow)}</span>이 성립되어, 매월 안전하게 통장 배당금처럼 {netCashFlow >= 0 ? "순 입금 누적식 자산 자금으로 연금형태 소득이 실현됩니다" : "조달비용에 대한 자금 투하가 이루어지게 됩니다"}.
                    </p>
                  </motion.div>
                </div>
              );
            })()}

            {/* TAB CONTENT: 2. DETAILED GEARS (INPUTS) */}
            {activeSubTab === 'gears' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-5"
              >
                <div className="border border-zinc-800 bg-zinc-900/40 rounded-xl p-4 sm:p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-800">
                    <Grid className="w-4 h-4 text-[#f2ca50]" />
                    <span className="text-xs font-black text-white uppercase tracking-wider">포트폴리오 미세 변수 설정</span>
                  </div>

                  {/* 1. Target Apartment */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] sm:text-xs text-slate-400 font-bold flex justify-between">
                      <span>분석 대상 아파트 단지명</span>
                      <span className="text-[9px] text-[#f2ca50] font-mono">Complex Name</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="text"
                        value={aptName}
                        onChange={(e) => setAptName(e.target.value)}
                        placeholder="예: 수원 매교역 팰루시드"
                        className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-[#f2ca50]/50 rounded-lg p-2.5 px-3 text-xs font-bold text-white transition-colors duration-150 outline-none"
                      />
                      <Building2 className="absolute right-3 top-3 w-4 h-4 text-slate-500" />
                    </div>
                  </div>

                  {/* 2. Estimated Price */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] sm:text-xs text-slate-400 font-bold flex justify-between">
                      <span>가용 자산 가치 평가액 (총 필요 자금)</span>
                      <span className="text-[10px] text-white font-mono font-black">{formatExactDraftWon(estimatedPrice)}</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input 
                          type="text"
                          value={estimatedPrice ? (estimatedPrice / 100000000).toString() : ''}
                          onChange={(e) => {
                            const val = Number(e.target.value.replace(/[^0-9.]/g, ''));
                            setEstimatedPrice(val * 100000000);
                          }}
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#f2ca50]/50 rounded-lg p-2.5 text-xs font-bold text-white outline-none"
                          placeholder="가액 입력"
                        />
                        <span className="absolute right-3 top-2.5 text-[10px] text-slate-500 font-extrabold uppercase">억 원</span>
                      </div>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => setEstimatedPrice(prev => Math.max(100000000, prev - 100000000))}
                          className="px-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-white/5 active:scale-95 text-xs text-slate-300 font-bold"
                        >
                          -1억
                        </button>
                        <button 
                          onClick={() => setEstimatedPrice(prev => prev + 100000000)}
                          className="px-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-white/5 active:scale-95 text-xs text-slate-300 font-bold"
                        >
                          +1억
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 3. Initial Loan */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] sm:text-xs text-slate-400 font-bold flex justify-between">
                      <span>초기 대출금 설정액</span>
                      <span className="text-[10px] text-[#f2ca50] font-mono font-black">{formatExactDraftWon(initialLoan)}</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input 
                          type="text"
                          value={initialLoan ? (initialLoan / 100000000).toString() : ''}
                          onChange={(e) => {
                            const val = Number(e.target.value.replace(/[^0-9.]/g, ''));
                            setInitialLoan(val * 100000000);
                          }}
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#f2ca50]/50 rounded-lg p-2.5 text-xs font-bold text-white outline-none"
                          placeholder="대출금 입력"
                        />
                        <span className="absolute right-3 top-2.5 text-[10px] text-slate-500 font-extrabold uppercase">억 원</span>
                      </div>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => setInitialLoan(prev => Math.max(50000000, prev - 50000000))}
                          className="px-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-white/5 active:scale-95 text-xs text-slate-300 font-bold"
                        >
                          -5K만
                        </button>
                        <button 
                          onClick={() => setInitialLoan(prev => prev + 50000000)}
                          className="px-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-white/5 active:scale-95 text-xs text-slate-300 font-bold"
                        >
                          +5K만
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 4. Rent Rate Settings */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] sm:text-xs text-slate-400 font-bold">
                        단지 기본 전세 시세 (Jeonse Base)
                      </label>
                      <div className="relative">
                        <input 
                          type="number"
                          value={marketJeonse ? marketJeonse / 100000000 : ''}
                          onChange={(e) => setMarketJeonse(Number(e.target.value) * 100000000)}
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#f2ca50]/50 rounded-lg p-2.5 text-xs font-bold text-white outline-none"
                          placeholder="억 원 단위"
                        />
                        <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-bold">억 원</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] sm:text-xs text-slate-400 font-bold">
                        목표 월 수취 월세액
                      </label>
                      <div className="relative">
                        <input 
                          type="number"
                          value={targetRent ? targetRent / 10000 : ''}
                          onChange={(e) => setTargetRent(Number(e.target.value) * 10000)}
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#f2ca50]/50 rounded-lg p-2.5 text-xs font-bold text-white outline-none"
                          placeholder="만 원 단위"
                        />
                        <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-bold">만 원</span>
                      </div>
                    </div>
                  </div>

                  {/* 5. Percent Ratios */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] sm:text-xs text-slate-400 font-bold">
                        대출 약정 이자율 (%)
                      </label>
                      <div className="relative">
                        <input 
                          type="number"
                          step="0.1"
                          value={interestRate}
                          onChange={(e) => setInterestRate(Number(e.target.value))}
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#f2ca50]/50 rounded-lg p-2.5 text-xs font-bold text-white outline-none"
                        />
                        <Percent className="absolute right-3 top-3 w-4 h-4 text-slate-500" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] sm:text-xs text-slate-400 font-bold">
                        시장 전월세 전환율 (%)
                      </label>
                      <div className="relative">
                        <input 
                          type="number"
                          step="0.1"
                          value={conversionRate}
                          onChange={(e) => setConversionRate(Number(e.target.value))}
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#f2ca50]/50 rounded-lg p-2.5 text-xs font-bold text-white outline-none"
                        />
                        <Percent className="absolute right-3 top-3 w-4 h-4 text-slate-500" />
                      </div>
                    </div>
                  </div>

                  {/* 6. Calendar Amortisation Target Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] sm:text-xs text-slate-400 font-bold">
                        원리금 분할 상환 연한
                      </label>
                      <select
                        value={amortizationYears}
                        onChange={(e) => setAmortizationYears(Number(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#f2ca50]/50 rounded-lg p-2.5 text-xs font-bold text-white outline-none cursor-pointer"
                      >
                        <option value={10}>10년 분할상환</option>
                        <option value={20}>20년 분할상환</option>
                        <option value={30}>30년 분할상환</option>
                        <option value={40}>40년 분할상환</option>
                        <option value={50}>50년 분할상환</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] sm:text-xs text-slate-400 font-bold">
                        최종 입주/인도 예정일
                      </label>
                      <div className="relative">
                        <input 
                          type="date"
                          value={targetDate}
                          onChange={(e) => setTargetDate(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#f2ca50]/50 rounded-lg p-2.5 text-xs font-bold text-white outline-none cursor-pointer"
                        />
                        <Calendar className="absolute right-3 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Sync Action Buttons inside tab */}
                  <div className="pt-2">
                    <button
                      onClick={handleSaveAndSyncAll}
                      className="w-full bg-[#f2ca50] hover:bg-[#e4bc3c] text-zinc-950 font-black p-3 rounded-lg text-xs transition-colors flex justify-center items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      현재 세팅값으로 마스터플랜 동기화 완료
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </div>

          {/* Bottom Control Actions */}
          <div className="p-4 sm:p-5 border-t border-zinc-800 flex justify-end gap-2.5 shrink-0 bg-zinc-950/40 rounded-b-2xl">
            <button
              onClick={onClose}
              className="bg-zinc-800 hover:bg-zinc-700 text-slate-300 font-bold px-5 py-2.5 rounded-lg text-xs transition-all cursor-pointer border border-white/5"
            >
              닫기
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
