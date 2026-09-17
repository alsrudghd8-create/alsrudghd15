import React from 'react';
import { SceneData } from '../types';
import { Play, ExternalLink, CheckCircle2, XCircle, Lightbulb, Users } from 'lucide-react';

interface SceneCardProps {
  scene: SceneData;
  isActive: boolean;
  userAnswer?: number;
  accentColor?: string;
  onPlayTimestamp: (seconds: number, title: string, timeRange: string, sceneId: number) => void;
  onCheckAnswer: (sceneId: number, selectedOption: number) => void;
}

export const SceneCard: React.FC<SceneCardProps> = ({
  scene,
  isActive,
  userAnswer,
  accentColor = '#f59e0b',
  onPlayTimestamp,
  onCheckAnswer,
}) => {
  const isAnswered = userAnswer !== undefined;
  const isCorrect = isAnswered && userAnswer === scene.correctAnswer;
  const isEmerald = accentColor === '#10b981';

  return (
    <div
      id={`scene-${scene.id}`}
      className={`scene-card bg-[#1e293b] border rounded-2xl p-5 sm:p-6 transition-all duration-300 ${
        isActive
          ? isEmerald
            ? 'active border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400/50'
            : 'active border-[#f59e0b] shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-[#f59e0b]/50'
          : 'border-slate-700 hover:border-slate-600 shadow-md'
      }`}
    >
      {/* Scene Header */}
      <div className="scene-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`scene-number px-2.5 py-1 rounded-md text-xs font-bold tracking-wider border ${
              isEmerald
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30'
            }`}
          >
            {scene.sceneNumber}
          </span>
          {isAnswered && (
            <span
              className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold ${
                isCorrect
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  <span>정답</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3" />
                  <span>오답</span>
                </>
              )}
            </span>
          )}
        </div>
        <span className="scene-duration text-xs text-slate-400 font-medium bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700 w-fit">
          {scene.duration}
        </span>
      </div>

      {/* Scene Title */}
      <h2 className="scene-title text-lg sm:text-xl font-bold text-white mb-2 leading-snug">
        {scene.title}
      </h2>

      {/* Character tags */}
      {scene.characterTags && scene.characterTags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          <Users className="w-3 h-3 text-slate-500" />
          {scene.characterTags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Video Action Buttons */}
      <div className="video-btn-group flex flex-wrap gap-2.5 mb-5">
        <button
          type="button"
          onClick={() =>
            onPlayTimestamp(
              scene.timestampSeconds,
              `${scene.id}. ${scene.title}`,
              scene.timeRangeText,
              scene.id
            )
          }
          className={`play-btn inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer text-slate-950 ${
            isEmerald
              ? 'bg-emerald-400 hover:bg-emerald-500'
              : 'bg-[#f59e0b] hover:bg-[#d97706]'
          } ${isActive ? 'shadow-md ring-2 ring-white/30' : ''}`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>플레이어로 보기</span>
        </button>

        <a
          href={scene.ytLink}
          target="_blank"
          rel="noreferrer"
          className="yt-link-btn inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-slate-700 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>유튜브 앱에서 열기 ({scene.timeRangeText.split('~')[0].trim()})</span>
        </a>
      </div>

      {/* Quiz Section */}
      <div className="quiz-box bg-slate-950/60 rounded-xl p-4 sm:p-5 border border-slate-800/80">
        <div className="quiz-question font-semibold text-sm sm:text-base text-slate-100 mb-3 leading-relaxed flex items-start gap-2">
          <span
            className={`font-bold shrink-0 ${
              isEmerald ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            Q.
          </span>
          <span>{scene.question.replace(/^Q\d+\.\s*/, '')}</span>
        </div>

        <div className="options-list flex flex-col gap-2" id={`options-${scene.id}`}>
          {scene.options.map((option, optIdx) => {
            const isSelected = userAnswer === optIdx;
            const isCorrectOption = optIdx === scene.correctAnswer;

            let buttonStyle = isEmerald
              ? 'bg-slate-800/60 border-slate-700 text-slate-200 hover:bg-emerald-500/10 hover:border-emerald-500/60 hover:text-white'
              : 'bg-slate-800/60 border-slate-700 text-slate-200 hover:bg-[#f59e0b]/10 hover:border-[#f59e0b]/60 hover:text-white';

            if (isAnswered) {
              if (isCorrectOption) {
                buttonStyle =
                  'correct bg-emerald-950/70 border-emerald-500 text-emerald-300 font-semibold shadow-[0_0_10px_rgba(16,185,129,0.2)]';
              } else if (isSelected && !isCorrect) {
                buttonStyle =
                  'incorrect bg-rose-950/70 border-rose-500 text-rose-300 font-medium';
              } else {
                buttonStyle =
                  'bg-slate-900/40 border-slate-800/80 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={optIdx}
                type="button"
                disabled={isAnswered}
                onClick={() => onCheckAnswer(scene.id, optIdx)}
                className={`option-btn w-full p-3 text-left rounded-lg text-xs sm:text-sm border transition-all flex items-center justify-between gap-2 ${
                  isAnswered ? 'cursor-default' : 'cursor-pointer'
                } ${buttonStyle}`}
              >
                <span className="leading-snug">{option}</span>
                {isAnswered && isCorrectOption && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation revealed after answering */}
        {isAnswered && (
          <div
            id={`exp-${scene.id}`}
            className={`explanation visible mt-4 p-3.5 rounded-lg text-xs sm:text-sm bg-slate-900/90 border-l-4 ${
              isEmerald ? 'border-emerald-400' : 'border-[#f59e0b]'
            } border border-slate-800 text-slate-200 space-y-1.5`}
          >
            <div
              className={`flex items-center gap-1.5 font-bold text-xs ${
                isEmerald ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>정답 해설</span>
            </div>
            <div className="whitespace-pre-line leading-relaxed text-slate-300">
              {scene.explanation}
            </div>
            {scene.historicalContext && (
              <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                📚 <span className="font-medium text-slate-300">배경지식:</span>{' '}
                {scene.historicalContext}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
