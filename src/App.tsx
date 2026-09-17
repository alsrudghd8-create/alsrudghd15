/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { SCENES } from './data/scenes';
import { ActivePlayingInfo, UserAnswers } from './types';
import { Header } from './components/Header';
import { VideoPlayer } from './components/VideoPlayer';
import { SceneCard } from './components/SceneCard';
import { CompletionModal } from './components/CompletionModal';
import { BookOpen, ListOrdered } from 'lucide-react';

export default function App() {
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [activeSceneId, setActiveSceneId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [currentVideo, setCurrentVideo] = useState<ActivePlayingInfo>({
    sceneId: null,
    title: '장면 선택 대기 중',
    timeRange: '아래 목록에서 [▶ 플레이어로 보기]를 클릭하면 지정된 타임라인으로 이동합니다.',
    seconds: 0,
  });

  // Calculate score based on user answers
  const score = Object.entries(userAnswers).reduce((acc, [sceneIdStr, selectedOpt]) => {
    const scene = SCENES.find((s) => s.id === Number(sceneIdStr));
    return scene && scene.correctAnswer === selectedOpt ? acc + 1 : acc;
  }, 0);

  const answeredCount = Object.keys(userAnswers).length;
  const totalScenes = SCENES.length;

  const handlePlayTimestamp = (
    seconds: number,
    title: string,
    timeRange: string,
    sceneId: number
  ) => {
    setCurrentVideo({
      sceneId,
      title,
      timeRange: `⏱️ 재생 구간: ${timeRange}`,
      seconds,
    });
    setActiveSceneId(sceneId);

    // If on mobile/small screen, optionally scroll to player smoothly
    if (window.innerWidth < 900) {
      const playerEl = document.getElementById('video-section');
      if (playerEl) {
        playerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleCheckAnswer = (sceneId: number, selectedOption: number) => {
    if (userAnswers[sceneId] !== undefined) return;

    const newAnswers = { ...userAnswers, [sceneId]: selectedOption };
    setUserAnswers(newAnswers);

    // Also automatically set this scene as active if none is playing
    if (activeSceneId === null) {
      const scene = SCENES.find((s) => s.id === sceneId);
      if (scene) {
        setActiveSceneId(sceneId);
        setCurrentVideo({
          sceneId: scene.id,
          title: `${scene.id}. ${scene.title}`,
          timeRange: `⏱️ 재생 구간: ${scene.timeRangeText}`,
          seconds: scene.timestampSeconds,
        });
      }
    }

    // If all scenes answered, display completion modal after a short delay
    if (Object.keys(newAnswers).length === totalScenes) {
      setTimeout(() => {
        setIsModalOpen(true);
      }, 500);
    }
  };

  const handleReset = () => {
    setUserAnswers({});
    setIsModalOpen(false);
  };

  const handlePrevScene = () => {
    if (!currentVideo.sceneId || currentVideo.sceneId <= 1) return;
    const prevScene = SCENES.find((s) => s.id === currentVideo.sceneId! - 1);
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
    if (!currentVideo.sceneId || currentVideo.sceneId >= totalScenes) return;
    const nextScene = SCENES.find((s) => s.id === currentVideo.sceneId! + 1);
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

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] flex flex-col selection:bg-[#f59e0b]/30 selection:text-[#f59e0b]">
      {/* Top Header */}
      <Header
        score={score}
        total={totalScenes}
        answeredCount={answeredCount}
        onReset={handleReset}
      />

      {/* Main Container */}
      <main className="container max-w-[1180px] mx-auto my-6 sm:my-8 px-4 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-6 lg:gap-8 items-start">
          {/* Left Column: Video Section */}
          <VideoPlayer
            currentVideo={currentVideo}
            onPrevScene={handlePrevScene}
            onNextScene={handleNextScene}
            hasPrevScene={Boolean(currentVideo.sceneId && currentVideo.sceneId > 1)}
            hasNextScene={Boolean(currentVideo.sceneId && currentVideo.sceneId < totalScenes)}
          />

          {/* Right Column: Scenes List */}
          <div className="scenes-list flex flex-col gap-6" id="scenesList">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-slate-300 font-bold text-sm">
                <ListOrdered className="w-4 h-4 text-[#f59e0b]" />
                <span>핵심 요약 장면 목록 ({SCENES.length}개 구간)</span>
              </div>
              <span className="text-xs text-slate-400">
                완료 {answeredCount}/{totalScenes}
              </span>
            </div>

            {SCENES.map((scene) => (
              <SceneCard
                key={scene.id}
                scene={scene}
                isActive={activeSceneId === scene.id}
                userAnswer={userAnswers[scene.id]}
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
            <BookOpen className="w-4 h-4 text-[#f59e0b]" />
            <span className="font-semibold text-slate-400">주몽 신화 40분 핵심요약 &amp; 퀴즈 학습관</span>
          </div>
          <p>고구려 건국 시조 동명성왕 설화 학습용 인터랙티브 플랫폼</p>
        </div>
      </footer>

      {/* Completion Modal */}
      <CompletionModal
        isOpen={isModalOpen}
        score={score}
        total={totalScenes}
        onClose={() => setIsModalOpen(false)}
        onReset={handleReset}
      />
    </div>
  );
}
