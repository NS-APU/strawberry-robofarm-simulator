<script lang="ts">
  import type { AnalysisMetricData } from '../../../stores/robotStore';
  import { STATUS_TEXT } from '../../../logic/analysisService';

  export let metric: AnalysisMetricData;
  const label = "コスト効率";

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

    <div class="border-t border-gray-100 pt-2">
      <strong class="mb-2 block text-xs text-gray-500">メトリクス</strong>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <span class="block text-xs text-gray-500">コスト/収穫量 比率</span>
          <p class="text-lg font-medium text-gray-800">
            -<span class="text-xs ml-1 text-gray-500">%</span>
          </p>
        </div>
        <div>
          <span class="block text-xs text-gray-500">コスト/時間 比率</span>
          <p class="text-lg font-medium text-gray-800">
            -<span class="text-xs ml-1 text-gray-500">%</span>
          </p>
        </div>
        <div>
          <span class="block text-xs text-gray-500">収穫量</span>
          <p class="text-lg font-medium text-gray-800">
            -<span class="text-xs ml-1 text-gray-500">個</span>
          </p>
        </div>
      </div>
    </div>

    {#if metric.harvestCount !== undefined && metric.operatingTime !== undefined && metric.totalStopTime !== undefined}
      <div class="border-t border-gray-100 pt-2">
        <strong class="mb-2 block text-xs text-gray-500">データ</strong>
        <div class="grid grid-cols-2 gap-2">
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
            <span class="block text-xs text-gray-500">収穫数</span>
            <p class="text-lg font-medium text-gray-800">
              {metric.harvestCount}<span class="text-xs ml-1 text-gray-500">個</span>
            </p>
          </div>
        </div>
      </div>
    {/if}

    <div class="border-t border-gray-100 pt-2">
      <strong class="mb-2 block text-xs text-gray-500">フィードバックデータ</strong>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <span class="block text-xs text-gray-500">取り残し数</span>
          <p class="text-lg font-medium text-gray-800">
            -<span class="text-xs ml-1 text-gray-500">個</span>
          </p>
        </div>
        <div>
          <span class="block text-xs text-gray-500">人の作業時間</span>
          <p class="text-lg font-medium text-gray-800">
            -<span class="text-xs ml-1 text-gray-500">時間</span>
          </p>
        </div>
        <div>
          <span class="block text-xs text-gray-500">運用コスト</span>
          <p class="text-lg font-medium text-gray-800">
            -<span class="text-xs ml-1 text-gray-500">円</span>
          </p>
        </div>
      </div>
    </div>


  </div>
</div>
