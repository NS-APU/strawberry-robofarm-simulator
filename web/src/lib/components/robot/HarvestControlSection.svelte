<script lang="ts">
  import { robotSettings } from '../../stores/robotStore';
</script>

<div class="mb-6 rounded-lg bg-gray-50 p-4">
  <h3 class="mb-3 border-b border-gray-200 pb-2 font-bold text-gray-700">収穫制御</h3>

  <div class="mb-3 space-y-3">
    <!-- Harvest Count -->
    <div>
      <label class="form-label" for="harvestCount">収穫数</label>
      <div class="flex items-center gap-2">
        <input 
          type="range" 
          class="form-range flex-1 rounded-full" 
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
          class="form-range flex-1 rounded-full" 
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

<style>
  /* Custom range slider colors - change thumb and track progress color */
  
  /* For Chrome, Safari, Edge */
  input[type="range"].form-range::-webkit-slider-thumb {
    background-color: var(--range-color, #3b82f6) !important;
  }

  input[type="range"].form-range::-webkit-slider-runnable-track {
    background: transparent !important;
  }

  /* For Firefox - thumb */
  input[type="range"].form-range::-moz-range-thumb {
    background-color: var(--range-color, #3b82f6) !important;
  }

  /* For Firefox - progress track */
  input[type="range"].form-range::-moz-range-progress {
    background-color: var(--range-color, #3b82f6) !important;
  }
</style>
