<script lang="ts">
  import { robotSettings } from '../../stores/robotStore';

  // 収穫数が検知数を超えないように制御
  $: if ($robotSettings.harvestCount > $robotSettings.detectionCount) {
    $robotSettings.harvestCount = $robotSettings.detectionCount;
  }
</script>

<div class="control-section">
  <h3 class="control-section-header">収穫情報</h3>
  <div class="space-y-3">
    <div>
      <label class="form-label" for="detectionCount">検知数 (個)</label>
      <div class="flex items-center gap-2">
        <input type="range" class="form-range form-range-colored flex-1 rounded-full" id="detectionCountRange" min="0" max="1000" step="1" bind:value={$robotSettings.detectionCount} style="--range-color: #3b82f6; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {$robotSettings.detectionCount * 100 / 1000}%, #e5e7eb {$robotSettings.detectionCount * 100 / 1000}%, #e5e7eb 100%); background-size: 100% 100%;" />
        <input type="number" class="form-control w-28 text-right" id="detectionCount" min="0" max="1000" bind:value={$robotSettings.detectionCount} />
        <span class="text-sm text-gray-500 w-8">個</span>
      </div>
    </div>
    <div>
      <label class="form-label" for="harvestCount">収穫数 (個)</label>
      <div class="flex items-center gap-2">
        <input 
          type="range" 
          class="form-range form-range-colored flex-1 rounded-full" 
          id="harvestCountRange" 
          min="0" 
          max={$robotSettings.detectionCount} 
          step="1" 
          bind:value={$robotSettings.harvestCount} 
          style="--range-color: #3b82f6; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {$robotSettings.harvestCount * 100 / ($robotSettings.detectionCount || 1)}%, #e5e7eb {$robotSettings.harvestCount * 100 / ($robotSettings.detectionCount || 1)}%, #e5e7eb 100%); background-size: 100% 100%;" 
        />
        <input 
          type="number" 
          class="form-control w-28 text-right" 
          id="harvestCount" 
          min="0" 
          max={$robotSettings.detectionCount} 
          bind:value={$robotSettings.harvestCount} 
        />
        <span class="text-sm text-gray-500 w-8">個</span>
      </div>
    </div>
    <div>
      <label class="form-label" for="processingTimePerFruit">1果実あたりの処理時間 (秒)</label>
      <div class="flex items-center gap-2">
        <input type="range" class="form-range form-range-colored flex-1 rounded-full" id="processingTimePerFruit" min="1" max="1000" step="1" bind:value={$robotSettings.processingTimePerFruit} style="--range-color: #3b82f6; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {($robotSettings.processingTimePerFruit - 1) * 100 / 999}%, #e5e7eb {($robotSettings.processingTimePerFruit - 1) * 100 / 999}%, #e5e7eb 100%); background-size: 100% 100%;" />
        <input type="number" class="form-control w-28 text-right" min="1" max="1000" step="1" bind:value={$robotSettings.processingTimePerFruit} />
        <span class="text-sm text-gray-500 w-8">秒</span>
      </div>
    </div>
  </div>
</div>
