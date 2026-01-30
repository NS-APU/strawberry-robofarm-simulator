import { get } from 'svelte/store';
import { analysisResult } from '../stores/robotStore';
import type { RobotSettings } from '../stores/robotStore';
import type { HouseSettings } from '../stores/houseStore';

// 環境変数から設定を読み込み
const SEND_ENABLE = import.meta.env.VITE_AGRI_SEND_ENABLE === 'true';
const ORION_BASE_URL = import.meta.env.VITE_ORION_BASE_URL || 'http://localhost';
const ORION_API_PATH = import.meta.env.VITE_ORION_API_PATH || '/api/orion';
const ORION_ENTITY_ID = import.meta.env.VITE_ORION_ENTITY_ID || 'urn:ngsi-ld:AgrifarmRobotHouseSnapshot:site-01';

const getOrionEndpoint = () => {
  try {
    const url = new URL(ORION_BASE_URL);
    if (import.meta.env.DEV || url.hostname === 'localhost') {
      return ORION_API_PATH;
    }
    return ORION_BASE_URL + ORION_API_PATH;
  } catch (e) {
    return ORION_BASE_URL + ORION_API_PATH;
  }
};

const ORION_ENDPOINT = getOrionEndpoint();

export type HealthStatus = 'healthy' | 'warning' | 'critical' | 'unknown';

export interface AnalysisResultDetailed {
  system: {
    health: HealthStatus;
  };
  robot: {
    health: HealthStatus;
    diagnosis: string;
    action: string;
  };
  house: {
    health: HealthStatus;
    diagnosis: string;
    problematicData: string[];
    action: string;
  };
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
  battery: { warning: 20, critical: 0 },
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

  let robotResult;
  if (robot) {
    robotResult = analyzeRobot(robot);
  }

  let houseResult;
  if (house) {
    houseResult = analyzeHouse(house);
  }

  // Calculate System Health
  let systemHealth: HealthStatus = 'healthy';

  const statuses: HealthStatus[] = [];
  if (robotResult) statuses.push(robotResult.health);
  if (houseResult) statuses.push(houseResult.health);

  if (statuses.includes('critical')) {
    systemHealth = 'critical';
  } else if (statuses.includes('warning')) {
    systemHealth = 'warning';
  } else if (statuses.length === 0) {
    systemHealth = 'unknown';
  }

  return {
    system: {
      health: systemHealth,
    },
    robot: robotResult || {
      health: 'unknown',
      diagnosis: '-',
      action: '-',
    },
    house: houseResult || {
      health: 'unknown',
      diagnosis: '-',
      problematicData: [],
      action: '-',
    },
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
        tireRotation: data.robot.settings.tireRotation,
        obstacleDetected: data.robot.settings.obstacleDetected,
        cameraClarity: data.robot.settings.cameraClarity,
        trayFull: data.robot.settings.trayFull,
        batteryLevel: data.robot.settings.batteryLevel / 100, // Convert percentage to decimal
        status: data.robot.settings.statusCode,
      },
      observedAt: data.robot.timestamp,
      speed_unitCode: { type: 'Property', value: 'MTS' },
      pitch_unitCode: { type: 'Property', value: 'DD' },
      roll_unitCode: { type: 'Property', value: 'DD' },
      tireRotation_unitCode: { type: 'Property', value: 'RPM' },
      cameraClarity_unitCode: { type: 'Property', value: 'P1' },
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
      system: {
        health: data.analysis.system.health,
      },
      robot: {
        health: data.analysis.robot.health,
        diagnosis: data.analysis.robot.diagnosis,
        action: data.analysis.robot.action,
      },
      house: {
        health: data.analysis.house.health,
        diagnosis: data.analysis.house.diagnosis,
        problematicData: data.analysis.house.problematicData,
        action: data.analysis.house.action,
      },
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

function analyzeRobot(robot: RobotSettings): {
  health: HealthStatus;
  diagnosis: string;
  action: string;
} {
  const code = robot.statusCode;

  // 1. Check for specific status codes first (User Defined Logic)
  // Normal Series
  if (code === 'S-01') return { health: 'healthy', diagnosis: 'アイドル状態です。', action: '正常に稼働しています。' };
  if (code === 'S-02') return { health: 'healthy', diagnosis: '移動中です。', action: '正常に稼働しています。' };
  if (code === 'S-03') return { health: 'healthy', diagnosis: '収穫中です。', action: '正常に稼働しています。' };
  if (code === 'S-04')
    return { health: 'healthy', diagnosis: '帰還中です（充電や荷下ろし）。', action: '正常に稼働しています。' };

  // Running Error Series
  if (code === 'R-01')
    return {
      health: 'critical',
      diagnosis: 'タイヤがスタックしています。',
      action: 'ロボットを走行可能な場所まで移動させてください。',
    };
  if (code === 'R-02')
    return { health: 'critical', diagnosis: '進路上に障害物があります。', action: '障害物を取り除いてください。' };
  if (code === 'R-03')
    return {
      health: 'critical',
      diagnosis: '脱輪または転倒しています。',
      action: 'ロボットを走行可能な場所まで移動させてください。',
    };

  //  Harvest/Device Warning Series
  if (code === 'H-01')
    return { health: 'warning', diagnosis: 'カメラが汚れています。', action: 'カメラをきれいにしてください。' };
  if (code === 'H-02')
    return { health: 'warning', diagnosis: 'トレイの収穫物が満タンです。', action: '収穫物を回収してください。' };

  // Battery Warning Series
  if (code === 'E-01') {
    if (robot.batteryLevel <= THRESHOLDS.battery.critical) {
      return {
        health: 'critical',
        diagnosis: 'バッテリー切れ',
        action: 'バッテリー切れです。充電ステーションまで移動させ、充電してください。',
      };
    } else {
      return {
        health: 'warning',
        diagnosis: 'バッテリー残量が少なくなっています。',
        action: '充電ステーションにもどります。',
      };
    }
  }

  // Generic Error handling if code is not in the list but fits pattern
  if (code.startsWith('R-') || code.startsWith('E-')) {
    return {
      health: 'critical',
      diagnosis: '未定義のエラー',
      action: 'エラーコードを確認し、マニュアルに従って復旧作業を行ってください。',
    };
  }

  // Warning Checks
  if (code.startsWith('H-')) {
    return {
      health: 'warning',
      diagnosis: '収穫系異常',
      action: '収穫作業の状態を確認してください（トレイ満タン、視界不良など）。',
    };
  }

  return {
    health: 'healthy',
    diagnosis: '正常',
    action: '正常に稼働しています。定期的なメンテナンスを継続してください。',
  };
}

function analyzeHouse(house: HouseSettings): {
  health: HealthStatus;
  diagnosis: string;
  problematicData: string[];
  action: string;
} {
  const criticalItems: string[] = [];
  const warningItems: string[] = [];
  let isCritical = false;
  let isWarning = false;

  // Temperature
  if (
    house.temperature < THRESHOLDS.temperature.criticalMin ||
    house.temperature > THRESHOLDS.temperature.criticalMax
  ) {
    isCritical = true;
    criticalItems.push('温度');
  } else if (house.temperature < THRESHOLDS.temperature.min || house.temperature > THRESHOLDS.temperature.max) {
    isWarning = true;
    warningItems.push('温度');
  }

  // Humidity
  if (house.humidity < THRESHOLDS.humidity.criticalMin || house.humidity > THRESHOLDS.humidity.criticalMax) {
    isCritical = true;
    criticalItems.push('湿度');
  } else if (house.humidity < THRESHOLDS.humidity.min || house.humidity > THRESHOLDS.humidity.max) {
    isWarning = true;
    warningItems.push('湿度');
  }

  // Illuminance
  if (
    house.illuminance < THRESHOLDS.illuminance.criticalMin ||
    house.illuminance > THRESHOLDS.illuminance.criticalMax
  ) {
    isCritical = true;
    criticalItems.push('照度');
  } else if (house.illuminance < THRESHOLDS.illuminance.min || house.illuminance > THRESHOLDS.illuminance.max) {
    isWarning = true;
    warningItems.push('照度');
  }

  // CO2
  if (house.co2 < THRESHOLDS.co2.criticalMin || house.co2 > THRESHOLDS.co2.criticalMax) {
    isCritical = true;
    criticalItems.push('CO2濃度');
  } else if (house.co2 < THRESHOLDS.co2.min || house.co2 > THRESHOLDS.co2.max) {
    isWarning = true;
    warningItems.push('CO2濃度');
  }

  // Determine Result
  if (isCritical) {
    return {
      health: 'critical',
      diagnosis: `${criticalItems.join('、')}が適正範囲外（異常値）です。`,
      problematicData: [],
      action: '直ちにハウスを確認し、機器の故障がないか確認してください。',
    };
  }

  if (isWarning) {
    return {
      health: 'warning',
      diagnosis: `${warningItems.join('、')}が注意範囲を外れています。`,
      problematicData: [],
      action: 'ハウスを確認し、最適な環境を保つようにしてください。',
    };
  }

  return {
    health: 'healthy',
    diagnosis: 'すべての環境値が適正範囲内です。',
    problematicData: [],
    action: '現在の環境を維持してください。',
  };
}
