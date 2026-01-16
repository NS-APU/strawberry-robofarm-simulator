<script lang="ts">
  import { analysisResult, robotLogs } from '../../stores/robotStore';
  import type { LogEntry, AnalysisResult } from '../../stores/robotStore';

  function handleSendToAgri() {
    // Mock sending to Agri Platform
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      data: $analysisResult.data,
      analysis: {
        status: $analysisResult.status,
        insights: $analysisResult.insights,
      },
    };

    robotLogs.update((logs) => [logEntry, ...logs]);
    alert('農業情報基盤へデータを送信しました');
  }
</script>

{#if $analysisResult.waiting}
  <div
    class="animate-pulse rounded border-l-4 border-blue-500 bg-blue-50 p-4 text-blue-700 shadow-sm"
    id="waitingMessage"
  >
    <div class="flex items-center gap-3">
      <span class="text-xl">⏳</span>
      <span class="font-medium">ロボットからのデータを待機中...</span>
    </div>
  </div>
{:else}
  <div id="analysisContainer" class="space-y-6">
    <div>
      <h5 class="mb-2 flex items-center gap-2 font-bold text-gray-700">
        <span>📡</span> 受信データ
      </h5>
      <div class="rounded-lg border border-gray-200 bg-gray-50 shadow-inner">
        <div class="p-4">
          <pre id="receivedData" class="mb-0 font-mono text-xs whitespace-pre-wrap break-words overflow-wrap-anywhere">{JSON.stringify($analysisResult.data, null, 2)}</pre>
        </div>
      </div>
    </div>

    <div>
      <h5 class="mb-2 flex items-center gap-2 font-bold text-gray-700">
        <span>📊</span> 分析結果
      </h5>
      <div class="rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        <div class="space-y-4 p-4">
          <div id="analysisStatus" class="flex items-center gap-2 border-b border-gray-100 pb-3">
            <strong class="text-gray-600">ステータス:</strong>
            <span
              class="rounded-full px-3 py-1 text-sm font-bold"
              class:bg-green-100={$analysisResult.status === 'normal'}
              class:text-green-700={$analysisResult.status === 'normal'}
              class:bg-red-100={$analysisResult.status !== 'normal'}
              class:text-red-700={$analysisResult.status !== 'normal'}
            >
              {($analysisResult.status || '').toUpperCase()}
            </span>
          </div>
          <div id="analysisInsights">
            <strong class="mb-2 block text-gray-600">インサイト:</strong>
            <ul class="space-y-2">
              {#each $analysisResult.insights as insight}
                <li class="insight-item">{insight}</li>
              {/each}
            </ul>
          </div>
          <div id="analysisRecommendations">
            <strong class="mb-2 block text-gray-600">推奨アクション:</strong>
            <ul class="space-y-2">
              {#each $analysisResult.recommendations as rec}
                <li class="recommendation-item">{rec}</li>
              {/each}
            </ul>
          </div>
        </div>
      </div>
    </div>

    <button
      id="sendToAgriBtn"
      class="btn btn-success w-full transform shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
      on:click={handleSendToAgri}
    >
      🌾 農業情報基盤へ送信
    </button>

    <div class="mt-3">
      <h5>送信履歴</h5>
      <div id="agriLog" class="log-container">
        {#each $robotLogs as log}
          <div class="log-entry {log.analysis.status === 'normal' ? 'success' : 'warning'}">
            <small class="timestamp">{log.timestamp}</small>
            <div>Status: {log.analysis.status}</div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  /* Global styles from styles.css are used */
</style>
