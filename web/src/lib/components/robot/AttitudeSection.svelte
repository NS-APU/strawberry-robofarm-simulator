<script lang="ts">
  import { robotSettings } from '../../stores/robotStore';
  import Tilt3D from './Tilt3D.svelte';
</script>

<div class="control-section">
  <h3 class="control-section-header">姿勢情報</h3>

  <div class="mb-3">
    <label class="form-label" for="tilt3D">姿勢操作 (3Dビュー)</label>
    <Tilt3D />

  </div>

  <div class="space-y-3">
    <div>
      <label class="form-label" for="yaw">Yaw (°)</label>
      <div class="flex items-center gap-2">
        <input type="range" class="form-range form-range-colored flex-1 rounded-full" id="yaw" min="-180" max="180" step="0.5" bind:value={$robotSettings.yaw} style="--range-color: #3b82f6; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {($robotSettings.yaw + 180) / 3.6}%, #e5e7eb {($robotSettings.yaw + 180) / 3.6}%, #e5e7eb 100%); background-size: 100% 100%;" />
        <input type="number" class="form-control w-28 text-right" min="-180" max="180" step="0.5" bind:value={$robotSettings.yaw} />
        <span class="text-sm text-gray-500 w-8">°</span>
      </div>
    </div>
    <div>
      <label class="form-label" for="pitch">Pitch (°)</label>
      <div class="flex items-center gap-2">
        <input
          type="range"
          class="form-range form-range-colored flex-1 rounded-full"
          id="pitch"
          min="-90"
          max="90"
          step="0.5"
          bind:value={$robotSettings.pitch}
          style="--range-color: {Math.abs($robotSettings.pitch) >= 5 ? '#ef4444' : '#3b82f6'}; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {($robotSettings.pitch + 90) / 1.8}%, #e5e7eb {($robotSettings.pitch + 90) / 1.8}%, #e5e7eb 100%); background-size: 100% 100%;"
        />
        <input
          type="number"
          class="form-control w-28 text-right {Math.abs($robotSettings.pitch) >= 5 ? 'text-red-500 font-bold border-red-300' : ''}"
          min="-90"
          max="90"
          step="0.5"
          bind:value={$robotSettings.pitch}
        />
        <span class="text-sm text-gray-500 w-8">°</span>
      </div>
    </div>
    <div>
      <label class="form-label" for="roll">Roll (°)</label>
      <div class="flex items-center gap-2">
        <input
          type="range"
          class="form-range form-range-colored flex-1 rounded-full"
          id="roll"
          min="-90"
          max="90"
          step="0.5"
          bind:value={$robotSettings.roll}
          style="--range-color: {Math.abs($robotSettings.roll) >= 5 ? '#ef4444' : '#3b82f6'}; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {($robotSettings.roll + 90) / 1.8}%, #e5e7eb {($robotSettings.roll + 90) / 1.8}%, #e5e7eb 100%); background-size: 100% 100%;"
        />
        <input
          type="number"
          class="form-control w-28 text-right {Math.abs($robotSettings.roll) >= 5 ? 'text-red-500 font-bold border-red-300' : ''}"
          min="-90"
          max="90"
          step="0.5"
          bind:value={$robotSettings.roll}
        />
        <span class="text-sm text-gray-500 w-8">°</span>
      </div>
    </div>
  </div>
</div>
