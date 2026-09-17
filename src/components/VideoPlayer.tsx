import React from 'react';
import { ActivePlayingInfo } from '../types';
import { ExternalLink, ChevronLeft, ChevronRight, Clock, Info } from 'lucide-react';

interface VideoPlayerProps {
  videoId: string;
  currentVideo: ActivePlayingInfo;
  onPrevScene?: () => void;
  onNextScene?: () => void;
  hasPrevScene: boolean;
  hasNextScene: boolean;
  accentColor?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  currentVideo,
  onPrevScene,
  onNextScene,
  hasPrevScene,
  hasNextScene,
  accentColor = '#f59e0b',
}) => {
  const embedUrl =
    currentVideo.seconds > 0
      ? `https://www.youtube.com/embed/${videoId}?start=${currentVideo.seconds}&autoplay=1&enablejsapi=1`
      : `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;

  const externalUrl =
    currentVideo.seconds > 0
      ? `https://youtu.be/${videoId}?t=${currentVideo.seconds}`
      : `https://youtu.be/${videoId}`;

  const isEmerald = accentColor === '#10b981';

  return (
    <div id="video-section" className="video-section sticky top-5 z-20">
      {/* 16:9 Responsive Video Wrapper */}
      <div className="relative pt-[56.25%] rounded-xl overflow-hidden shadow-[0_20px_25px_-5px_rgba(0,0,0,0.6)] border border-slate-700 bg-black">
        <iframe
          id="ytPlayer"
          key={`${videoId}-${currentVideo.seconds}`}
          src={embedUrl}
          title="신화 및 역사 요약 영상 플레이어"
          className="absolute top-0 left-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      {/* Now Playing Info Box */}
      <div
        id="now-playing-box"
        className="bg-[#1e293b] border border-slate-700 rounded-xl p-4 mt-3 shadow-lg transition-all"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold mb-1">
              <span
                className={`inline-block w-2 h-2 rounded-full animate-pulse ${
                  isEmerald ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span className={isEmerald ? 'text-emerald-400' : 'text-amber-400'}>
                현재 타임라인
              </span>
            </div>

            <h3
              id="nowPlayingTitle"
              className={`font-bold text-base sm:text-lg leading-snug truncate transition-colors ${
                isEmerald ? 'text-emerald-300' : 'text-[#f59e0b]'
              }`}
              title={currentVideo.title}
            >
              {currentVideo.title}
            </h3>

            <div
              id="nowPlayingTime"
              className="text-slate-400 text-xs sm:text-sm mt-1 flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{currentVideo.timeRange}</span>
            </div>
          </div>

          <a
            href={externalUrl}
            target="_blank"
            rel="noreferrer"
            className={`shrink-0 p-2 text-slate-400 rounded-lg border border-slate-700 transition-colors ${
              isEmerald
                ? 'hover:text-emerald-400 hover:bg-emerald-950/40'
                : 'hover:text-amber-400 hover:bg-slate-700/60'
            }`}
            title="유튜브 앱/새 탭에서 열기"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Scene Navigation Bar */}
        {currentVideo.sceneId !== null && (
          <div className="mt-3 pt-3 border-t border-slate-700/70 flex items-center justify-between gap-2">
            <button
              onClick={onPrevScene}
              disabled={!hasPrevScene}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>이전 장면</span>
            </button>

            <span className="text-xs text-slate-400 font-medium">
              SCENE {currentVideo.sceneId} / 06
            </span>

            <button
              onClick={onNextScene}
              disabled={!hasNextScene}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <span>다음 장면</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Helpful Hint */}
      <div className="mt-2 text-center text-xs text-slate-500 hidden sm:flex items-center justify-center gap-1">
        <Info className="w-3.5 h-3.5 text-slate-400" />
        <span>[▶ 플레이어로 보기]를 누르면 해당 타임라인으로 바로 건너뜁니다.</span>
      </div>
    </div>
  );
};
