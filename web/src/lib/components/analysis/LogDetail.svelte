<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { LogEntry, AnalysisMetrics } from '../../stores/robotStore';
  import HarvestAccuracy from './metrics/HarvestAccuracy.svelte';
  import HarvestSpeed from './metrics/HarvestSpeed.svelte';
  import Adaptability from './metrics/Adaptability.svelte';
  import Operability from './metrics/Operability.svelte';
  import Maintainability from './metrics/Maintainability.svelte';
  import CostEfficiency from './metrics/CostEfficiency.svelte';
  import Safety from './metrics/Safety.svelte';
  import DataUtilization from './metrics/DataUtilization.svelte';
  import Durability from './metrics/Durability.svelte';
  import Ethics from './metrics/Ethics.svelte';

  export let log: LogEntry;

  const dispatch = createEventDispatcher<{
    close: void;
  }>();

  const metricConfigs = [
    { key: 'harvestAccuracy', label: '収穫精度', component: HarvestAccuracy },
    { key: 'harvestSpeed', label: '収穫速度', component: HarvestSpeed },
    { key: 'adaptability', label: '環境適応性', component: Adaptability },
    { key: 'operability', label: '操作性', component: Operability },
    { key: 'maintainability', label: 'メンテナンス性', component: Maintainability },
    { key: 'costEfficiency', label: 'コスト効率', component: CostEfficiency },
    { key: 'safety', label: '安全性', component: Safety },
    { key: 'dataUtilization', label: 'データ活用', component: DataUtilization },
    { key: 'durability', label: '耐久性', component: Durability },
    { key: 'ethics', label: '倫理性', component: Ethics },
  ] as const;

  let selectedMetricKey: keyof AnalysisMetrics = 'harvestAccuracy';

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      dispatch('close');
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
  <button
    class="absolute inset-0 h-full w-full bg-black bg-opacity-50 transition-opacity"
    on:click={() => dispatch('close')}
    aria-label="閉じる"
    type="button"
  ></button>
  <div
    class="relative flex h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
    role="document"
  >
    <!-- Header -->
    <div class="flex items-center justify-between border-b px-6 py-4 bg-gray-50 bg-opacity-50 backdrop-blur-sm">
      <div class="flex items-center gap-4">
        <h3 class="text-xl font-black tracking-tight text-gray-900">送信ログ詳細</h3>
        <div class="h-6 w-px bg-gray-300"></div>
        <div class="flex flex-col">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">送信ログ</span>
          <span class="text-xs font-mono font-medium text-gray-500 leading-none">
            {new Date(log.timestamp).toLocaleString('ja-JP', { dateStyle: 'long', timeStyle: 'medium' })}
          </span>
        </div>
      </div>
      <div class="flex items-center gap-4">
        {#if log.success !== undefined}
          <div class="rounded-full px-4 py-1.5 text-xs font-black shadow-sm"
            class:bg-green-100={log.success} class:text-green-700={log.success}
            class:bg-red-100={!log.success} class:text-red-700={!log.success}>
            {log.success ? '✓ 送信完了' : '✕ 送信失敗'}
          </div>
        {/if}
        <button 
          on:click={() => dispatch('close')} 
          class="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" 
          aria-label="閉じる"
        >
          <span class="text-2xl leading-none" aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>

    <!-- Main Content Area (Split View) -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left Sidebar Navigation -->
      <div class="w-64 shrink-0 border-r bg-gray-50 overflow-y-auto">
        <div class="p-3 pb-0">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3">評価軸セレクト</span>
        </div>
        <nav class="p-2 space-y-1">
          {#each metricConfigs as config}
            {@const metricStatus = log.analysis?.metrics?.[config.key]?.status}
            <button
              class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200"
              class:bg-white={selectedMetricKey === config.key}
              class:shadow-sm={selectedMetricKey === config.key}
              class:ring-1={selectedMetricKey === config.key}
              class:ring-gray-200={selectedMetricKey === config.key}
              class:hover:bg-gray-100={selectedMetricKey !== config.key}
              on:click={() => selectedMetricKey = config.key}
            >
              <div 
                class="h-2.5 w-2.5 shrink-0 rounded-full shadow-inner"
                class:bg-green-500={metricStatus === 'healthy'}
                class:bg-yellow-500={metricStatus === 'warning'}
                class:bg-red-500={metricStatus === 'critical'}
                class:bg-gray-300={!metricStatus || metricStatus === 'unknown'}
              ></div>
              <span 
                class="text-sm font-bold truncate"
                class:text-blue-600={selectedMetricKey === config.key}
                class:text-gray-600={selectedMetricKey !== config.key}
              >
                {config.label}
              </span>
              {#if selectedMetricKey === config.key}
                <div class="ml-auto text-blue-500 text-xs">▶</div>
              {/if}
            </button>
          {/each}
        </nav>
      </div>

      <!-- Right Detail Pane -->
      <div class="flex-1 overflow-y-auto bg-white p-8">
        {#if log.success === false && log.error}
          <div class="mb-8 rounded-xl border-l-4 border-red-500 bg-red-50 p-5 shadow-sm">
            <div class="flex items-center gap-2 font-black text-red-700 mb-2">
              <span class="text-lg">⚠️</span> 通信エラー詳細
            </div>
            <div class="font-mono text-sm leading-relaxed text-red-600 break-all bg-white bg-opacity-60 p-4 rounded-lg border border-red-100 shadow-inner">
              {log.error}
            </div>
          </div>
        {/if}

        {#if log.analysis?.metrics}
          {@const selectedConfig = metricConfigs.find(c => c.key === selectedMetricKey)}
          <div class="animate-in fade-in slide-in-from-right-2 duration-300">
            {#if selectedConfig}
              <div class="max-w-3xl">
                <svelte:component 
                  this={selectedConfig.component} 
                  metric={log.analysis.metrics[selectedMetricKey]} 
                />
              </div>
            {/if}
          </div>
        {:else}
          <div class="flex h-full flex-col items-center justify-center text-center opacity-30">
            <div class="text-gray-300 text-6xl mb-6 italic font-serif">No Analysis Data</div>
            <p class="text-gray-500 text-lg font-bold">この送信ログには性能評価データが含まれていません。</p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Footer -->
    <div class="flex justify-between items-center border-t px-6 py-4 bg-gray-50">
      <div class="text-[10px] text-gray-400 font-mono tracking-tighter">
        LOG_HASH: {(log.timestamp).toUpperCase()}
      </div>
      <button
        class="rounded-xl bg-gray-900 px-8 py-2.5 text-sm font-black text-white shadow-lg transition-all hover:bg-gray-800 hover:shadow-xl active:transform active:scale-95 focus:ring-4 focus:ring-gray-200"
        on:click={() => dispatch('close')}
      >
        閉じる
      </button>
    </div>
  </div>
</div>
