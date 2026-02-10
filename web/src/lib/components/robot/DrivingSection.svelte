<script lang="ts">
  import { robotSettings } from '../../stores/robotStore';
</script>

<div class="control-section">
  <h3 class="control-section-header">走行情報</h3>
  
  <div class="mb-3 space-y-3">
    <div>
      <label class="form-label" for="speed">走行速度 (m/s)</label>
      <div class="flex items-center gap-2">
        <input type="range" class="form-range form-range-colored flex-1 rounded-full" id="speed" min="0" max="5" step="0.01" bind:value={$robotSettings.speed} style="--range-color: #3b82f6; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {($robotSettings.speed / 5) * 100}%, #e5e7eb {($robotSettings.speed / 5) * 100}%, #e5e7eb 100%); background-size: 100% 100%;" />
        <input type="number" class="form-control w-28 text-right" min="0" max="5" step="0.01" bind:value={$robotSettings.speed} />
        <span class="text-sm text-gray-500 w-8">m/s</span>
      </div>
    </div>
  </div>
</div>
