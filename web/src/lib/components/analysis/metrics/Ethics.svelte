<script lang="ts">
  import type { AnalysisMetricData } from '../../../stores/robotStore';
  import { STATUS_TEXT } from '../../../logic/analysisService';

  export let metric: AnalysisMetricData;
  const label = "倫理性";

  $: statusText = '不明';
  $: statusClass = 'bg-gray-100 text-gray-700';
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
      <p class="text-sm text-gray-800">-</p>
    </div>

    <div class="border-t border-gray-100 pt-2">
      <strong class="mb-1 block text-xs text-gray-500">推奨アクション</strong>
      <p class="text-sm text-gray-800">-</p>
    </div>
  </div>
</div>
