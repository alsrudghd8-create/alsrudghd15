export interface SceneData {
  id: number;
  sceneNumber: string;
  title: string;
  duration: string;
  timestampSeconds: number;
  timeRangeText: string;
  ytLink: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  historicalContext?: string;
  characterTags?: string[];
}

export interface ActivePlayingInfo {
  sceneId: number | null;
  title: string;
  timeRange: string;
  seconds: number;
}

export type UserAnswers = Record<number, number>;
