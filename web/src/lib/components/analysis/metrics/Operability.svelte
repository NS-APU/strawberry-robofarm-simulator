<script lang="ts">
  import type { AnalysisMetricData } from '../../../stores/robotStore';
  import { STATUS_TEXT } from '../../../logic/analysisService';

  export let metric: AnalysisMetricData;
  const label = "操作性";

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

    {#if metric.operationErrorRate !== undefined}
      <div class="border-t border-gray-100 pt-2">
        <strong class="mb-2 block text-xs text-gray-500">メトリクス</strong>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <span class="block text-xs text-gray-500">操作エラー率</span>
            <p class="text-lg font-medium {metric.operationErrorRate >= 5 ? 'text-red-600' : 'text-gray-800'}">
              {metric.operationErrorRate}<span class="text-xs ml-1 text-gray-500">%</span>
            </p>
          </div>
        </div>
      </div>
    {/if}

    {#if metric.operationTime !== undefined || metric.operationSteps !== undefined || metric.operationErrors !== undefined}
      <div class="border-t border-gray-100 pt-2">
        <strong class="mb-2 block text-xs text-gray-500">データ</strong>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <span class="block text-xs text-gray-500">操作時間（平均）</span>
            <p class="text-lg font-medium {(metric.operationTime ?? 0) >= 30 ? 'text-red-600' : 'text-gray-800'}">
              {#if metric.operationTime !== undefined}
                {metric.operationTime}<span class="text-xs ml-1 text-gray-500">分</span>
              {:else}
                0<span class="text-xs ml-1 text-gray-500">分</span>
              {/if}
            </p>
          </div>
          <div>
            <span class="block text-xs text-gray-500">操作ステップ数（平均）</span>
            <p class="text-lg font-medium {(metric.operationSteps ?? 0) >= 5 ? 'text-red-600' : 'text-gray-800'}">
              {metric.operationSteps}<span class="text-xs ml-1 text-gray-500">回</span>
            </p>
          </div>
          <div>
            <span class="block text-xs text-gray-500">操作エラー数（平均）</span>
            <p class="text-lg font-medium text-gray-800">
              {metric.operationErrors}<span class="text-xs ml-1 text-gray-500">回</span>
            </p>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
