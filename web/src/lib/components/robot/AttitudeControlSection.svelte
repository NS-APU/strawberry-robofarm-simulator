<script lang="ts">
  import { robotSettings } from '../../stores/robotStore';
  import Tilt3D from './Tilt3D.svelte';
</script>

<div class="mb-6 rounded-lg bg-gray-50 p-4">
  <h3 class="mb-3 border-b border-gray-200 pb-2 font-bold text-gray-700">姿勢制御</h3>

  <div class="mb-3">
    <label class="form-label" for="tilt3D">傾き調整 (3Dビュー)</label>
    <Tilt3D />

  </div>

  <div class="space-y-3">
    <div>
      <label class="form-label" for="yaw">ヨー (°)</label>
      <div class="flex items-center gap-2">
        <input type="range" class="form-range flex-1 rounded-full" id="yaw" min="-180" max="180" step="0.5" bind:value={$robotSettings.yaw} style="--range-color: #3b82f6; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {($robotSettings.yaw + 180) / 3.6}%, #e5e7eb {($robotSettings.yaw + 180) / 3.6}%, #e5e7eb 100%); background-size: 100% 100%;" />
        <input type="number" class="form-control w-28 text-right" min="-180" max="180" step="0.5" bind:value={$robotSettings.yaw} />
        <span class="text-sm text-gray-500 w-8">°</span>
      </div>
    </div>
    <div>
      <label class="form-label" for="pitch">ピッチ (°)</label>
      <div class="flex items-center gap-2">
        <input type="range" class="form-range flex-1 rounded-full" id="pitch" min="-90" max="90" step="0.5" bind:value={$robotSettings.pitch} style="--range-color: #3b82f6; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {($robotSettings.pitch + 90) / 1.8}%, #e5e7eb {($robotSettings.pitch + 90) / 1.8}%, #e5e7eb 100%); background-size: 100% 100%;" />
        <input type="number" class="form-control w-28 text-right" min="-90" max="90" step="0.5" bind:value={$robotSettings.pitch} />
        <span class="text-sm text-gray-500 w-8">°</span>
      </div>
    </div>
    <div>
      <label class="form-label" for="roll">ロール (°)</label>
      <div class="flex items-center gap-2">
        <input type="range" class="form-range flex-1 rounded-full" id="roll" min="-90" max="90" step="0.5" bind:value={$robotSettings.roll} style="--range-color: #3b82f6; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {($robotSettings.roll + 90) / 1.8}%, #e5e7eb {($robotSettings.roll + 90) / 1.8}%, #e5e7eb 100%); background-size: 100% 100%;" />
        <input type="number" class="form-control w-28 text-right" min="-90" max="90" step="0.5" bind:value={$robotSettings.roll} />
        <span class="text-sm text-gray-500 w-8">°</span>
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
