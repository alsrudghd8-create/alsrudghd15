/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { KINGDOMS } from './data/scenes';
import { ActivePlayingInfo, KingdomType, UserAnswers } from './types';
import { Header } from './components/Header';
import { VideoPlayer } from './components/VideoPlayer';
import { SceneCard } from './components/SceneCard';
import { CompletionModal } from './components/CompletionModal';
import { BookOpen, ListOrdered, Landmark, ShieldAlert } from 'lucide-react';

export default function App() {
  const [activeKingdom, setActiveKingdom] = useState<KingdomType>('goguryeo');
  const [answersByKingdom, setAnswersByKingdom] = useState<Record<KingdomType, UserAnswers>>({
    goguryeo: {},
    baekje: {},
  });
  const [activeSceneIdByKingdom, setActiveSceneIdByKingdom] = useState<
    Record<KingdomType, number | null>
  >({
    goguryeo: null,
    baekje: null,
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [currentVideoByKingdom, setCurrentVideoByKingdom] = useState<
    Record<KingdomType, ActivePlayingInfo>
  >({
    goguryeo: {
      sceneId: null,
      title: '장면 선택 대기 중',
      timeRange: '아래 목록에서 [▶ 플레이어로 보기]를 클릭하면 지정된 타임라인으로 이동합니다.',
      seconds: 0,
    },
    baekje: {
      sceneId: null,
      title: '장면 선택 대기 중',
      timeRange: '아래 목록에서 [▶ 플레이어로 보기]를 클릭하면 지정된 타임라인으로 이동합니다.',
      seconds: 0,
    },
  });

  const currentKingdom = KINGDOMS[activeKingdom];
  const currentScenes = currentKingdom.scenes;
  const currentAnswers = answersByKingdom[activeKingdom];
  const currentVideo = currentVideoByKingdom[activeKingdom];
  const activeSceneId = activeSceneIdByKingdom[activeKingdom];

  // Calculate score for each kingdom
  const calculateKingdomStats = (kingdom: KingdomType) => {
    const kingdomScenes = KINGDOMS[kingdom].scenes;
    const kingdomAnswers = answersByKingdom[kingdom];
    const score = Object.entries(kingdomAnswers).reduce((acc, [sceneIdStr, selectedOpt]) => {
      const scene = kingdomScenes.find((s) => s.id === Number(sceneIdStr));
      return scene && scene.correctAnswer === selectedOpt ? acc + 1 : acc;
    }, 0);
    return {
      score,
      answeredCount: Object.keys(kingdomAnswers).length,
      total: kingdomScenes.length,
    };
  };

  const goguryeoProgress = calculateKingdomStats('goguryeo');
  const baekjeProgress = calculateKingdomStats('baekje');
  const currentProgress = activeKingdom === 'goguryeo' ? goguryeoProgress : baekjeProgress;

  const handleSelectKingdom = (kingdom: KingdomType) => {
    setActiveKingdom(kingdom);
    setIsModalOpen(false);
  };

  const handlePlayTimestamp = (
    seconds: number,
    title: string,
    timeRange: string,
    sceneId: number
  ) => {
    setCurrentVideoByKingdom((prev) => ({
      ...prev,
      [activeKingdom]: {
        sceneId,
        title,
        timeRange: `⏱️ 재생 구간: ${timeRange}`,
        seconds,
      },
    }));
    setActiveSceneIdByKingdom((prev) => ({
      ...prev,
      [activeKingdom]: sceneId,
    }));

    // If on mobile/small screen, scroll to player smoothly
    if (window.innerWidth < 900) {
      const playerEl = document.getElementById('video-section');
      if (playerEl) {
        playerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleCheckAnswer = (sceneId: number, selectedOption: number) => {
    if (currentAnswers[sceneId] !== undefined) return;

    const newKingdomAnswers = { ...currentAnswers, [sceneId]: selectedOption };
    setAnswersByKingdom((prev) => ({
      ...prev,
      [activeKingdom]: newKingdomAnswers,
    }));

    // If no scene is currently playing, set this scene as active
    if (activeSceneId === null) {
      const scene = currentScenes.find((s) => s.id === sceneId);
      if (scene) {
        setActiveSceneIdByKingdom((prev) => ({
          ...prev,
          [activeKingdom]: sceneId,
        }));
        setCurrentVideoByKingdom((prev) => ({
          ...prev,
          [activeKingdom]: {
            sceneId: scene.id,
            title: `${scene.id}. ${scene.title}`,
            timeRange: `⏱️ 재생 구간: ${scene.timeRangeText}`,
            seconds: scene.timestampSeconds,
          },
        }));
      }
    }

    // If all scenes in this kingdom answered, show completion modal
    if (Object.keys(newKingdomAnswers).length === currentScenes.length) {
      setTimeout(() => {
        setIsModalOpen(true);
      }, 500);
    }
  };

  const handleResetCurrentKingdom = () => {
    setAnswersByKingdom((prev) => ({
      ...prev,
      [activeKingdom]: {},
    }));
    setIsModalOpen(false);
  };

  const handlePrevScene = () => {
    if (!currentVideo.sceneId || currentVideo.sceneId <= 1) return;
    const prevScene = currentScenes.find((s) => s.id === currentVideo.sceneId! - 1);
    if (prevScene) {
      handlePlayTimestamp(
        prevScene.timestampSeconds,
        `${prevScene.id}. ${prevScene.title}`,
        prevScene.timeRangeText,
        prevScene.id
      );
      const card = document.getElementById(`scene-${prevScene.id}`);
      card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleNextScene = () => {
    if (!currentVideo.sceneId || currentVideo.sceneId >= currentScenes.length) return;
    const nextScene = currentScenes.find((s) => s.id === currentVideo.sceneId! + 1);
    if (nextScene) {
      handlePlayTimestamp(
        nextScene.timestampSeconds,
        `${nextScene.id}. ${nextScene.title}`,
        nextScene.timeRangeText,
        nextScene.id
      );
      const card = document.getElementById(`scene-${nextScene.id}`);
      card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const isGoguryeo = activeKingdom === 'goguryeo';

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] flex flex-col selection:bg-[#f59e0b]/30 selection:text-[#f59e0b]">
      <Analytics />
      {/* Top Header with Kingdom Switcher */}
      <Header
        currentKingdom={currentKingdom}
        activeKingdom={activeKingdom}
        onSelectKingdom={handleSelectKingdom}
        goguryeoProgress={goguryeoProgress}
        baekjeProgress={baekjeProgress}
        onReset={handleResetCurrentKingdom}
      />

      {/* Main Container */}
      <main className="container max-w-[1180px] mx-auto my-6 sm:my-8 px-4 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-6 lg:gap-8 items-start">
          {/* Left Column: Video Section */}
          <VideoPlayer
            videoId={currentKingdom.videoId}
            currentVideo={currentVideo}
            onPrevScene={handlePrevScene}
            onNextScene={handleNextScene}
            hasPrevScene={Boolean(currentVideo.sceneId && currentVideo.sceneId > 1)}
            hasNextScene={Boolean(
              currentVideo.sceneId && currentVideo.sceneId < currentScenes.length
            )}
            accentColor={currentKingdom.accentColor}
          />

          {/* Right Column: Scenes List */}
          <div className="scenes-list flex flex-col gap-6" id="scenesList">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-slate-300 font-bold text-sm">
                <ListOrdered
                  className={`w-4 h-4 ${
                    isGoguryeo ? 'text-[#f59e0b]' : 'text-emerald-400'
                  }`}
                />
                <span>
                  [{currentKingdom.name}] 핵심 요약 장면 목록 ({currentScenes.length}개 구간)
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                ���료 {currentProgress.answeredCount}/{currentScenes.length}
              </span>
            </div>

            {currentScenes.map((scene) => (
              <SceneCard
                key={`${activeKingdom}-${scene.id}`}
                scene={scene}
                isActive={activeSceneId === scene.id}
                userAnswer={currentAnswers[scene.id]}
                accentColor={currentKingdom.accentColor}
                onPlayTimestamp={handlePlayTimestamp}
                onCheckAnswer={handleCheckAnswer}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen
              className={`w-4 h-4 ${
                isGoguryeo ? 'text-[#f59e0b]' : 'text-emerald-400'
              }`}
            />
            <span className="font-semibold text-slate-400">
              한국사 건국 신화 영상 &amp; 퀴즈 학습관 (고구려 · 백제)
            </span>
          </div>
          <p>삼국사기 본기 기반 역사 건국 설화 인터랙티브 교육 플랫폼</p>
        </div>
      </footer>

      {/* Completion Modal */}
      <CompletionModal
        isOpen={isModalOpen}
        score={currentProgress.score}
        total={currentProgress.total}
        kingdomName={currentKingdom.name}
        accentColor={currentKingdom.accentColor}
        onClose={() => setIsModalOpen(false)}
        onReset={handleResetCurrentKingdom}
      />
    </div>
  );
}
