import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Building2, 
  Map, 
  LineChart, 
  Coins, 
  Gauge, 
  User, 
  Calculator, 
  ClipboardCheck, 
  BookOpen,
  Sparkles,
  Flame
} from 'lucide-react';

// Import modular sub-components
import LeverageCalculator from './components/LeverageCalculator';
import MasterPlan from './components/MasterPlan';
import SpecialNotes from './components/SpecialNotes';
import MarketAnalysis from './components/MarketAnalysis';
import LocationAnalysis from './components/LocationAnalysis';
import ProductAnalysis from './components/ProductAnalysis';
import InvestmentAnalysis from './components/InvestmentAnalysis';
import KnowledgeModal from './components/KnowledgeModal';
import MyPlanPortfolio from './components/MyPlanPortfolio';
import SavedPlansModal from './components/SavedPlansModal';
import { playClickSound, playIgniteSound } from './utils/audio';

type AppTab = 'calculator' | 'masterplan' | 'notes' | 'market' | 'location' | 'product' | 'investment';

interface ToastAlert {
  message: string;
  id: number;
}

export default function App() {
  const [activeTab, setActiveTab ] = useState<AppTab>('calculator');
  const [modalKey, setModalKey] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isSavedPlansOpen, setIsSavedPlansOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastAlert[]>([]);
  const [isFullyLocked, setIsFullyLocked] = useState<boolean>(false);
  const [isFlameQuenched, setIsFlameQuenched] = useState<boolean>(() => {
    try {
      return localStorage.getItem('byubin_flame_quenched') === 'true';
    } catch {
      return false;
    }
  });

  const checkLocks = () => {
    try {
      const lockTotal = localStorage.getItem('byubin_lock_total_capital') === 'locked';
      const lockLoan = localStorage.getItem('byubin_lock_initial_loan') === 'locked';
      const lockJeonse = localStorage.getItem('byubin_lock_market_jeonse') === 'locked';
      const lockInterest = localStorage.getItem('byubin_lock_interest_rate') === 'locked';
      const lockConversion = localStorage.getItem('byubin_lock_conversion_rate') === 'locked';
      const lockDeposit = localStorage.getItem('byubin_lock_deposit') === 'locked';
      
      return lockTotal && lockLoan && lockJeonse && lockInterest && lockConversion && lockDeposit;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    setIsFullyLocked(checkLocks());

    const handleLockUpdate = () => {
      const nextLocked = checkLocks();
      setIsFullyLocked(prev => {
        if (nextLocked && !prev) {
          handleShowToast("🔥 [금융 잠금 시스템 점화] 대표님! 6대 자산 설계 인자가 완전히 고정 잠금되어 마스터플랜의 시너지가 불타오릅니다!");
          try {
            localStorage.setItem('byubin_flame_quenched', 'false');
            window.dispatchEvent(new CustomEvent('byubin_flame_quenched_updated'));
          } catch {}
        }
        return nextLocked;
      });
    };

    const handleFlameQuencedSync = () => {
      try {
        setIsFlameQuenched(localStorage.getItem('byubin_flame_quenched') === 'true');
      } catch {}
    };

    window.addEventListener('byubin_locks_updated', handleLockUpdate);
    window.addEventListener('byubin_plan_updated', handleLockUpdate);
    window.addEventListener('byubin_flame_quenched_updated', handleFlameQuencedSync);

    return () => {
      window.removeEventListener('byubin_locks_updated', handleLockUpdate);
      window.removeEventListener('byubin_plan_updated', handleLockUpdate);
      window.removeEventListener('byubin_flame_quenched_updated', handleFlameQuencedSync);
    };
  }, []);

  // Trigger state to show modal popped-up
  const handleOpenNotebook = (key: string) => {
    setModalKey(key);
  };

  // Custom Toast handler
  const handleShowToast = (msg: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { message: msg, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2800);
  };

  // Safe callback to navigate back to principal leverage calculator
  const handleReturnToCalculator = () => {
    setActiveTab('calculator');
  };

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen pb-32 font-sans select-none antialiased">
      {/* Top Sticky Branded Header Panel */}
      <header className="sticky top-0 w-full z-40 bg-[#131313]/90 backdrop-blur-xl border-b border-zinc-800/80 shadow-md">
        <div className="max-w-4xl mx-auto w-full px-4 pt-5 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleReturnToCalculator}>
            {/* Premium Mobile App Launcher Icon Emblem */}
            <div className="relative group/logo">
              <div className="absolute -inset-0.5 bg-gradient-to-tr from-[#f2ca50] to-[#e4bc3c] rounded-xl blur opacity-30 group-hover/logo:opacity-50 transition duration-300"></div>
              <div className="relative bg-gradient-to-tr from-[#1b1b1b] via-[#2c240f] to-[#1e1a10] p-2.5 rounded-xl border border-[#f2ca50]/30 shadow-md flex justify-center items-center">
                <svg className="w-5 h-5 text-[#f2ca50]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18" />
                  <path d="M19 21v-8a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v8" />
                  <path d="M9 21v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4" />
                  <path d="m12 3-10 9h3" />
                  <path d="m12 3 10 9h-3" />
                  <path d="M9 10h.01" />
                  <path d="M15 10h.01" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-lg font-black text-[#f2ca50] tracking-tight hover:brightness-110 transition-all">아파트입주&투자플랜</h1>
                <span className="text-[9px] font-extrabold bg-[#f2ca50]/15 text-[#f2ca50] border border-[#f2ca50]/20 px-1.5 py-0.2 rounded font-mono uppercase tracking-wider scale-90">V3</span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#7dffa2] animate-pulse"></span>
                뷰빈 AI 부동산마스터
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playClickSound();
                setIsSavedPlansOpen(true);
              }}
              className="px-3 py-2.5 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-black flex items-center gap-1.5 bg-zinc-800/80 border border-zinc-700 text-slate-300 hover:bg-zinc-700 hover:text-white transition-all cursor-pointer shadow-md active:scale-95"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">저장된 플랜</span> 불러오기
            </button>
            
            {/* Premium Gold-Glowing Glassmorphism Portfolio Gate Button */}
            <button 
              onClick={() => {
                if (isFullyLocked && !isFlameQuenched) {
                  playIgniteSound();
                } else {
                  playClickSound();
                }
                setIsProfileOpen(true);
                try {
                  localStorage.setItem('byubin_flame_quenched', 'true');
                  window.dispatchEvent(new CustomEvent('byubin_flame_quenched_updated'));
                } catch {}
              }}
              className={`relative backdrop-blur-md px-3.5 py-2.5 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-black flex items-center gap-1.5 sm:gap-2 active:scale-95 duration-300 cursor-pointer select-none group/portfolio overflow-hidden transition-all ${
                (isFullyLocked && !isFlameQuenched)
                  ? 'bg-gradient-to-r from-[#ff3c00] via-[#fc4100] to-[#f2ca50] border-2 border-yellow-300 text-white shadow-[0_0_25px_rgba(255,60,0,0.8)] hover:shadow-[0_0_40px_rgba(255,60,0,1)] hover:scale-103 scale-102 ring-2 ring-orange-550/30'
                  : 'bg-gradient-to-r from-amber-500/10 via-[#f2ca50]/15 to-amber-500/10 hover:from-amber-500/20 hover:via-[#f2ca50]/35 hover:to-[#f2ca50]/10 text-[#f2ca50] border border-[#f2ca50]/45 hover:border-[#f2ca50] shadow-[0_0_15px_-4px_rgba(242,202,80,0.25)] hover:shadow-[0_0_22px_-2px_rgba(242,202,80,0.45)]'
              }`}
              title="나의 입주플랜 포트폴리오 세팅 및 마스터플랜 확인"
            >
              {/* Elegant glass reflect shine swipe keyframe effect over container */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/portfolio:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

              {/* Ignited fire sparks decoration */}
              {(isFullyLocked && !isFlameQuenched) && (
                <span className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom,rgba(255,230,0,0.45),transparent)] animate-pulse pointer-events-none" />
              )}

              {(isFullyLocked && !isFlameQuenched) ? (
                <Flame className="w-4 h-4 text-white animate-bounce group-hover/portfolio:scale-125 transition-transform shrink-0" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-[#f2ca50] group-hover/portfolio:scale-110 group-hover/portfolio:rotate-12 transition-transform duration-300 shrink-0" />
              )}
              
              {(isFullyLocked && !isFlameQuenched) ? (
                <span className="font-extrabold tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-pulse">
                  🔥 이글이글 플랜 확인하기
                </span>
              ) : (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fffbf0] via-[#f2ca50] to-[#e4bc3c] font-black tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">
                  내 플랜 확인하기
                </span>
              )}

              {/* Glowing critical status alert beacon */}
              <span className="flex h-1.5 w-1.5 shrink-0 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${(isFullyLocked && !isFlameQuenched) ? 'bg-white' : 'bg-[#f2ca50]'}`}></span>
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${(isFullyLocked && !isFlameQuenched) ? 'bg-white' : 'bg-[#f2ca50]'}`}></span>
              </span>
            </button>
          </div>
        </div>

        {/* Primary 3-Tab Header Array */}
        <div className="border-t border-white/[0.03] overflow-x-auto no-scrollbar">
          <div className="max-w-4xl mx-auto w-full flex">
            {/* Tab 1: Leverage Calculator */}
            <button 
              onClick={() => {
                playClickSound();
                setActiveTab('calculator');
              }}
              className={`relative flex-1 py-3 text-xs sm:text-sm transition-all duration-300 font-bold tracking-tight text-center min-w-[100px] cursor-pointer ${
                activeTab === 'calculator' 
                  ? 'text-[#f2ca50] font-black' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              레버리지 계산기
              <div 
                className={`absolute bottom-[-1px] left-1/2 -translate-x-1/2 h-[2.5px] bg-[#f2ca50] rounded-full transition-all duration-300 ${
                  activeTab === 'calculator' ? 'w-[70%]' : 'w-0'
                }`} 
              />
            </button>

            {/* Tab 2: Pre-inspection Masterplan */}
            <button 
              onClick={() => {
                playClickSound();
                setActiveTab('masterplan');
              }}
              className={`relative flex-1 py-3 text-xs sm:text-sm transition-all duration-300 font-bold tracking-tight text-center min-w-[124px] cursor-pointer ${
                activeTab === 'masterplan' 
                  ? 'text-[#f2ca50] font-black' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              사전점검 마스터플랜
              <div 
                className={`absolute bottom-[-1px] left-1/2 -translate-x-1/2 h-[2.5px] bg-[#f2ca50] rounded-full transition-all duration-300 ${
                  activeTab === 'masterplan' ? 'w-[70%]' : 'w-0'
                }`} 
              />
            </button>

            {/* Tab 3: Landlord Care Guidelines */}
            <button 
              onClick={() => {
                playClickSound();
                setActiveTab('notes');
              }}
              className={`relative flex-1 py-3 text-xs sm:text-sm transition-all duration-300 font-bold tracking-tight text-center min-w-[124px] cursor-pointer ${
                activeTab === 'notes' 
                  ? 'text-[#f2ca50] font-black' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              신축임대 특수 주의점
              <div 
                className={`absolute bottom-[-1px] left-1/2 -translate-x-1/2 h-[2.5px] bg-[#f2ca50] rounded-full transition-all duration-300 ${
                  activeTab === 'notes' ? 'w-[70%]' : 'w-0'
                }`} 
              />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Viewport */}
      <main className="mt-8 px-4 max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {activeTab === 'calculator' && (
            <motion.div key="calculator">
              <LeverageCalculator />
            </motion.div>
          )}

          {activeTab === 'masterplan' && (
            <motion.div key="masterplan">
              <MasterPlan onOpenNotebook={handleOpenNotebook} />
            </motion.div>
          )}

          {activeTab === 'notes' && (
            <motion.div key="notes">
              <SpecialNotes />
            </motion.div>
          )}

          {activeTab === 'market' && (
            <motion.div key="market">
              <MarketAnalysis onReturnToCalculator={handleReturnToCalculator} />
            </motion.div>
          )}

          {activeTab === 'location' && (
            <motion.div key="location">
              <LocationAnalysis onReturnToCalculator={handleReturnToCalculator} />
            </motion.div>
          )}

          {activeTab === 'product' && (
            <motion.div key="product">
              <ProductAnalysis onReturnToCalculator={handleReturnToCalculator} />
            </motion.div>
          )}

          {activeTab === 'investment' && (
            <motion.div key="investment">
              <InvestmentAnalysis onReturnToCalculator={handleReturnToCalculator} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Floating Hub Navigator Shelf (부동산 분석 4종 탭) */}
      <nav 
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 flex justify-around items-center px-4 pb-5 pt-2.5 bg-[#1a1a1a]/90 backdrop-blur-xl border-t border-white/[0.05] shadow-[0_-15px_40px_rgba(0,0,0,0.85)] rounded-t-3xl"
        id="bottom-navigation-hub"
      >
        {/* Hub Button 1: Market Analysis */}
        <button 
          onClick={() => setActiveTab('market')}
          className={`group flex flex-col items-center justify-center rounded-xl px-2 py-1 transition-all duration-250 cursor-pointer ${
            activeTab === 'market' 
              ? 'text-[#f2ca50] font-bold bg-[#f2ca50]/10 scale-105' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <LineChart className="w-5 h-5 mb-0.5 group-hover:scale-110 duration-150" />
          <span className="text-[10px] font-bold">시장분석</span>
        </button>

        {/* Hub Button 2: Location Grading */}
        <button 
          onClick={() => setActiveTab('location')}
          className={`group flex flex-col items-center justify-center rounded-xl px-2 py-1 transition-all duration-250 cursor-pointer ${
            activeTab === 'location' 
              ? 'text-[#f2ca50] font-bold bg-[#f2ca50]/10 scale-105' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Map className="w-5 h-5 mb-0.5 group-hover:scale-110 duration-150" />
          <span className="text-[10px] font-bold">입지분석</span>
        </button>

        {/* Hub Button 3: Housing Types */}
        <button 
          onClick={() => setActiveTab('product')}
          className={`group flex flex-col items-center justify-center rounded-xl px-2 py-1 transition-all duration-250 cursor-pointer ${
            activeTab === 'product' 
              ? 'text-[#f2ca50] font-bold bg-[#f2ca50]/10 scale-105' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-5 h-5 mb-0.5 group-hover:scale-110 duration-150" />
          <span className="text-[10px] font-bold">상품분석</span>
        </button>

        {/* Hub Button 4: Strategies */}
        <button 
          onClick={() => setActiveTab('investment')}
          className={`group flex flex-col items-center justify-center rounded-xl px-2 py-1 transition-all duration-250 cursor-pointer ${
            activeTab === 'investment' 
              ? 'text-[#f2ca50] font-bold bg-[#f2ca50]/10 scale-105' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Coins className="w-5 h-5 mb-0.5 group-hover:scale-110 duration-150" />
          <span className="text-[10px] font-bold">방법분석</span>
        </button>
      </nav>

      {/* Deluxe Detailed Modal Popup */}
      <KnowledgeModal 
        isOpen={modalKey !== null}
        onClose={() => setModalKey(null)}
        itemKey={modalKey || ""}
        onShowToast={handleShowToast}
      />

      {/* Personal Capital and Leverage Portfolio Sync Modal */}
      <MyPlanPortfolio 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onShowToast={handleShowToast}
      />

      {/* Saved Plans Archive Modal */}
      <SavedPlansModal
        isOpen={isSavedPlansOpen}
        onClose={() => setIsSavedPlansOpen(false)}
        onShowToast={handleShowToast}
      />

      {/* Floating Micro-Toasts */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="bg-[#f2ca50] text-[#3c2f00] text-xs font-black px-5 py-3 rounded-full shadow-2xl border border-[#f2ca50]/20 max-w-sm pointer-events-auto"
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
