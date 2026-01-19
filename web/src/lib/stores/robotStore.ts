import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { HouseSettings } from './houseStore';

export interface RobotSettings {
  speed: number;
  pitch: number;
  roll: number;
  tireRotation: number; // rpm
  obstacleDetected: boolean;
  cameraClarity: number; // 0-100
  trayFull: boolean;
  batteryLevel: number; // 0-100
  statusCode: string;
}

export interface AnalysisResultDetailed {
  system: {
    health: 'health' | 'warning' | 'critical' | 'unknown';
  };
  robot: {
    health: 'health' | 'warning' | 'critical' | 'unknown';
    diagnosis: string;
    action: string;
  };
  house: {
    health: 'health' | 'warning' | 'critical' | 'unknown';
    diagnosis: string;
    problematicData: string[];
    action: string;
  };
  timestamp: string;
}

export interface AnalysisResult {
  waiting: boolean;
  data: {
    robot?: { settings: RobotSettings; timestamp: string };
    house?: { settings: HouseSettings; timestamp: string };
  } | null;
  result: AnalysisResultDetailed | null;
}

export interface LogEntry {
  timestamp: string;
  data: {
    robot?: { settings: RobotSettings; timestamp: string };
    house?: { settings: HouseSettings; timestamp: string };
  } | null;
  analysis: AnalysisResultDetailed | null;
}

// ステータスコード定義
export const STATUS_CODES = {
  NORMAL: [
    { code: 'S-01', label: '待機中' },
    { code: 'S-02', label: '移動中' },
    { code: 'S-03', label: '収穫中' },
    { code: 'S-04', label: '帰還中' },
  ],
  RUNNING: [
    { code: 'R-01', label: '足元スタック' },
    { code: 'R-02', label: '進路障害' },
    { code: 'R-03', label: '脱輪・転倒' },
  ],
  HARVEST: [
    { code: 'H-01', label: '視界不良 (カメラ汚れ/逆光)' },
    { code: 'H-02', label: '収穫物満タン (トレイ満杯)' },
  ],
  BATTERY: [{ code: 'E-01', label: 'バッテリー残量低下' }],
};

// ステータスコード別の設定値マッピング
export const STATUS_SETTINGS: Record<string, Partial<RobotSettings>> = {
  'S-01': {
    speed: 0,
    tireRotation: 0,
    obstacleDetected: false,
    pitch: 0,
    roll: 0,
    cameraClarity: 100,
    batteryLevel: 100,
    trayFull: false,
  },
  'S-02': {
    speed: 0.5,
    tireRotation: 120,
    obstacleDetected: false,
    pitch: 0,
    roll: 0,
    cameraClarity: 100,
    batteryLevel: 100,
    trayFull: false,
  },
  'S-03': {
    speed: 0,
    tireRotation: 0,
    obstacleDetected: false,
    pitch: 0,
    roll: 0,
    cameraClarity: 100,
    batteryLevel: 100,
    trayFull: false,
  },
  'S-04': {
    speed: 0.5,
    tireRotation: 120,
    obstacleDetected: false,
    pitch: 0,
    roll: 0,
    cameraClarity: 100,
    batteryLevel: 20,
    trayFull: true,
  },
  'R-01': {
    speed: 0,
    tireRotation: 0,
    obstacleDetected: false,
    pitch: 0,
    roll: 0,
    cameraClarity: 100,
    batteryLevel: 80,
    trayFull: false,
  },
  'R-02': {
    speed: 0,
    tireRotation: 0,
    obstacleDetected: true,
    pitch: 0,
    roll: 0,
    cameraClarity: 100,
    batteryLevel: 80,
    trayFull: false,
  },
  'R-03': {
    speed: 0,
    tireRotation: 0,
    obstacleDetected: false,
    pitch: 0,
    roll: 90,
    cameraClarity: 100,
    batteryLevel: 80,
    trayFull: false,
  },
  'H-01': {
    speed: 0,
    tireRotation: 0,
    obstacleDetected: false,
    pitch: 0,
    roll: 0,
    cameraClarity: 20,
    batteryLevel: 100,
    trayFull: false,
  },
  'H-02': {
    speed: 0,
    tireRotation: 0,
    obstacleDetected: false,
    pitch: 0,
    roll: 0,
    cameraClarity: 100,
    batteryLevel: 60,
    trayFull: true,
  },
  'E-01': {
    speed: 0,
    tireRotation: 0,
    obstacleDetected: false,
    pitch: 0,
    roll: 0,
    cameraClarity: 100,
    batteryLevel: 10,
    trayFull: false,
  },
};

// 初期値
const initialState: RobotSettings = {
  speed: 0,
  pitch: 0,
  roll: 0,
  tireRotation: 0,
  obstacleDetected: false,
  cameraClarity: 100,
  trayFull: false,
  batteryLevel: 100,
  statusCode: 'S-01',
};

// カスタムストアを作成してステータスコード変更時に自動的に設定値を更新
function createRobotSettingsStore() {
  const { subscribe, set, update } = writable<RobotSettings>(initialState);

  return {
    subscribe,
    set,
    update,
    // ステータスコードを変更し、対応する設定値を自動的に適用
    setStatusCode: (statusCode: string) => {
      update((state) => {
        const newSettings = STATUS_SETTINGS[statusCode];
        if (newSettings) {
          return {
            ...state,
            ...newSettings,
            statusCode,
          };
        }
        return { ...state, statusCode };
      });
    },
    // 個別の設定値を更新（手動変更用）
    updateSetting: <K extends keyof RobotSettings>(key: K, value: RobotSettings[K]) => {
      update((state) => ({
        ...state,
        [key]: value,
      }));
    },
    // リセット
    reset: () => set(initialState),
  };
}

// ロボット設定ストア
export const robotSettings = createRobotSettingsStore();

// ログ履歴ストア
export const robotLogs: Writable<LogEntry[]> = writable([]);
export const analysisLogs: Writable<unknown[]> = writable([]);

// 分析結果ストア
export const analysisResult: Writable<AnalysisResult> = writable({
  waiting: true,
  data: null,
  result: null,
});

export const isAnalysisPanelOpen: Writable<boolean> = writable(false);
