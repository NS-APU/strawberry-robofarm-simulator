<script lang="ts">
  import type { AnalysisMetricData } from '../../../stores/robotStore';
  import { STATUS_TEXT } from '../../../logic/analysisService';

  export let metric: AnalysisMetricData;
  const label = "データ活用";

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


  </div>
</div>
