import React, { useEffect } from 'react';
import { X, Copy } from 'lucide-react';
import { notebookDB } from '../data/notebookData';

interface KnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemKey: string;
  onShowToast: (msg: string) => void;
}

export default function KnowledgeModal({ isOpen, onClose, itemKey, onShowToast }: KnowledgeModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    // Direct click handler for the special contract copy area inside dynamically rendered HTML
    const handleDynamicCopy = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.id === 'copy-target-special' || target.closest('#copy-target-special'))) {
        const copyArea = document.getElementById('copy-target-special');
        if (copyArea) {
          const text = copyArea.innerText.trim();
          navigator.clipboard.writeText(text).then(() => {
            onShowToast("📋 특약 조항이 클립보드에 성공적으로 복사되었습니다!");
          });
        }
      }
    };

    document.addEventListener('click', handleDynamicCopy);
    return () => {
      document.removeEventListener('click', handleDynamicCopy);
    };
  }, [isOpen, onShowToast]);

  if (!isOpen || !itemKey) return null;

  const data = notebookDB[itemKey];
  if (!data) return null;

  const handleCopyAll = () => {
    // Strip HTML tags roughly for copying plaintext
    const tempElement = document.createElement('div');
    tempElement.innerHTML = data.content;
    const plainText = tempElement.innerText || tempElement.textContent || "";
    
    navigator.clipboard.writeText(`${data.title}\n${data.subtitle}\n\n${plainText}`).then(() => {
      onShowToast("📋 문서 전체 내용이 클립보드에 복사되었습니다!");
    });
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-all duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#1e1e1e]/90 border border-[#f2ca50]/25 backdrop-blur-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-start border-b border-white/10 pb-4">
          <div className="space-y-1">
            <span className="text-xs text-[#f2ca50] font-bold uppercase tracking-wider">{data.subtitle}</span>
            <h3 className="text-xl md:text-2xl font-bold text-white">{data.title}</h3>
          </div>
          <button 
            className="text-slate-400 hover:text-white p-1 hover:bg-white/10 rounded-full transition-all"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div 
          className="text-slate-300 leading-relaxed space-y-4 font-normal"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
        
        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
          <button 
            className="bg-[#f2ca50]/15 hover:bg-[#f2ca50]/25 border border-[#f2ca50]/30 text-[#f2ca50] text-[#f2ca50] hover:text-[#f2ca50] text-xs px-4 py-2.5 rounded-full font-bold transition-all flex items-center gap-1 cursor-pointer"
            onClick={handleCopyAll}
          >
            <Copy className="w-4.5 h-4.5" />
            전체 내용 복사
          </button>
          <button 
            className="bg-zinc-800 hover:bg-zinc-700 text-xs px-5 py-2.5 rounded-full font-bold transition-all text-white cursor-pointer"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
