<script lang="ts">
  import { STATUS_CODES } from '../../../stores/robotStore';
  import type { AnalysisMetricData } from '../../../stores/robotStore';
  import { STATUS_TEXT } from '../../../logic/analysisService';

  export let metric: AnalysisMetricData;
  const label = "収穫速度";

  function getStatusLabel(code: string | undefined): string {
    if (!code) return '-';
    for (const group of Object.values(STATUS_CODES)) {
      const found = group.find(s => s.code === code);
      if (found) return found.label;
    }
    return code;
  }

  $: statusText = STATUS_TEXT[metric.status] || '不明';
  $: statusClass = metric.status === 'healthy' 
    ? 'bg-green-100 text-green-700' 
    : metric.status === 'warning' 
      ? 'bg-yellow-100 text-yellow-700' 
        : metric.status === 'critical'
          ? 'bg-red-100 text-red-700'
          : 'bg-gray-100 text-gray-700';
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

    {#if metric.stopRate !== undefined}
      <div class="border-t border-gray-100 pt-2">
        <strong class="mb-2 block text-xs text-gray-500">メトリクス</strong>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <span class="block text-xs text-gray-500">走行停止率</span>
            <p class="text-lg font-medium {metric.stopRate >= 5 ? 'text-red-600' : 'text-gray-800'}">
              {metric.stopRate}<span class="text-xs ml-1 text-gray-500">%</span>
            </p>
          </div>
        </div>
      </div>
    {/if}

    {#if metric.robotSpeed !== undefined}
      <div class="border-t border-gray-100 pt-2">
        <strong class="mb-2 block text-xs text-gray-500">データ</strong>
        <div class="grid grid-cols-2 gap-4 gap-y-3">
          <div>
            <span class="block text-xs text-gray-500">ロボット走行速度</span>
            <p class="text-lg font-medium text-gray-800">
              {metric.robotSpeed}<span class="text-xs ml-1 text-gray-500">m/s</span>
            </p>
          </div>
          <div>
            <span class="block text-xs text-gray-500">1果実あたりの処理時間</span>
            <p class="text-lg font-medium text-gray-800">
              {metric.processingTime}<span class="text-xs ml-1 text-gray-500">秒</span>
            </p>
          </div>
          <div>
            <span class="block text-xs text-gray-500">収穫稼働時間</span>
            <p class="text-lg font-medium text-gray-800">
              {metric.operatingTime}<span class="text-xs ml-1 text-gray-500">分</span>
            </p>
          </div>
          <div>
            <span class="block text-xs text-gray-500">走行停止時間</span>
            <p class="text-lg font-medium text-gray-800">
              {metric.travelStopTime}<span class="text-xs ml-1 text-gray-500">分</span>
            </p>
          </div>
          <div class="col-span-1">
            <span class="block text-xs text-gray-500">ステータス</span>
            <p class="text-lg font-medium {STATUS_CODES.NORMAL.some(s => s.code === metric.statusCode) ? 'text-gray-800' : 'text-orange-600'}">
              {getStatusLabel(metric.statusCode)}
            </p>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
