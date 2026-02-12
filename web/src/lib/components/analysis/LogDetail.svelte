<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { LogEntry } from '../../stores/robotStore';
  import { getStatusText } from '../../logic/analysisService';

  export let log: LogEntry;

  const dispatch = createEventDispatcher<{
    close: void;
  }>();

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
    class="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
    role="document"
  >
    <div class="flex items-center justify-between border-b p-4">
      <h3 class="text-lg font-bold text-gray-800">送信データ詳細</h3>
      <button on:click={() => dispatch('close')} class="text-gray-400 hover:text-gray-600" aria-label="閉じる">
        <span class="text-2xl" aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="overflow-y-auto space-y-4 p-4">
      <div class="text-xs text-gray-500">
        送信日時: {new Date(log.timestamp).toLocaleString()}
      </div>

      {#if log.data}
        {#if log.data.robot}
          <div>
            <h4 class="mb-2 flex items-center gap-2 font-bold text-gray-700">
              <span>🤖</span> ロボットデータ
            </h4>
            <div class="space-y-1 rounded bg-gray-50 p-3 text-xs font-mono">
              <div class="grid grid-cols-2">
                <span class="text-gray-500">ステータスコード:</span>
                <span>{log.data.robot.settings.statusCode}</span>
              </div>
              <div class="grid grid-cols-2">
                <span class="text-gray-500">走行速度:</span>
                <span>{log.data.robot.settings.speed} m/s</span>
              </div>
              <div class="mt-1 border-t pt-1 opacity-60 grid grid-cols-2">
                <span class="text-gray-400 italic">データ取得時刻:</span>
                <span class="text-gray-400 italic">
                  {log.data.robot.timestamp ? new Date(log.data.robot.timestamp).toLocaleTimeString() : '-'}
                </span>
              </div>
            </div>
          </div>
        {/if}

        {#if log.data.house}
          <div>
            <h4 class="mb-2 flex items-center gap-2 font-bold text-gray-700">
              <span>🏠</span> ハウスデータ
            </h4>
            <div class="space-y-1 rounded bg-gray-50 p-3 text-xs font-mono">
              <div class="grid grid-cols-2">
                <span class="text-gray-500">温度:</span>
                <span>{log.data.house.settings.temperature} ℃</span>
              </div>
              <div class="grid grid-cols-2">
                <span class="text-gray-500">湿度:</span>
                <span>{log.data.house.settings.humidity} %</span>
              </div>
              <div class="grid grid-cols-2">
                <span class="text-gray-500">照度:</span>
                <span>{log.data.house.settings.illuminance} lx</span>
              </div>
              <div class="grid grid-cols-2">
                <span class="text-gray-500">CO2濃度:</span>
                <span>{log.data.house.settings.co2} ppm</span>
              </div>
              <div class="mt-1 border-t pt-1 opacity-60 grid grid-cols-2">
                <span class="text-gray-400 italic">データ取得時刻:</span>
                <span class="text-gray-400 italic">
                  {log.data.house.timestamp ? new Date(log.data.house.timestamp).toLocaleTimeString() : '-'}
                </span>
              </div>
            </div>
          </div>
        {/if}
      {/if}

      {#if log.analysis}
        <div>
          <h4 class="mb-2 flex items-center gap-2 font-bold text-gray-700">
            <span>🔍</span> 分析結果
          </h4>
          <div class="space-y-3 rounded border border-blue-100 bg-blue-50 p-3 text-xs">
          <div class="space-y-3 rounded border border-blue-100 bg-blue-50 p-3 text-xs">
            <p class="text-center text-gray-500 italic">健全性分析データは削除されました</p>
          </div>
          </div>
        </div>
      {/if}
    </div>
    <div class="flex justify-end border-t p-4">
      <button
        class="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
        on:click={() => dispatch('close')}
      >
        閉じる
      </button>
    </div>
  </div>
</div>
