import React from 'react';
import { Award, CheckCircle, RotateCcw, Sparkles } from 'lucide-react';
import { KingdomInfo, KingdomType } from '../types';

interface HeaderProps {
  currentKingdom: KingdomInfo;
  activeKingdom: KingdomType;
  onSelectKingdom: (kingdom: KingdomType) => void;
  goguryeoProgress: { score: number; answeredCount: number; total: number };
  baekjeProgress: { score: number; answeredCount: number; total: number };
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentKingdom,
  activeKingdom,
  onSelectKingdom,
  goguryeoProgress,
  baekjeProgress,
  onReset,
}) => {
  const currentProgress =
    activeKingdom === 'goguryeo' ? goguryeoProgress : baekjeProgress;
  const progressPercent = Math.round(
    (currentProgress.answeredCount / currentProgress.total) * 100
  );

  const isGoguryeo = activeKingdom === 'goguryeo';

  return (
    <header
      id="main-header"
      className={`border-b-2 px-4 py-7 text-center shadow-[0_10px_25px_-5px_rgba(0,0,0,0.6)] relative overflow-hidden transition-colors duration-500 ${
        isGoguryeo
          ? 'bg-gradient-to-br from-[#1e1b4b] via-[#24135e] to-[#0f172a] border-[#f59e0b]'
          : 'bg-gradient-to-br from-[#064e3b] via-[#0f2e26] to-[#0f172a] border-emerald-400'
      }`}
    >
      {/* Background glow */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-500 ${
          isGoguryeo
            ? 'bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.18),transparent_70%)]'
            : 'bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.18),transparent_70%)]'
        }`}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Kingdom Switch Tabs */}
        <div className="inline-flex p-1 rounded-xl bg-slate-900/80 border border-slate-700/80 mb-5 shadow-inner">
          <button
            type="button"
            onClick={() => onSelectKingdom('goguryeo')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              isGoguryeo
                ? 'bg-[#f59e0b] text-slate-950 shadow-md ring-1 ring-white/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>⚔️ 고구려 (주몽 신화)</span>
            <span
              className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                isGoguryeo
                  ? 'bg-black/20 text-slate-900 font-extrabold'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {goguryeoProgress.answeredCount}/{goguryeoProgress.total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectKingdom('baekje')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              !isGoguryeo
                ? 'bg-emerald-400 text-slate-950 shadow-md ring-1 ring-white/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>🏛️ 백제 (온조왕 건국)</span>
            <span
              className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                !isGoguryeo
                  ? 'bg-black/20 text-slate-900 font-extrabold'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {baekjeProgress.answeredCount}/{baekjeProgress.total}
            </span>
          </button>
        </div>

        {/* Kingdom Historical Badge */}
        <div>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 tracking-wide border transition-colors ${
              isGoguryeo
                ? 'bg-[#f59e0b]/15 border-[#f59e0b]/40 text-[#f59e0b]'
                : 'bg-emerald-400/15 border-emerald-400/40 text-emerald-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentKingdom.badge}</span>
          </div>
        </div>

        {/* Heading */}
        <h1
          id="app-heading"
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 flex items-center justify-center gap-2 flex-wrap transition-colors ${
            isGoguryeo ? 'text-[#f59e0b]' : 'text-emerald-400'
          }`}
        >
          <span>{isGoguryeo ? '⚔️' : '🏛️'}</span>
          <span>{currentKingdom.subtitle}</span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          각 요약 구간의 영상 버튼을 눌러 시청하고, 퀴즈를 풀어보세요!
        </p>

        {/* Status Badges & Controls */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <div
            id="scoreBadge"
            className={`stat-badge inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border px-4 py-1.5 rounded-full text-sm font-bold shadow-sm transition-colors ${
              isGoguryeo
                ? 'border-[#f59e0b]/70 text-[#f59e0b]'
                : 'border-emerald-400/70 text-emerald-300'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>
              점수: {currentProgress.score} / {currentProgress.total}
            </span>
          </div>

          <div
            id="progressBadge"
            className="stat-badge inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-emerald-500/60 px-4 py-1.5 rounded-full text-sm font-bold text-emerald-400 shadow-sm"
          >
            <CheckCircle className="w-4 h-4" />
            <span>
              진행도: {progressPercent}% ({currentProgress.answeredCount}/
              {currentProgress.total})
            </span>
          </div>

          {currentProgress.answeredCount > 0 && (
            <button
              id="reset-btn"
              onClick={onReset}
              className="inline-flex items-center gap-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer"
              title="현재 왕국 퀴즈 다시 풀기"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>다시 풀기</span>
            </button>
          )}
        </div>

        {/* Visual Progress Bar */}
        <div className="mt-4 max-w-md mx-auto bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-700/60">
          <div
            className={`h-full transition-all duration-500 ease-out ${
              isGoguryeo
                ? 'bg-gradient-to-r from-[#f59e0b] to-amber-300'
                : 'bg-gradient-to-r from-emerald-500 to-teal-300'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </header>
  );
};
