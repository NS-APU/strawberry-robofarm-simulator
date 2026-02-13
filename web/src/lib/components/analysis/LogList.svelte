<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { LogEntry, AnalysisMetricData } from '../../stores/robotStore';
  import { getStatusText } from '../../logic/analysisService';

  export let logs: LogEntry[] = [];

  const dispatch = createEventDispatcher<{
    select: LogEntry;
  }>();

  // 評価軸の定義 (正式名称版)
  const metricConfigs = [
    { key: 'harvestAccuracy', label: '収穫精度' },
    { key: 'harvestSpeed', label: '収穫速度' },
    { key: 'adaptability', label: '環境適応性' },
    { key: 'operability', label: '操作性' },
    { key: 'maintainability', label: 'メンテナンス性' },
    { key: 'costEfficiency', label: 'コスト効率' },
    { key: 'safety', label: '安全性' },
    { key: 'dataUtilization', label: 'データ活用' },
    { key: 'durability', label: '耐久性' },
    { key: 'ethics', label: '倫理性' },
  ] as const;

  /**
   * ログ全体の送信ステータスを判定
   */
  function getAggregateHealth(log: LogEntry): string {
    if (log.success === true) return 'healthy';
    if (log.success === false) return 'critical';
    return 'unknown';
  }
</script>

<div class="mt-3">
  <h5 class="mb-3 font-bold text-gray-700 px-1 text-xs flex items-center gap-2">
    <span>🕒</span> 送信履歴 (最大10件)
  </h5>
  <div id="agriLog" class="log-container space-y-3 max-h-[600px] overflow-y-auto pr-1">
    {#each logs as log}
      {@const aggregateHealth = getAggregateHealth(log)}
      <button
        class="log-entry group relative w-full overflow-hidden rounded-xl border bg-white p-2.5 text-left transition-all duration-300 hover:border-blue-400 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        class:border-green-200={aggregateHealth === 'healthy'}
        class:border-red-200={aggregateHealth === 'critical'}
        class:border-gray-200={aggregateHealth === 'unknown'}
        on:click={() => dispatch('select', log)}
      >
        <!-- Status Indicator Side Bar -->
        <div 
          class="absolute left-0 top-0 h-full w-1 transition-colors duration-300"
          class:bg-green-500={aggregateHealth === 'healthy'}
          class:bg-red-500={aggregateHealth === 'critical'}
          class:bg-gray-400={aggregateHealth === 'unknown'}
        ></div>

        <div class="mb-2 flex items-center justify-between pl-1">
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] font-bold text-gray-500 group-hover:text-blue-600">
              {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            {#if log.success === true}
              <span class="bg-green-100 text-green-600 text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">送信成功</span>
            {:else if log.success === false}
              <span class="bg-red-100 text-red-600 text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">送信失敗</span>
            {/if}
          </div>
          <span class="text-[8px] font-mono text-gray-400 uppercase tracking-tighter">
            #{log.timestamp.slice(-4)}
          </span>
        </div>

        <div class="grid grid-cols-5 gap-0.5 pl-1">
          {#if log.analysis?.metrics}
            {#each metricConfigs as config}
              {@const metric = log.analysis.metrics[config.key]}
              <div 
                class="flex h-7 items-center justify-center rounded-[2px] border text-center leading-none transition-colors duration-200"
                class:bg-green-50={metric?.status === 'healthy'}
                class:border-green-100={metric?.status === 'healthy'}
                class:text-green-700={metric?.status === 'healthy'}
                class:bg-yellow-50={metric?.status === 'warning'}
                class:border-yellow-100={metric?.status === 'warning'}
                class:text-yellow-700={metric?.status === 'warning'}
                class:bg-red-50={metric?.status === 'critical'}
                class:border-red-100={metric?.status === 'critical'}
                class:text-red-700={metric?.status === 'critical'}
                class:bg-gray-50={!metric || metric.status === 'unknown'}
                class:border-gray-100={!metric || metric.status === 'unknown'}
                class:text-gray-400={!metric || metric.status === 'unknown'}
                title="{config.label}: {getStatusText(metric?.status)}"
              >
                <span class="w-full break-all text-[12px] font-bold tracking-[ -0.05em]">{config.label}</span>
              </div>
            {/each}
          {/if}
        </div>
      </button>
    {/each}
    {#if logs.length === 0}
      <div class="py-12 text-center text-xs italic text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        送信履歴はありません
      </div>
    {/if}
  </div>
</div>

<style>
  .log-container::-webkit-scrollbar {
    width: 4px;
  }
  .log-container::-webkit-scrollbar-track {
    background: #f9fafb;
    border-radius: 10px;
  }
  .log-container::-webkit-scrollbar-thumb {
    background: #e5e7eb;
    border-radius: 10px;
  }
  .log-container::-webkit-scrollbar-thumb:hover {
    background: #d1d5db;
  }
</style>
