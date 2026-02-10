<script lang="ts">
  import type { AnalysisMetricData } from '../../../stores/robotStore';
  import { STATUS_TEXT } from '../../../logic/analysisService';

  export let metric: AnalysisMetricData;
  const label = "安全性";

  $: statusText = STATUS_TEXT[metric.status] || '不明';
  $: statusClass = metric.status === 'healthy' 
    ? 'bg-green-100 text-green-700' 
    : metric.status === 'warning' 
      ? 'bg-yellow-100 text-yellow-700' 
        : metric.status === 'critical'
          ? 'bg-red-100 text-red-700'
          : 'bg-gray-100 text-gray-700';
</script>

<div class="rounded-lg border border-gray-200 bg-white shadow-sm opacity-60">
  <div class="space-y-3 p-4">
    <div class="flex items-center justify-between border-b border-gray-100 pb-2">
      <div class="flex items-center gap-2">
        <h5 class="font-bold text-gray-700">{label}</h5>
        <span class="rounded-full px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-600">FY25対象外</span>
      </div>
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
      <strong class="mb-2 block text-xs text-gray-500">メトリクス</strong>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <span class="block text-xs text-gray-500">誤作動率</span>
          <p class="text-lg font-medium text-gray-800">
            {metric.safetyMalfunctionRate ?? '-'}<span class="text-xs ml-1 text-gray-500">%</span>
          </p>
        </div>
      </div>
    </div>

    {#if metric.riskDetectionCount !== undefined || metric.safetyActivationCount !== undefined}
      <div class="border-t border-gray-100 pt-2">
        <strong class="mb-2 block text-xs text-gray-500">データ</strong>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <span class="block text-xs text-gray-500">安全性リスク検知回数</span>
            <p class="text-lg font-medium text-gray-800">
              {metric.riskDetectionCount ?? '-'}<span class="text-xs ml-1 text-gray-500">{metric.riskDetectionCount !== undefined ? '回' : ''}</span>
            </p>
          </div>
          <div>
            <span class="block text-xs text-gray-500">安全装置作動回数</span>
            <p class="text-lg font-medium text-gray-800">
              {metric.safetyActivationCount ?? '-'}<span class="text-xs ml-1 text-gray-500">{metric.safetyActivationCount !== undefined ? '回' : ''}</span>
            </p>
          </div>
        </div>
      </div>
    {/if}

    <div class="border-t border-gray-100 pt-2">
      <div class="flex items-center gap-2 mb-2">
        <strong class="block text-xs text-gray-500">フィードバックデータ</strong>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <span class="block text-xs text-gray-500">安全装置誤作動回数</span>
          <p class="text-lg font-medium text-gray-800">
            {metric.safetyMalfunctionCount ?? '-'}<span class="text-xs ml-1 text-gray-500">回</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
