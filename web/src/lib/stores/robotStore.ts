import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { HouseSettings } from './houseStore';

export interface PartFailureProbs {
  arm: number;
  hand: number;
  camera: number;
  wheels: number;
  tray: number;
  communication: number;
  controlUnit: number;
  power: number;
}

export interface AnalysisMetricData {
  score: number; // 0-1.0
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  diagnosis: string;
  action: string;
  uncertainCount?: number; // 不確実判定数
  ambiguityRate?: number; // 曖昧判定率
  harvestCount?: number; // 収穫数
  detectionCount?: number; // 検知数
  robotSpeed?: number; // ロボット走行速度
  processingTime?: number; // 1果実あたりの処理時間
  operatingTime?: number; // 稼働時間
  totalStopTime?: number; // 停止時間
  travelStopTime?: number; // 走行停止時間
  statusCode?: string; // ステータス
  stopRate?: number; // 走行停止率
  yaw?: number; // ヨー角
  pitch?: number; // ピッチ角
  roll?: number; // ロール角
  temperature?: number; // 温度
  humidity?: number; // 湿度
  illuminance?: number; // 照度
  co2?: number; // CO2濃度
  operationTime?: number; // 操作時間
  operationSteps?: number; // 操作ステップ数
  operationErrors?: number; // 操作エラー数
  operationErrorRate?: number; // 操作エラー率
  failureCount?: number; // 故障回数
  partFailureRate?: number; // 部位別予兆発生率
  partFailureProbs?: PartFailureProbs; // 部位別予兆発生率 (詳細)
  mttr?: number; // MTTR
  utilizationRate?: number; // 稼働率
  harvestEfficiency?: number; // 収穫効率
  riskDetectionCount?: number; // 安全性リスク検知回数
  safetyActivationCount?: number; // 安全装置作動回数
  safetyMalfunctionCount?: number; // 安全装置誤作動回数
  safetyMalfunctionRate?: number; // 誤作動率
  dataUtilizationRate?: number; // データ活用率
  mtbf?: number; // MTBF (h)
  operationRate?: number; // 稼働率 (%)
  statusLabel?: string; // ステータス
  // フィードバックデータ
  falseHarvestCount?: number; // 誤収穫数
  damageCount?: number; // 損傷数
  leftBehindCount?: number; // 取り残し数
  repairTime?: number; // 修理時間 (分)
  repairCount?: number; // 修理回数 (回)
  downtime?: number; // ダウンタイム (分)

  // フィードバックメトリクス
  falseHarvestRate?: number; // 誤収穫率 (%)
  damageRate?: number; // 損傷率 (%)
  leftBehindRate?: number; // 取り残し率 (%)
  marketableFruitRate?: number; // 可販果率 (%)
  recognitionAccuracy?: number; // 認識精度 (%)
}

export interface AnalysisMetrics {
  harvestAccuracy: AnalysisMetricData; // 収穫精度
  harvestSpeed: AnalysisMetricData; // 収穫速度
  adaptability: AnalysisMetricData; // 環境適応性
  operability: AnalysisMetricData; // 操作性
  maintainability: AnalysisMetricData; // メンテナンス性
  costEfficiency: AnalysisMetricData; // コスト効率
  safety: AnalysisMetricData; // 安全性
  dataUtilization: AnalysisMetricData; // データ活用
  durability: AnalysisMetricData; // 耐久性
  ethics: AnalysisMetricData; // 倫理性
}

export interface RobotSettings {
  speed: number;
  pitch: number;
  roll: number;
  yaw: number;
  statusCode: string;
  harvestOperatingDuration: number; // minutes - 収穫稼働時間
  totalOperatingDuration: number; // minutes - 稼働時間
  travelStopDuration: number; // minutes - 走行停止時間
  totalStopDuration: number; // minutes - 停止時間
  harvestCount: number;
  detectionCount: number;
  processingTimePerFruit: number;
  operationTime: number;
  operationSteps: number;
  operationErrors: number;
  failureCount: number;
  partFailureProbs: PartFailureProbs;
  riskDetectionCount: number;
  safetyActivationCount: number;
}

export interface AnalysisResultDetailed {
  metrics?: AnalysisMetrics;
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
  success?: boolean;
  error?: string;
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

// Helper to format date for datetime-local input (YYYY-MM-DDThh:mm)
const getLocalISOString = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60000;
  const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, 16);
  return localISOTime;
};

// Calculate defaults
const now = new Date();
const opStart = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago
const stopStart = new Date(now.getTime() - 30 * 60 * 1000); // 30 mins ago
const stopEnd = new Date(stopStart.getTime() + 3 * 60 * 1000); // 3 mins duration

// 初期値
const initialState: RobotSettings = {
  speed: 0,
  pitch: 0,
  roll: 0,
  yaw: 0,
  statusCode: 'S-01',
  harvestOperatingDuration: 60,
  totalOperatingDuration: 600,
  travelStopDuration: 0,
  totalStopDuration: 0,
  harvestCount: 0,
  detectionCount: 0,
  processingTimePerFruit: 10,
  operationTime: 0,
  operationSteps: 0,
  operationErrors: 0,
  failureCount: 0,
  partFailureProbs: {
    arm: 0,
    hand: 0,
    camera: 0,
    wheels: 0,
    tray: 0,
    communication: 0,
    controlUnit: 0,
    power: 0,
  },
  riskDetectionCount: 0,
  safetyActivationCount: 0,
};

// カスタムストアを作成してステータスコード変更時に自動的に設定値を更新
function createRobotSettingsStore() {
  const { subscribe, set, update } = writable<RobotSettings>(initialState);

  return {
    subscribe,
    set,
    update,
    // ステータスコードを変更
    setStatusCode: (statusCode: string) => {
      update((state) => ({ ...state, statusCode }));
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
