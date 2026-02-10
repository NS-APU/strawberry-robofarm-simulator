<script lang="ts">
  import { robotSettings, type PartFailureProbs } from '../../stores/robotStore';

  const parts: { id: keyof PartFailureProbs; label: string }[] = [
    { id: 'arm', label: 'アーム' },
    { id: 'hand', label: 'ハンド' },
    { id: 'camera', label: 'カメラ' },
    { id: 'wheels', label: '車輪' },
    { id: 'tray', label: 'トレイ' },
    { id: 'communication', label: '通信' },
    { id: 'controlUnit', label: '情報ユニット' },
    { id: 'power', label: '電源' },
  ];

  $: getPartColor = (value: number) => (value >= 10 ? '#ef4444' : '#3b82f6');
</script>

<div class="control-section">
  <h3 class="control-section-header">故障情報</h3>

  <div class="mb-4">
    <label class="form-label" for="failureCount">故障回数</label>
    <div class="flex items-center gap-2">
      <input
        type="range"
        class="form-range form-range-colored flex-1 rounded-full"
        id="failureCountRange"
        min="0"
        max="50"
        step="1"
        bind:value={$robotSettings.failureCount}
        style="--range-color: #3b82f6; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {($robotSettings.failureCount * 100) / 50}%, #e5e7eb {($robotSettings.failureCount * 100) / 50}%, #e5e7eb 100%); background-size: 100% 100%;"
      />
      <input type="number" class="form-control w-24 text-right" id="failureCount" min="0" max="50" bind:value={$robotSettings.failureCount} />
      <span class="text-sm text-gray-500 w-8">回</span>
    </div>
  </div>

  <div class="space-y-4">
    <h4 class="text-sm font-bold text-gray-600 border-b border-gray-100 pb-1">部位別予兆発生率 (%)</h4>
    <div class="grid grid-cols-1 gap-y-3">
      {#each parts as part}
        <div class="flex flex-col">
          <label class="form-label text-xs mb-1" for={part.id}>{part.label}</label>
          <div class="flex items-center gap-2">
            <input
              type="range"
              class="form-range form-range-colored flex-1 rounded-full"
              id="{part.id}Range"
              min="0"
              max="100"
              step="0.1"
              bind:value={$robotSettings.partFailureProbs[part.id]}
              style="--range-color: {getPartColor($robotSettings.partFailureProbs[part.id])}; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {$robotSettings.partFailureProbs[part.id]}%, #e5e7eb {$robotSettings.partFailureProbs[part.id]}%, #e5e7eb 100%); background-size: 100% 100%;"
            />
            <input
              type="number"
              class="form-control form-control-sm w-20 text-right"
              id={part.id}
              min="0"
              max="100"
              step="0.1"
              bind:value={$robotSettings.partFailureProbs[part.id]}
            />
            <span class="text-xs text-gray-400 w-4">%</span>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
