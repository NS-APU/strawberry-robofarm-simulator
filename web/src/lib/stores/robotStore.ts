import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export interface RobotSettings {
  speed: number;
  pitch: number;
  roll: number;
  startTime: string; // ISO string
  stopTime: string; // ISO string
  route: string; // JSON string
  anomalyCode: string;
  anomalyDetails: string;
}

export interface AnalysisResult {
  waiting: boolean;
  data: RobotSettings | null;
  status: 'normal' | 'warning' | 'error' | null;
  insights: string[];
  recommendations: string[];
}

export interface LogEntry {
  timestamp: string;
  data: RobotSettings | null;
  analysis: {
    status: string | null;
    insights: string[];
  };
}

// 初期値
const initialState: RobotSettings = {
  speed: 3.5,
  pitch: 2.3,
  roll: 1.8,
  startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString().slice(0, 16), // 2時間前
  stopTime: new Date().toISOString().slice(0, 16),
  route: JSON.stringify(
    [
      {
        latitude: 35.6812,
        longitude: 139.7671,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        latitude: 35.6815,
        longitude: 139.7673,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 20 * 60000).toISOString(),
      },
    ],
    null,
    2,
  ),
  anomalyCode: '',
  anomalyDetails: '',
};

// ロボット設定ストア
export const robotSettings: Writable<RobotSettings> = writable(initialState);

// ログ履歴ストア
export const robotLogs: Writable<LogEntry[]> = writable([]);
export const analysisLogs: Writable<unknown[]> = writable([]);

// 分析結果ストア
export const analysisResult: Writable<AnalysisResult> = writable({
  waiting: true,
  data: null,
  status: null,
  insights: [],
  recommendations: [],
});
