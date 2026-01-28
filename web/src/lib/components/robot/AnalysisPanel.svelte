<script lang="ts">
  import { onDestroy } from 'svelte';
  import { analysisResult, robotLogs } from '../../stores/robotStore';
  import type { LogEntry } from '../../stores/robotStore';
  import { sendToAgriPlatform, getSendMode } from '../../logic/analysisService';

  // Get send mode configuration
  const sendMode = getSendMode();

  // Status localization map
  const STATUS_TEXT = {
    healthy: '正常',
    warning: '注意',
    critical: '異常',
    unknown: '不明',
  };

  let autoSendEnabled = false;
  let autoSendInterval: number | undefined;
  let selectedLog: LogEntry | null = null;
  let sendStatus: { type: 'success' | 'error' | null; message: string } = { type: null, message: '' };
  let isSending = false;

  function getStatusText(status: string | undefined): string {
    if (!status || !STATUS_TEXT[status as keyof typeof STATUS_TEXT]) return '不明';
    return STATUS_TEXT[status as keyof typeof STATUS_TEXT];
  }

  function closeDialog() {
    selectedLog = null;
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeDialog();
    }
  }

  async function handleSendToAgri() {
    // Clear previous status
    sendStatus = { type: null, message: '' };

    // Check if we have data to send
    if (!$analysisResult.data || !$analysisResult.result) {
      if (!autoSendEnabled) {
        sendStatus = { type: 'error', message: 'データがありません。' };
      }
      return;
    }

    isSending = true;

    try {
      // Send data to agricultural platform
      const result = await sendToAgriPlatform({
        timestamp: new Date().toISOString(),
        robot: $analysisResult.data.robot,
        house: $analysisResult.data.house,
        analysis: $analysisResult.result,
      });

      if (result.success) {
        // Add to log
        const logEntry: LogEntry = {
          timestamp: new Date().toISOString(),
          data: $analysisResult.data,
          analysis: $analysisResult.result,
        };

        robotLogs.update((logs) => {
          const newLogs = [logEntry, ...logs];
          return newLogs.slice(0, 10);
        });

        const modeText = result.mode === 'simulation' ? 'シミュレーション' : '農業情報基盤へ送信';
        sendStatus = { type: 'success', message: `送信成功 (${modeText})` };
      } else {
        sendStatus = { type: 'error', message: result.error || '送信に失敗しました' };
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '不明なエラー';
      sendStatus = { type: 'error', message: `送信エラー: ${errorMsg}` };
    } finally {
      isSending = false;
      // Auto-clear status after 5 seconds
      setTimeout(() => {
        sendStatus = { type: null, message: '' };
      }, 5000);
    }
  }


  function toggleAutoSend() {
    if (autoSendEnabled) {
      autoSendInterval = window.setInterval(() => {
        handleSendToAgri();
      }, 10000);
    } else {
      if (autoSendInterval) {
        clearInterval(autoSendInterval);
        autoSendInterval = undefined;
      }
    }
  }

  onDestroy(() => {
    if (autoSendInterval) {
      clearInterval(autoSendInterval);
    }
  });
</script>

{#if $analysisResult.waiting}
  <div
    class="animate-pulse rounded border-l-4 border-blue-500 bg-blue-50 p-4 text-blue-700 shadow-sm"
    id="waitingMessage"
  >
    <div class="flex items-center gap-3">
      <span class="text-xl">⏳</span>
      <span class="font-medium">データを待機中...</span>
    </div>
  </div>
{:else}
  <div id="analysisContainer" class="space-y-6">
    <!-- System Health Section -->
    <div>
      <h5 class="mb-2 flex items-center gap-2 font-bold text-gray-700">
        <span>🖥️</span> システム健全性
      </h5>
      <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div class="p-4 flex items-center justify-between">
          <span class="text-gray-600 font-medium">総合ステータス</span>
          <span
            class="rounded-full px-3 py-1 text-sm font-bold"
            class:bg-green-100={$analysisResult.result?.system.health === 'healthy'}
            class:text-green-700={$analysisResult.result?.system.health === 'healthy'}
            class:bg-yellow-100={$analysisResult.result?.system.health === 'warning'}
            class:text-yellow-700={$analysisResult.result?.system.health === 'warning'}
            class:bg-red-100={$analysisResult.result?.system.health === 'critical'}
            class:text-red-700={$analysisResult.result?.system.health === 'critical'}
            class:bg-gray-100={$analysisResult.result?.system.health === 'unknown'}
            class:text-gray-700={$analysisResult.result?.system.health === 'unknown'}
          >
            {getStatusText($analysisResult.result?.system.health)}
          </span>
        </div>
      </div>
    </div>

    <!-- Robot Health Section -->
    <div>
      <h5 class="mb-2 flex items-center gap-2 font-bold text-gray-700">
        <span>🤖</span> ロボット健全性
        {#if $analysisResult.data?.robot?.timestamp}
          <span class="ml-auto text-xs font-normal text-gray-400">
            データ: {new Date($analysisResult.data.robot.timestamp).toLocaleTimeString()}
          </span>
        {/if}
      </h5>
      <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div class="p-4 space-y-3">
          <div class="flex items-center justify-between border-b border-gray-100 pb-2">
            <span class="text-gray-600 font-medium">ステータス</span>
            <span
              class="rounded-full px-3 py-1 text-sm font-bold"
              class:bg-green-100={$analysisResult.result?.robot.health === 'healthy'}
              class:text-green-700={$analysisResult.result?.robot.health === 'healthy'}
              class:bg-yellow-100={$analysisResult.result?.robot.health === 'warning'}
              class:text-yellow-700={$analysisResult.result?.robot.health === 'warning'}
              class:bg-red-100={$analysisResult.result?.robot.health === 'critical'}
              class:text-red-700={$analysisResult.result?.robot.health === 'critical'}
            >
              {getStatusText($analysisResult.result?.robot.health)}
            </span>
          </div>
          <div>
            <strong class="block text-xs text-gray-500 mb-1">診断</strong>
            <p class="text-sm text-gray-800">{$analysisResult.result?.robot.diagnosis}</p>
          </div>
          <div class="border-t border-gray-100 pt-2">
            <strong class="block text-xs text-gray-500 mb-1">推奨アクション</strong>
            <p class="text-sm text-gray-800">{$analysisResult.result?.robot.action}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- House Health Section -->
    <div>
      <h5 class="mb-2 flex items-center gap-2 font-bold text-gray-700">
        <span>🏠</span> ハウス健全性
        {#if $analysisResult.data?.house?.timestamp}
          <span class="ml-auto text-xs font-normal text-gray-400">
            データ: {new Date($analysisResult.data.house.timestamp).toLocaleTimeString()}
          </span>
        {/if}
      </h5>
      <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div class="p-4 space-y-3">
          <div class="flex items-center justify-between border-b border-gray-100 pb-2">
            <span class="text-gray-600 font-medium">ステータス</span>
            <span
              class="rounded-full px-3 py-1 text-sm font-bold"
              class:bg-green-100={$analysisResult.result?.house.health === 'healthy'}
              class:text-green-700={$analysisResult.result?.house.health === 'healthy'}
              class:bg-yellow-100={$analysisResult.result?.house.health === 'warning'}
              class:text-yellow-700={$analysisResult.result?.house.health === 'warning'}
              class:bg-red-100={$analysisResult.result?.house.health === 'critical'}
              class:text-red-700={$analysisResult.result?.house.health === 'critical'}
            >
              {getStatusText($analysisResult.result?.house.health)}
            </span>
          </div>
          
          <div>
            <strong class="block text-xs text-gray-500 mb-1">診断</strong>
            <p class="text-sm text-gray-800">{$analysisResult.result?.house.diagnosis}</p>
          </div>

          <div>
            <strong class="block text-xs text-gray-500 mb-1">推奨アクション</strong>
            <p class="text-sm text-gray-800">{$analysisResult.result?.house.action}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Divider between House Health and Send Controls -->
    <hr class="border-t-2 border-gray-300 my-4" />

    <div class="space-y-3">
      <!-- Send Mode Info -->
      <div class="rounded border px-3 py-2 text-xs" class:border-blue-200={sendMode.enabled} class:bg-blue-50={sendMode.enabled} class:border-gray-200={!sendMode.enabled} class:bg-gray-50={!sendMode.enabled}>
        <div class="flex items-center gap-2">
          <span class="font-semibold text-gray-700">送信モード:</span>
          <span class="font-bold" class:text-blue-700={sendMode.enabled} class:text-gray-600={!sendMode.enabled}>
            {sendMode.enabled ? '🌐 農業情報基盤へ送信' : '💻 シミュレーション'}
          </span>
        </div>
        {#if sendMode.enabled && sendMode.endpoint}
          <div class="mt-1 text-gray-600">
            <span class="opacity-70">送信先:</span> <code class="text-xs bg-white px-1 rounded">{sendMode.endpoint}</code>
          </div>
        {/if}
      </div>

      <div class="flex items-center gap-2 px-1">
        <input
          type="checkbox"
          id="autoSendCheck"
          bind:checked={autoSendEnabled}
          on:change={toggleAutoSend}
          class="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <label for="autoSendCheck" class="text-sm font-medium text-gray-700">
          定期送信(10秒毎)
        </label>
      </div>

      <button
        id="sendToAgriBtn"
        class="btn btn-success w-full transform shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
        class:opacity-50={isSending}
        disabled={isSending}
        on:click={handleSendToAgri}
      >
        {#if isSending}
          ⏳ 送信中...
        {:else}
          🌾 農業情報基盤へ送信
        {/if}
      </button>

      <!-- Send Status Feedback -->
      {#if sendStatus.type}
        <div 
          class="rounded border px-3 py-2 text-xs animate-fade-in"
          class:border-green-300={sendStatus.type === 'success'}
          class:bg-green-50={sendStatus.type === 'success'}
          class:text-green-700={sendStatus.type === 'success'}
          class:border-red-300={sendStatus.type === 'error'}
          class:bg-red-50={sendStatus.type === 'error'}
          class:text-red-700={sendStatus.type === 'error'}
        >
          {sendStatus.type === 'success' ? '✓' : '✗'} {sendStatus.message}
        </div>
      {/if}
    </div>


    <div class="mt-3">
      <h5 class="mb-2 font-bold text-gray-700">送信履歴 (最大10件)</h5>
      <div id="agriLog" class="log-container space-y-2">
        {#each $robotLogs as log}
          <button
            class="log-entry w-full text-left rounded p-3 text-xs border bg-white transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            class:border-green-200={log.analysis?.system.health === 'healthy'}
            class:border-yellow-200={log.analysis?.system.health === 'warning'}
            class:border-red-200={log.analysis?.system.health === 'critical'}
            class:border-gray-200={log.analysis?.system.health === 'unknown'}
            on:click={() => (selectedLog = log)}
          >
            <div class="flex justify-between text-gray-500 mb-2 border-b border-gray-50 pb-1">
              <span>{new Date(log.timestamp).toLocaleString()}</span>
            </div>
            
            <div class="grid grid-cols-2 gap-2">
              <div class="flex items-center gap-1">
                <span class="opacity-70">🤖</span>
                <span class="font-bold">{getStatusText(log.analysis?.robot.health)}</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="opacity-70">🏠</span>
                <span class="font-bold">{getStatusText(log.analysis?.house.health)}</span>
              </div>
            </div>
          </button>
        {/each}
        {#if $robotLogs.length === 0}
          <div class="text-center py-4 text-gray-400 text-sm italic">
            履歴はありません
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

{#if selectedLog}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity"
    on:click={closeDialog}
    on:keydown={handleKeyDown}
    role="button"
    tabindex="0"
    aria-label="閉じる"
  >
    <div
      class="max-h-[90vh] w-full max-w-lg flex flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
      on:click|stopPropagation={() => {}}
      on:keydown|stopPropagation={() => {}}
      role="document"
    >
      <div class="flex items-center justify-between border-b p-4">
        <h3 class="text-lg font-bold text-gray-800">送信データ詳細</h3>
        <button on:click={closeDialog} class="text-gray-400 hover:text-gray-600" aria-label="閉じる">
          <span class="text-2xl" aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="overflow-y-auto p-4 space-y-4">
        <div class="text-xs text-gray-500">
          送信日時: {new Date(selectedLog.timestamp).toLocaleString()}
        </div>

        {#if selectedLog.data}
          {#if selectedLog.data.robot}
            <div>
              <h4 class="mb-2 flex items-center gap-2 font-bold text-gray-700">
                <span>🤖</span> ロボットデータ
              </h4>
              <div class="rounded bg-gray-50 p-3 text-xs font-mono space-y-1">
                <div class="grid grid-cols-2">
                  <span class="text-gray-500">ステータスコード:</span>
                  <span>{selectedLog.data.robot.settings.statusCode}</span>
                </div>
                <div class="grid grid-cols-2">
                  <span class="text-gray-500">走行速度:</span>
                  <span>{selectedLog.data.robot.settings.speed} m/s</span>
                </div>
                <div class="grid grid-cols-2">
                  <span class="text-gray-500">バッテリー残量:</span>
                  <span>{selectedLog.data.robot.settings.batteryLevel} %</span>
                </div>
                <div class="grid grid-cols-2">
                  <span class="text-gray-500">タイヤ回転数:</span>
                  <span>{selectedLog.data.robot.settings.tireRotation} rpm</span>
                </div>
                <div class="grid grid-cols-2">
                  <span class="text-gray-500">障害物検知:</span>
                  <span>{selectedLog.data.robot.settings.obstacleDetected ? 'あり' : 'なし'}</span>
                </div>
                <div class="grid grid-cols-2 border-t mt-1 pt-1 opacity-60">
                  <span class="text-gray-400 italic">データ取得時刻:</span>
                  <span class="text-gray-400 italic">
                    {selectedLog.data.robot.timestamp ? new Date(selectedLog.data.robot.timestamp).toLocaleTimeString() : '-'}
                  </span>
                </div>
              </div>
            </div>
          {/if}

          {#if selectedLog.data.house}
            <div>
              <h4 class="mb-2 flex items-center gap-2 font-bold text-gray-700">
                <span>🏠</span> ハウスデータ
              </h4>
              <div class="rounded bg-gray-50 p-3 text-xs font-mono space-y-1">
                <div class="grid grid-cols-2">
                  <span class="text-gray-500">温度:</span>
                  <span>{selectedLog.data.house.settings.temperature} ℃</span>
                </div>
                <div class="grid grid-cols-2">
                  <span class="text-gray-500">湿度:</span>
                  <span>{selectedLog.data.house.settings.humidity} %</span>
                </div>
                <div class="grid grid-cols-2">
                  <span class="text-gray-500">照度:</span>
                  <span>{selectedLog.data.house.settings.illuminance} lx</span>
                </div>
                <div class="grid grid-cols-2">
                  <span class="text-gray-500">CO2濃度:</span>
                  <span>{selectedLog.data.house.settings.co2} ppm</span>
                </div>
                <div class="grid grid-cols-2 border-t mt-1 pt-1 opacity-60">
                  <span class="text-gray-400 italic">データ取得時刻:</span>
                  <span class="text-gray-400 italic">
                    {selectedLog.data.house.timestamp ? new Date(selectedLog.data.house.timestamp).toLocaleTimeString() : '-'}
                  </span>
                </div>
              </div>
            </div>
          {/if}
        {/if}

        {#if selectedLog.analysis}
           <div>
            <h4 class="mb-2 flex items-center gap-2 font-bold text-gray-700">
              <span>🔍</span> 分析結果
            </h4>
            <div class="rounded border border-blue-100 bg-blue-50 p-3 text-xs space-y-3">
              <!-- Robot Analysis -->
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                   <strong class="text-gray-700">🤖 ロボット分析:</strong>
                   <span 
                    class="font-bold border-b-2"
                    class:border-green-400={selectedLog.analysis.robot.health === 'healthy'}
                    class:border-yellow-400={selectedLog.analysis.robot.health === 'warning'}
                    class:border-red-400={selectedLog.analysis.robot.health === 'critical'}
                   >
                    {getStatusText(selectedLog.analysis.robot.health)}
                   </span>
                </div>
                <p class="text-gray-600 bg-white/50 p-1 rounded">診断: {selectedLog.analysis.robot.diagnosis}</p>
                {#if selectedLog.analysis.robot.action && selectedLog.analysis.robot.action !== '-'}
                  <p class="text-gray-600 bg-white/50 p-1 rounded">推奨アクション: {selectedLog.analysis.robot.action}</p>
                {/if}
              </div>

              <!-- House Analysis -->
              <div class="space-y-1 border-t border-blue-100 pt-2">
                <div class="flex items-center justify-between">
                   <strong class="text-gray-700">🏠 ハウス分析:</strong>
                   <span 
                    class="font-bold border-b-2"
                    class:border-green-400={selectedLog.analysis.house.health === 'healthy'}
                    class:border-yellow-400={selectedLog.analysis.house.health === 'warning'}
                    class:border-red-400={selectedLog.analysis.house.health === 'critical'}
                   >
                    {getStatusText(selectedLog.analysis.house.health)}
                   </span>
                </div>
                <p class="text-gray-600 bg-white/50 p-1 rounded">診断: {selectedLog.analysis.house.diagnosis}</p>
                {#if selectedLog.analysis.house.action && selectedLog.analysis.house.action !== '-'}
                  <p class="text-gray-600 bg-white/50 p-1 rounded">推奨アクション: {selectedLog.analysis.house.action}</p>
                {/if}
              </div>

              <!-- Overall System Health -->
              <div class="border-t border-blue-200 pt-2">
                <div class="flex justify-between items-center font-bold">
                  <span>システム健全性:</span>
                  <span
                   class:text-green-600={selectedLog.analysis.system.health === 'healthy'}
                   class:text-yellow-600={selectedLog.analysis.system.health === 'warning'}
                   class:text-red-600={selectedLog.analysis.system.health === 'critical'}
                  >
                    {getStatusText(selectedLog.analysis.system.health)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
      <div class="border-t p-4 flex justify-end">
        <button
          class="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors"
          on:click={closeDialog}
        >
          閉じる
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Global styles from styles.css are used */
</style>
