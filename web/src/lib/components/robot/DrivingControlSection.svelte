<script lang="ts">
  import { robotSettings } from '../../stores/robotStore';
</script>

<div class="mb-6 rounded-lg bg-gray-50 p-4">
  <h3 class="mb-3 border-b border-gray-200 pb-2 font-bold text-gray-700">走行制御</h3>
  
  <div class="mb-3 space-y-3">
    <div>
      <label class="form-label" for="speed">走行速度 (m/s)</label>
      <div class="flex items-center gap-2">
        <input type="range" class="form-range flex-1 rounded-full" id="speed" min="0" max="1" step="0.1" bind:value={$robotSettings.speed} style="--range-color: #3b82f6; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {$robotSettings.speed * 100}%, #e5e7eb {$robotSettings.speed * 100}%, #e5e7eb 100%); background-size: 100% 100%;" />
        <input type="number" class="form-control w-28 text-right" min="0" max="1" step="0.1" bind:value={$robotSettings.speed} />
        <span class="text-sm text-gray-500 w-8">m/s</span>
      </div>
    </div>
    <div>
      <label class="form-label" for="tireRotation">タイヤ回転数 (rpm)</label>
      <div class="flex items-center gap-2">
        <input type="range" class="form-range flex-1 rounded-full" id="tireRotation" min="0" max="200" step="1" bind:value={$robotSettings.tireRotation} style="--range-color: #3b82f6; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {$robotSettings.tireRotation / 2}%, #e5e7eb {$robotSettings.tireRotation / 2}%, #e5e7eb 100%); background-size: 100% 100%;" />
        <input type="number" class="form-control w-28 text-right" min="0" max="200" step="1" bind:value={$robotSettings.tireRotation} />
        <span class="text-sm text-gray-500 w-8">rpm</span>
      </div>
    </div>
  </div>

  <div class="mb-3">
      <label class="form-label" for="obstacleDetected">障害物検知</label>
      <div>
        <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" id="obstacleDetected" bind:checked={$robotSettings.obstacleDetected} class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
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
