<script lang="ts">
  import { onDestroy } from 'svelte';
  import { analysisResult, robotLogs } from '../../stores/robotStore';
  import type { LogEntry } from '../../stores/robotStore';
  import { sendToAgriPlatform, getSendMode } from '../../logic/analysisService';
  
  import LogList from './LogList.svelte';
  import LogDetail from './LogDetail.svelte';
  import PerformanceMetrics from './PerformanceMetrics.svelte';

  // Get send mode configuration
  const sendMode = getSendMode();

  let autoSendEnabled = false;
  let autoSendInterval: number | undefined;
  let selectedLog: LogEntry | null = null;
  let sendStatus: { type: 'success' | 'error' | null; message: string } = { type: null, message: '' };
  let isSending = false;

  function closeDialog() {
    selectedLog = null;
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
    <!-- Performance Metrics Section -->
    <PerformanceMetrics metrics={$analysisResult.result?.metrics} />

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

    <!-- Log History -->
    <LogList logs={$robotLogs} on:select={(e) => selectedLog = e.detail} />
  </div>
{/if}

{#if selectedLog}
  <LogDetail log={selectedLog} on:close={closeDialog} />
{/if}

<style>
  /* Global styles from styles.css are used */
</style>
