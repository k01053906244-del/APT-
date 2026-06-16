import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { X, Calendar, Building2, Coins, Trash2, ArrowRight } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface SavedPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

interface SavedPlan {
  id: string;
  aptName: string;
  totalNeededCapital: number;
  initialLoan: number;
  marketJeonse: number;
  interestRate: number;
  conversionRate: number;
  targetRent: number;
  createdAt: string;
}

const formatKRW = (val: number): string => {
  if (val >= 100000000) {
    const eok = Math.floor(val / 100000000);
    const man = Math.floor((val % 100000000) / 10000);
    return man > 0 ? `${eok}억 ${man.toLocaleString()}만 원` : `${eok}억 원`;
  }
  return `${Math.floor(val / 10000).toLocaleString()}만 원`;
};

export default function SavedPlansModal({ isOpen, onClose, onShowToast }: SavedPlansModalProps) {
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPlans();
    }
  }, [isOpen]);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, 'savedPlans'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedPlans: SavedPlan[] = [];
      querySnapshot.forEach((doc) => {
        fetchedPlans.push({ id: doc.id, ...doc.data() } as SavedPlan);
      });
      setPlans(fetchedPlans);
    } catch (error) {
      console.error("Error fetching plans: ", error);
      onShowToast("⚠️ 저장된 플랜을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadPlan = (plan: SavedPlan) => {
    playClickSound();
    
    // 1. Update localStorage
    localStorage.setItem('byubin_apt_name', plan.aptName);
    localStorage.setItem('byubin_total_capital', plan.totalNeededCapital.toString());
    localStorage.setItem('byubin_initial_loan', plan.initialLoan.toString());
    localStorage.setItem('byubin_market_jeonse', plan.marketJeonse.toString());
    localStorage.setItem('byubin_interest_rate', plan.interestRate.toString());
    localStorage.setItem('byubin_conversion_rate', plan.conversionRate.toString());
    localStorage.setItem('byubin_target_rent', plan.targetRent.toString());

    // 2. Trigger events to sync UI
    window.dispatchEvent(new CustomEvent('byubin_apt_name_updated', { detail: plan.aptName }));
    window.dispatchEvent(new CustomEvent('byubin_plan_updated'));
    
    onShowToast(`📂 [${plan.aptName}] 플랜을 성공적으로 불러왔습니다.`);
    onClose();
  };

  const handleDeletePlan = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, 'savedPlans', id));
      setPlans(prev => prev.filter(p => p.id !== id));
      onShowToast("🗑️ 플랜이 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting plan: ", error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-zinc-900 border border-[#f2ca50]/30 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-950 shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-[#f2ca50]/20 p-2 rounded-xl border border-[#f2ca50]/30">
                <Calendar className="w-5 h-5 text-[#f2ca50]" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">저장된 플랜 보관함</h2>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">과거에 분석한 아파트 플랜을 다시 불러옵니다.</p>
              </div>
            </div>
            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-48 space-y-4">
                <div className="w-8 h-8 border-4 border-[#f2ca50] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-slate-400 font-bold">DB에서 플랜을 불러오는 중...</p>
              </div>
            ) : plans.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 space-y-3 text-center">
                <div className="bg-zinc-800/50 p-4 rounded-full text-zinc-600">
                  <Building2 className="w-8 h-8" />
                </div>
                <p className="text-sm text-slate-400 font-bold">아직 저장된 플랜이 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {plans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => handleLoadPlan(plan)}
                    className="bg-zinc-950 border border-zinc-800 hover:border-[#f2ca50]/50 rounded-xl p-4 cursor-pointer transition-all hover:bg-zinc-900/50 group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-[#f2ca50]/10 text-[#f2ca50] p-1.5 rounded-lg border border-[#f2ca50]/20">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <h3 className="font-black text-white text-base">{plan.aptName}</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-500 font-medium">
                          {new Date(plan.createdAt).toLocaleDateString('ko-KR', {
                            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                        <button 
                          onClick={(e) => handleDeletePlan(plan.id, e)}
                          className="text-slate-600 hover:text-red-400 transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/50">
                        <div className="text-[9px] text-slate-500 font-bold mb-1">총 필요자금</div>
                        <div className="text-xs font-black text-[#f2ca50]">{formatKRW(plan.totalNeededCapital)}</div>
                      </div>
                      <div className="bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/50">
                        <div className="text-[9px] text-slate-500 font-bold mb-1">초기 대출금</div>
                        <div className="text-xs font-black text-sky-400">{formatKRW(plan.initialLoan)}</div>
                      </div>
                      <div className="bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/50">
                        <div className="text-[9px] text-slate-500 font-bold mb-1">전세 시세</div>
                        <div className="text-xs font-black text-slate-300">{formatKRW(plan.marketJeonse)}</div>
                      </div>
                      <div className="bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/50">
                        <div className="text-[9px] text-slate-500 font-bold mb-1">목표 월세</div>
                        <div className="text-xs font-black text-emerald-400">{formatKRW(plan.targetRent)}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <span className="text-[10px] font-bold text-[#f2ca50] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        이 플랜 불러오기 <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
