import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Landmark, TrendingUp, Coins, ArrowUp, Sparkles, AlertCircle, X, HelpCircle, Check, Info, Minus, Plus, Pencil, Lock, Unlock, Flame, Building2 } from 'lucide-react';
import { playClickSound, playLockSound, playUnlockSound, playIgniteSound } from '../utils/audio';
import pellucidHero from '../pellucid-hero.jpeg';

export default function LeverageCalculator() {
  const [aptName, setAptName] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('byubin_apt_name');
      return (stored && stored !== '신축 아파트' && stored !== '신축아파트') ? stored : '';
    } catch {
      return '';
    }
  });

  const [isEditingName, setIsEditingName] = useState<boolean>(false);

  const handleAptNameChange = (val: string) => {
    setAptName(val);
    try {
      localStorage.setItem('byubin_apt_name', val);
      window.dispatchEvent(new CustomEvent('byubin_apt_name_updated', { detail: val }));
    } catch {}
  };

  useEffect(() => {
    const handleAptNameSync = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail !== undefined) {
        setAptName(customEvent.detail || '');
      } else {
        const savedApt = localStorage.getItem('byubin_apt_name');
        setAptName(savedApt || '');
      }
    };
    window.addEventListener('byubin_apt_name_updated', handleAptNameSync);
    return () => {
      window.removeEventListener('byubin_apt_name_updated', handleAptNameSync);
    };
  }, []);

  // --- 대표님 맞춤형 실전 레버리지 및 핵심 재무 인자 상태 구성 ---
  // [State Persistence / 로컬 캐싱 적용] 대표님께서 직접 입력하신 핵심 재무구조 값들을 브라우저 내부에 보존합니다.
  const [totalNeededCapital, setTotalNeededCapital] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('byubin_total_capital');
      return saved ? Number(saved) : 800000000;
    } catch {
      return 800000000;
    }
  }); // 총 필요자금 (분양대금 + 취득세 + 이자경비) 기본 8억 원

  const [initialLoan, setInitialLoan] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('byubin_initial_loan');
      return saved ? Number(saved) : 430000000;
    } catch {
      return 430000000;
    }
  }); // 대출받을 금액 기본 4억 3천만 원

  const [marketJeonse, setMarketJeonse] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('byubin_market_jeonse');
      return saved ? Number(saved) : 400000000;
    } catch {
      return 400000000;
    }
  }); // 기준 전세 시세 (완전전세 기준) 기본 4억 원
  
  // 2. Financial Rate States
  const [interestRate, setInterestRate] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('byubin_interest_rate');
      return saved ? Number(saved) : 5.0;
    } catch {
      return 5.0;
    }
  });       // 예상 대출 금리 (5.0%)

  const [loanTerm, setLoanTerm] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('byubin_loan_term');
      return saved ? Number(saved) : 30;
    } catch {
      return 30;
    }
  });       // 대출 상환 기간 (15, 30, 40년 등)

  const [conversionRate, setConversionRate] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('byubin_conversion_rate');
      return saved ? Number(saved) : 6.0;
    } catch {
      return 6.0;
    }
  });   // 시장 전월세 전환율 (6.0%)

  const [targetRent, setTargetRent] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('byubin_target_rent');
      return saved ? Number(saved) : 1500000;
    } catch {
      return 1500000;
    }
  });       // 목표 월세 세팅 (150만)

  // --- 입력 설정 데이터 자동 백업 및 연속성 보장 제어 레이어 (Local Storage Sync Effect) ---
  useEffect(() => {
    try {
      localStorage.setItem('byubin_total_capital', totalNeededCapital.toString());
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [totalNeededCapital]);

  useEffect(() => {
    try {
      localStorage.setItem('byubin_initial_loan', initialLoan.toString());
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [initialLoan]);

  useEffect(() => {
    try {
      localStorage.setItem('byubin_market_jeonse', marketJeonse.toString());
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [marketJeonse]);

  useEffect(() => {
    try {
      localStorage.setItem('byubin_interest_rate', interestRate.toString());
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [interestRate]);

  useEffect(() => {
    try {
      localStorage.setItem('byubin_loan_term', loanTerm.toString());
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [loanTerm]);

  useEffect(() => {
    try {
      localStorage.setItem('byubin_conversion_rate', conversionRate.toString());
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [conversionRate]);

  useEffect(() => {
    try {
      localStorage.setItem('byubin_target_rent', targetRent.toString());
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [targetRent]);

  // [State Persistence Synchronizer] 외부 입주플랜 포트폴리오 변경 사조 시 수치 동시 동기화 처리
  useEffect(() => {
    const handlePlanSync = () => {
      try {
        const savedCapital = localStorage.getItem('byubin_total_capital');
        if (savedCapital) setTotalNeededCapital(Number(savedCapital));
        const savedLoan = localStorage.getItem('byubin_initial_loan');
        if (savedLoan) setInitialLoan(Number(savedLoan));
        const savedJeonse = localStorage.getItem('byubin_market_jeonse');
        if (savedJeonse) setMarketJeonse(Number(savedJeonse));
        const savedInterest = localStorage.getItem('byubin_interest_rate');
        if (savedInterest) setInterestRate(Number(savedInterest));
        const savedConversion = localStorage.getItem('byubin_conversion_rate');
        if (savedConversion) setConversionRate(Number(savedConversion));
        const savedRent = localStorage.getItem('byubin_target_rent');
        if (savedRent) setTargetRent(Number(savedRent));

        const savedCapitalLock = localStorage.getItem('byubin_lock_total_capital');
        if (savedCapitalLock) setIsTotalCapitalUnlocked(savedCapitalLock === 'unlocked');
        const savedLoanLock = localStorage.getItem('byubin_lock_initial_loan');
        if (savedLoanLock) setIsInitialLoanUnlocked(savedLoanLock === 'unlocked');
        const savedJeonseLock = localStorage.getItem('byubin_lock_market_jeonse');
        if (savedJeonseLock) setIsMarketJeonseUnlocked(savedJeonseLock === 'unlocked');
        const savedInterestLock = localStorage.getItem('byubin_lock_interest_rate');
        if (savedInterestLock) setIsInterestUnlocked(savedInterestLock === 'unlocked');
        const savedConversionLock = localStorage.getItem('byubin_lock_conversion_rate');
        if (savedConversionLock) setIsConversionUnlocked(savedConversionLock === 'unlocked');
        const savedDepositLock = localStorage.getItem('byubin_lock_deposit');
        if (savedDepositLock) setIsDepositUnlocked(savedDepositLock === 'unlocked');
      } catch (e) {
        console.error("Failed to sync plan parameters: ", e);
      }
    };

    window.addEventListener('byubin_plan_updated', handlePlanSync);
    return () => {
      window.removeEventListener('byubin_plan_updated', handlePlanSync);
    };
  }, []);

  // --- Flame state sync for extinguishing sizzling flame banner once check/confirm clicked ---
  const [isFlameQuenched, setIsFlameQuenched] = useState<boolean>(() => {
    try {
      return localStorage.getItem('byubin_flame_quenched') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleQuenchedSync = () => {
      try {
        setIsFlameQuenched(localStorage.getItem('byubin_flame_quenched') === 'true');
      } catch (e) {
        console.warn('Failed to sync flame states:', e);
      }
    };
    window.addEventListener('byubin_flame_quenched_updated', handleQuenchedSync);
    window.addEventListener('byubin_plan_updated', handleQuenchedSync);
    window.addEventListener('byubin_locks_updated', handleQuenchedSync);
    return () => {
      window.removeEventListener('byubin_flame_quenched_updated', handleQuenchedSync);
      window.removeEventListener('byubin_plan_updated', handleQuenchedSync);
      window.removeEventListener('byubin_locks_updated', handleQuenchedSync);
    };
  }, []);

  // --- 슬라이더 제스처 오동작 방지 핀 조작 상태 (Lockable Gesture Protectors) ---
  const [isDepositUnlocked, setIsDepositUnlocked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('byubin_lock_deposit');
      return saved ? saved === 'unlocked' : true;
    } catch {
      return true;
    }
  });
  const [isInterestUnlocked, setIsInterestUnlocked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('byubin_lock_interest_rate');
      return saved ? saved === 'unlocked' : true;
    } catch {
      return true;
    }
  });
  const [isConversionUnlocked, setIsConversionUnlocked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('byubin_lock_conversion_rate');
      return saved ? saved === 'unlocked' : true;
    } catch {
      return true;
    }
  });
  const [isTotalCapitalUnlocked, setIsTotalCapitalUnlocked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('byubin_lock_total_capital');
      return saved ? saved === 'unlocked' : true;
    } catch {
      return true;
    }
  });
  const [isInitialLoanUnlocked, setIsInitialLoanUnlocked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('byubin_lock_initial_loan');
      return saved ? saved === 'unlocked' : true;
    } catch {
      return true;
    }
  });
  const [isMarketJeonseUnlocked, setIsMarketJeonseUnlocked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('byubin_lock_market_jeonse');
      return saved ? saved === 'unlocked' : true;
    } catch {
      return true;
    }
  });

  // Keep lock states synchronized with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('byubin_lock_deposit', isDepositUnlocked ? 'unlocked' : 'locked');
      window.dispatchEvent(new CustomEvent('byubin_locks_updated'));
    } catch {}
  }, [isDepositUnlocked]);

  useEffect(() => {
    try {
      localStorage.setItem('byubin_lock_interest_rate', isInterestUnlocked ? 'unlocked' : 'locked');
      window.dispatchEvent(new CustomEvent('byubin_locks_updated'));
    } catch {}
  }, [isInterestUnlocked]);

  useEffect(() => {
    try {
      localStorage.setItem('byubin_lock_conversion_rate', isConversionUnlocked ? 'unlocked' : 'locked');
      window.dispatchEvent(new CustomEvent('byubin_locks_updated'));
    } catch {}
  }, [isConversionUnlocked]);

  useEffect(() => {
    try {
      localStorage.setItem('byubin_lock_total_capital', isTotalCapitalUnlocked ? 'unlocked' : 'locked');
      window.dispatchEvent(new CustomEvent('byubin_locks_updated'));
    } catch {}
  }, [isTotalCapitalUnlocked]);

  useEffect(() => {
    try {
      localStorage.setItem('byubin_lock_initial_loan', isInitialLoanUnlocked ? 'unlocked' : 'locked');
      window.dispatchEvent(new CustomEvent('byubin_locks_updated'));
    } catch {}
  }, [isInitialLoanUnlocked]);

  useEffect(() => {
    try {
      localStorage.setItem('byubin_lock_market_jeonse', isMarketJeonseUnlocked ? 'unlocked' : 'locked');
      window.dispatchEvent(new CustomEvent('byubin_locks_updated'));
    } catch {}
  }, [isMarketJeonseUnlocked]);

  // --- 실전 전월세 전환 계산 해설 가이드 토글 상태 ---
  const [showBonusGuide, setShowBonusGuide] = useState<boolean>(false);

  // --- 대표님 전용 정밀 키보드 직접 입력 제어 레이어 (Direct Keyboard Input State Interception) ---
  const [activeEdit, setActiveEdit] = useState<string | null>(null);
  const [rawInputValue, setRawInputValue] = useState<string>('');

  const handleResetPlan = () => {
    playClickSound();
    
    // Reset states
    setAptName('');
    setTotalNeededCapital(800000000);
    setInitialLoan(430000000);
    setMarketJeonse(400000000);
    setInterestRate(5.0);
    setConversionRate(6.0);
    setTargetRent(1500000);
    
    // Reset locks
    setIsDepositUnlocked(true);
    setIsInterestUnlocked(true);
    setIsConversionUnlocked(true);
    setIsTotalCapitalUnlocked(true);
    setIsInitialLoanUnlocked(true);
    setIsMarketJeonseUnlocked(true);
    
    // Clear localStorage
    const keysToRemove = [
      'byubin_apt_name',
      'byubin_total_capital',
      'byubin_initial_loan',
      'byubin_market_jeonse',
      'byubin_interest_rate',
      'byubin_loan_term',
      'byubin_conversion_rate',
      'byubin_target_rent',
      'byubin_lock_deposit',
      'byubin_lock_interest',
      'byubin_lock_conversion',
      'byubin_lock_total_capital',
      'byubin_lock_initial_loan',
      'byubin_lock_market_jeonse',
      'byubin_flame_quenched'
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    setIsFlameQuenched(false);
    
    window.dispatchEvent(new Event('byubin_locks_updated'));
  };

  const startEdit = (field: string, initialNum: number) => {
    setActiveEdit(field);
    setRawInputValue(initialNum.toString());
  };

  const cancelEdit = () => {
    setActiveEdit(null);
    setRawInputValue('');
  };

  const handleRawInputChange = (val: string) => {
    const filtered = val.replace(/[^0-9.]/g, '');
    setRawInputValue(filtered);
  };

  const saveValue = (field: string) => {
    const num = Number(rawInputValue);
    if (isNaN(num)) {
      cancelEdit();
      return;
    }

    switch (field) {
      case 'total': {
        const adjusted = Math.min(150000, Math.max(30000, num)) * 10000;
        setTotalNeededCapital(adjusted);
        break;
      }
      case 'loan': {
        const adjusted = Math.min(100000, Math.max(10000, num)) * 10000;
        setInitialLoan(adjusted);
        break;
      }
      case 'jeonse': {
        const adjusted = Math.min(100000, Math.max(20000, num)) * 10000;
        setMarketJeonse(adjusted);
        break;
      }
      case 'deposit': {
        const minDep = 2000;
        const maxDep = marketJeonse / 10000;
        const typedDeposit = Math.min(maxDep, Math.max(minDep, num)) * 10000;
        const nextRent = Math.max(0, Math.round((marketJeonse - typedDeposit) * (conversionRate / 100) / 12));
        setTargetRent(nextRent);
        break;
      }
      case 'interest': {
        const adjusted = Math.min(7.0, Math.max(2.0, num));
        setInterestRate(adjusted);
        break;
      }
      case 'conversion': {
        const adjusted = Math.min(8.0, Math.max(3.0, num));
        setConversionRate(adjusted);
        break;
      }
      case 'rent': {
        const adjusted = Math.min(250, Math.max(50, num)) * 10000;
        setTargetRent(adjusted);
        break;
      }
    }
    setActiveEdit(null);
    setRawInputValue('');
  };

  // 동적 계산: 실제 필요한 순수 자기자본 실투자금 (총필요자금 - 대출받을 금액)
  const myCash = Math.max(0, totalNeededCapital - initialLoan);

  // --- 실전 협상용 가상 예시 자동 연동 계산 인자 (1억 및 2억 보증금 대입액) ---
  const exampleDepositValue1 = 100000000; // 1억 원
  const exampleDepositValue2 = 200000000; // 2억 원

  const calculatedRentFor1Eok = useMemo(() => {
    if (marketJeonse <= exampleDepositValue1) return 0;
    return Math.round(((marketJeonse - exampleDepositValue1) * (conversionRate / 100)) / 12);
  }, [marketJeonse, conversionRate]);

  const calculatedRentFor2Eok = useMemo(() => {
    if (marketJeonse <= exampleDepositValue2) return 0;
    return Math.round(((marketJeonse - exampleDepositValue2) * (conversionRate / 100)) / 12);
  }, [marketJeonse, conversionRate]);

  // Format numbers into Korean representation (e.g., "4억 3,000만 원")
  const formatKRW = (val: number): string => {
    if (val >= 100000000) {
      const eok = Math.floor(val / 100000000);
      const man = Math.floor((val % 100000000) / 10000);
      return man > 0 ? `${eok}억 ${man.toLocaleString()}만 원` : `${eok}억 원`;
    }
    return `${Math.floor(val / 10000).toLocaleString()}만 원`;
  };

  // Convert decimal interest rate and conversion rate
  const conversionRateDecimal = conversionRate / 100;

  // 3. Precision Mathematical Calculation Engine (Matching V3)
  const metrics = useMemo(() => {
    // A. 시장에 내놓을 보증금 = 전세시세 - (월세 * 12 / 전환율)
    const depositValue = Math.max(0, Math.round(marketJeonse - (targetRent * 12 / conversionRateDecimal)));
    
    // B. 보증금 상환 후 잔여 대출금
    const remainingLoan = Math.max(0, initialLoan - depositValue);
    
    // B-2. 실투자금 (필요 현금)
    const actualCashNeeded = Math.max(0, totalNeededCapital - initialLoan - depositValue);
    
    // C. 매월 주단보수 원리금 균등상환액 계산
    const r = interestRate / 12 / 100;
    const n = loanTerm * 12;
    let monthlyAmortization = 0;
    if (remainingLoan > 0 && r > 0) {
      monthlyAmortization = Math.round(
        remainingLoan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      );
    }
    
    // D. 첫회 납입이자 및 내 집 저축 원금 계산
    const monthlyPureInterest = Math.round(remainingLoan * r);
    const monthlyPrincipalSaved = Math.max(0, Math.round(monthlyAmortization - monthlyPureInterest));
    
    // E. 최종 실질 현금흐름 (목표월세 - 원리금 상환액)
    const netCashFlow = targetRent - monthlyAmortization;
    
    // F. 실질 연간 순익 및 실투자 ROI
    const annualNetProfit = (targetRent * 12) - (monthlyAmortization * 12) + (monthlyPrincipalSaved * 12);
    const roiPercentage = myCash > 0 ? (annualNetProfit / myCash) * 100 : 0;

    // Remaining progress indicators
    const depositBarPercentage = marketJeonse > 0 ? Math.min(100, (depositValue / marketJeonse) * 100) : 0;
    const repaymentRatio = initialLoan > 0 ? Math.min(100, (depositValue / initialLoan) * 100) : 0;
    const principalPercent = monthlyAmortization > 0 ? (monthlyPrincipalSaved / monthlyAmortization) * 100 : 0;

    return {
      depositValue,
      actualCashNeeded,
      remainingLoan,
      monthlyAmortization,
      monthlyPureInterest,
      monthlyPrincipalSaved,
      netCashFlow,
      roiPercentage,
      depositBarPercentage,
      repaymentRatio,
      principalPercent
    };
  }, [initialLoan, myCash, marketJeonse, interestRate, conversionRate, targetRent, totalNeededCapital, loanTerm]);

  const isPositiveFlow = metrics.netCashFlow >= 0;

  const isFullyLocked = useMemo(() => {
    return !isDepositUnlocked && !isInterestUnlocked && !isConversionUnlocked && !isTotalCapitalUnlocked && !isInitialLoanUnlocked && !isMarketJeonseUnlocked;
  }, [isDepositUnlocked, isInterestUnlocked, isConversionUnlocked, isTotalCapitalUnlocked, isInitialLoanUnlocked, isMarketJeonseUnlocked]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-8"
      id="calculator-tab-container"
    >
      {/* Premium Hero Info Banner */}
      <section 
        className="relative overflow-hidden rounded-2xl h-[260px] sm:h-[320px] flex flex-col items-center justify-center p-6 sm:p-10 border border-white/5 shadow-2xl bg-zinc-950 transition-all duration-500 group/hero"
      >
        {/* 팰루시드 완성 이미지 */}
        <img 
          src={pellucidHero} 
          alt="수원 매교역 팰루시드 아파트 완성 투시도"
          className="absolute inset-0 w-full h-full object-cover object-[center_70%] pointer-events-none z-0"
          style={{ filter: "brightness(1) contrast(1.02) saturate(1.05)" }}
        />
        {/* 다크 오버레이 완전 제거 */}
        
        {/* Top Content Block */}
        <div className="absolute top-6 left-0 w-full z-30 flex justify-start px-4 gap-2">
          {!isEditingName ? (
            <button
              onClick={() => {
                playClickSound();
                setIsEditingName(true);
              }}
              className="w-48 sm:w-64 backdrop-blur-lg bg-white/60 border border-white/40 text-slate-800 hover:bg-white/80 py-2.5 rounded-full text-xs sm:text-sm font-extrabold shadow-[0_4px_20px_rgba(0,0,0,0.15)] scale-100 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer"
            >
              <span className="font-extrabold text-slate-900 tracking-tight">
                분석대상: {aptName && aptName !== '신축 아파트' && aptName !== '신축아파트' ? aptName : ''}
              </span>
            </button>
          ) : (
            <div
              className="w-full max-w-xs bg-black/70 backdrop-blur-md border border-[#f2ca50] rounded-full p-1.5 flex items-center gap-2 shadow-xl"
            >
              <button
                onClick={handleResetPlan}
                className="h-8 px-3 rounded-full bg-slate-700/50 hover:bg-slate-600 flex items-center justify-center text-white transition-colors text-xs font-bold whitespace-nowrap"
                title="새 플랜 시작하기 (초기화)"
              >
                🔄 초기화
              </button>
              <input 
                type="text"
                value={aptName}
                onChange={(e) => handleAptNameChange(e.target.value)}
                placeholder="분석대상"
                className="bg-transparent text-white font-extrabold text-xs sm:text-sm outline-none flex-1 pl-2 placeholder-slate-400"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    playClickSound();
                    setIsEditingName(false);
                  }
                }}
              />
              <button
                onClick={() => {
                  playClickSound();
                  setIsEditingName(false);
                }}
                className="bg-[#f2ca50] text-[#3c2f00] hover:bg-white transition-colors py-1.5 px-4 rounded-full text-xs font-black active:scale-95 duration-150 cursor-pointer"
              >
                확인
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Bento Grid Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Control Card: Investment Setup */}
        <div className="bg-[#1e1e1e]/60 backdrop-blur-md border border-[#f2ca50]/20 p-6 rounded-2xl flex flex-col justify-between space-y-6 shadow-lg relative overflow-hidden group">
          {/* Subtle outer glow border effect on hover */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#f2ca50]/30 rounded-2xl transition-colors duration-500 pointer-events-none" />
          <div className="space-y-6">
            <h3 className="text-base sm:text-lg font-bold text-[#f2ca50] flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#f2ca50]" />
              실전 레버리지 및 투입액 조율
            </h3>
            
            <div className="space-y-5">
              {/* 1. 총 필요자금 (분양대금+취득세+이자경비) */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-300 font-medium">총 필요자금</span>
                    <span className="text-[10px] text-zinc-500 font-semibold leading-none mt-0.5">분양대금 + 취득세 + 이자경비 등 합계</span>
                  </div>
                  <div className="relative">
                    {activeEdit === 'total' ? (
                      <div className="flex items-center gap-1 bg-zinc-900 border border-[#f2ca50]/50 rounded-lg p-1 shadow-lg z-10 animate-fade-in">
                        <input
                          type="text"
                          className="w-18 bg-transparent text-right text-xs font-black text-[#f2ca50] outline-none border-b border-zinc-700 focus:border-[#f2ca50] font-mono"
                          value={rawInputValue}
                          onChange={(e) => handleRawInputChange(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveValue('total');
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          autoFocus
                        />
                        <span className="text-[9px] text-zinc-400">만원</span>
                        <button
                          type="button"
                          onClick={() => saveValue('total')}
                          className="p-1 text-[#7dffa2] hover:bg-zinc-800 rounded transition-colors"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="p-1 text-rose-400 hover:bg-zinc-800 rounded transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {/* Live translation tooltip */}
                        <div className="absolute -bottom-6 right-0 text-[10px] bg-zinc-950 text-[#f2ca50] border border-[#f2ca50]/20 px-1 py-0.5 rounded shadow z-50 pointer-events-none whitespace-nowrap font-sans font-medium">
                          대입: {formatKRW(Number(rawInputValue) * 10000)}
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (isTotalCapitalUnlocked) {
                            startEdit('total', totalNeededCapital / 10000);
                          }
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                          isTotalCapitalUnlocked
                            ? 'border-dashed border-zinc-700/60 hover:border-[#f2ca50]/40 hover:bg-zinc-800/40 text-[#f2ca50] cursor-pointer'
                            : 'bg-zinc-900 border-[#f2ca50] text-[#f2ca50] font-black shadow-[0_0_12px_rgba(242,202,80,0.35)] cursor-not-allowed scale-[1.02] font-mono'
                        }`}
                        title={isTotalCapitalUnlocked ? "클릭하여 직접 금액 입력" : "총 필요자금 고정 잠금 상태"}
                        disabled={!isTotalCapitalUnlocked}
                      >
                        <span className="tracking-tight">{formatKRW(totalNeededCapital)}</span>
                        {isTotalCapitalUnlocked ? (
                          <Pencil className="w-2.5 h-2.5 text-zinc-500 animate-pulse" />
                        ) : (
                          <Lock className="w-3 h-3 text-[#f2ca50]" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (isTotalCapitalUnlocked) {
                        setTotalNeededCapital(prev => Math.max(300000000, prev - 10000000));
                      }
                    }}
                    disabled={!isTotalCapitalUnlocked}
                    className={`w-9 h-9 rounded-lg bg-zinc-900 border text-[#f2ca50] flex items-center justify-center active:scale-95 transition-all shrink-0 select-none ${
                      isTotalCapitalUnlocked 
                        ? 'border-[#f2ca50]/25 hover:border-[#f2ca50]/60 hover:bg-zinc-800 cursor-pointer' 
                        : 'border-zinc-850 text-zinc-600 opacity-30 cursor-not-allowed'
                    }`}
                    title="1,000만원 인하"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex-1 py-1 flex items-center gap-2">
                    <input 
                      type="range" 
                      onWheel={(e) => (e.target as HTMLElement).blur()}
                      min="300000000" 
                      max="1500000000" 
                      step="10000000"
                      value={totalNeededCapital}
                      onChange={(e) => {
                        if (isTotalCapitalUnlocked) {
                          setTotalNeededCapital(Number(e.target.value));
                        }
                      }}
                      disabled={!isTotalCapitalUnlocked}
                      className={`w-full h-1.5 rounded-lg appearance-none transition-all outline-none ${
                        isTotalCapitalUnlocked 
                          ? 'bg-[#f2ca50]/25 accent-[#f2ca50] cursor-ew-resize' 
                          : 'bg-zinc-800/10 accent-zinc-500 opacity-30 cursor-not-allowed'
                      }`}
                    />
                    
                    {/* Lock safety pin */}
                    <button
                      type="button"
                      onClick={() => {
                        const nextState = !isTotalCapitalUnlocked;
                        setIsTotalCapitalUnlocked(nextState);
                        if (!nextState) {
                          playLockSound();
                        } else {
                          playUnlockSound();
                        }
                      }}
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center active:scale-95 transition-all shrink-0 cursor-pointer select-none ${
                        isTotalCapitalUnlocked
                          ? 'bg-[#f2ca50]/15 border-[#f2ca50]/40 text-[#f2ca50] shadow-[0_0_8px_rgba(242,202,80,0.1)] hover:bg-[#f2ca50]/30'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800/40'
                      }`}
                      title={isTotalCapitalUnlocked ? "총 필요자금 변경 수동 잠금 고정" : "수정 잠금 해제"}
                    >
                      {isTotalCapitalUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (isTotalCapitalUnlocked) {
                        setTotalNeededCapital(prev => Math.min(1500000000, prev + 10000000));
                      }
                    }}
                    disabled={!isTotalCapitalUnlocked}
                    className={`w-9 h-9 rounded-lg bg-zinc-900 border text-[#f2ca50] flex items-center justify-center active:scale-95 transition-all shrink-0 select-none ${
                      isTotalCapitalUnlocked 
                        ? 'border-[#f2ca50]/25 hover:border-[#f2ca50]/60 hover:bg-zinc-800 cursor-pointer' 
                        : 'border-zinc-850 text-zinc-600 opacity-30 cursor-not-allowed'
                    }`}
                    title="1,000만원 인상"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>3억</span>
                  <span className={`text-[9px] font-sans ${isTotalCapitalUnlocked ? 'text-[#f2ca50]/60' : 'text-rose-450 font-bold'}`}>
                    {isTotalCapitalUnlocked ? '🔓 실시간 조절 활성' : '🔒 총 필요금 고정 잠금'}
                  </span>
                  <span>15억</span>
                </div>
              </div>

              {/* 2. 대출받을 금액 */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-300 font-medium">대출받을 금액</span>
                    <span className="text-[10px] text-zinc-500 font-semibold leading-none mt-0.5">주담대 (레버리지 융자 규모)</span>
                  </div>
                  <div className="relative">
                    {activeEdit === 'loan' ? (
                      <div className="flex items-center gap-1 bg-zinc-900 border border-[#f2ca50]/50 rounded-lg p-1 shadow-lg z-10 animate-fade-in">
                        <input
                          type="text"
                          className="w-18 bg-transparent text-right text-xs font-black text-[#f2ca50] outline-none border-b border-zinc-700 focus:border-[#f2ca50] font-mono"
                          value={rawInputValue}
                          onChange={(e) => handleRawInputChange(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveValue('loan');
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          autoFocus
                        />
                        <span className="text-[9px] text-zinc-400">만원</span>
                        <button
                          type="button"
                          onClick={() => saveValue('loan')}
                          className="p-1 text-[#7dffa2] hover:bg-zinc-800 rounded transition-colors"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="p-1 text-rose-400 hover:bg-zinc-800 rounded transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {/* Live translation tooltip */}
                        <div className="absolute -bottom-6 right-0 text-[10px] bg-zinc-950 text-[#f2ca50] border border-[#f2ca50]/20 px-1 py-0.5 rounded shadow z-50 pointer-events-none whitespace-nowrap font-sans font-medium">
                          대입: {formatKRW(Number(rawInputValue) * 10000)}
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (isInitialLoanUnlocked) {
                            startEdit('loan', initialLoan / 10000);
                          }
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                          isInitialLoanUnlocked
                            ? 'border-dashed border-zinc-700/60 hover:border-[#f2ca50]/40 hover:bg-zinc-800/40 text-[#f2ca50] cursor-pointer'
                            : 'bg-zinc-900 border-[#f2ca50] text-[#f2ca50] font-black shadow-[0_0_12px_rgba(242,202,80,0.35)] cursor-not-allowed scale-[1.02] font-mono'
                        }`}
                        title={isInitialLoanUnlocked ? "클릭하여 직접 금액 입력" : "대출금 고정 잠금 상태"}
                        disabled={!isInitialLoanUnlocked}
                      >
                        <span className="tracking-tight">{formatKRW(initialLoan)}</span>
                        {isInitialLoanUnlocked ? (
                          <Pencil className="w-2.5 h-2.5 text-zinc-500 animate-pulse" />
                        ) : (
                          <Lock className="w-3 h-3 text-[#f2ca50]" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (isInitialLoanUnlocked) {
                        setInitialLoan(prev => Math.max(100000000, prev - 10000000));
                      }
                    }}
                    disabled={!isInitialLoanUnlocked}
                    className={`w-9 h-9 rounded-lg bg-zinc-900 border text-[#f2ca50] flex items-center justify-center active:scale-95 transition-all shrink-0 select-none ${
                      isInitialLoanUnlocked 
                        ? 'border-[#f2ca50]/25 hover:border-[#f2ca50]/60 hover:bg-zinc-800 cursor-pointer' 
                        : 'border-zinc-850 text-zinc-600 opacity-30 cursor-not-allowed'
                    }`}
                    title="1,000만원 인하"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex-1 py-1 flex items-center gap-2">
                    <input 
                      type="range" 
                      onWheel={(e) => (e.target as HTMLElement).blur()}
                      min="100000000" 
                      max="1000000000" 
                      step="10000000"
                      value={initialLoan}
                      onChange={(e) => {
                        if (isInitialLoanUnlocked) {
                          setInitialLoan(Number(e.target.value));
                        }
                      }}
                      disabled={!isInitialLoanUnlocked}
                      className={`w-full h-1.5 rounded-lg appearance-none transition-all outline-none ${
                        isInitialLoanUnlocked 
                          ? 'bg-[#f2ca50]/25 accent-[#f2ca50] cursor-ew-resize' 
                          : 'bg-zinc-800/10 accent-zinc-500 opacity-30 cursor-not-allowed'
                      }`}
                    />
                    
                    {/* Lock safety pin */}
                    <button
                      type="button"
                      onClick={() => {
                        const nextState = !isInitialLoanUnlocked;
                        setIsInitialLoanUnlocked(nextState);
                        if (!nextState) {
                          playLockSound();
                        } else {
                          playUnlockSound();
                        }
                      }}
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center active:scale-95 transition-all shrink-0 cursor-pointer select-none ${
                        isInitialLoanUnlocked
                          ? 'bg-[#f2ca50]/15 border-[#f2ca50]/40 text-[#f2ca50] shadow-[0_0_8px_rgba(242,202,80,0.1)] hover:bg-[#f2ca50]/30'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800/40'
                      }`}
                      title={isInitialLoanUnlocked ? "대출받을 금액 변경 수동 잠금 고정" : "수정 잠금 해제"}
                    >
                      {isInitialLoanUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (isInitialLoanUnlocked) {
                        setInitialLoan(prev => Math.min(1000000000, prev + 10000000));
                      }
                    }}
                    disabled={!isInitialLoanUnlocked}
                    className={`w-9 h-9 rounded-lg bg-zinc-900 border text-[#f2ca50] flex items-center justify-center active:scale-95 transition-all shrink-0 select-none ${
                      isInitialLoanUnlocked 
                        ? 'border-[#f2ca50]/25 hover:border-[#f2ca50]/60 hover:bg-zinc-800 cursor-pointer' 
                        : 'border-zinc-850 text-zinc-600 opacity-30 cursor-not-allowed'
                    }`}
                    title="1,000만원 인상"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>1억</span>
                  <span className={`text-[9px] font-sans ${isInitialLoanUnlocked ? 'text-[#f2ca50]/60' : 'text-rose-450 font-bold'}`}>
                    {isInitialLoanUnlocked ? '🔓 실시간 조절 활성' : '🔒 대출금 고정 잠금'}
                  </span>
                  <span>10억</span>
                </div>
              </div>

              {/* 3. 기준 전세 시세 (완전전세 기준) */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-200 font-bold flex items-center gap-1">
                    기준 전세시세 
                    <span className="text-[10px] text-[#7dffa2]/70 font-normal">(완전전세 기준)</span>
                  </span>
                  <div className="relative">
                    {activeEdit === 'jeonse' ? (
                      <div className="flex items-center gap-1 bg-zinc-900 border border-[#7dffa2]/55 rounded-lg p-1 shadow-lg z-10 animate-fade-in">
                        <input
                          type="text"
                          className="w-18 bg-transparent text-right text-xs font-black text-[#7dffa2] outline-none border-b border-zinc-700 focus:border-[#7dffa2] font-mono"
                          value={rawInputValue}
                          onChange={(e) => handleRawInputChange(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveValue('jeonse');
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          autoFocus
                        />
                        <span className="text-[9px] text-zinc-400">만원</span>
                        <button
                          type="button"
                          onClick={() => saveValue('jeonse')}
                          className="p-1 text-[#7dffa2] hover:bg-zinc-800 rounded transition-colors"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="p-1 text-rose-400 hover:bg-zinc-800 rounded transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {/* Live translation tooltip */}
                        <div className="absolute -bottom-6 right-0 text-[10px] bg-zinc-950 text-[#7dffa2] border border-[#7dffa2]/20 px-1 py-0.5 rounded shadow z-50 pointer-events-none whitespace-nowrap font-sans font-medium">
                          대입: {formatKRW(Number(rawInputValue) * 10000)}
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (isMarketJeonseUnlocked) {
                            startEdit('jeonse', marketJeonse / 10000);
                          }
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                          isMarketJeonseUnlocked
                            ? 'border-dashed border-zinc-700/60 hover:border-[#7dffa2]/40 hover:bg-zinc-800/40 text-[#7dffa2] cursor-pointer'
                            : 'bg-zinc-900 border-[#7dffa2] text-[#7dffa2] font-black shadow-[0_0_12px_rgba(125,255,162,0.35)] cursor-not-allowed scale-[1.02] font-mono'
                        }`}
                        title={isMarketJeonseUnlocked ? "클릭하여 직접 금액 입력" : "전세시세 고정 잠금 상태"}
                        disabled={!isMarketJeonseUnlocked}
                      >
                        <span className="tracking-tight">{formatKRW(marketJeonse)}</span>
                        {isMarketJeonseUnlocked ? (
                          <Pencil className="w-2.5 h-2.5 text-zinc-500 animate-pulse" />
                        ) : (
                          <Lock className="w-3 h-3 text-[#7dffa2]" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (isMarketJeonseUnlocked) {
                        setMarketJeonse(prev => Math.max(200000000, prev - 10000000));
                      }
                    }}
                    disabled={!isMarketJeonseUnlocked}
                    className={`w-9 h-9 rounded-lg bg-zinc-900 border text-[#7dffa2] flex items-center justify-center active:scale-95 transition-all shrink-0 select-none ${
                      isMarketJeonseUnlocked 
                        ? 'border-[#7dffa2]/25 hover:border-[#7dffa2]/60 hover:bg-zinc-800 cursor-pointer' 
                        : 'border-zinc-850 text-zinc-650 opacity-30 cursor-not-allowed'
                    }`}
                    title="1,000만원 인하"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex-1 py-1 flex items-center gap-2">
                    <input 
                      type="range" 
                      onWheel={(e) => (e.target as HTMLElement).blur()}
                      min="200000000" 
                      max="1000000000" 
                      step="10000000"
                      value={marketJeonse}
                      onChange={(e) => {
                        if (isMarketJeonseUnlocked) {
                          setMarketJeonse(Number(e.target.value));
                        }
                      }}
                      disabled={!isMarketJeonseUnlocked}
                      className={`w-full h-1.5 rounded-lg appearance-none transition-all outline-none ${
                        isMarketJeonseUnlocked 
                          ? 'bg-[#7dffa2]/25 accent-[#7dffa2] cursor-ew-resize' 
                          : 'bg-zinc-800/10 accent-zinc-500 opacity-30 cursor-not-allowed'
                      }`}
                    />
                    
                    {/* Lock safety pin */}
                    <button
                      type="button"
                      onClick={() => {
                        const nextState = !isMarketJeonseUnlocked;
                        setIsMarketJeonseUnlocked(nextState);
                        if (!nextState) {
                          playLockSound();
                        } else {
                          playUnlockSound();
                        }
                      }}
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center active:scale-95 transition-all shrink-0 cursor-pointer select-none ${
                        isMarketJeonseUnlocked
                          ? 'bg-[#7dffa2]/15 border-[#7dffa2]/40 text-[#7dffa2] shadow-[0_0_8px_rgba(125,255,162,0.1)] hover:bg-[#7dffa2]/30'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800/40'
                      }`}
                      title={isMarketJeonseUnlocked ? "기준 전세시세 변경 수동 잠금 고정" : "수정 잠금 해제"}
                    >
                      {isMarketJeonseUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (isMarketJeonseUnlocked) {
                        setMarketJeonse(prev => Math.min(1000000000, prev + 10000000));
                      }
                    }}
                    disabled={!isMarketJeonseUnlocked}
                    className={`w-9 h-9 rounded-lg bg-zinc-900 border text-[#7dffa2] flex items-center justify-center active:scale-95 transition-all shrink-0 select-none ${
                      isMarketJeonseUnlocked 
                        ? 'border-[#7dffa2]/25 hover:border-[#7dffa2]/60 hover:bg-zinc-800 cursor-pointer' 
                        : 'border-zinc-850 text-zinc-655 opacity-30 cursor-not-allowed'
                    }`}
                    title="1,000만원 인상"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>2억</span>
                  <span className={`text-[9px] font-sans ${isMarketJeonseUnlocked ? 'text-[#7dffa2]/60' : 'text-rose-450 font-bold'}`}>
                    {isMarketJeonseUnlocked ? '🔓 실시간 조절 활성' : '🔒 전세가 고정 잠금'}
                  </span>
                  <span>10억</span>
                </div>
              </div>

              {/* Bottom Highlight Information Box (Auto Calculations Display) */}
              <div className="bg-[#f2ca50]/5 p-3.5 rounded-xl border border-[#f2ca50]/15 flex items-start gap-2.5 shadow-sm">
                <Coins className="w-5 h-5 text-[#f2ca50] shrink-0 mt-0.5" />
                <div className="space-y-0.5 animate-fade-in">
                  <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5 flex-wrap">
                    내 실제 순수 투자 자본금 (자기자본)
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#f2ca50]/10 text-[#f2ca50] border border-[#f2ca50]/20 font-sans tracking-wide">
                      자동 계산 수식 연동
                    </span>
                  </div>
                  <div className="text-sm font-black text-[#f2ca50]">{formatKRW(myCash)}</div>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    *총 필요자금({formatKRW(totalNeededCapital).replace(' 원', '')})에서 대출받을 금액({formatKRW(initialLoan).replace('BC', '').replace(' 원', '')})을 뺀 실제 현금 자력 실투자금입니다. 이 기준으로 실질 ROI 수익률이 산출됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Control Card: Market Strategy & Conversion */}
        <div className="bg-[#1e1e1e]/60 backdrop-blur-md border border-[#f2ca50]/20 p-6 rounded-2xl flex flex-col justify-between space-y-6 shadow-lg relative overflow-hidden group">
          {/* Subtle outer glow border effect on hover */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#f2ca50]/30 rounded-2xl transition-colors duration-500 pointer-events-none" />
          <div className="space-y-6">
            <h3 className="text-base sm:text-lg font-bold text-[#f2ca50] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#f2ca50]" />
              금리 변동 및 전환율 조작
            </h3>
            
            <div className="space-y-5">
              {/* A. 대출 이율 - 개별 영역 독립 테두리 박스 */}
              <div className="p-4 rounded-xl border border-[#f2ca50]/25 bg-zinc-950/40 hover:border-[#f2ca50]/50 transition-all flex flex-col gap-3 shadow-md shadow-[#f2ca50]/5">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-slate-200 font-bold flex items-center gap-1">예상 대출 금리 (연)</span>
                  <div className="relative">
                    {activeEdit === 'interest' ? (
                      <div className="flex items-center gap-1 bg-zinc-900 border border-[#f2ca50]/55 rounded-lg p-1 shadow-lg z-10 animate-fade-in">
                        <input
                          type="text"
                          className="w-16 bg-transparent text-right text-xs font-black text-[#f2ca50] outline-none border-b border-zinc-700 focus:border-[#f2ca50] font-mono"
                          value={rawInputValue}
                          onChange={(e) => handleRawInputChange(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveValue('interest');
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          autoFocus
                        />
                        <span className="text-[10px] text-zinc-400">%</span>
                        <button
                          type="button"
                          onClick={() => saveValue('interest')}
                          className="p-1 text-[#7dffa2] hover:bg-zinc-800 rounded transition-colors"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="p-1 text-rose-400 hover:bg-zinc-800 rounded transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (isInterestUnlocked) {
                            startEdit('interest', interestRate);
                          }
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all text-xs font-bold ${
                          isInterestUnlocked
                            ? 'border-dashed border-zinc-700/60 hover:border-[#f2ca50]/40 hover:bg-zinc-800/40 text-[#f2ca50] cursor-pointer'
                            : 'bg-zinc-900 border-[#f2ca50] text-[#f2ca50] font-black shadow-[0_0_12px_rgba(242,202,80,0.35)] cursor-not-allowed scale-[1.02] font-mono'
                        }`}
                        title={isInterestUnlocked ? "클릭하여 직접 대출금리 입력" : "대출 금리 고정 잠금 상태"}
                        disabled={!isInterestUnlocked}
                      >
                        <span className="tracking-tight">{interestRate.toFixed(1)} %</span>
                        {isInterestUnlocked ? (
                          <Pencil className="w-2.5 h-2.5 text-zinc-500 animate-pulse" />
                        ) : (
                          <Lock className="w-3 h-3 text-[#f2ca50]" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (isInterestUnlocked) {
                        setInterestRate(prev => Math.max(2.0, Number((prev - 0.1).toFixed(1))));
                      }
                    }}
                    disabled={!isInterestUnlocked}
                    className={`w-9 h-9 rounded-lg bg-zinc-900 border text-[#f2ca50] flex items-center justify-center active:scale-95 transition-all shrink-0 select-none ${
                      isInterestUnlocked 
                        ? 'border-[#f2ca50]/25 hover:border-[#f2ca50]/60 hover:bg-zinc-800 cursor-pointer' 
                        : 'border-zinc-850 text-zinc-600 opacity-30 cursor-not-allowed'
                    }`}
                    title="0.1% 인하"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex-1 py-1 flex items-center gap-2">
                    <input 
                      type="range" 
                      onWheel={(e) => (e.target as HTMLElement).blur()}
                      min="2.0" 
                      max="7.0" 
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => {
                        if (isInterestUnlocked) {
                          setInterestRate(Number(e.target.value));
                        }
                      }}
                      disabled={!isInterestUnlocked}
                      className={`w-full h-1.5 rounded-lg appearance-none transition-all outline-none ${
                        isInterestUnlocked 
                          ? 'bg-[#f2ca50]/25 accent-[#f2ca50] cursor-ew-resize' 
                          : 'bg-zinc-800/10 accent-zinc-500 opacity-30 cursor-not-allowed'
                      }`}
                    />
                    
                    {/* Lock safety pin */}
                    <button
                      type="button"
                      onClick={() => {
                        const nextState = !isInterestUnlocked;
                        setIsInterestUnlocked(nextState);
                        if (!nextState) {
                          playLockSound();
                        } else {
                          playUnlockSound();
                        }
                      }}
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center active:scale-95 transition-all shrink-0 cursor-pointer select-none ${
                        isInterestUnlocked
                          ? 'bg-[#f2ca50]/15 border-[#f2ca50]/40 text-[#f2ca50] shadow-[0_0_8px_rgba(242,202,80,0.1)] hover:bg-[#f2ca50]/30'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800/40'
                      }`}
                      title={isInterestUnlocked ? "실재 이자율 변경 오작동 잠금 고정" : "수정 잠금 해제"}
                    >
                      {isInterestUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (isInterestUnlocked) {
                        setInterestRate(prev => Math.min(7.0, Number((prev + 0.1).toFixed(1))));
                      }
                    }}
                    disabled={!isInterestUnlocked}
                    className={`w-9 h-9 rounded-lg bg-zinc-900 border text-[#f2ca50] flex items-center justify-center active:scale-95 transition-all shrink-0 select-none ${
                      isInterestUnlocked 
                        ? 'border-[#f2ca50]/25 hover:border-[#f2ca50]/60 hover:bg-zinc-800 cursor-pointer' 
                        : 'border-zinc-850 text-zinc-600 opacity-30 cursor-not-allowed'
                    }`}
                    title="0.1% 인상"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex justify-between text-[10px] text-[#f2ca50]/55 font-mono">
                  <span>2.0%</span>
                  <span className={`text-[9px] font-sans ${isInterestUnlocked ? 'text-[#7dffa2]/60' : 'text-rose-450 font-bold'}`}>
                    {isInterestUnlocked ? '🔓 실시간 조절 활성' : '🔒 금리 고정 잠금'}
                  </span>
                  <span>7.0%</span>
                </div>
                {/* 대출 기간 선택 */}
                <div className="pt-3 border-t border-zinc-800/50 mt-1 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">대출 상환 기간</span>
                  <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                    {[15, 30, 40, 50].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          if (isInterestUnlocked) {
                            setLoanTerm(term);
                            playClickSound();
                          }
                        }}
                        disabled={!isInterestUnlocked}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                          loanTerm === term 
                            ? 'bg-rose-500 text-white shadow-[0_0_8px_rgba(243,24,96,0.4)]' 
                            : 'text-zinc-500 hover:text-zinc-300'
                        } ${!isInterestUnlocked && loanTerm !== term ? 'opacity-30 cursor-not-allowed' : ''}`}
                      >
                        {term}년
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* B. 시장 전월세 전환율 - 개별 영역 독립 테두리 박스 */}
              <div className="p-4 rounded-xl border border-[#f2ca50]/25 bg-zinc-950/40 hover:border-[#f2ca50]/50 transition-all flex flex-col gap-3 shadow-md shadow-[#f2ca50]/5">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-slate-200 font-bold flex items-center gap-1">시장 전월세 전환율 (연)</span>
                  <div className="relative">
                    {activeEdit === 'conversion' ? (
                      <div className="flex items-center gap-1 bg-zinc-900 border border-[#f2ca50]/55 rounded-lg p-1 shadow-lg z-10 animate-fade-in">
                        <input
                          type="text"
                          className="w-16 bg-transparent text-right text-xs font-black text-[#f2ca50] outline-none border-b border-zinc-700 focus:border-[#f2ca50] font-mono"
                          value={rawInputValue}
                          onChange={(e) => handleRawInputChange(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveValue('conversion');
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          autoFocus
                        />
                        <span className="text-[10px] text-zinc-400">%</span>
                        <button
                          type="button"
                          onClick={() => saveValue('conversion')}
                          className="p-1 text-[#7dffa2] hover:bg-zinc-800 rounded transition-colors"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="p-1 text-rose-400 hover:bg-zinc-800 rounded transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (isConversionUnlocked) {
                            startEdit('conversion', conversionRate);
                          }
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all text-xs font-bold ${
                          isConversionUnlocked
                            ? 'border-dashed border-zinc-700/60 hover:border-[#f2ca50]/40 hover:bg-zinc-800/40 text-[#f2ca50] cursor-pointer'
                            : 'bg-zinc-900 border-[#f2ca50] text-[#f2ca50] font-black shadow-[0_0_12px_rgba(242,202,80,0.35)] cursor-not-allowed scale-[1.02] font-mono'
                        }`}
                        title={isConversionUnlocked ? "클릭하여 직접 전환율 입력" : "전환율 고정 잠금 상태"}
                        disabled={!isConversionUnlocked}
                      >
                        <span className="tracking-tight">{conversionRate.toFixed(1)} %</span>
                        {isConversionUnlocked ? (
                          <Pencil className="w-2.5 h-2.5 text-zinc-500 animate-pulse" />
                        ) : (
                          <Lock className="w-3 h-3 text-[#f2ca50]" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (isConversionUnlocked) {
                        setConversionRate(prev => Math.max(3.0, Number((prev - 0.1).toFixed(1))));
                      }
                    }}
                    disabled={!isConversionUnlocked}
                    className={`w-9 h-9 rounded-lg bg-zinc-900 border text-[#f2ca50] flex items-center justify-center active:scale-95 transition-all shrink-0 select-none ${
                      isConversionUnlocked 
                        ? 'border-[#f2ca50]/25 hover:border-[#f2ca50]/60 hover:bg-zinc-800 cursor-pointer' 
                        : 'border-zinc-850 text-zinc-600 opacity-30 cursor-not-allowed'
                    }`}
                    title="0.1% 인하"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  
                  <div className="flex-1 py-1 flex items-center gap-2">
                    <input 
                      type="range" 
                      onWheel={(e) => (e.target as HTMLElement).blur()}
                      min="3.0" 
                      max="8.0" 
                      step="0.1"
                      value={conversionRate}
                      onChange={(e) => {
                        if (isConversionUnlocked) {
                          setConversionRate(Number(e.target.value));
                        }
                      }}
                      disabled={!isConversionUnlocked}
                      className={`w-full h-1.5 rounded-lg appearance-none transition-all outline-none ${
                        isConversionUnlocked 
                          ? 'bg-[#f2ca50]/25 accent-[#f2ca50] cursor-ew-resize' 
                          : 'bg-zinc-800/10 accent-zinc-500 opacity-30 cursor-not-allowed'
                      }`}
                    />
                    
                    {/* Lock safety pin */}
                    <button
                      type="button"
                      onClick={() => {
                        const nextState = !isConversionUnlocked;
                        setIsConversionUnlocked(nextState);
                        if (!nextState) {
                          playLockSound();
                        } else {
                          playUnlockSound();
                        }
                      }}
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center active:scale-95 transition-all shrink-0 cursor-pointer select-none ${
                        isConversionUnlocked
                          ? 'bg-[#f2ca50]/15 border-[#f2ca50]/40 text-[#f2ca50] shadow-[0_0_8px_rgba(242,202,80,0.1)] hover:bg-[#f2ca50]/30'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800/40'
                      }`}
                      title={isConversionUnlocked ? "협상 전환율 및 월세 연동 비율 잠금 고정" : "수정 잠금 해제"}
                    >
                      {isConversionUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (isConversionUnlocked) {
                        setConversionRate(prev => Math.min(8.0, Number((prev + 0.1).toFixed(1))));
                      }
                    }}
                    disabled={!isConversionUnlocked}
                    className={`w-9 h-9 rounded-lg bg-zinc-900 border text-[#f2ca50] flex items-center justify-center active:scale-95 transition-all shrink-0 select-none ${
                      isConversionUnlocked 
                        ? 'border-[#f2ca50]/25 hover:border-[#f2ca50]/60 hover:bg-zinc-800 cursor-pointer' 
                        : 'border-zinc-850 text-zinc-650 opacity-30 cursor-not-allowed'
                    }`}
                    title="0.1% 인상"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex justify-between text-[10px] text-[#f2ca50]/55 font-mono mb-1">
                  <span>3.0%</span>
                  <span className={`text-[9px] font-sans ${isConversionUnlocked ? 'text-[#7dffa2]/60' : 'text-rose-450 font-bold'}`}>
                    {isConversionUnlocked ? '🔓 실시간 조절 활성' : '🔒 전환율 고정 잠금'}
                  </span>
                  <span>8.0%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Restored Premium Guide Card with Attention-Inducing Toggle button */}
          <div className="pt-2 border-t border-white/5 space-y-3 shrink-0">
            <button
              type="button"
              onClick={() => setShowBonusGuide(!showBonusGuide)}
              className="w-full relative py-3 px-4 rounded-xl font-black text-xs transition-all duration-300 flex items-center justify-between overflow-hidden select-none cursor-pointer group shadow-[0_0_15px_rgba(242,202,80,0.1)] active:scale-[0.98] border border-[#f2ca50]/35 bg-[#f2ca50]/10 text-[#f2ca50] hover:bg-[#f2ca50]/20"
            >
              {/* Pulsating background highlight */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#f2ca50]/20 via-[#f2ca50]/5 to-transparent animate-pulse pointer-events-none" />
              
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f2ca50] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f2ca50]"></span>
                </span>
                <span className="tracking-tight flex items-center gap-1 text-left">
                  🔥 전월세 적정 월세 수식 & 실전 예시 가이드
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-950/75 border border-[#f2ca50]/30 font-mono text-[#f2ca50]">
                    V3 UPGRADE
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-1 font-sans text-[10px] opacity-80">
                <span>{showBonusGuide ? '숨기기' : '자세히 보기'}</span>
                {showBonusGuide ? <Unlock className="w-3 h-3 text-[#f2ca50]" /> : <Lock className="w-3 h-3 text-[#f2ca50] animate-bounce" />}
              </div>
            </button>

            <AnimatePresence initial={false}>
              {showBonusGuide && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="bg-zinc-950/75 p-4.5 rounded-xl border border-[#f2ca50]/20 space-y-3.5 shadow-inner">
                    <div className="flex items-start gap-2 text-xs leading-relaxed text-slate-300">
                      <Sparkles className="w-4 h-4 text-[#f2ca50] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-[#f2ca50] mb-1 text-left sm:text-xs">
                          기준 전세가 기반의 한국 실전 전환 연동 예시
                        </p>
                        <p className="text-[11px] text-slate-400 text-left leading-normal">
                          기준 전세가 <span className="font-bold text-[#7dffa2]">{formatKRW(marketJeonse)}</span> 및 전환율 <span className="font-bold text-[#f2ca50]">{conversionRate}%</span> 기준, 보증금 수준별 적법한 최종 안착 월세 수준을 예측 산출합니다:
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5 font-sans">
                      <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/5 space-y-1 hover:border-[#f2ca50]/20 transition-colors">
                        <div className="flex justify-between text-xs font-bold text-slate-200">
                          <span>보증금 1억 원 전환 시:</span>
                          <span className="text-[#f2ca50] text-right font-black">
                            적정 월세 {formatKRW(calculatedRentFor1Eok)}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal text-left">
                          *수식: ({formatKRW(marketJeonse).replace(' 원', '')} - 1억 원) &times; {conversionRate}% &divide; 12개월
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/5 space-y-1 hover:border-[#f2ca50]/20 transition-colors">
                        <div className="flex justify-between text-xs font-bold text-slate-200">
                          <span>보증금 2억 원 전환 시:</span>
                          <span className="text-[#f2ca50] text-right font-black">
                            적정 월세 {formatKRW(calculatedRentFor2Eok)}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal text-left">
                          *수식: ({formatKRW(marketJeonse).replace(' 원', '')} - 2억 원) &times; {conversionRate}% &divide; 12개월
                        </p>
                      </div>
                    </div>

                    {/* 법적 고시 상한 및 실무 조율 팁 */}
                    <div className="p-3 rounded-lg bg-[#f2ca50]/5 border border-[#f2ca50]/15 space-y-1.5">
                      <div className="text-[10.5px] font-extrabold text-[#f2ca50] flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-[#f2ca50]" />
                        실무용 전월세 전환 계산 법칙 가이드 (실무 실전 노하우)
                      </div>
                      <p className="text-[10px] text-slate-300 leading-relaxed text-left">
                        반전세 협상 테이블에서는 주택임대차보호법에 의거하여 한국은행 기준금리에 일정 마진을 더한 법령 상한선과 시장 전환율 중 낮은 것을 적용하여 최종 수수료율 변동 폭을 차단하는 것이 수익 구조(Leverage &amp; Rent Yield) 방어의 핵심입니다.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 실전 부동산 협상용 양방 정밀 자물쇠 연동 제어 판넬 (보증금 & 월세 가로 2단 나란한 배열) */}
      <div className="bg-[#1e1e1e]/60 backdrop-blur-md border border-[#f2ca50]/20 p-6 rounded-2xl flex flex-col gap-6 shadow-xl shadow-[#f2ca50]/5">
        <div className="flex flex-col gap-1">
          <h3 className="text-base sm:text-lg font-black text-[#f2ca50] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#f2ca50] animate-pulse" />
            실전 협상 가치 평가 및 조율 섹터
          </h3>
          <p className="text-xs text-zinc-400">
            *실시간 협상 테이블에서 보증금과 월세를 즉각적으로 교환 및 연동하여 실투자금 대비 ROI 수익률의 변동 그래프를 관찰할 수 있는 양방향 정밀 기어 시스템입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* A. 실전 협상용 예상 보증금 세팅 (좌측 기어) */}
          <div className="p-4.5 rounded-xl border border-[#f2ca50]/20 bg-zinc-950/45 hover:border-[#f2ca50]/40 transition-all flex flex-col justify-between gap-3 shadow-md shadow-[#f2ca50]/2 group">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-xs sm:text-sm text-slate-200 font-bold flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-[#f2ca50] group-hover:scale-110 transition-transform" /> 실전 협상용 예상 보증금 세팅
              </span>
              <div className="text-center">
                {activeEdit === 'deposit' ? (
                  <div className="relative inline-flex items-center gap-1 bg-zinc-900 border border-[#f2ca50]/55 rounded-lg p-1 shadow-md justify-center select-none animate-fade-in mx-auto">
                    <input
                      type="text"
                      className="w-16 bg-transparent text-center text-xs sm:text-sm font-black text-[#f2ca50] outline-none border-b border-zinc-700 focus:border-[#f2ca50] font-mono"
                      value={rawInputValue}
                      onChange={(e) => handleRawInputChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveValue('deposit');
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      autoFocus
                    />
                    <span className="text-[10px] text-zinc-400 font-bold">만원</span>
                    <button
                      type="button"
                      onClick={() => saveValue('deposit')}
                      className="p-1 text-[#7dffa2] hover:bg-zinc-850 rounded transition-colors"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="p-1 text-rose-450 hover:bg-zinc-850 rounded transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (isDepositUnlocked) {
                        startEdit('deposit', metrics.depositValue / 10000);
                      }
                    }}
                    className={`group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all text-xs font-black select-none ${
                      isDepositUnlocked
                        ? 'border-dashed border-[#f2ca50]/40 text-[#f2ca50] hover:bg-zinc-900 hover:border-[#f2ca50] cursor-pointer'
                        : 'bg-zinc-900 border-[#f2ca50] text-[#f2ca50] font-black shadow-[0_0_12px_rgba(242,202,80,0.35)] cursor-not-allowed scale-[1.02] font-mono'
                    }`}
                    title={isDepositUnlocked ? "클릭하여 직접 금액 입력" : "예상 보증금 고정 잠금 상태"}
                    disabled={!isDepositUnlocked}
                  >
                    <span>{formatKRW(metrics.depositValue)}</span>
                    {isDepositUnlocked ? (
                      <Pencil className="w-2.5 h-2.5 text-zinc-500 animate-pulse" />
                    ) : (
                      <Lock className="w-3 h-3 text-[#f2ca50]" />
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 py-1">
              <button
                type="button"
                onClick={() => {
                  if (isDepositUnlocked) {
                    const nextDeposit = Math.max(20000000, metrics.depositValue - 5000000);
                    const nextRent = Math.max(0, Math.round((marketJeonse - nextDeposit) * (conversionRate / 100) / 12));
                    setTargetRent(nextRent);
                  }
                }}
                disabled={!isDepositUnlocked}
                className={`w-9 h-9 rounded-lg bg-zinc-900 border text-[#f2ca50] flex items-center justify-center active:scale-95 transition-all shrink-0 select-none ${
                  isDepositUnlocked 
                    ? 'border-[#f2ca50]/25 hover:border-[#f2ca50]/60 hover:bg-zinc-850 cursor-pointer shadow-sm shadow-[#f2ca50]/10' 
                    : 'border-zinc-850 text-zinc-600 opacity-30 cursor-not-allowed'
                }`}
                title="보증금 500만원 인하"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              
              <div className="flex-1 py-1 flex items-center gap-2">
                <input 
                  type="range" 
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  min="20000000" 
                  max={marketJeonse} 
                  step="5000000"
                  value={metrics.depositValue}
                  onChange={(e) => {
                    if (isDepositUnlocked) {
                      const nextDeposit = Number(e.target.value);
                      const nextRent = Math.max(0, Math.round((marketJeonse - nextDeposit) * (conversionRate / 100) / 12));
                      setTargetRent(nextRent);
                    }
                  }}
                  disabled={!isDepositUnlocked}
                  className={`w-full h-1.5 rounded-lg appearance-none transition-all outline-none ${
                    isDepositUnlocked 
                    ? 'bg-[#f2ca50]/25 accent-[#f2ca50] cursor-ew-resize' 
                    : 'bg-zinc-800/15 accent-zinc-500 opacity-30 cursor-not-allowed'
                  }`}
                />
                
                {/* Lock safety pin */}
                <button
                  type="button"
                  onClick={() => {
                    const nextState = !isDepositUnlocked;
                    setIsDepositUnlocked(nextState);
                    if (!nextState) {
                      playLockSound();
                    } else {
                      playUnlockSound();
                    }
                  }}
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center active:scale-95 transition-all shrink-0 cursor-pointer select-none ${
                    isDepositUnlocked
                    ? 'bg-[#f2ca50]/15 border-[#f2ca50]/40 text-[#f2ca50] shadow-[0_0_8px_rgba(242,202,80,0.15)] hover:bg-[#f2ca50]/30'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-[#1e1e1e]'
                  }`}
                  title={isDepositUnlocked ? "실제 협상 수치 변경 수동 잠금 고정" : "수정 잠금 해제"}
                >
                  {isDepositUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (isDepositUnlocked) {
                    const nextDeposit = Math.min(marketJeonse, metrics.depositValue + 5000000);
                    const nextRent = Math.max(0, Math.round((marketJeonse - nextDeposit) * (conversionRate / 100) / 12));
                    setTargetRent(nextRent);
                  }
                }}
                disabled={!isDepositUnlocked}
                className={`w-9 h-9 rounded-lg bg-zinc-900 border text-[#f2ca50] flex items-center justify-center active:scale-95 transition-all shrink-0 select-none ${
                  isDepositUnlocked 
                    ? 'border-[#f2ca50]/25 hover:border-[#f2ca50]/60 hover:bg-zinc-850 cursor-pointer shadow-sm shadow-[#f2ca50]/10' 
                    : 'border-zinc-850 text-zinc-600 opacity-30 cursor-not-allowed'
                }`}
                title="보증금 500만원 인상"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono pt-1">
              <span>2,000만 원</span>
              <span className={`text-[9.5px] font-sans font-extrabold ${isDepositUnlocked ? 'text-[#7dffa2]/80 animate-pulse' : 'text-rose-450 font-bold'}`}>
                {isDepositUnlocked ? '🔓 실시간 조절 활성' : '🔒 협상액 고정 잠금'}
              </span>
              <span>{formatKRW(marketJeonse).replace(' 원', '')}</span>
            </div>
          </div>

          {/* B. 실전 협상용 목표 월세 세팅 (우측 기어) */}
          <div className="p-4.5 rounded-xl border border-[#f2ca50]/20 bg-zinc-950/45 hover:border-[#f2ca50]/40 transition-all flex flex-col justify-between gap-3 shadow-md shadow-[#f2ca50]/2 group">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-xs sm:text-sm text-slate-200 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#f2ca50] group-hover:rotate-12 transition-transform" /> 실전 협상용 목표 월세 세팅
              </span>
              <div className="text-center">
                {activeEdit === 'rent' ? (
                  <div className="relative inline-flex items-center gap-1 bg-zinc-900 border border-[#f2ca50]/55 rounded-lg p-1.5 shadow-md justify-center select-none animate-fade-in mx-auto">
                    <input
                      type="text"
                      className="w-16 bg-transparent text-center text-xs sm:text-sm font-black text-[#f2ca50] outline-none border-b border-zinc-700 focus:border-[#f2ca50] font-mono"
                      value={rawInputValue}
                      onChange={(e) => handleRawInputChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveValue('rent');
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      autoFocus
                    />
                    <span className="text-[10px] text-zinc-400 font-bold">만원</span>
                    <button
                      type="button"
                      onClick={() => saveValue('rent')}
                      className="p-1 text-[#7dffa2] hover:bg-zinc-850 rounded transition-colors"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="p-1 text-rose-450 hover:bg-zinc-850 rounded transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (isConversionUnlocked) {
                        startEdit('rent', targetRent / 10000);
                      }
                    }}
                    className={`group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all text-xs font-black select-none ${
                      isConversionUnlocked
                        ? 'border-dashed border-[#f2ca50]/40 text-[#f2ca50] hover:bg-zinc-900 hover:border-[#f2ca50] cursor-pointer'
                        : 'bg-zinc-900 border-[#f2ca50] text-[#f2ca50] font-black shadow-[0_0_12px_rgba(242,202,80,0.35)] cursor-not-allowed scale-[1.02] font-mono'
                    }`}
                    title={isConversionUnlocked ? "클릭하여 직접 금액 입력" : "목표 월세 고정 잠금 상태"}
                    disabled={!isConversionUnlocked}
                  >
                    <span>{formatKRW(targetRent)}</span>
                    {isConversionUnlocked ? (
                      <Pencil className="w-2.5 h-2.5 text-zinc-500 animate-pulse" />
                    ) : (
                      <Lock className="w-3 h-3 text-[#f2ca50]" />
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 py-1">
              <button
                type="button"
                onClick={() => {
                  if (isConversionUnlocked) {
                    setTargetRent(prev => Math.max(500000, prev - 50000));
                  }
                }}
                disabled={!isConversionUnlocked}
                className={`w-9 h-9 rounded-lg bg-zinc-900 border text-[#f2ca50] flex items-center justify-center active:scale-95 transition-all shrink-0 select-none ${
                  isConversionUnlocked 
                    ? 'border-[#f2ca50]/25 hover:border-[#f2ca50]/60 hover:bg-zinc-850 cursor-pointer shadow-sm shadow-[#f2ca50]/10' 
                    : 'border-zinc-850 text-zinc-650 opacity-30 cursor-not-allowed'
                }`}
                title="월세 5만원 인하"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              
              <div className="flex-1 py-1 flex items-center gap-2">
                <input 
                  type="range" 
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  min="500000" 
                  max="2500000" 
                  step="50000"
                  value={targetRent}
                  onChange={(e) => {
                    if (isConversionUnlocked) {
                      setTargetRent(Number(e.target.value));
                    }
                  }}
                  disabled={!isConversionUnlocked}
                  className={`w-full h-1.5 rounded-lg appearance-none transition-all outline-none ${
                    isConversionUnlocked 
                      ? 'bg-[#f2ca50]/25 accent-[#f2ca50] cursor-ew-resize' 
                      : 'bg-zinc-800/15 accent-zinc-500 opacity-30 cursor-not-allowed'
                  }`}
                />
                
                {/* Lock safety pin */}
                <button
                  type="button"
                  onClick={() => {
                    const nextState = !isConversionUnlocked;
                    setIsConversionUnlocked(nextState);
                    if (!nextState) {
                      playLockSound();
                    } else {
                      playUnlockSound();
                    }
                  }}
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center active:scale-95 transition-all shrink-0 cursor-pointer select-none ${
                    isConversionUnlocked
                      ? 'bg-[#f2ca50]/15 border-[#f2ca50]/40 text-[#f2ca50] shadow-[0_0_8px_rgba(242,202,80,0.15)] hover:bg-[#f2ca50]/30'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-[#1e1e1e]'
                  }`}
                  title={isConversionUnlocked ? "협상 전환율 및 월세 연동 비율 잠금 고정" : "수정 잠금 해제"}
                >
                  {isConversionUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (isConversionUnlocked) {
                    setTargetRent(prev => Math.min(2500000, prev + 50000));
                  }
                }}
                disabled={!isConversionUnlocked}
                className={`w-9 h-9 rounded-lg bg-zinc-900 border text-[#f2ca50] flex items-center justify-center active:scale-95 transition-all shrink-0 select-none ${
                  isConversionUnlocked 
                    ? 'border-[#f2ca50]/25 hover:border-[#f2ca50]/60 hover:bg-zinc-850 cursor-pointer shadow-sm shadow-[#f2ca50]/10' 
                    : 'border-zinc-850 text-zinc-650 opacity-30 cursor-not-allowed'
                }`}
                title="월세 5만원 인상"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="flex justify-between text-[10px] text-[#f2ca50]/55 font-mono pt-1">
              <span>50만 원</span>
              <span className={`text-[9.5px] font-sans font-extrabold ${isConversionUnlocked ? 'text-[#7dffa2]/80 animate-pulse' : 'text-rose-450 font-bold'}`}>
                {isConversionUnlocked ? '🔓 실시간 조절 활성' : '🔒 전환율 고정 잠금'}
              </span>
              <span>250만 원</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Output KPIs Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: 실투자금 (필요 현금) */}
        <div className="bg-[#1e1e1e]/60 border border-rose-500/30 p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group shadow-[0_0_15px_rgba(243,24,96,0.1)] hover:border-rose-500/60 transition-all">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-rose-500/10 rounded-full blur-xl group-hover:bg-rose-500/20 transition-all"></div>
          <div className="relative z-10">
            <div className="flex flex-col gap-1 mb-1.5">
              <p className="text-xs text-rose-400 font-bold tracking-tight">실투자금 (당장 필요한 현금)</p>
              <p className="text-[10px] text-rose-400/70 font-sans break-keep font-medium">실질투입금액 = [총필요자금] - [주담대] - [보증금]</p>
            </div>
            <h4 className="text-base sm:text-lg font-black text-white drop-shadow-md">{formatKRW(metrics.actualCashNeeded)}</h4>
          </div>
          <div className="h-1.5 w-full bg-zinc-800 mt-4 rounded-full overflow-hidden relative z-10">
            <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${Math.min(100, (metrics.actualCashNeeded / totalNeededCapital) * 100)}%` }}></div>
          </div>
        </div>

        {/* KPI 2: 잔여 대출금 */}
        <div className="bg-[#1e1e1e]/60 border border-white/5 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1 font-sans">보증금 상환 후 잔여 대출금</p>
            <h4 className="text-base sm:text-lg font-black text-white">{formatKRW(metrics.remainingLoan)}</h4>
          </div>
          <p className="text-[10px] text-zinc-500 mt-3 font-semibold font-mono">대출 정밀 상환율: {metrics.repaymentRatio.toFixed(1)}%</p>
        </div>

        {/* KPI 3: 매월 원리금 상환액 */}
        <div className="bg-[#1e1e1e]/60 border border-white/5 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1">매월 은행 원리금 상환액</p>
            <h4 className="text-base sm:text-lg font-black text-white">{formatKRW(metrics.monthlyAmortization)}</h4>
          </div>
          <div className="flex gap-1 mt-4 h-1.5">
            <div className="bg-[#f2ca50] rounded-full transition-all duration-300" style={{ width: `${metrics.principalPercent}%` }}></div>
            <div className="bg-[#f2ca50]/20 rounded-full transition-all duration-300" style={{ width: `${100 - metrics.principalPercent}%` }}></div>
          </div>
        </div>

        {/* KPI 4: 월 수취 월세 수익 */}
        <div className="bg-[#1e1e1e]/60 border border-white/5 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1">매월 수취 월세 수익</p>
            <h4 className="text-base sm:text-lg font-black text-[#f2ca50]">{formatKRW(targetRent)}</h4>
          </div>
          <div className="flex items-center gap-1 mt-2 text-[#7dffa2] text-[10px] font-bold">
            <ArrowUp className="w-3.5 h-3.5" /> 임대 계약 고정 보장 수취액
          </div>
        </div>

        {/* KPI 5: 실질 투자 수익률 */}
        <div className="bg-[#7dffa2]/5 border-l-2 border-[#7dffa2] p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <p className="text-xs text-[#7dffa2] font-semibold mb-1">실질 투자 수익률 (ROI)</p>
            <h4 className="text-lg sm:text-xl font-black text-[#7dffa2] font-mono">{metrics.roiPercentage.toFixed(2)} %</h4>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 font-sans leading-tight">원금상환형 소유자산 환산 수익 적용</p>
        </div>
      </section>

      {/* Main Bottom Comprehensive Balance Card */}
      <section 
        className={`p-6 md:p-8 rounded-3xl border-2 transition-all duration-500 shadow-2xl ${
          isPositiveFlow 
            ? 'border-[#7dffa2]/30 bg-[#7dffa2]/5' 
            : 'border-rose-500/20 bg-rose-500/5'
        }`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h2 className="text-sm sm:text-base font-bold text-slate-200">
              최종 실질 현금 흐름 <span className="text-xs text-slate-400 font-normal font-sans">(수취월세 - 원리금상환)</span>
            </h2>
            <div className={`text-2xl sm:text-3xl md:text-4xl font-extrabold ${isPositiveFlow ? 'text-[#7dffa2]' : 'text-rose-400'}`}>
              {isPositiveFlow ? `+${formatKRW(metrics.netCashFlow)}` : `-${formatKRW(Math.abs(metrics.netCashFlow))}`}
            </div>
          </div>
          
          <div className="max-w-md text-slate-300 text-xs sm:text-sm leading-relaxed border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 space-y-1.5">
            <p>
              *매월 은행에 갚는 금액 중 약 <span className="text-[#f2ca50] font-bold font-mono">{formatKRW(metrics.monthlyPrincipalSaved)}</span>은 소멸되는 대출이자가 아니라 <span className="text-[#7dffa2] font-bold">‘내 집에 자동으로 축적되는 저축 원금’</span>에 해당합니다. 
            </p>
            <p className="mt-1">
              따라서 임대 소유주님의 실질적인 무위험 자산은 부채 차감 부를 반영하여 매월 약 <span className="text-white font-bold font-mono">{formatKRW(metrics.netCashFlow + metrics.monthlyPrincipalSaved)}</span>씩 실제 가비지로 순증가하는 견실한 우상향 자생 가계 구조입니다.
            </p>
          </div>
        </div>
      </section>


    </motion.div>
  );
}
