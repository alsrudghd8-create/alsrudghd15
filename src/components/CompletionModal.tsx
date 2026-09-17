import React from 'react';
import { Award, Trophy, RotateCcw, Check, Sparkles } from 'lucide-react';

interface CompletionModalProps {
  isOpen: boolean;
  score: number;
  total: number;
  kingdomName: string;
  accentColor?: string;
  onClose: () => void;
  onReset: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  score,
  total,
  kingdomName,
  accentColor = '#f59e0b',
  onClose,
  onReset,
}) => {
  if (!isOpen) return null;

  const isPerfect = score === total;
  const percentage = Math.round((score / total) * 100);
  const isEmerald = accentColor === '#10b981';

  return (
    <div
      id="modal"
      className="completion-modal fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
    >
      <div
        className={`modal-content bg-[#1e293b] border-2 ${
          isEmerald ? 'border-emerald-400' : 'border-[#f59e0b]'
        } p-6 sm:p-8 rounded-2xl text-center max-w-md w-full shadow-2xl relative overflow-hidden`}
      >
        {/* Glow decoration */}
        <div
          className={`absolute -top-12 -left-12 w-32 h-32 rounded-full blur-2xl pointer-events-none ${
            isEmerald ? 'bg-emerald-400/20' : 'bg-[#f59e0b]/20'
          }`}
        />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div
            className={`w-16 h-16 mx-auto mb-4 rounded-2xl border flex items-center justify-center shadow-inner ${
              isEmerald
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : 'bg-[#f59e0b]/15 border-[#f59e0b]/40 text-[#f59e0b]'
            }`}
          >
            {isPerfect ? (
              <Trophy className="w-8 h-8 animate-bounce" />
            ) : (
              <Award className="w-8 h-8" />
            )}
          </div>

          <h2
            className={`text-2xl font-extrabold mb-2 flex items-center justify-center gap-2 ${
              isEmerald ? 'text-emerald-400' : 'text-[#f59e0b]'
            }`}
          >
            <span>🎉</span>
            <span>[{kingdomName}] 학습 완료!</span>
          </h2>

          <div
            id="modalResultText"
            className="text-slate-200 text-sm sm:text-base my-4 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-700/60"
          >
            <p className="text-lg font-bold mb-1 text-white">
              총 {total}문제 중{' '}
              <span className={isEmerald ? 'text-emerald-400' : 'text-[#f59e0b]'}>
                {score}개
              </span>{' '}
              정답! ({percentage}점)
            </p>
            <p className="text-xs sm:text-sm text-slate-300">
              {isPerfect ? (
                <span className="text-emerald-400 font-semibold flex items-center justify-center gap-1 mt-1">
                  <Sparkles className="w-4 h-4 inline" /> 완벽합니다!{' '}
                  {kingdomName === '백제'
                    ? '온조왕과 소서노의 백제 건국 설화의 모든 맥락을 완벽히 마스터하셨습니다.'
                    : '주몽 신화의 모든 전승을 꿰뚫으셨습니다.'}
                </span>
              ) : score >= 4 ? (
                <span>
                  훌륭한 성적입니다! {kingdomName} 건국 설화의 핵심 맥락을 잘 이해하셨습니다.
                </span>
              ) : (
                <span>영상을 다시 시청하며 복습하면 더욱 확실하게 기억할 수 있습니다.</span>
              )}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-md text-slate-950 ${
                isEmerald
                  ? 'bg-emerald-400 hover:bg-emerald-500'
                  : 'bg-[#f59e0b] hover:bg-[#d97706]'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>확인 및 해설 보기</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onReset();
                onClose();
              }}
              className="inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>처음부터 다시 풀기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
