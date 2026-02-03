<script lang="ts">
  import { robotSettings } from '../../stores/robotStore';
</script>

<div class="control-section">
  <h3 class="control-section-header">収穫制御</h3>

  <div class="mb-3 space-y-3">
    <!-- Harvest Count -->
    <div>
      <label class="form-label" for="harvestCount">収穫数</label>
      <div class="flex items-center gap-2">
        <input 
          type="range" 
          class="form-range form-range-colored flex-1 rounded-full" 
          id="harvestCount" 
          min="0" 
          max="200" 
          step="1" 
          bind:value={$robotSettings.harvestCount}
          style="--range-color: #3b82f6; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {$robotSettings.harvestCount / 2}%, #e5e7eb {$robotSettings.harvestCount / 2}%, #e5e7eb 100%); background-size: 100% 100%;" 
        />
        <input type="number" class="form-control w-28 text-right" min="0" max="200" bind:value={$robotSettings.harvestCount} />
        <span class="text-sm text-gray-500 w-8">個</span>
      </div>
    </div>

    <!-- Detection Count -->
    <div>
      <label class="form-label" for="detectionCount">検出数</label>
      <div class="flex items-center gap-2">
        <input 
          type="range" 
          class="form-range form-range-colored flex-1 rounded-full" 
          id="detectionCount" 
          min="0" 
          max="200" 
          step="1" 
          bind:value={$robotSettings.detectionCount} 
          style="--range-color: #3b82f6; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {$robotSettings.detectionCount / 2}%, #e5e7eb {$robotSettings.detectionCount / 2}%, #e5e7eb 100%); background-size: 100% 100%;"
        />
        <input type="number" class="form-control w-28 text-right" min="0" max="200" bind:value={$robotSettings.detectionCount} />
        <span class="text-sm text-gray-500 w-8">個</span>
      </div>
    </div>
  </div>
</div>


