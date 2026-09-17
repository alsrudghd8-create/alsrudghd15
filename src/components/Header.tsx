import React from 'react';
import { Award, CheckCircle, RotateCcw, Sparkles } from 'lucide-react';

interface HeaderProps {
  score: number;
  total: number;
  answeredCount: number;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  total,
  answeredCount,
  onReset,
}) => {
  const progressPercent = Math.round((answeredCount / total) * 100);

  return (
    <header
      id="main-header"
      className="bg-gradient-to-br from-[#1e1b4b] via-[#24135e] to-[#0f172a] border-b-2 border-[#f59e0b] px-4 py-8 text-center shadow-[0_10px_25px_-5px_rgba(0,0,0,0.6)] relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.15),transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f59e0b]/15 border border-[#f59e0b]/40 text-[#f59e0b] text-xs font-semibold mb-3 tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>삼국사기 고구려 본기 · 동명성왕 건국 설화</span>
        </div>

        <h1
          id="app-heading"
          className="text-[#f59e0b] text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 flex items-center justify-center gap-2 flex-wrap"
        >
          <span>⚔️</span>
          <span>주몽 신화 40분 핵심요약 &amp; 퀴즈 학습관</span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          각 요약 구간의 영상 버튼을 눌러 시청하고, 퀴즈를 풀어보세요!
        </p>

        {/* Status Badges & Controls */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <div
            id="scoreBadge"
            className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-[#f59e0b]/70 px-4 py-1.5 rounded-full text-sm font-bold text-[#f59e0b] shadow-sm"
          >
            <Award className="w-4 h-4" />
            <span>
              점수: {score} / {total}
            </span>
          </div>

          <div
            id="progressBadge"
            className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-emerald-500/60 px-4 py-1.5 rounded-full text-sm font-bold text-emerald-400 shadow-sm"
          >
            <CheckCircle className="w-4 h-4" />
            <span>
              진행도: {progressPercent}% ({answeredCount}/{total})
            </span>
          </div>

          {answeredCount > 0 && (
            <button
              id="reset-btn"
              onClick={onReset}
              className="inline-flex items-center gap-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer"
              title="퀴즈 다시 풀기"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>다시 풀기</span>
            </button>
          )}
        </div>

        {/* Visual Progress Bar */}
        <div className="mt-4 max-w-md mx-auto bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-700/60">
          <div
            className="h-full bg-gradient-to-r from-[#f59e0b] to-emerald-400 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </header>
  );
};
