<script lang="ts">
  import type { AnalysisMetricData } from '../../../stores/robotStore';
  import { STATUS_TEXT } from '../../../logic/analysisService';

  export let metric: AnalysisMetricData;
  const label = "環境適応性";

  $: displayStatus = metric.status === 'warning' ? 'healthy' : metric.status;
  $: statusText = STATUS_TEXT[displayStatus] || '不明';
  const statusClasses: Record<string, string> = {
    healthy: 'bg-green-100 text-green-700',
    critical: 'bg-red-100 text-red-700',
    unknown: 'bg-gray-100 text-gray-700'
  };
  $: statusClass = statusClasses[displayStatus] || statusClasses.unknown;

  function getAttitudeClass(val: number | undefined): string {
    if (val === undefined) return 'text-gray-800';
    return Math.abs(val) >= 5 ? 'text-red-500 font-bold' : 'text-gray-800';
  }

  function getTempClass(val: number | undefined): string {
    if (val === undefined) return 'text-gray-800';
    if (val > 35 || val < 0) return 'text-red-600 font-bold';
    if ((val > 25 && val <= 35) || (val >= 0 && val < 10)) return 'text-yellow-600 font-bold';
    return 'text-gray-800';
  }

  function getHumidityClass(val: number | undefined): string {
    if (val === undefined) return 'text-gray-800';
    if (val > 90 || val < 30) return 'text-red-600 font-bold';
    if ((val > 80 && val <= 90) || (val >= 30 && val < 40)) return 'text-yellow-600 font-bold';
    return 'text-gray-800';
  }

  function getIlluminanceClass(val: number | undefined): string {
    if (val === undefined) return 'text-gray-800';
    if (val > 50000 || val < 10000) return 'text-red-600 font-bold';
    if ((val > 40000 && val <= 50000) || (val >= 10000 && val < 20000)) return 'text-yellow-600 font-bold';
    return 'text-gray-800';
  }

  function getCo2Class(val: number | undefined): string {
    if (val === undefined) return 'text-gray-800';
    if (val > 3000 || val < 200) return 'text-red-600 font-bold';
    if ((val >= 200 && val < 800) || (val > 1000 && val <= 3000)) return 'text-yellow-600 font-bold';
    return 'text-gray-800';
  }
</script>

<div class="rounded-lg border border-gray-200 bg-white shadow-sm">
  <div class="space-y-3 p-4">
    <div class="flex items-center justify-between border-b border-gray-100 pb-2">
      <h5 class="font-bold text-gray-700">{label}</h5>
      <span class="rounded-full px-3 py-1 text-sm font-bold {statusClass}">
        {statusText}
      </span>
    </div>
    
    <div>
      <strong class="mb-1 block text-xs text-gray-500">診断</strong>
      <p class="text-sm text-gray-800">{metric.diagnosis}</p>
    </div>

    {#if metric.action}
      <div class="border-t border-gray-100 pt-2">
        <strong class="mb-1 block text-xs text-gray-500">推奨アクション</strong>
        <p class="text-sm text-gray-800">{metric.action}</p>
      </div>
    {/if}

    <div class="border-t border-gray-100 pt-2">
      <strong class="mb-2 block text-xs text-gray-500">データ</strong>
      <div class="space-y-3">
        <div class="grid grid-cols-3 gap-2">
          <div>
            <span class="block text-xs text-gray-500">Yaw</span>
            <p class="text-lg font-medium text-gray-800">{metric.yaw !== undefined ? metric.yaw.toFixed(1) + '°' : '-'}</p>
          </div>
          <div>
            <span class="block text-xs text-gray-500">Pitch</span>
            <p class="text-lg font-medium {getAttitudeClass(metric.pitch)}">{metric.pitch !== undefined ? metric.pitch.toFixed(1) + '°' : '-'}</p>
          </div>
          <div>
            <span class="block text-xs text-gray-500">Roll</span>
            <p class="text-lg font-medium {getAttitudeClass(metric.roll)}">{metric.roll !== undefined ? metric.roll.toFixed(1) + '°' : '-'}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-x-2 gap-y-4">
          <div>
            <span class="block text-xs text-gray-500">温度</span>
            <p class="text-lg font-medium {getTempClass(metric.temperature)}">
              {metric.temperature !== undefined ? metric.temperature.toFixed(1) : '-'}<span class="text-xs ml-1 text-gray-500">{metric.temperature !== undefined ? '℃' : ''}</span>
            </p>
          </div>
          <div>
            <span class="block text-xs text-gray-500">湿度</span>
            <p class="text-lg font-medium {getHumidityClass(metric.humidity)}">
              {metric.humidity !== undefined ? metric.humidity.toFixed(0) : '-'}<span class="text-xs ml-1 text-gray-500">{metric.humidity !== undefined ? '%' : ''}</span>
            </p>
          </div>
          <div>
            <span class="block text-xs text-gray-500">照度</span>
            <p class="text-lg font-medium {getIlluminanceClass(metric.illuminance)}">
              {metric.illuminance !== undefined ? metric.illuminance.toLocaleString() : '-'}<span class="text-xs ml-1 text-gray-500">{metric.illuminance !== undefined ? 'lx' : ''}</span>
            </p>
          </div>
          <div>
            <span class="block text-xs text-gray-500">CO2濃度</span>
            <p class="text-lg font-medium leading-tight {getCo2Class(metric.co2)}">
              {metric.co2 !== undefined ? metric.co2.toFixed(0) : '-'}<span class="text-xs ml-1 text-gray-500">{metric.co2 !== undefined ? 'ppm' : ''}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
