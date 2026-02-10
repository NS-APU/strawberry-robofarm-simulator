<script lang="ts">
  import type { AnalysisMetricData } from '../../../stores/robotStore';
  import { STATUS_TEXT } from '../../../logic/analysisService';
  import { STATUS_CODES } from '../../../stores/robotStore';

  export let metric: AnalysisMetricData;
  const label = "耐久性";

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

    {#if metric.mtbf !== undefined && metric.operationRate !== undefined}
      <div class="border-t border-gray-100 pt-2">
        <strong class="mb-2 block text-xs text-gray-500">メトリクス</strong>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <span class="block text-xs text-gray-500">MTBF</span>
            <p class="text-lg font-medium {metric.mtbf < 9.5 ? 'text-red-600' : 'text-gray-800'}">
              {metric.mtbf}<span class="text-xs ml-1 text-gray-500">時間</span>
            </p>
          </div>
          <div>
            <span class="block text-xs text-gray-500">稼働率</span>
            <p class="text-lg font-medium {metric.operationRate < 95 ? 'text-red-600' : 'text-gray-800'}">
              {metric.operationRate}<span class="text-xs ml-1 text-gray-500">%</span>
            </p>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="block text-xs text-gray-500">ダウンタイム</span>
              <span class="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 border border-gray-200">
                FY25対象外
              </span>
            </div>
            <p class="text-lg font-medium text-gray-800">
              {#if metric.downtime !== undefined}
                {metric.downtime}<span class="text-xs ml-1 text-gray-500">分</span>
              {:else}
                -
              {/if}
            </p>
          </div>
        </div>
      </div>
    {/if}

    {#if metric.operatingTime !== undefined}
      <div class="border-t border-gray-100 pt-2">
        <strong class="mb-2 block text-xs text-gray-500">データ</strong>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <span class="block text-xs text-gray-500">稼働時間</span>
            <p class="text-lg font-medium text-gray-800">
              {metric.operatingTime}<span class="text-xs ml-1 text-gray-500">分</span>
            </p>
          </div>
          <div>
            <span class="block text-xs text-gray-500">停止時間</span>
            <p class="text-lg font-medium text-gray-800">
              {metric.totalStopTime}<span class="text-xs ml-1 text-gray-500">分</span>
            </p>
          </div>
          <div>
            <span class="block text-xs text-gray-500">故障回数</span>
            <p class="text-lg font-medium text-gray-800">
              {metric.failureCount}<span class="text-xs ml-1 text-gray-500">回</span>
            </p>
          </div>
          <div>
            <span class="block text-xs text-gray-500">1果実あたりの処理時間</span>
            <p class="text-lg font-medium text-gray-800">
              {metric.processingTime}<span class="text-xs ml-1 text-gray-500">秒</span>
            </p>
          </div>
          <div>
            <span class="block text-xs text-gray-500">ロボット走行速度</span>
            <p class="text-lg font-medium text-gray-800">
              {metric.robotSpeed}<span class="text-xs ml-1 text-gray-500">m/s</span>
            </p>
          </div>
          <div>
            <span class="block text-xs text-gray-500">ステータス</span>
            <p class="text-lg font-medium {STATUS_CODES.NORMAL.some(s => s.label === metric.statusLabel) ? 'text-gray-800' : 'text-orange-600'}">
              {metric.statusLabel}
            </p>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-100 pt-2">
        <div class="flex items-center gap-2 mb-2">
          <strong class="block text-xs text-gray-500">フィードバックデータ</strong>
          <span class="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 border border-gray-200">
            FY25対象外
          </span>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <span class="block text-xs text-gray-500">修理時間</span>
            <p class="text-lg font-medium text-gray-800">
              {#if metric.repairTime !== undefined}
                {metric.repairTime}<span class="text-xs ml-1 text-gray-500">分</span>
              {:else}
                -
              {/if}
            </p>
          </div>
          <div>
            <span class="block text-xs text-gray-500">修理回数</span>
            <p class="text-lg font-medium text-gray-800">
              {#if metric.repairCount !== undefined}
                {metric.repairCount}<span class="text-xs ml-1 text-gray-500">回</span>
              {:else}
                -
              {/if}
            </p>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
