<script lang="ts">
  import { getStatusText } from '../../logic/analysisService';

  // Define strict type for system result based on AnalysisPanel usage
  export let systemResult: {
    health: string;
  } | undefined;
</script>

<div>
  <h5 class="mb-2 flex items-center gap-2 font-bold text-gray-700">
    <span>🖥️</span> システム健全性
  </h5>
  <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
    <div class="flex items-center justify-between p-4">
      <span class="font-medium text-gray-600">総合ステータス</span>
      <span
        class="rounded-full px-3 py-1 text-sm font-bold"
        class:bg-green-100={systemResult?.health === 'healthy'}
        class:text-green-700={systemResult?.health === 'healthy'}
        class:bg-yellow-100={systemResult?.health === 'warning'}
        class:text-yellow-700={systemResult?.health === 'warning'}
        class:bg-red-100={systemResult?.health === 'critical'}
        class:text-red-700={systemResult?.health === 'critical'}
        class:bg-gray-100={systemResult?.health === 'unknown'}
        class:text-gray-700={systemResult?.health === 'unknown'}
      >
        {getStatusText(systemResult?.health)}
      </span>
    </div>
  </div>
</div>
