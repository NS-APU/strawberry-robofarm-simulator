<script lang="ts">
  import type { AnalysisMetricData } from '../../../stores/robotStore';
  import { STATUS_TEXT } from '../../../logic/analysisService';

  export let metric: AnalysisMetricData;
  const label = "メンテナンス性";

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

    {#if metric.mttr !== undefined}
      <div class="border-t border-gray-100 pt-2">
        <strong class="mb-2 block text-xs text-gray-500">メトリクス</strong>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <span class="block text-xs text-gray-500">MTTR</span>
            <p class="text-lg font-medium {metric.mttr >= 0.5 ? 'text-red-600' : 'text-gray-800'}">
              {metric.mttr}<span class="text-xs ml-1 text-gray-500">時間</span>
            </p>
          </div>
        </div>
      </div>
    {/if}

    {#if metric.partFailureRate !== undefined || metric.failureCount !== undefined || metric.totalStopTime !== undefined}
      <div class="border-t border-gray-100 pt-2">
        <strong class="mb-2 block text-xs text-gray-500">データ</strong>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <span class="block text-xs text-gray-500">故障回数</span>
            <p class="text-lg font-medium text-gray-800">
              {metric.failureCount}<span class="text-xs ml-1 text-gray-500">回</span>
            </p>
          </div>
          <div>
            <span class="block text-xs text-gray-500">停止時間</span>
            <p class="text-lg font-medium text-gray-800">
              {metric.totalStopTime}<span class="text-xs ml-1 text-gray-500">分</span>
            </p>
          </div>
        </div>
      </div>
    {/if}

    {#if metric.partFailureProbs}
      <div>
        <span class="block text-xs text-gray-500">部位別予兆発生率</span>
        <div class="grid grid-cols-2 gap-4 p-4">
          <div>
            <span class="block text-xs text-gray-500">アーム</span>
            <p class="text-lg font-medium {metric.partFailureProbs.arm >= 10 ? 'text-red-600' : 'text-gray-800'}">
              {metric.partFailureProbs.arm}<span class="text-xs ml-1 text-gray-500">%</span>
            </p>
          </div>
          <div>
            <span class="block text-xs text-gray-500">ハンド</span>
            <p class="text-lg font-medium {metric.partFailureProbs.hand >= 10 ? 'text-red-600' : 'text-gray-800'}">
              {metric.partFailureProbs.hand}<span class="text-xs ml-1 text-gray-500">%</span>
            </p>
          </div>
          <div>
            <span class="block text-xs text-gray-500">カメラ</span>
            <p class="text-lg font-medium {metric.partFailureProbs.camera >= 10 ? 'text-red-600' : 'text-gray-800'}">
              {metric.partFailureProbs.camera}<span class="text-xs ml-1 text-gray-500">%</span>
            </p>
          </div>
          <div>
            <span class="block text-xs text-gray-500">車輪</span>
            <p class="text-lg font-medium {metric.partFailureProbs.wheels >= 10 ? 'text-red-600' : 'text-gray-800'}">
              {metric.partFailureProbs.wheels}<span class="text-xs ml-1 text-gray-500">%</span>
            </p>
          </div>
          <div>
            <span class="block text-xs text-gray-500">トレイ</span>
            <p class="text-lg font-medium {metric.partFailureProbs.tray >= 10 ? 'text-red-600' : 'text-gray-800'}">
              {metric.partFailureProbs.tray}<span class="text-xs ml-1 text-gray-500">%</span>
            </p>
          </div>
          <div>
            <span class="block text-xs text-gray-500">通信</span>
            <p class="text-lg font-medium {metric.partFailureProbs.communication >= 10 ? 'text-red-600' : 'text-gray-800'}">
              {metric.partFailureProbs.communication}<span class="text-xs ml-1 text-gray-500">%</span>
            </p>
          </div>
          <div>
            <span class="block text-xs text-gray-500">制御ユニット</span>
            <p class="text-lg font-medium {metric.partFailureProbs.controlUnit >= 10 ? 'text-red-600' : 'text-gray-800'}">
              {metric.partFailureProbs.controlUnit}<span class="text-xs ml-1 text-gray-500">%</span>
            </p>
          </div>
          <div>
            <span class="block text-xs text-gray-500">電源</span>
            <p class="text-lg font-medium {metric.partFailureProbs.power >= 10 ? 'text-red-600' : 'text-gray-800'}">
              {metric.partFailureProbs.power}<span class="text-xs ml-1 text-gray-500">%</span>
            </p>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
