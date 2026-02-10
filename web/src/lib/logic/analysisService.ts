import { get } from 'svelte/store';
import { analysisResult, STATUS_CODES } from '../stores/robotStore';
import type { RobotSettings, AnalysisMetrics, AnalysisMetricData, PartFailureProbs } from '../stores/robotStore';
import type { HouseSettings } from '../stores/houseStore';

// 環境変数から設定を読み込み
const SEND_ENABLE = import.meta.env.VITE_AGRI_SEND_ENABLE === 'true';
const ORION_BASE_URL = import.meta.env.VITE_ORION_BASE_URL || 'http://localhost';
const ORION_API_PATH = import.meta.env.VITE_ORION_API_PATH || '/api/orion';
const ORION_ENTITY_ID = import.meta.env.VITE_ORION_ENTITY_ID || 'urn:ngsi-ld:AgrifarmRobotHouseSnapshot:site-01';

const getOrionEndpoint = () => {
  return ORION_API_PATH;
};

const ORION_ENDPOINT = getOrionEndpoint();

export const STATUS_TEXT = {
  healthy: '正常',
  warning: '注意',
  critical: '異常',
  unknown: '不明',
} as const;

export type StatusType = keyof typeof STATUS_TEXT;

export function getStatusText(status: string | undefined): string {
  if (!status || !STATUS_TEXT[status as StatusType]) return '不明';
  return STATUS_TEXT[status as StatusType];
}

export type HealthStatus = 'healthy' | 'warning' | 'critical' | 'unknown';

export interface AnalysisResultDetailed {
  metrics?: AnalysisMetrics;
  timestamp: string;
}

// NGSI-LD Entity type
interface NGSILDEntity {
  id: string;
  type: string;
  systemTimestamp: {
    type: string;
    value: string;
  };
  robot?: any;
  house?: any;
  analysis: any;
  '@context': string[];
}

// Thresholds
const THRESHOLDS = {
  temperature: { min: 10, max: 25, criticalMin: 0, criticalMax: 35 },
  humidity: { min: 40, max: 80, criticalMin: 30, criticalMax: 90 },
  illuminance: { min: 20000, max: 40000, criticalMin: 10000, criticalMax: 50000 },
  co2: { min: 800, max: 1000, criticalMin: 200, criticalMax: 3000 },
};

/**
 * Simulates sending data to a backend service.
 * Determines system health based on the latest available data from both Robot and House.
 */
export function submitAnalysisData(robot?: RobotSettings, house?: HouseSettings) {
  // 1. Get current "server" state (simulated by store)
  const currentResult = get(analysisResult);

  // 2. Prepare new data objects with timestamps
  let nextRobotData = currentResult.data?.robot;
  if (robot) {
    nextRobotData = {
      settings: robot,
      timestamp: new Date().toISOString(),
    };
  }

  let nextHouseData = currentResult.data?.house;
  if (house) {
    nextHouseData = {
      settings: house,
      timestamp: new Date().toISOString(),
    };
  }

  // 3. Perform Analysis on the merged state
  const result = analyzeHealth(nextRobotData?.settings, nextHouseData?.settings);

  // 4. Update the "client" state (store)
  analysisResult.set({
    waiting: false,
    data: {
      robot: nextRobotData,
      house: nextHouseData,
    },
    result: result,
  });
}

export function analyzeHealth(robot?: RobotSettings, house?: HouseSettings): AnalysisResultDetailed {
  console.log('--- Analysis Service Request ---');
  if (robot) console.log('Robot Settings:', robot);
  if (house) console.log('House Settings:', house);
  console.log('-------------------------------');

  return {
    metrics: generateMetrics(robot, house),
    timestamp: new Date().toISOString(),
  };
}

/**
 * データをNGSI-LD形式に変換する
 */
function convertToNGSILD(data: {
  timestamp: string;
  robot?: { settings: RobotSettings; timestamp: string };
  house?: { settings: HouseSettings; timestamp: string };
  analysis: AnalysisResultDetailed;
}): NGSILDEntity {
  const ngsiEntity: any = {
    id: ORION_ENTITY_ID,
    type: 'AgrifarmRobotHouseSnapshot',
    systemTimestamp: {
      type: 'Property',
      value: data.timestamp,
    },
  };

  // Robot data
  if (data.robot) {
    ngsiEntity.robot = {
      type: 'Property',
      value: {
        speed: data.robot.settings.speed,
        pitch: data.robot.settings.pitch,
        roll: data.robot.settings.roll,
        yaw: data.robot.settings.yaw,
        status: data.robot.settings.statusCode,
        harvestOperatingDuration: data.robot.settings.harvestOperatingDuration,
        totalOperatingDuration: data.robot.settings.totalOperatingDuration,
        travelStopDuration: data.robot.settings.travelStopDuration,
        harvestCount: data.robot.settings.harvestCount,
        detectionCount: data.robot.settings.detectionCount,
        processingTimePerFruit: data.robot.settings.processingTimePerFruit,
        operationTime: data.robot.settings.operationTime,
        operationSteps: data.robot.settings.operationSteps,
        operationErrors: data.robot.settings.operationErrors,
        failureCount: data.robot.settings.failureCount,
        partFailureProbs: data.robot.settings.partFailureProbs,
        riskDetectionCount: data.robot.settings.riskDetectionCount,
        safetyActivationCount: data.robot.settings.safetyActivationCount,
      },
      observedAt: data.robot.timestamp,
      speed_unitCode: { type: 'Property', value: 'MTS' },
      pitch_unitCode: { type: 'Property', value: 'DD' },
      roll_unitCode: { type: 'Property', value: 'DD' },
      yaw_unitCode: { type: 'Property', value: 'DD' },
      harvestOperatingDuration_unitCode: { type: 'Property', value: 'MIN' },
      totalOperatingDuration_unitCode: { type: 'Property', value: 'MIN' },
      travelStopDuration_unitCode: { type: 'Property', value: 'MIN' },
      processingTimePerFruit_unitCode: { type: 'Property', value: 'SEC' },
      operationTime_unitCode: { type: 'Property', value: 'MIN' },
    };
  }

  // House data
  if (data.house) {
    ngsiEntity.house = {
      type: 'Property',
      value: {
        temperature: data.house.settings.temperature,
        relativeHumidity: data.house.settings.humidity,
        illuminance: data.house.settings.illuminance,
        co2: data.house.settings.co2,
      },
      observedAt: data.house.timestamp,
      temperature_unitCode: { type: 'Property', value: 'CEL' },
      relativeHumidity_unitCode: { type: 'Property', value: 'P1' },
      illuminance_unitCode: { type: 'Property', value: 'LUX' },
      co2_unitCode: { type: 'Property', value: '3P' },
    };
  }

  // Analysis data
  ngsiEntity.analysis = {
    type: 'Property',
    value: {
      // Health information removed
    },
    observedAt: data.analysis.timestamp,
  };

  // Add @context
  ngsiEntity['@context'] = [
    'https://smart-data-models.github.io/dataModel.Device/context.jsonld',
    'https://smart-data-models.github.io/dataModel.Environment/context.jsonld',
    'https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context-v1.8.jsonld',
  ];

  return ngsiEntity;
}

/**
 * 農業情報基盤へデータを送信する (FIWARE/ORIONにNGSI-LD形式で送信)
 * @param data 送信するデータ
 * @returns Promise<{success: boolean, error?: string}>
 */
export async function sendToAgriPlatform(data: {
  timestamp: string;
  robot?: { settings: RobotSettings; timestamp: string };
  house?: { settings: HouseSettings; timestamp: string };
  analysis: AnalysisResultDetailed;
}): Promise<{ success: boolean; error?: string; mode: 'simulation' | 'real' }> {
  // Convert to NGSI-LD format
  const ngsiEntity = convertToNGSILD(data);

  // シミュレーションモード
  if (!SEND_ENABLE) {
    console.group('--- 農業情報基盤へのデータ送信 (シミュレーション) ---');
    console.info('送信モード: シミュレーション');
    console.info('NGSI-LDデータ:', ngsiEntity);
    console.groupEnd();
    return { success: true, mode: 'simulation' };
  }

  // 実送信モード - FIWARE/ORIONへ送信
  try {
    const orionUrl = `${ORION_ENDPOINT}/ngsi-ld/v1/entityOperations/upsert`;

    console.group('--- 農業情報基盤へのデータ送信 (FIWARE/ORION) ---');
    console.info('送信先:', orionUrl);
    console.info('NGSI-LDデータ:', ngsiEntity);

    const response = await fetch(orionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ld+json',
        'NGSILD-Tenant': 'agri_farm_robot_house',
        Accept: 'application/ld+json',
      },
      body: JSON.stringify([ngsiEntity]), // upsert expects an array
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.info('送信成功');
    console.groupEnd();

    return { success: true, mode: 'real' };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : '不明なエラー';
    console.error('送信エラー:', errorMsg);
    console.groupEnd();
    return { success: false, error: errorMsg, mode: 'real' };
  }
}

/**
 * 送信モードを取得
 */
export function getSendMode(): { enabled: boolean; endpoint: string } {
  return {
    enabled: SEND_ENABLE,
    endpoint: SEND_ENABLE ? ORION_ENDPOINT : '',
  };
}

function generateMetrics(robot?: RobotSettings, house?: HouseSettings): AnalysisMetrics {
  const createMetric = (name: string, score: number, extra?: Partial<AnalysisMetricData>): AnalysisMetricData => {
    let status: 'healthy' | 'warning' | 'critical' | 'unknown' = 'healthy';
    let diagnosis = '良好です。';
    let action = '現状を維持してください。';

    if (score < 0.6) {
      status = 'critical';
      diagnosis = `${name}が低下しています（クリティカル）。`;
      action = 'ただちに点検と調整を行ってください。';
    } else if (score < 0.8) {
      status = 'warning';
      diagnosis = `${name}がやや低下しています。`;
      action = '設定の見直しを推奨します。';
    }

    return { score, status, diagnosis, action, ...extra };
  };

  // Generate random scores between 0.50 and 1.00 for demo purposes (wider range to show variance)
  const r = () => parseFloat((0.5 + Math.random() * 0.5).toFixed(2));

  // Harvest Accuracy Calculation
  let harvestScore = r();
  let harvestExtra: Partial<AnalysisMetricData> = {};

  if (robot) {
    const detection = robot.detectionCount || 0;
    const harvest = robot.harvestCount || 0;
    const uncertain = detection - harvest;
    const ambiguity = detection > 0 ? (uncertain / detection) * 100 : 0;

    // Score calculation based on ambiguity rate (inverse relationship)
    // 0% ambiguity -> 1.0 score, 100% ambiguity -> 0.0 score
    harvestScore = Math.max(0, Math.min(1, 1 - ambiguity / 100));
    harvestScore = parseFloat(harvestScore.toFixed(2));

    // FY25対象外のため、ステータスを不明、診断と推奨アクションを「-」に設定
    const status: 'unknown' = 'unknown';
    const diagnosis = '-';
    const action = '-';

    // フィードバックデータ (現在はデータがないためundefined)
    const falseHarvestCount = undefined;
    const damageCount = undefined;
    const leftBehindCount = undefined;

    // フィードバックメトリクスの計算
    let falseHarvestRate = undefined;
    let damageRate = undefined;
    let leftBehindRate = undefined;
    let marketableFruitRate = undefined;
    let recognitionAccuracy = undefined;

    // データが揃っている場合のみ計算
    if (harvest > 0) {
      if (falseHarvestCount !== undefined) {
        falseHarvestRate = parseFloat(((falseHarvestCount / harvest) * 100).toFixed(1));
      }

      if (damageCount !== undefined) {
        damageRate = parseFloat(((damageCount / harvest) * 100).toFixed(1));
      }

      // 可販果率（％）（100-（（誤収穫数＋損傷数）/ロボットの収穫数×100)）
      if (falseHarvestCount !== undefined && damageCount !== undefined) {
        marketableFruitRate = parseFloat((100 - ((falseHarvestCount + damageCount) / harvest) * 100).toFixed(1));
      }
    }

    if (harvest + (leftBehindCount || 0) > 0) {
      if (leftBehindCount !== undefined) {
        leftBehindRate = parseFloat(((leftBehindCount / (harvest + leftBehindCount)) * 100).toFixed(1));
        // 認識精度（％）（100－取り残し率）
        recognitionAccuracy = parseFloat((100 - leftBehindRate).toFixed(1));
      }
    }

    harvestExtra = {
      status,
      diagnosis,
      action,
      uncertainCount: uncertain,
      ambiguityRate: parseFloat(ambiguity.toFixed(1)),
      harvestCount: harvest,
      detectionCount: detection,
      falseHarvestCount,
      damageCount,
      leftBehindCount,
      falseHarvestRate,
      damageRate,
      leftBehindRate,
      marketableFruitRate,
      recognitionAccuracy,
    };
  }

  // Speed Data
  let speedExtra: Partial<AnalysisMetricData> = {};
  let speedScore = r();

  if (robot) {
    const opDuration = robot.harvestOperatingDuration || 0;
    const stopDuration = robot.travelStopDuration || 0;
    const stopRate = opDuration > 0 ? (stopDuration / opDuration) * 100 : 0;

    // Score calculation
    speedScore = Math.max(0, Math.min(1, 1 - stopRate / 100));
    speedScore = parseFloat(speedScore.toFixed(2));

    const status: 'healthy' | 'critical' | 'unknown' = stopRate >= 5 ? 'critical' : 'healthy';
    const diagnosis =
      stopRate >= 5
        ? '稼働効率が低下しています。頻繁な停止により、予定された収穫範囲を完了できないリスクがあります。'
        : '安定稼働しています。';
    const action =
      stopRate >= 5
        ? '通路の凹凸、ぬかるみ、またはセンサーを遮るほど伸びた葉など、物理的な障害を取り除いてください。'
        : '現在の状態を維持してください。';

    speedExtra = {
      status,
      diagnosis,
      action,
      robotSpeed: robot.speed,
      processingTime: robot.processingTimePerFruit,
      operatingTime: opDuration,
      travelStopTime: stopDuration,
      statusCode: robot.statusCode,
      stopRate: parseFloat(stopRate.toFixed(1)),
    };
  } else {
    speedExtra = {
      status: 'unknown',
      diagnosis: '-',
      action: '-',
    };
  }

  // Adaptability Data (姿勢データ + 環境データ)
  let adaptabilityExtra: Partial<AnalysisMetricData> = {};

  // Default to unknown/empty
  let adaptabilityStatus: 'healthy' | 'warning' | 'critical' | 'unknown' = 'unknown';
  let adaptabilityDiagnosis = '-';
  let adaptabilityAction = '-';

  if (robot && house) {
    // Both data present - perform analysis
    adaptabilityStatus = 'healthy';
    const adaptabilityDiagnosisList: string[] = [];
    const adaptabilityActionList: string[] = [];

    const addIssue = (s: 'warning' | 'critical', diag: string, act: string) => {
      // Status priority: critical > warning > healthy
      if (s === 'critical') {
        adaptabilityStatus = 'critical';
      } else if (s === 'warning' && adaptabilityStatus !== 'critical') {
        adaptabilityStatus = 'warning';
      }
      adaptabilityDiagnosisList.push(diag);
      adaptabilityActionList.push(act);
    };

    if (robot) {
      // Pitch/Roll check
      if (Math.abs(robot.pitch || 0) >= 5 || Math.abs(robot.roll || 0) >= 5) {
        addIssue(
          'critical',
          'ロボットの姿勢が不安定（傾き5°以上）です。',
          '走行路面の凹凸や障害物を確認し、平坦な経路を確保してください。',
        );
      }
    }

    if (house) {
      // Temperature check
      const t = house.temperature || 0;
      if (t > 35 || t < 0) {
        addIssue('critical', '温度が許容範囲外（0℃未満または35℃超）です。', '空調設備の緊急点検を行ってください。');
      } else if ((t > 25 && t <= 35) || (t >= 0 && t < 10)) {
        addIssue('warning', '温度が注意範囲です。', '空調設定の見直しを推奨します。');
      }

      // Humidity check
      const h = house.humidity || 0;
      if (h > 90 || h < 30) {
        addIssue(
          'critical',
          '湿度が許容範囲外（30%未満または90%超）です。',
          'ミストや除湿機の動作を確認してください。',
        );
      } else if ((h > 80 && h <= 90) || (h >= 30 && h < 40)) {
        addIssue('warning', '湿度が注意範囲です。', '湿度管理の設定調整を検討してください。');
      }

      // Illuminance check
      const l = house.illuminance || 0;
      if (l > 50000 || l < 10000) {
        addIssue(
          'critical',
          '照度が許容範囲外（10,000lx未満または50,000lx超）です。',
          '遮光や補光の不具合を確認してください。',
        );
      } else if ((l > 40000 && l <= 50000) || (l >= 10000 && l < 20000)) {
        addIssue('warning', '照度が注意範囲です。', '照明または遮光の調整を推奨します。');
      }

      // CO2 check
      const c = house.co2 || 0;
      if (c > 3000 || c < 200) {
        addIssue(
          'critical',
          'CO2濃度が許容範囲外（200ppm未満または3,000ppm超）です。',
          '換気装置またはCO2局所施用の確認を行ってください。',
        );
      } else if ((c > 1000 && c <= 3000) || (c >= 200 && c < 800)) {
        addIssue('warning', 'CO2濃度が注意範囲です。', '換気・施用設定の微調整を推奨します。');
      }
    }

    // Determine final messages
    if (adaptabilityStatus === 'healthy') {
      adaptabilityDiagnosis = '環境およびロボットの姿勢は正常範囲内です。';
      adaptabilityAction = '現在の環境制御を継続してください。';
    } else {
      // Use newline to separate multiple messages
      adaptabilityDiagnosis = adaptabilityDiagnosisList.join('\n');
      adaptabilityAction = adaptabilityActionList.join('\n');
    }
  }

  if (robot || house) {
    adaptabilityExtra = {
      ...(robot && {
        yaw: robot.yaw,
        pitch: robot.pitch,
        roll: robot.roll,
      }),
      ...(house && {
        temperature: house.temperature,
        humidity: house.humidity,
        illuminance: house.illuminance,
        co2: house.co2,
      }),
      status: adaptabilityStatus,
      diagnosis: adaptabilityDiagnosis,
      action: adaptabilityAction,
    };
  }

  // Operability Data
  let operabilityScore = r();
  let operabilityExtra: Partial<AnalysisMetricData> = {};
  if (robot) {
    const opSteps = robot.operationSteps || 0;
    const opErrors = robot.operationErrors || 0;
    const errorRate = opSteps > 0 ? (opErrors / opSteps) * 100 : 0;

    // Score calculation based on error rate (inverse relationship)
    // 0% error -> 1.0 score, 50% error -> 0.0 score (stricter than ambiguity)
    operabilityScore = Math.max(0, Math.min(1, 1 - errorRate / 50));
    operabilityScore = parseFloat(operabilityScore.toFixed(2));

    const opTime = robot.operationTime || 0;
    const isErrorRateHigh = errorRate >= 5;
    const isOpTimeHigh = opTime >= 30;
    const isOpStepsHigh = opSteps >= 5;
    const isCritical = isErrorRateHigh || isOpTimeHigh || isOpStepsHigh;

    const status: 'healthy' | 'critical' | 'unknown' = isCritical ? 'critical' : 'healthy';

    let diagnosis = '';
    let action = '';

    if (isCritical) {
      const diagnosisList: string[] = [];
      const actionList: string[] = [];

      if (isErrorRateHigh) {
        diagnosisList.push(
          '操作ミスまたはシステムエラーが多発しています。利用者の習熟度が不足している可能性があります。',
        );
        actionList.push(
          '操作マニュアルの改訂、または現場スタッフへの再レクチャーを実施し、正しい操作手順を周知してください。',
        );
      }
      if (isOpTimeHigh) {
        diagnosisList.push('操作時間（平均）が長時間（30分以上）に及んでいます。');
        actionList.push('操作の手順を再確認し、より効率的な操作方法を検討してください。');
      }
      if (isOpStepsHigh) {
        diagnosisList.push('操作ステップ数（平均）が多すぎます（5回以上）。');
        actionList.push('操作ステップを簡略化できないか検討してください。');
      }

      diagnosis = diagnosisList.join('\n');
      action = actionList.join('\n');
    } else {
      diagnosis = '操作はスムーズに行われています。利用者が正しくロボットを制御できています。';
      action = '現場の声を聞き取り、さらなる利便性向上へ繋げてください。';
    }

    operabilityExtra = {
      status,
      diagnosis,
      action,
      operationTime: opTime,
      operationSteps: opSteps,
      operationErrors: opErrors,
      operationErrorRate: parseFloat(errorRate.toFixed(1)),
    };
  } else {
    operabilityExtra = {
      status: 'unknown',
      diagnosis: '-',
      action: '-',
    };
  }

  // Maintainability Data
  let maintainabilityScore = r();
  let maintainabilityExtra: Partial<AnalysisMetricData> = {};
  if (robot) {
    const failureCount = robot.failureCount || 0;
    const stopTime = robot.totalStopDuration || 0;
    const probs = Object.values(robot.partFailureProbs);
    const maxPartFailureRate = probs.length > 0 ? Math.max(...probs) : 0;
    const mttr = failureCount > 0 ? stopTime / 60 / failureCount : 0;

    // Score calculation (simple heuristic for demo)
    // High failure count or high part failure rate reduces score
    maintainabilityScore = Math.max(0, Math.min(1, 1 - (failureCount / 20 + maxPartFailureRate / 100) / 2));
    maintainabilityScore = parseFloat(maintainabilityScore.toFixed(2));

    // 異常判定: MTTR 0.5時間以上 または いずれかの部位の予兆発生率10%以上
    const isMttrHigh = mttr >= 0.5;
    const isPartFailureHigh = maxPartFailureRate >= 10;
    const isCritical = isMttrHigh || isPartFailureHigh;

    // 10%以上の部位を特定
    const partNameMap: Record<keyof PartFailureProbs, string> = {
      arm: 'アーム',
      hand: 'ハンド',
      camera: 'カメラ',
      wheels: '車輪',
      tray: 'トレイ',
      communication: '通信',
      controlUnit: '制御ユニット',
      power: '電源',
    };
    const highRiskParts: string[] = [];
    (Object.keys(robot.partFailureProbs) as Array<keyof PartFailureProbs>).forEach((key) => {
      if (robot.partFailureProbs[key] >= 10) {
        highRiskParts.push(partNameMap[key]);
      }
    });
    const highRiskPartsText = highRiskParts.length > 0 ? `(${highRiskParts.join('、')})` : '';

    const status: 'healthy' | 'critical' | 'unknown' = isCritical ? 'critical' : 'healthy';

    // 診断メッセージの生成
    let diagnosis = '';
    if (isMttrHigh && isPartFailureHigh) {
      diagnosis = `復旧までに時間を要しており、かつ部位の予兆発生率が高い状態です${highRiskPartsText}。トラブル対応のフローや保守体制、および部品の劣化状態に重大な課題があります。`;
    } else if (isMttrHigh) {
      diagnosis =
        '復旧までに時間を要しており、稼働率を大きく押し下げています。トラブル対応のフローや保守体制に課題があります。';
    } else if (isPartFailureHigh) {
      diagnosis = `部位の予兆発生率が高く${highRiskPartsText}、故障リスクが高まっています。予防保全が必要な状態です。`;
    } else {
      diagnosis =
        '迅速な復旧が行われており、部位の状態も良好です。トラブル発生時のダウンタイムが最小限に抑えられています。';
    }

    // 推奨アクションの生成
    let action = '';
    if (isMttrHigh && isPartFailureHigh) {
      action = `「異常の検知」「現場への到着」「実際の修理・復旧」のどこに時間がかかっているか分析し、予兆発生率の高い部位${highRiskPartsText}の点検・交換を優先的に実施してください。`;
    } else if (isMttrHigh) {
      action = '「異常の検知」「現場への到着」「実際の修理・復旧」のどこに時間がかかっているか分析してください。';
    } else if (isPartFailureHigh) {
      action = `予兆発生率の高い部位${highRiskPartsText}を特定し、予防保全として点検・交換を実施してください。`;
    } else {
      action = '現在の復旧の速さと部位の状態を維持してください。';
    }

    maintainabilityExtra = {
      status,
      diagnosis,
      action,
      failureCount,
      partFailureRate: maxPartFailureRate,
      partFailureProbs: robot.partFailureProbs,
      totalStopTime: stopTime,
      mttr: parseFloat(mttr.toFixed(1)),
    };
  } else {
    maintainabilityExtra = {
      status: 'unknown',
      diagnosis: '-',
      action: '-',
    };
  }

  // Cost Efficiency Data
  let costEfficiencyScore = r();
  let costEfficiencyExtra: Partial<AnalysisMetricData> = {};
  if (robot) {
    const harvest = robot.harvestCount || 0;
    const opDuration = robot.totalOperatingDuration || 0;
    const stopDuration = robot.totalStopDuration || 0;

    const utilizationRate = opDuration > 0 ? ((opDuration - stopDuration) / opDuration) * 100 : 0;
    const harvestEfficiency = opDuration > 0 ? (harvest / opDuration) * 60 : 0;

    // Score calculation based on utilization (heuristic)
    costEfficiencyScore = Math.max(0, Math.min(1, utilizationRate / 100));
    costEfficiencyScore = parseFloat(costEfficiencyScore.toFixed(2));

    // FY25対象外のため、ステータスを不明、診断と推奨アクションを「-」に設定
    const status: 'unknown' = 'unknown';
    const diagnosis = '-';
    const action = '-';

    costEfficiencyExtra = {
      harvestCount: harvest,
      operatingTime: opDuration,
      totalStopTime: stopDuration,
      utilizationRate: parseFloat(utilizationRate.toFixed(1)),
      harvestEfficiency: parseFloat(harvestEfficiency.toFixed(1)),
      status,
      diagnosis,
      action,
    };
  } else {
    // データがない場合も同様に不明・対象外として扱う
    costEfficiencyExtra = {
      status: 'unknown',
      diagnosis: '-',
      action: '-',
    };
  }

  // Safety Data
  let safetyScore = r();
  let safetyExtra: Partial<AnalysisMetricData> = {};
  if (robot) {
    const activation = robot.safetyActivationCount || 0;
    const riskDetection = robot.riskDetectionCount || 0;

    // 操作エラー率を計算
    const opSteps = robot.operationSteps || 0;
    const opErrors = robot.operationErrors || 0;
    const operationErrorRate = opSteps > 0 ? (opErrors / opSteps) * 100 : 0;

    // Score calculation based on operation error rate (inverse relationship)
    // 0% error -> 1.0 score, 50% error -> 0.0 score
    safetyScore = Math.max(0, Math.min(1, 1 - operationErrorRate / 50));
    safetyScore = parseFloat(safetyScore.toFixed(2));

    const status: 'healthy' | 'critical' | 'unknown' = operationErrorRate >= 3 ? 'critical' : 'healthy';
    const diagnosis =
      operationErrorRate >= 3
        ? '深刻な動作不備が発生しています。作物への損傷や、機器故障のリスクが許容範囲を超えています。'
        : '動作の信頼性は高い状態です。意図した通りの制御が行われています。';
    const action =
      operationErrorRate >= 3
        ? '誤作動時に正しく安全停止が機能しているか、リミットスイッチや衝突検知の感度を再検証してください。'
        : '動作精度を維持するため、関節部のガタつきやベルトの緩みなど、経年劣化による精度の低下を未然に防ぐ定期点検を継続してください。';

    safetyExtra = {
      status: 'unknown',
      diagnosis: '-',
      action: '-',
      riskDetectionCount: riskDetection,
      safetyActivationCount: activation,
      safetyMalfunctionCount: undefined,
      safetyMalfunctionRate: undefined,
    };
  } else {
    safetyExtra = {
      status: 'unknown',
      diagnosis: '-',
      action: '-',
    };
  }

  // Durability Data
  let durabilityScore = r();
  let durabilityExtra: Partial<AnalysisMetricData> = {};
  if (robot) {
    const opDuration = robot.totalOperatingDuration || 0;
    const stopDuration = robot.totalStopDuration || 0;
    const failureCount = robot.failureCount || 0;

    const opHours = opDuration / 60;
    const mtbf = failureCount > 0 ? opHours / failureCount : opHours;
    const operationRate = opDuration > 0 ? ((opDuration - stopDuration) / opDuration) * 100 : 0;

    // Score calculation based on operation rate and failure count
    durabilityScore = Math.max(0, Math.min(1, (operationRate / 100 + (1 - failureCount / 10)) / 2));
    durabilityScore = parseFloat(durabilityScore.toFixed(2));

    // Get status label
    const allCodes = [
      ...STATUS_CODES.NORMAL,
      ...STATUS_CODES.RUNNING,
      ...STATUS_CODES.HARVEST,
      ...STATUS_CODES.BATTERY,
    ];
    const statusObj = allCodes.find((c) => c.code === robot.statusCode);
    const statusLabel = statusObj ? statusObj.label : robot.statusCode;

    // ステータス判断 (MTBF < 9.5 または 稼働率 < 95% なら異常)
    const isMtbfCritical = mtbf < 9.5;
    const isOperationRateCritical = operationRate < 95;
    const isCritical = isMtbfCritical || isOperationRateCritical;
    const status: 'healthy' | 'critical' = isCritical ? 'critical' : 'healthy';

    // 診断メッセージとアクションの生成
    let diagnosis = '';
    let action = '';

    if (isMtbfCritical && isOperationRateCritical) {
      diagnosis =
        '故障が頻発し、かつ稼働率も極めて低い状態です。システムの信頼性が著しく低下しており、連続稼働に耐えられない可能性があります。';
      action = '故障の根本原因を特定し、オーバーホールまたは主要部品の交換を検討してください。';
    } else if (isMtbfCritical) {
      diagnosis =
        'MTBF（平均故障間隔）が低く、短期間で故障を繰り返しています。機械的な耐久性や部品の品質に問題が生じている可能性があります。';
      action = '故障履歴を分析し、早期に摩耗・劣化した部品の特定と、耐久性の高い部品への交換を行ってください。';
    } else if (isOperationRateCritical) {
      diagnosis =
        '稼働率が低下しており、非稼働時間が長くなっています。耐久性そのものよりも、故障発生後の復旧や運用管理に課題があります。';
      action = '現場でのダウンタイム発生要因（対応遅れや部品待ち等）を精査し、運用体制の最適化を図ってください。';
    } else {
      diagnosis = 'MTBFおよび稼働率ともに良好な数値を維持しています。システムの耐久性は高く、安定した稼働状態です。';
      action = '現在の高い信頼性と耐久性を維持してください。';
    }

    durabilityExtra = {
      status,
      diagnosis,
      action,
      operatingTime: opDuration,
      failureCount: failureCount,
      totalStopTime: stopDuration,
      processingTime: robot.processingTimePerFruit,
      robotSpeed: robot.speed,
      statusLabel: statusLabel,
      mtbf: parseFloat(mtbf.toFixed(1)),
      operationRate: parseFloat(operationRate.toFixed(1)),
      repairTime: undefined,
      repairCount: undefined,
      downtime: undefined,
    };
  } else {
    durabilityExtra = {
      status: 'unknown',
      diagnosis: '-',
      action: '-',
    };
  }

  // Data Utilization Status Calculation
  // データ活用およびFY25対象外（収穫精度、コスト効率、倫理性）を除く他の評価軸の状態を確認
  // ひとつでもステータスが「不明(unknown)」であれば、データ活用は「異常(critical)」とする
  const otherMetrics = [
    { name: '収穫速度', data: speedExtra },
    { name: '環境適応性', data: adaptabilityExtra },
    { name: '操作性', data: operabilityExtra },
    { name: 'メンテナンス性', data: maintainabilityExtra },
    { name: '耐久性', data: durabilityExtra },
  ];

  const unknownMetrics = otherMetrics.filter((m) => m.data.status === 'unknown');
  const isAllKnown = unknownMetrics.length === 0;

  // Data Utilization score (1.0 if all known, 0.0 otherwise)
  const dataUtilizationScore = isAllKnown ? 1.0 : 0.0;

  // Data Utilization status and messages
  const dataUtilizationStatus: 'healthy' | 'critical' = isAllKnown ? 'healthy' : 'critical';

  let dataUtilizationDiagnosis = '';
  let dataUtilizationAction = '';

  if (isAllKnown) {
    dataUtilizationDiagnosis = 'すべての評価軸が正常にデータ連携されています。';
    dataUtilizationAction = '現在の状態を継続してください。';
  } else {
    const missingNames = unknownMetrics.map((m) => m.name).join('、');
    dataUtilizationDiagnosis = `データ連携が不完全です。一部の評価軸(${missingNames})がブラックボックス化しており、正確な稼働分析や意思決定ができない状態です。`;
    dataUtilizationAction = `どのデータが収集・連携されていないか特定し(${missingNames})、対応を検討してください。`;
  }

  return {
    harvestAccuracy: createMetric('収穫精度', harvestScore, harvestExtra),
    harvestSpeed: createMetric('収穫速度', speedScore, speedExtra),
    adaptability: createMetric('環境適応性', r(), adaptabilityExtra),
    operability: createMetric('操作性', operabilityScore, operabilityExtra),
    maintainability: createMetric('メンテナンス性', maintainabilityScore, maintainabilityExtra),
    costEfficiency: createMetric('コスト効率', costEfficiencyScore, costEfficiencyExtra),
    safety: createMetric('安全性', safetyScore, safetyExtra),
    dataUtilization: createMetric('データ活用', dataUtilizationScore, {
      status: dataUtilizationStatus,
      diagnosis: dataUtilizationDiagnosis,
      action: dataUtilizationAction,
    }),
    durability: createMetric('耐久性', durabilityScore, durabilityExtra),
    ethics: createMetric('倫理性', r(), {
      status: 'unknown',
      diagnosis: '-',
      action: '-',
    }),
  };
}
