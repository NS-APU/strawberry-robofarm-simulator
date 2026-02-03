<script lang="ts">
  import { getStatusText } from './analysisUtils';

  export let houseResult: {
    health: string;
    diagnosis: string;
    action: string;
  } | undefined;
  export let timestamp: string | undefined = undefined;
</script>

<div>
  <h5 class="mb-2 flex items-center gap-2 font-bold text-gray-700">
    <span>🏠</span> ハウス健全性
    {#if timestamp}
      <span class="ml-auto text-xs font-normal text-gray-400">
        データ: {new Date(timestamp).toLocaleTimeString()}
      </span>
    {/if}
  </h5>
  <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
    <div class="space-y-3 p-4">
      <div class="flex items-center justify-between border-b border-gray-100 pb-2">
        <span class="font-medium text-gray-600">ステータス</span>
        <span
          class="rounded-full px-3 py-1 text-sm font-bold"
          class:bg-green-100={houseResult?.health === 'healthy'}
          class:text-green-700={houseResult?.health === 'healthy'}
          class:bg-yellow-100={houseResult?.health === 'warning'}
          class:text-yellow-700={houseResult?.health === 'warning'}
          class:bg-red-100={houseResult?.health === 'critical'}
          class:text-red-700={houseResult?.health === 'critical'}
        >
          {getStatusText(houseResult?.health)}
        </span>
      </div>

      <div>
        <strong class="mb-1 block text-xs text-gray-500">診断</strong>
        <p class="text-sm text-gray-800">{houseResult?.diagnosis}</p>
      </div>

      <div>
        <strong class="mb-1 block text-xs text-gray-500">推奨アクション</strong>
        <p class="text-sm text-gray-800">{houseResult?.action}</p>
      </div>
    </div>
  </div>
</div>
