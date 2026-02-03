<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { LogEntry } from '../../stores/robotStore';
  import { getStatusText } from './analysisUtils';

  export let logs: LogEntry[] = [];

  const dispatch = createEventDispatcher<{
    select: LogEntry;
  }>();
</script>

<div class="mt-3">
  <h5 class="mb-2 font-bold text-gray-700">送信履歴 (最大10件)</h5>
  <div id="agriLog" class="log-container space-y-2">
    {#each logs as log}
      <button
        class="log-entry w-full rounded border bg-white p-3 text-left text-xs transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        class:border-green-200={log.analysis?.system.health === 'healthy'}
        class:border-yellow-200={log.analysis?.system.health === 'warning'}
        class:border-red-200={log.analysis?.system.health === 'critical'}
        class:border-gray-200={log.analysis?.system.health === 'unknown'}
        on:click={() => dispatch('select', log)}
      >
        <div class="mb-2 flex justify-between border-b border-gray-50 pb-1 text-gray-500">
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
    {#if logs.length === 0}
      <div class="py-4 text-center text-sm italic text-gray-400">
        履歴はありません
      </div>
    {/if}
  </div>
</div>
